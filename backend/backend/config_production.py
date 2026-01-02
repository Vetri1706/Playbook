"""
Production Configuration for Design Thinking Playbook Backend
"""
import os
from datetime import timedelta

class ProductionConfig:
    """Production-grade configuration"""
    
    # Flask Core
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'CHANGE_THIS_IN_PRODUCTION'
    DEBUG = False
    TESTING = False
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///dt_playbook.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }
    
    # JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'CHANGE_THIS_IN_PRODUCTION'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # File Uploads
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER') or 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    
    # PDF Generation
    PDF_TEMPLATE_PATH = os.environ.get('PDF_TEMPLATE_PATH') or 'SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf'
    PDF_OUTPUT_DIR = os.environ.get('PDF_OUTPUT_DIR') or 'generated_pdfs'
    
    # Rate Limiting
    RATELIMIT_ENABLED = True
    RATELIMIT_STORAGE_URL = os.environ.get('REDIS_URL') or 'memory://'
    RATELIMIT_DEFAULT = "200 per day, 50 per hour"
    RATELIMIT_HEADERS_ENABLED = True
    
    # Security
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    
    # CORS (adjust for production domain)
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
    
    # Logging
    LOG_LEVEL = os.environ.get('LOG_LEVEL') or 'INFO'
    LOG_FORMAT = '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
    
    # Timeouts
    REQUEST_TIMEOUT = 300  # 5 minutes for PDF generation
    
    # Workers (for Gunicorn)
    WORKERS = int(os.environ.get('WORKERS') or 4)
    WORKER_CLASS = 'sync'
    WORKER_CONNECTIONS = 1000
    KEEPALIVE = 2
    
    # Gunicorn
    BIND = os.environ.get('BIND') or '0.0.0.0:8000'
    ACCESSLOG = '-'  # stdout
    ERRORLOG = '-'   # stderr
    LOGLEVEL = 'info'


class DevelopmentConfig:
    """Development configuration"""
    
    SECRET_KEY = 'dev-secret-key'
    DEBUG = True
    TESTING = False
    
    SQLALCHEMY_DATABASE_URI = 'sqlite:///dt_playbook.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    JWT_SECRET_KEY = 'dev-jwt-secret'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    
    PDF_TEMPLATE_PATH = 'SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf'
    PDF_OUTPUT_DIR = 'generated_pdfs'
    
    # No rate limiting in dev
    RATELIMIT_ENABLED = False
    
    CORS_ORIGINS = ['*']
    LOG_LEVEL = 'DEBUG'


# Config dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
