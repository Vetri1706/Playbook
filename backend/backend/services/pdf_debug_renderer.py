"""
PDF Debug Renderer - Visual Debugging Tool
Generates debug PDFs with bounding boxes, labels, and diagnostics
"""
import fitz
from pathlib import Path
import logging
from typing import Dict, Any, Optional

from pdf_mappings import PDF_FIELD_MAPPINGS, get_page_fields

logger = logging.getLogger(__name__)


class PDFDebugRenderer:
    """Renders debug overlays on PDF template for visual inspection"""
    
    def __init__(self, template_path: str, output_dir: str):
        """Initialize debug renderer"""
        self.template_path = Path(template_path)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        if not self.template_path.exists():
            raise FileNotFoundError(f"Template not found: {template_path}")
    
    def generate_debug_pdf(
        self,
        user_responses: Dict[str, Any],
        images: Dict[str, str] = None,
        output_filename: str = "debug_overlay.pdf"
    ) -> Path:
        """
        Generate a PDF with visual debug overlays
        
        Features:
        - Red bounding boxes around all mapped fields
        - Field names as labels
        - Green boxes for fields with data
        - Yellow boxes for missing data
        - Blue boxes for images
        
        Args:
            user_responses: User data dictionary
            images: Image paths dictionary
            output_filename: Output file name
            
        Returns:
            Path to generated debug PDF
        """
        pdf_document = fitz.open(str(self.template_path))
        output_path = self.output_dir / output_filename
        
        try:
            for page_num in range(1, len(pdf_document) + 1):
                page = pdf_document[page_num - 1]
                page_fields = get_page_fields(page_num)
                
                if not page_fields:
                    continue
                
                for field_name, field_config in page_fields.items():
                    self._draw_field_debug(
                        page,
                        page_num,
                        field_name,
                        field_config,
                        user_responses,
                        images
                    )
            
            pdf_document.save(str(output_path))
            logger.info(f"✅ Debug PDF saved: {output_path}")
            return output_path
            
        finally:
            pdf_document.close()
    
    def _draw_field_debug(
        self,
        page: fitz.Page,
        page_num: int,
        field_name: str,
        field_config: Dict[str, Any],
        user_responses: Dict[str, Any],
        images: Dict[str, str] = None
    ):
        """Draw debug overlay for a single field"""
        x = field_config['x']
        y = field_config['y']
        width = field_config['width']
        height = field_config.get('height', 50)
        field_type = field_config.get('field_type', 'unknown')
        
        # Convert to PyMuPDF coordinates (bottom-left origin)
        rect_y = page.rect.height - y - height
        rect = fitz.Rect(x, rect_y, x + width, rect_y + height)
        
        # Determine color based on data availability
        has_data = False
        if field_type in ['text', 'textarea']:
            has_data = field_name in user_responses and user_responses[field_name]
            color = (0, 0.8, 0) if has_data else (1, 0.8, 0)  # Green if has data, yellow if missing
        elif field_type == 'image':
            has_data = images and field_name in images
            color = (0, 0.5, 1)  # Blue for images
        elif field_type == 'table':
            has_data = field_name in user_responses
            color = (0.8, 0, 0.8)  # Purple for tables
        else:
            color = (1, 0, 0)  # Red for unknown types
        
        # Draw bounding box
        page.draw_rect(rect, color=color, width=2)
        
        # Add label above the box
        label = f"{field_name} ({field_type})"
        if not has_data:
            label += " [NO DATA]"
        
        # Label background (semi-transparent white)
        label_rect = fitz.Rect(x, rect_y - 20, x + width, rect_y)
        page.draw_rect(label_rect, color=(1, 1, 1), fill=(1, 1, 1), width=0.5)
        
        # Label text
        page.insert_textbox(
            label_rect,
            label,
            fontsize=8,
            fontname="Helvetica",
            color=(0, 0, 0),
            align=fitz.TEXT_ALIGN_LEFT
        )
        
        # If field has data, show preview
        if has_data and field_type in ['text', 'textarea']:
            value = user_responses.get(field_name, '')
            preview = str(value)[:50] + "..." if len(str(value)) > 50 else str(value)
            
            # Draw preview text inside the box
            preview_rect = fitz.Rect(x + 5, rect_y + 5, x + width - 5, rect_y + height - 5)
            page.insert_textbox(
                preview_rect,
                f"[DATA]: {preview}",
                fontsize=7,
                fontname="Helvetica",
                color=(0, 0, 0),
                align=fitz.TEXT_ALIGN_LEFT
            )


def generate_field_map_documentation(
    template_path: str,
    output_path: str,
    user_responses: Optional[Dict[str, Any]] = None,
    images: Optional[Dict[str, str]] = None
):
    """
    Generate an annotated PDF showing all field locations
    Useful for documentation and manual calibration
    
    Args:
        template_path: Path to PDF template
        output_path: Output path for debug PDF
        user_responses: Optional user data to show coverage
        images: Optional image paths
    """
    renderer = PDFDebugRenderer(template_path, Path(output_path).parent)
    
    # Use provided data or empty dict to show all fields as "missing"
    debug_pdf = renderer.generate_debug_pdf(
        user_responses=user_responses or {},
        images=images or {},
        output_filename=Path(output_path).name
    )
    
    logger.info(f"📄 Field map documentation generated: {debug_pdf}")
    return debug_pdf
