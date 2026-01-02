"""
PRECISE PDF CALIBRATION TOOL
Creates a calibration PDF showing exactly where text appears on each page
with grid overlays and measurement markers
"""
import fitz
from pathlib import Path
from pdf_mappings import PDF_FIELD_MAPPINGS, PDF_WIDTH, PDF_HEIGHT

# Paths
BACKEND_DIR = Path(__file__).parent
BACKGROUNDS_DIR = BACKEND_DIR / "static" / "pdf_backgrounds"
OUTPUT_DIR = BACKEND_DIR / "generated_pdfs"
OUTPUT_DIR.mkdir(exist_ok=True)

def create_calibration_pdf():
    """Create a PDF showing field positions overlaid on actual backgrounds"""
    
    output_path = OUTPUT_DIR / "CALIBRATION_VISUAL.pdf"
    doc = fitz.open()
    
    print("=" * 70)
    print("VISUAL CALIBRATION PDF GENERATOR")
    print("=" * 70)
    
    for page_num in range(1, 13):
        # Create a new page with exact dimensions
        page = doc.new_page(width=PDF_WIDTH, height=PDF_HEIGHT)
        
        # Load and insert the background image
        bg_path = BACKGROUNDS_DIR / f"page_{page_num:02d}.png"
        if bg_path.exists():
            # Insert background as full page
            page_rect = fitz.Rect(0, 0, PDF_WIDTH, PDF_HEIGHT)
            page.insert_image(page_rect, filename=str(bg_path))
            print(f"\nPage {page_num}: Background loaded from {bg_path.name}")
        else:
            print(f"\nPage {page_num}: WARNING - No background found!")
            # Draw a placeholder
            page.draw_rect(fitz.Rect(0, 0, PDF_WIDTH, PDF_HEIGHT), color=(0.9, 0.9, 0.9), fill=(1, 1, 1))
        
        # Draw grid lines every 50 points for reference
        # Vertical lines
        for x in range(0, int(PDF_WIDTH) + 1, 50):
            page.draw_line(
                fitz.Point(x, 0), 
                fitz.Point(x, PDF_HEIGHT),
                color=(0.8, 0.8, 0.8),
                width=0.3
            )
            # Label every 100 points
            if x % 100 == 0:
                page.insert_text((x + 2, 10), str(x), fontsize=6, color=(0.5, 0.5, 0.5))
        
        # Horizontal lines
        for y in range(0, int(PDF_HEIGHT) + 1, 50):
            page.draw_line(
                fitz.Point(0, y), 
                fitz.Point(PDF_WIDTH, y),
                color=(0.8, 0.8, 0.8),
                width=0.3
            )
            # Label every 100 points
            if y % 100 == 0:
                page.insert_text((2, y + 8), str(y), fontsize=6, color=(0.5, 0.5, 0.5))
        
        # Get fields for this page
        fields = PDF_FIELD_MAPPINGS.get(page_num, {})
        
        if fields:
            print(f"  Fields: {len(fields)}")
            
            for field_name, config in fields.items():
                x = config['x']
                y = config['y']
                width = config['width']
                height = config['height']
                field_type = config.get('field_type', 'text')
                
                # Draw field boundary rectangle
                rect = fitz.Rect(x, y, x + width, y + height)
                
                # Color by field type
                if field_type == 'image':
                    border_color = (0, 0.6, 0)  # Green
                    fill_color = (0, 1, 0)       # Light green
                    fill_opacity = 0.15
                elif field_type == 'textarea':
                    border_color = (0, 0, 0.8)  # Blue
                    fill_color = (0, 0, 1)       # Light blue
                    fill_opacity = 0.15
                else:
                    border_color = (0.8, 0, 0)  # Red
                    fill_color = (1, 0, 0)       # Light red
                    fill_opacity = 0.15
                
                # Draw filled rectangle with transparency
                shape = page.new_shape()
                shape.draw_rect(rect)
                shape.finish(color=border_color, fill=fill_color, fill_opacity=fill_opacity, width=1.5)
                shape.commit()
                
                # Add field label at top-left of box
                label = f"{field_name}"
                page.insert_text(
                    (x + 2, y + 10),
                    label,
                    fontsize=7,
                    color=(0, 0, 0)
                )
                
                # Add sample text to show where text actually renders
                sample_text = f"[{field_type}]"
                if field_type == 'text':
                    sample_text = "Sample Title Text"
                elif field_type == 'textarea':
                    sample_text = "Sample body text line 1\nLine 2 of the text"
                
                # Insert sample text at the actual position (using same method as generator)
                font_size = config.get('font_size', 11)
                text_y = y + font_size + 2  # Same calculation as _insert_single_line_safe
                
                page.insert_text(
                    (x + 8, text_y),
                    sample_text.split('\n')[0][:30] + "..." if len(sample_text) > 30 else sample_text.split('\n')[0],
                    fontsize=min(font_size, 10),
                    color=(0.2, 0.2, 0.8)
                )
                
                # Print coordinates for reference
                print(f"    {field_name}: ({x}, {y}) {width}x{height} [{field_type}]")
        else:
            print(f"  No fields defined")
    
    # Save the PDF
    doc.save(str(output_path))
    doc.close()
    
    print("\n" + "=" * 70)
    print(f"CALIBRATION PDF SAVED: {output_path}")
    print("=" * 70)
    print("\nOpen this PDF to verify:")
    print("  - Gray grid shows 50pt intervals (labeled at 100pt)")
    print("  - RED boxes = text fields")
    print("  - BLUE boxes = textarea fields") 
    print("  - GREEN boxes = image fields")
    print("  - Blue sample text shows approximate text position")
    print("=" * 70)
    
    return output_path

if __name__ == "__main__":
    create_calibration_pdf()
