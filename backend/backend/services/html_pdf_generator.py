"""
HTML→PDF Generation Service using WeasyPrint
Replaces coordinate-based PyMuPDF overlay with robust HTML rendering
"""
from pathlib import Path
from typing import Dict, Any, Optional
import logging
from flask import render_template, url_for
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration
import uuid

logger = logging.getLogger(__name__)


class HTMLPDFGenerator:
    """
    Production-grade HTML→PDF generator
    
    Architecture:
    1. Load page background PNGs
    2. Render Jinja2 template with user data
    3. Position content over backgrounds using CSS
    4. Convert HTML→PDF with WeasyPrint
    
    Advantages over coordinate overlay:
    - No silent failures from coordinate errors
    - Content flows naturally with HTML
    - Easy visual debugging
    - Consistent across machines
    - Supports rich formatting
    """
    
    def __init__(self, output_dir: str, debug_mode: bool = False):
        """
        Initialize HTML PDF generator
        
        Args:
            output_dir: Directory for generated PDFs
            debug_mode: Enable visual debugging indicators
        """
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.debug_mode = debug_mode
        
        # Font configuration for WeasyPrint
        self.font_config = FontConfiguration()
        
        logger.info(f"✅ HTML PDF Generator initialized (debug_mode={debug_mode})")
    
    def generate_pdf(
        self,
        project_id: int,
        project_name: str,
        user_responses: Dict[str, Any],
        images: Optional[Dict[str, str]] = None,
        output_filename: Optional[str] = None
    ) -> Path:
        """
        Generate PDF from HTML template with user data
        
        Args:
            project_id: Database project ID
            project_name: Display name for project
            user_responses: Dictionary of field_name → value
            images: Dictionary of field_name → image_path
            output_filename: Custom output filename (auto-generated if None)
        
        Returns:
            Path to generated PDF
        
        Raises:
            ValueError: If template rendering fails
            RuntimeError: If PDF generation fails
        """
        trace_id = str(uuid.uuid4())[:8]
        
        logger.info(f"[{trace_id}] Starting HTML→PDF generation")
        logger.info(f"[{trace_id}]   Project: {project_name} (ID: {project_id})")
        logger.info(f"[{trace_id}]   Responses: {len(user_responses)}")
        logger.info(f"[{trace_id}]   Images: {len(images or {})}")
        logger.info(f"[{trace_id}]   Debug mode: {self.debug_mode}")
        
        # Prepare data for template
        template_data = {
            'project_id': project_id,
            'project_name': project_name,
            'data': user_responses,
            'images': images or {},
            'debug_mode': self.debug_mode,
            'trace_id': trace_id
        }
        
        try:
            # Render HTML template
            logger.info(f"[{trace_id}] Rendering Jinja2 template...")
            html_content = render_template('pdf/playbook.html', **template_data)
            
            # Generate output filename
            if not output_filename:
                from datetime import datetime
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                output_filename = f"playbook_{project_name.replace(' ', '_')}_{timestamp}.pdf"
            
            output_path = self.output_dir / output_filename
            
            # Convert HTML→PDF with WeasyPrint
            logger.info(f"[{trace_id}] Converting HTML→PDF with WeasyPrint...")
            
            # Load CSS
            css_path = Path(__file__).parent.parent / 'static' / 'css' / 'pdf_template.css'
            css = CSS(filename=str(css_path), font_config=self.font_config)
            
            # Generate PDF
            HTML(string=html_content, base_url=str(Path(__file__).parent.parent)).write_pdf(
                target=str(output_path),
                stylesheets=[css],
                font_config=self.font_config
            )
            
            file_size = output_path.stat().st_size
            logger.info(f"[{trace_id}] ✅ PDF generated successfully")
            logger.info(f"[{trace_id}]   Output: {output_path}")
            logger.info(f"[{trace_id}]   Size: {file_size:,} bytes")
            
            return output_path
            
        except Exception as e:
            logger.error(f"[{trace_id}] ❌ PDF generation failed: {e}", exc_info=True)
            raise RuntimeError(f"Failed to generate PDF: {e}")
    
    def generate_debug_html(
        self,
        project_id: int,
        project_name: str,
        user_responses: Dict[str, Any],
        images: Optional[Dict[str, str]] = None
    ) -> str:
        """
        Generate HTML for debugging (can be opened in browser)
        
        Args:
            project_id: Database project ID
            project_name: Display name for project
            user_responses: Dictionary of field_name → value
            images: Dictionary of field_name → image_path
        
        Returns:
            Rendered HTML string
        """
        template_data = {
            'project_id': project_id,
            'project_name': project_name,
            'data': user_responses,
            'images': images or {},
            'debug_mode': True
        }
        
        return render_template('pdf/playbook.html', **template_data)
