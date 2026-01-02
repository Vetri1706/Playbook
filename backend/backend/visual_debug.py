"""
Visual Debug PDF Generator
Creates a PDF with visible field boundaries to verify positioning
"""
import sys
import os
sys.path.insert(0, '.')

import fitz
from pathlib import Path
from pdf_mappings import PDF_FIELD_MAPPINGS, PDF_WIDTH, PDF_HEIGHT

def create_visual_debug_pdf():
    """Generate a PDF showing all field boundaries with labels"""
    
    print("=" * 70)
    print("VISUAL DEBUG PDF GENERATOR")
    print("=" * 70)
    
    template_path = r'D:\dt playbook\SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf'
    output_path = r'D:\dt playbook\design-thinking-playbook-website\backend\generated_pdfs\DEBUG_FIELD_BOUNDARIES.pdf'
    
    # Open template
    doc = fitz.open(template_path)
    
    # Colors for different field types
    colors = {
        'text': (1, 0, 0),      # Red
        'textarea': (0, 0, 1),   # Blue
        'image': (0, 0.7, 0),    # Green
        'table': (0.8, 0.5, 0)   # Orange
    }
    
    # Process each page
    for page_num in range(1, len(doc) + 1):
        page = doc[page_num - 1]
        fields = PDF_FIELD_MAPPINGS.get(page_num, {})
        
        if not fields:
            continue
        
        print(f"\nPage {page_num}: {len(fields)} fields")
        
        for field_name, config in fields.items():
            x = config.get('x', 0)
            y = config.get('y', 0)
            width = config.get('width', 100)
            height = config.get('height', 30)
            field_type = config.get('field_type', 'text')
            
            # Get color for field type
            color = colors.get(field_type, (0.5, 0.5, 0.5))
            
            # Draw rectangle showing field boundary
            rect = fitz.Rect(x, y, x + width, y + height)
            
            # Draw border (dashed for visual distinction)
            shape = page.new_shape()
            shape.draw_rect(rect)
            shape.finish(
                color=color,
                fill=None,
                width=1.5,
                dashes="[3] 0"  # Dashed line
            )
            shape.commit()
            
            # Add field name label at top-left corner
            label = f"{field_name} ({field_type})"
            page.insert_text(
                (x + 2, y + 10),
                label[:30],  # Truncate long names
                fontsize=7,
                color=color,
                overlay=True
            )
            
            print(f"  {field_name}: ({x}, {y}) {width}x{height} [{field_type}]")
    
    # Save debug PDF
    doc.save(output_path)
    doc.close()
    
    print("\n" + "=" * 70)
    print(f"Debug PDF saved to: {output_path}")
    print("=" * 70)
    print("\nLegend:")
    print("  RED dashed boxes    = text fields")
    print("  BLUE dashed boxes   = textarea fields")
    print("  GREEN dashed boxes  = image fields")
    print("  ORANGE dashed boxes = table fields")
    print("=" * 70)
    
    return output_path


if __name__ == '__main__':
    create_visual_debug_pdf()
