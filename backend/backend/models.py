"""
Database Models
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import JSON
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    """User model"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Student info
    full_name = db.Column(db.String(200))
    grade = db.Column(db.String(20))
    school = db.Column(db.String(200))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    projects = db.relationship('Project', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check password against hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'grade': self.grade,
            'school': self.school,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Project(db.Model):
    """Project/Playbook Session model"""
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Project metadata
    title = db.Column(db.String(200))
    status = db.Column(db.String(50), default='in_progress')  # in_progress, completed, archived
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    responses = db.relationship('Response', backref='project', lazy=True, cascade='all, delete-orphan')
    images = db.relationship('ImageUpload', backref='project', lazy=True, cascade='all, delete-orphan')
    generated_pdfs = db.relationship('GeneratedPDF', backref='project', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }


class Response(db.Model):
    """User responses to playbook questions"""
    __tablename__ = 'responses'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False, index=True)
    
    # Response data
    field_name = db.Column(db.String(100), nullable=False, index=True)
    field_value = db.Column(db.Text)
    page_number = db.Column(db.Integer)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Unique constraint: one response per field per project
    __table_args__ = (
        db.UniqueConstraint('project_id', 'field_name', name='unique_project_field'),
    )
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'project_id': self.project_id,
            'field_name': self.field_name,
            'field_value': self.field_value,
            'page_number': self.page_number,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class ImageUpload(db.Model):
    """Uploaded images (drawings, sketches, etc.)"""
    __tablename__ = 'image_uploads'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False, index=True)
    
    # Image metadata
    field_name = db.Column(db.String(100), nullable=False, index=True)
    filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_size = db.Column(db.Integer)  # In bytes
    mime_type = db.Column(db.String(50))
    
    # Timestamps
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'project_id': self.project_id,
            'field_name': self.field_name,
            'filename': self.filename,
            'file_size': self.file_size,
            'mime_type': self.mime_type,
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None
        }


class GeneratedPDF(db.Model):
    """Generated PDF files"""
    __tablename__ = 'generated_pdfs'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False, index=True)
    
    # PDF metadata
    filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_size = db.Column(db.Integer)  # In bytes
    
    # Generation info
    generated_at = db.Column(db.DateTime, default=datetime.utcnow)
    download_count = db.Column(db.Integer, default=0)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'project_id': self.project_id,
            'filename': self.filename,
            'file_size': self.file_size,
            'generated_at': self.generated_at.isoformat() if self.generated_at else None,
            'download_count': self.download_count
        }


def init_db(app):
    """Initialize database"""
    db.init_app(app)
    
    with app.app_context():
        # Create all tables
        db.create_all()
        print("Database tables created successfully!")


def get_project_responses(project_id: int) -> dict:
    """
    Get all responses for a project as a dictionary
    
    Args:
        project_id: Project ID
        
    Returns:
        dict: field_name -> field_value mapping
    """
    responses = Response.query.filter_by(project_id=project_id).all()
    return {r.field_name: r.field_value for r in responses}


def get_project_images(project_id: int) -> dict:
    """
    Get all image paths for a project
    
    Args:
        project_id: Project ID
        
    Returns:
        dict: field_name -> file_path mapping
    """
    images = ImageUpload.query.filter_by(project_id=project_id).all()
    return {img.field_name: img.file_path for img in images}


def save_response(project_id: int, field_name: str, field_value: str, page_number: int = None):
    """
    Save or update a response
    
    Args:
        project_id: Project ID
        field_name: Field name
        field_value: Field value
        page_number: Optional page number
    """
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
    return response
