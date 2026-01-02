"""
API Routes for PDF Generation
"""
from flask import Blueprint, request, jsonify, send_file, current_app
from werkzeug.utils import secure_filename
from pathlib import Path
import base64
import os
import re
import shutil
import uuid
from datetime import datetime

from models import (
    db, Project, Response, ImageUpload, GeneratedPDF,
    get_project_responses, get_project_images
)
from services.pdf_generator import PDFGeneratorService
from auth import login_required, project_access_required, validate_file_upload, sanitize_filename

# Create blueprint
pdf_bp = Blueprint('pdf', __name__, url_prefix='/api')


def _require_api_key_if_configured():
    """Optionally require an API key for unauthenticated endpoints.

    If environment variable PDF_API_KEY is set, the request must include the same
    value in the X-API-Key header.
    """
    expected = os.environ.get('PDF_API_KEY')
    if not expected:
        return None

    provided = request.headers.get('X-API-Key')
    if provided != expected:
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Missing or invalid API key'
        }), 401

    return None


_DATA_URL_RE = re.compile(r'^data:(image\/(png|jpeg));base64,(.*)$', re.IGNORECASE | re.DOTALL)


def _save_data_url_image(data_url: str, output_dir: Path, field_name: str) -> str:
    """Persist a data URL image to disk and return its file path."""
    match = _DATA_URL_RE.match(data_url.strip())
    if not match:
        raise ValueError(f"Invalid image data URL for field '{field_name}'")

    mime = match.group(1).lower()
    b64_payload = match.group(3)

    try:
        raw = base64.b64decode(b64_payload, validate=True)
    except Exception as e:
        raise ValueError(f"Invalid base64 payload for field '{field_name}': {e}")

    ext = 'png' if mime.endswith('png') else 'jpg'
    safe_field = sanitize_filename(field_name)
    filename = f"{safe_field}.{ext}"
    output_dir.mkdir(parents=True, exist_ok=True)
    file_path = output_dir / filename
    file_path.write_bytes(raw)
    return str(file_path)


@pdf_bp.route('/create-project', methods=['POST'])
@login_required
def create_project(user):
    """
    Create a new project for the authenticated user (dev/test helper)

    Expected JSON (optional): { "title": "My Project" }
    Returns: { "success": true, "project_id": <int>, "title": <str> }
    """
    try:
        data = request.get_json(silent=True) or {}
        title = data.get('title') or 'My Project'

        project = Project(user_id=user.id, title=title, status='in_progress')
        db.session.add(project)
        db.session.commit()

        return jsonify({
            'success': True,
            'project_id': project.id,
            'title': project.title
        }), 201

    except Exception as e:
        current_app.logger.error(f"Create project error: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@pdf_bp.route('/generate-pdf', methods=['POST'])
@login_required
def generate_pdf_endpoint(user):
    """
    Generate a filled PDF for a project
    
    Expected JSON:
    {
        "project_id": 123
    }
    
    Returns:
    {
        "success": true,
        "pdf_id": 456,
        "download_url": "/api/download-pdf/456",
        "filename": "playbook_2024_01_15.pdf",
        "file_size": 1234567
    }
    """
    try:
        data = request.json
        project_id = data.get('project_id')
        
        if not project_id:
            return jsonify({
                'error': 'Bad request',
                'message': 'project_id is required'
            }), 400
        
        # Verify project access
        project = Project.query.get(project_id)
        if not project:
            return jsonify({
                'error': 'Not found',
                'message': 'Project not found'
            }), 404
        
        if project.user_id != user.id:
            return jsonify({
                'error': 'Forbidden',
                'message': 'You do not have access to this project'
            }), 403
        
        # Get all responses and images for the project
        user_responses = get_project_responses(project_id)
        images = get_project_images(project_id)
        
        if not user_responses:
            return jsonify({
                'error': 'Bad request',
                'message': 'No responses found for this project'
            }), 400
        
        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_filename = f"design_thinking_playbook_{user.username}_{timestamp}.pdf"
        
        # Initialize PDF generator
        generator = PDFGeneratorService(
            template_path=current_app.config['PDF_TEMPLATE_PATH'],
            output_dir=current_app.config['PDF_OUTPUT_DIR']
        )
        
        # Generate the PDF
        pdf_path = generator.generate_filled_pdf(
            user_responses=user_responses,
            output_filename=output_filename,
            images=images
        )
        
        # Save PDF record to database
        generated_pdf = GeneratedPDF(
            project_id=project_id,
            filename=output_filename,
            file_path=str(pdf_path),
            file_size=pdf_path.stat().st_size
        )
        db.session.add(generated_pdf)
        
        # Update project status if not already completed
        if project.status != 'completed':
            project.status = 'completed'
            project.completed_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'pdf_id': generated_pdf.id,
            'download_url': f'/api/download-pdf/{generated_pdf.id}',
            'filename': output_filename,
            'file_size': generated_pdf.file_size
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"PDF generation error: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500


@pdf_bp.route('/generate-pdf-direct', methods=['POST'])
def generate_pdf_direct():
    """Generate a PDF directly from posted responses (no DB, no auth).

    This endpoint is intended for the Next.js app integration, so the app can
    use the backend's PDFGeneratorService instead of client-side PDF rendering.

    Security:
    - If PDF_API_KEY is set, requests must include X-API-Key.

    Expected JSON:
    {
      "responses": { "student_name": "...", ... },
      "images": { "idea_1_drawing": "data:image/png;base64,...", ... },
      "filename": "my-playbook.pdf"  // optional
    }

    Returns: application/pdf as an attachment.
    """
    api_key_error = _require_api_key_if_configured()
    if api_key_error:
        return api_key_error

    data = request.get_json(silent=True) or {}
    responses = data.get('responses') or {}
    images_in = data.get('images') or {}
    filename = data.get('filename') or 'sns-playbook.pdf'

    if not isinstance(responses, dict):
        return jsonify({
            'error': 'Bad request',
            'message': 'responses must be an object'
        }), 400

    if not isinstance(images_in, dict):
        return jsonify({
            'error': 'Bad request',
            'message': 'images must be an object'
        }), 400

    # Normalize filename
    filename = sanitize_filename(str(filename))
    if not filename.lower().endswith('.pdf'):
        filename = f"{filename}.pdf"

    trace_id = str(uuid.uuid4())[:8]
    temp_dir = Path(current_app.config['UPLOAD_FOLDER']) / 'direct' / trace_id
    images: dict[str, str] = {}

    try:
        for field_name, value in images_in.items():
            if not value:
                continue

            if isinstance(value, str) and value.strip().lower().startswith('data:image/'):
                images[str(field_name)] = _save_data_url_image(value, temp_dir, str(field_name))
                continue

            # Allow passing an existing local file path (advanced/debug use)
            if isinstance(value, str) and Path(value).exists():
                images[str(field_name)] = value

        generator = PDFGeneratorService(
            template_path=current_app.config['PDF_TEMPLATE_PATH'],
            output_dir=current_app.config['PDF_OUTPUT_DIR']
        )

        pdf_path = generator.generate_filled_pdf(
            user_responses=responses,
            output_filename=filename,
            images=images
        )

        return send_file(
            pdf_path,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )

    except Exception as e:
        current_app.logger.error(f"Direct PDF generation error [{trace_id}]: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

    finally:
        # Best-effort cleanup of transient uploaded images
        try:
            if temp_dir.exists():
                shutil.rmtree(temp_dir, ignore_errors=True)
        except Exception:
            pass


@pdf_bp.route('/download-pdf/<int:pdf_id>', methods=['GET'])
@login_required
def download_pdf(user, pdf_id):
    """
    Download a generated PDF
    
    Returns: PDF file as attachment
    """
    try:
        # Get PDF record
        pdf_record = GeneratedPDF.query.get(pdf_id)
        
        if not pdf_record:
            return jsonify({
                'error': 'Not found',
                'message': 'PDF not found'
            }), 404
        
        # Verify user has access to this PDF
        project = Project.query.get(pdf_record.project_id)
        if project.user_id != user.id:
            return jsonify({
                'error': 'Forbidden',
                'message': 'You do not have access to this PDF'
            }), 403
        
        # Check if file exists
        pdf_path = Path(pdf_record.file_path)
        if not pdf_path.exists():
            return jsonify({
                'error': 'Not found',
                'message': 'PDF file not found on server'
            }), 404
        
        # Increment download count
        pdf_record.download_count += 1
        db.session.commit()
        
        # Send file
        return send_file(
            pdf_path,
            as_attachment=True,
            download_name=pdf_record.filename,
            mimetype='application/pdf'
        )
        
    except Exception as e:
        current_app.logger.error(f"PDF download error: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500


@pdf_bp.route('/upload-image', methods=['POST'])
@login_required
def upload_image(user):
    """
    Upload an image for a project
    
    Form data:
    - project_id: int
    - field_name: str (e.g., 'idea_1_drawing')
    - image: file
    
    Returns:
    {
        "success": true,
        "image_id": 789,
        "field_name": "idea_1_drawing",
        "filename": "drawing_123.png"
    }
    """
    try:
        # Validate form data
        project_id = request.form.get('project_id')
        field_name = request.form.get('field_name')
        
        if not project_id or not field_name:
            return jsonify({
                'error': 'Bad request',
                'message': 'project_id and field_name are required'
            }), 400
        
        project_id = int(project_id)
        
        # Verify project access
        project = Project.query.get(project_id)
        if not project or project.user_id != user.id:
            return jsonify({
                'error': 'Forbidden',
                'message': 'Invalid project access'
            }), 403
        
        # Validate file
        if 'image' not in request.files:
            return jsonify({
                'error': 'Bad request',
                'message': 'No image file provided'
            }), 400
        
        file = request.files['image']
        is_valid, error = validate_file_upload(
            file,
            current_app.config['ALLOWED_EXTENSIONS'],
            current_app.config['MAX_IMAGE_SIZE_MB']
        )
        
        if not is_valid:
            return jsonify({
                'error': 'Bad request',
                'message': error
            }), 400
        
        # Save file
        original_filename = secure_filename(file.filename)
        sanitized_name = sanitize_filename(original_filename)
        
        # Create unique filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{user.id}_{project_id}_{field_name}_{timestamp}_{sanitized_name}"
        
        upload_dir = Path(current_app.config['UPLOAD_FOLDER']) / str(user.id) / str(project_id)
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        file_path = upload_dir / filename
        file.save(str(file_path))
        
        # Get file info
        file_size = file_path.stat().st_size
        mime_type = file.content_type
        
        # Check if image already exists for this field
        existing_image = ImageUpload.query.filter_by(
            project_id=project_id,
            field_name=field_name
        ).first()
        
        if existing_image:
            # Delete old file
            old_path = Path(existing_image.file_path)
            if old_path.exists():
                old_path.unlink()
            
            # Update record
            existing_image.filename = filename
            existing_image.file_path = str(file_path)
            existing_image.file_size = file_size
            existing_image.mime_type = mime_type
            existing_image.uploaded_at = datetime.utcnow()
            image_record = existing_image
        else:
            # Create new record
            image_record = ImageUpload(
                project_id=project_id,
                field_name=field_name,
                filename=filename,
                file_path=str(file_path),
                file_size=file_size,
                mime_type=mime_type
            )
            db.session.add(image_record)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'image_id': image_record.id,
            'field_name': field_name,
            'filename': filename,
            'file_size': file_size
        }), 201
        
    except Exception as e:
        current_app.logger.error(f"Image upload error: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500


@pdf_bp.route('/save-response', methods=['POST'])
@login_required
def save_response(user):
    """
    Save or update a response for a project
    
    Expected JSON:
    {
        "project_id": 123,
        "field_name": "problem_who_it_helps",
        "field_value": "This will help students...",
        "page_number": 3
    }
    
    Returns:
    {
        "success": true,
        "response_id": 456
    }
    """
    try:
        data = request.json
        project_id = data.get('project_id')
        field_name = data.get('field_name')
        field_value = data.get('field_value')
        page_number = data.get('page_number')
        
        if not all([project_id, field_name, field_value]):
            return jsonify({
                'error': 'Bad request',
                'message': 'project_id, field_name, and field_value are required'
            }), 400
        
        # Verify project access
        project = Project.query.get(project_id)
        if not project or project.user_id != user.id:
            return jsonify({
                'error': 'Forbidden',
                'message': 'Invalid project access'
            }), 403
        
        # Save or update response
        response = Response.query.filter_by(
            project_id=project_id,
            field_name=field_name
        ).first()
        
        if response:
            response.field_value = field_value
            response.page_number = page_number
            response.updated_at = datetime.utcnow()
        else:
            response = Response(
                project_id=project_id,
                field_name=field_name,
                field_value=field_value,
                page_number=page_number
            )
            db.session.add(response)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'response_id': response.id
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Save response error: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500


@pdf_bp.route('/project/<int:project_id>/responses', methods=['GET'])
@login_required
def get_responses(user, project_id):
    """
    Get all responses for a project
    
    Returns:
    {
        "project_id": 123,
        "responses": {
            "problem_who_it_helps": "This will help...",
            "empathy_who": "My user is..."
        }
    }
    """
    try:
        # Verify project access
        project = Project.query.get(project_id)
        if not project or project.user_id != user.id:
            return jsonify({
                'error': 'Forbidden',
                'message': 'Invalid project access'
            }), 403
        
        responses = get_project_responses(project_id)
        
        return jsonify({
            'project_id': project_id,
            'responses': responses
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get responses error: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500
