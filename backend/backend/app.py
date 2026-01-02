"""
Main Flask Application
"""
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from pathlib import Path
import logging
import time
import uuid
import os
from werkzeug.exceptions import HTTPException

from config import get_config
from models import init_db
from routes.pdf_routes import pdf_bp
from routes.auth_routes import auth_bp
# from routes.html_pdf_routes import pdf_bp as html_pdf_bp  # Disabled: requires GTK libraries on Windows

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)


def create_app(config_name=None):
    """
    Application factory - Production-hardened Flask app
    
    Args:
        config_name: Configuration name (development, production, testing)
        
    Returns:
        Flask: Configured Flask application
    """
    app = Flask(__name__)
    
    # Load configuration
    config_class = get_config()
    app.config.from_object(config_class)
    
    # Ensure directories exist
    Path(app.config['PDF_OUTPUT_DIR']).mkdir(parents=True, exist_ok=True)
    Path(app.config['UPLOAD_FOLDER']).mkdir(parents=True, exist_ok=True)
    
    # Initialize database
    init_db(app)
    
    # Enable CORS - allow all origins in development
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-API-Key"]
        }
    })
    
    # ─────────────────────────────────────────────────────────────
    # REQUEST LOGGING MIDDLEWARE
    # ─────────────────────────────────────────────────────────────
    @app.before_request
    def log_request():
        """Log all incoming requests with trace ID"""
        g.trace_id = str(uuid.uuid4())[:8]
        g.start_time = time.time()
        
        logger.info(f"[{g.trace_id}] {request.method} {request.path} "
                   f"from {request.remote_addr}")
        
        # Log request body for POST/PUT (exclude sensitive fields)
        if request.method in ['POST', 'PUT'] and request.is_json:
            try:
                body = request.get_json()
                safe_body = {k: v for k, v in body.items() 
                           if k not in ['password', 'token', 'secret']}
                logger.debug(f"[{g.trace_id}] Body: {safe_body}")
            except:
                pass
    
    @app.after_request
    def log_response(response):
        """Log response and timing"""
        if hasattr(g, 'start_time'):
            duration = (time.time() - g.start_time) * 1000
            logger.info(f"[{g.trace_id}] {response.status_code} "
                       f"in {duration:.2f}ms")
        return response
    
    # ─────────────────────────────────────────────────────────────
    # REGISTER BLUEPRINTS
    # ─────────────────────────────────────────────────────────────
    app.register_blueprint(auth_bp)
    app.register_blueprint(pdf_bp)  # Legacy coordinate-based PDF generation
    # app.register_blueprint(html_pdf_bp)  # Disabled: requires GTK libraries on Windows
    
    # ─────────────────────────────────────────────────────────────
    # CORE ENDPOINTS
    # ─────────────────────────────────────────────────────────────
    @app.route('/health', methods=['GET'])
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint for load balancers"""
        return jsonify({
            'status': 'healthy',
            'service': 'Design Thinking Playbook PDF Generator',
            'version': '1.0.0',
            'timestamp': time.time()
        })
    
    @app.route('/api/routes', methods=['GET'])
    def list_routes():
        """Debug endpoint: List all registered routes"""
        routes = []
        for rule in app.url_map.iter_rules():
            routes.append({
                'endpoint': rule.endpoint,
                'methods': list(rule.methods - {'HEAD', 'OPTIONS'}),
                'path': str(rule)
            })
        return jsonify({
            'total': len(routes),
            'routes': sorted(routes, key=lambda x: x['path'])
        })
    
    @app.route('/test', methods=['GET'])
    def test_page():
        """Test page for API exploration"""
        try:
            with open('test_api.html', 'r') as f:
                return f.read(), 200
        except FileNotFoundError:
            return jsonify({
                'error': 'Test page not found',
                'message': 'test_api.html is missing'
            }), 404
    
    @app.route('/api/config', methods=['GET'])
    def show_config():
        """Debug endpoint: Show configuration (non-sensitive)"""
        return jsonify({
            'PDF_TEMPLATE_PATH': str(app.config['PDF_TEMPLATE_PATH']),
            'PDF_OUTPUT_DIR': str(app.config['PDF_OUTPUT_DIR']),
            'environment': app.config.get('ENV', 'development'),
            'debug': app.config.get('DEBUG', False)
        })
    
    # ─────────────────────────────────────────────────────────────
    # GLOBAL ERROR HANDLERS
    # ─────────────────────────────────────────────────────────────
    @app.errorhandler(400)
    def bad_request(error):
        """Handle bad requests"""
        trace_id = getattr(g, 'trace_id', 'unknown')
        return jsonify({
            'error': 'Bad Request',
            'message': str(error.description) if hasattr(error, 'description') else 'Invalid request',
            'trace_id': trace_id
        }), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        """Handle unauthorized access"""
        trace_id = getattr(g, 'trace_id', 'unknown')
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Authentication required',
            'trace_id': trace_id
        }), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        """Handle forbidden access"""
        trace_id = getattr(g, 'trace_id', 'unknown')
        return jsonify({
            'error': 'Forbidden',
            'message': 'You do not have permission to access this resource',
            'trace_id': trace_id
        }), 403
    
    @app.errorhandler(404)
    def not_found(error):
        """Handle not found errors"""
        trace_id = getattr(g, 'trace_id', 'unknown')
        logger.warning(f"[{trace_id}] 404: {request.method} {request.path}")
        return jsonify({
            'error': 'Not Found',
            'message': f'The requested URL {request.path} was not found',
            'trace_id': trace_id,
            'hint': 'Try GET /api/routes to see all available endpoints'
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        """Handle internal server errors"""
        trace_id = getattr(g, 'trace_id', 'unknown')
        logger.error(f"[{trace_id}] 500 Error: {error}", exc_info=True)
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred',
            'trace_id': trace_id
        }), 500
    
    @app.errorhandler(Exception)
    def handle_exception(error):
        """Catch-all exception handler"""
        trace_id = getattr(g, 'trace_id', 'unknown')
        
        # Pass through HTTP errors
        if isinstance(error, HTTPException):
            return error
        
        # Log unexpected errors
        logger.error(f"[{trace_id}] Unhandled exception: {error}", exc_info=True)
        
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred',
            'trace_id': trace_id,
            'type': type(error).__name__ if app.debug else None
        }), 500
    
    # ─────────────────────────────────────────────────────────────
    # STARTUP DIAGNOSTICS
    # ─────────────────────────────────────────────────────────────
    # Log all routes on startup (Flask 3.0+ compatible)
    with app.app_context():
        logger.info("="* 60)
        logger.info("FLASK APP INITIALIZED - REGISTERED ROUTES:")
        logger.info("="* 60)
        for rule in sorted(app.url_map.iter_rules(), key=lambda r: str(r)):
            methods = ','.join(rule.methods - {'HEAD', 'OPTIONS'})
            logger.info(f"  {methods:15} {rule}")
        logger.info("="* 60)
    
    return app


if __name__ == '__main__':
    app = create_app()
    # The Flask debug reloader can cause the parent process to exit immediately
    # in some VS Code terminal/task setups on Windows. Keep debug, but disable
    # the reloader so the server stays reachable on :5000.
    debug = os.getenv('FLASK_DEBUG', '').strip() in {'1', 'true', 'True'} or bool(app.config.get('DEBUG', False))
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=debug,
        use_reloader=False
    )
