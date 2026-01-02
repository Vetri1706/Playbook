"""
Authentication and Authorization Utilities
"""
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from models import User, Project


def generate_token(user_id: int, expiration_hours: int = 24) -> str:
    """
    Generate JWT token for user
    
    Args:
        user_id: User ID
        expiration_hours: Token expiration in hours
        
    Returns:
        str: JWT token
    """
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=expiration_hours),
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(
        payload,
        current_app.config['JWT_SECRET_KEY'],
        algorithm='HS256'
    )
    
    return token


def decode_token(token: str) -> dict:
    """
    Decode and verify JWT token
    
    Args:
        token: JWT token string
        
    Returns:
        dict: Decoded payload
        
    Raises:
        jwt.InvalidTokenError: If token is invalid or expired
    """
    return jwt.decode(
        token,
        current_app.config['JWT_SECRET_KEY'],
        algorithms=['HS256']
    )


def get_current_user():
    """
    Get current user from request Authorization header
    
    Returns:
        User: Current user object or None
    """
    auth_header = request.headers.get('Authorization')
    
    if not auth_header:
        return None
    
    try:
        # Extract token from "Bearer <token>"
        token = auth_header.split(' ')[1] if ' ' in auth_header else auth_header
        payload = decode_token(token)
        user = User.query.get(payload['user_id'])
        return user
    except (jwt.InvalidTokenError, IndexError, KeyError):
        return None


def login_required(f):
    """
    Decorator to require authentication
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        
        if not user:
            return jsonify({
                'error': 'Authentication required',
                'message': 'Please provide a valid authentication token'
            }), 401
        
        # Pass user to the route function
        return f(user=user, *args, **kwargs)
    
    return decorated_function


def project_access_required(f):
    """
    Decorator to verify user has access to the requested project
    Expects 'project_id' in route parameters or request JSON
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        
        if not user:
            return jsonify({
                'error': 'Authentication required',
                'message': 'Please provide a valid authentication token'
            }), 401
        
        # Get project_id from kwargs or request
        project_id = kwargs.get('project_id') or request.json.get('project_id')
        
        if not project_id:
            return jsonify({
                'error': 'Bad request',
                'message': 'project_id is required'
            }), 400
        
        # Verify project exists and belongs to user
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
        
        # Pass user and project to the route function
        return f(user=user, project=project, *args, **kwargs)
    
    return decorated_function


def validate_file_upload(file, allowed_extensions: set, max_size_mb: int) -> tuple:
    """
    Validate uploaded file
    
    Args:
        file: FileStorage object from Flask request
        allowed_extensions: Set of allowed file extensions
        max_size_mb: Maximum file size in MB
        
    Returns:
        tuple: (is_valid, error_message)
    """
    if not file:
        return False, "No file provided"
    
    if file.filename == '':
        return False, "Empty filename"
    
    # Check extension
    if '.' not in file.filename:
        return False, "File must have an extension"
    
    ext = file.filename.rsplit('.', 1)[1].lower()
    if ext not in allowed_extensions:
        return False, f"File type not allowed. Allowed: {', '.join(allowed_extensions)}"
    
    # Check file size (seek to end to get size)
    file.seek(0, 2)  # Seek to end
    size = file.tell()
    file.seek(0)  # Reset to beginning
    
    max_size_bytes = max_size_mb * 1024 * 1024
    if size > max_size_bytes:
        return False, f"File too large. Maximum size: {max_size_mb}MB"
    
    return True, None


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to prevent path traversal attacks
    
    Args:
        filename: Original filename
        
    Returns:
        str: Sanitized filename
    """
    import re
    import os
    
    # Remove path components
    filename = os.path.basename(filename)
    
    # Remove any non-alphanumeric characters except dots, hyphens, underscores
    filename = re.sub(r'[^\w\s\-\.]', '', filename)
    
    # Replace spaces with underscores
    filename = filename.replace(' ', '_')
    
    # Limit length
    name, ext = os.path.splitext(filename)
    if len(name) > 100:
        name = name[:100]
    
    return f"{name}{ext}"
