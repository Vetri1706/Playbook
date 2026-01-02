"""
PDF Routes - HTML→PDF Generation
Flask Blueprint for new production-grade PDF generation system
"""
from flask import Blueprint, request, jsonify, send_file
from pathlib import Path
import logging
import os

from models import db, Response, Project, GeneratedPDF, ImageUpload
from services.html_pdf_generator import HTMLPDFGenerator

logger = logging.getLogger(__name__)

# Create blueprint
pdf_bp = Blueprint('pdf', __name__, url_prefix='/api/pdf')

# Initialize HTML PDF generator
DEBUG_MODE = os.environ.get('PDF_DEBUG_MODE', 'false').lower() == 'true'
OUTPUT_DIR = Path(__file__).parent.parent / 'generated_pdfs_html'
pdf_generator = HTMLPDFGenerator(str(OUTPUT_DIR), debug_mode=DEBUG_MODE)


@pdf_bp.route('/generate-html', methods=['POST'])
def generate_pdf_from_html():
    """
    Generate PDF using HTML→PDF pipeline (WeasyPrint)
    
    POST /api/pdf/generate-html
    {
        "project_id": 123
    }
    
    Returns:
    {
        "success": true,
        "pdf_id": 456,
        "download_url": "/api/download-pdf/456",
        "method": "html",
        "file_size": 1234567,
        "pages_generated": 12
    }
    """
    try:
        data = request.get_json()
        project_id = data.get('project_id')
        
        if not project_id:
            return jsonify({'error': 'project_id is required'}), 400
        
        # Get project
        project = Project.query.get(project_id)
        if not project:
            return jsonify({'error': f'Project {project_id} not found'}), 404
        
        # Get all user responses for this project
        responses = Response.query.filter_by(project_id=project_id).all()
        
        # Convert to dictionary
        user_responses = {}
        for response in responses:
            # Handle special formatting for user profile
            if response.field_name == 'user_profile_name':
                age = next((r.field_value for r in responses if r.field_name == 'user_profile_age'), '')
                location = next((r.field_value for r in responses if r.field_name == 'user_profile_location'), '')
                user_responses['user_profile_description'] = f"Name: {response.field_value}  •  Age: {age}  •  Location: {location}"
            else:
                user_responses[response.field_name] = response.field_value
        
        # Get uploaded images
        images_db = ImageUpload.query.filter_by(project_id=project_id).all()
        images = {img.field_name: img.file_path for img in images_db}
        
        logger.info(f"Generating HTML-based PDF for project {project_id}")
        logger.info(f"  Responses: {len(user_responses)}")
        logger.info(f"  Images: {len(images)}")
        
        # Generate PDF
        pdf_path = pdf_generator.generate_pdf(
            project_id=project_id,
            project_name=project.title or f'Project {project_id}',
            user_responses=user_responses,
            images=images
        )
        
        # Save to database
        pdf_record = GeneratedPDF(
            project_id=project_id,
            file_path=str(pdf_path),
            filename=pdf_path.name,
            file_size=pdf_path.stat().st_size
        )
        db.session.add(pdf_record)
        db.session.commit()
        
        logger.info(f"✅ PDF generated successfully: {pdf_path.name}")
        
        return jsonify({
            'success': True,
            'pdf_id': pdf_record.id,
            'download_url': f'/api/download-pdf/{pdf_record.id}',
            'method': 'html',
            'file_size': pdf_path.stat().st_size,
            'pages_generated': 12,
            'message': 'PDF generated using HTML→PDF pipeline'
        }), 200
        
    except Exception as e:
        logger.error(f"PDF generation failed: {e}", exc_info=True)
        return jsonify({
            'error': 'PDF generation failed',
            'details': str(e)
        }), 500


@pdf_bp.route('/debug-html/<int:project_id>', methods=['GET'])
def get_debug_html(project_id: int):
    """
    Get debug HTML for visual inspection in browser
    
    GET /api/pdf/debug-html/123
    
    Returns HTML with debug mode enabled
    """
    try:
        # Get project
        project = Project.query.get(project_id)
        if not project:
            return jsonify({'error': f'Project {project_id} not found'}), 404
        
        # Get all user responses
        responses = Response.query.filter_by(project_id=project_id).all()
        user_responses = {r.field_name: r.field_value for r in responses}
        
        # Get images
        images_db = ImageUpload.query.filter_by(project_id=project_id).all()
        images = {img.field_name: img.file_path for img in images_db}
        
        # Generate debug HTML
        html_content = pdf_generator.generate_debug_html(
            project_id=project_id,
            project_name=project.title or f'Project {project_id}',
            user_responses=user_responses,
            images=images
        )
        
        return html_content, 200, {'Content-Type': 'text/html'}
        
    except Exception as e:
        logger.error(f"Debug HTML generation failed: {e}", exc_info=True)
        return jsonify({
            'error': 'Debug HTML generation failed',
            'details': str(e)
        }), 500
