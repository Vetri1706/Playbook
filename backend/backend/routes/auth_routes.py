"""
Authentication routes for user login and registration
"""
from flask import Blueprint, request, jsonify
from models import db, User
from auth import generate_token
import logging

logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__, url_prefix='/api')

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    User login endpoint
    Returns JWT token for authenticated users
    """
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400

        # Find user
        user = User.query.filter_by(username=username).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid username or password'}), 401

        # Generate JWT token
        token = generate_token(user.id)

        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict()
        }), 200

    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'An error occurred during login'}), 500


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    User registration endpoint
    Creates a new user account
    """
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name')
        grade = data.get('grade')
        school = data.get('school')

        # Validate required fields
        if not username or not email or not password:
            return jsonify({'error': 'Username, email, and password are required'}), 400

        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 409

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists'}), 409

        # Create new user
        user = User(
            username=username,
            email=email,
            full_name=full_name,
            grade=grade,
            school=school
        )
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        # Generate JWT token
        token = generate_token(user.id)

        return jsonify({
            'message': 'Registration successful',
            'token': token,
            'user': user.to_dict()
        }), 201

    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'An error occurred during registration'}), 500
