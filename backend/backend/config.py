"""
Backend Configuration Module
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Base directories
BASE_DIR = Path(__file__).parent
PROJECT_ROOT = BASE_DIR.parent

# Load environment variables (always from this backend folder)
load_dotenv(dotenv_path=BASE_DIR / '.env')

_pdf_template_env = os.getenv('PDF_TEMPLATE_PATH')
if _pdf_template_env:
    _candidate = Path(_pdf_template_env)
    # If relative, resolve relative to repo root (two levels up from this file)
    PDF_TEMPLATE_PATH = str(_candidate if _candidate.is_absolute() else (PROJECT_ROOT.parent / _candidate).resolve())
else:
    PDF_TEMPLATE_PATH = str((PROJECT_ROOT.parent / 'SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf').resolve())


class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        f'sqlite:///{BASE_DIR / "dt_playbook.db"}'
    )
    
    # PDF Settings
    PDF_TEMPLATE_PATH = PDF_TEMPLATE_PATH
    PDF_OUTPUT_DIR = BASE_DIR / 'generated_pdfs'
    MAX_PDF_SIZE_MB = int(os.getenv('MAX_PDF_SIZE_MB', 50))
    
    # Security
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', SECRET_KEY)
    JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', 24))
    
    # File Upload
    UPLOAD_FOLDER = BASE_DIR / 'uploads'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    MAX_IMAGE_SIZE_MB = int(os.getenv('MAX_IMAGE_SIZE_MB', 5))
    
    # CORS
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False


class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config():
    """Get configuration based on environment"""
    env = os.getenv('FLASK_ENV', 'development')
    return config.get(env, config['default'])
