"""
PDF Coordinate Calibration Tool

This utility helps you find the exact (x, y) coordinates for placing
text and images on your PDF template.

Usage:
    python pdf_calibrator.py

Instructions:
1. The tool will open each page of your PDF
2. Click on the PDF to mark where you want to place content
3. Coordinates will be displayed and saved to a JSON file
4. Use these coordinates to update pdf_mappings.py
"""
import fitz  # PyMuPDF
import json
from pathlib import Path


def calibrate_pdf(pdf_path: str, output_file: str = 'calibrated_coordinates.json'):
    """
    Interactive tool to find coordinates on PDF pages
    
    Args:
        pdf_path: Path to the PDF template
        output_file: Output file for coordinates
    """
    pdf_path = Path(pdf_path)
    
    if not pdf_path.exists():
        print(f"Error: PDF not found at {pdf_path}")
        return
    
    print(f"Opening PDF: {pdf_path}")
    print(f"Total pages: ", end='')
    
    pdf_document = fitz.open(str(pdf_path))
    print(len(pdf_document))
    
    coordinates = {}
    
    print("\n" + "="*60)
    print("PDF COORDINATE CALIBRATOR")
    print("="*60)
    
    for page_num in range(len(pdf_document)):
        page = pdf_document[page_num]
        page_number = page_num + 1
        
        print(f"\n📄 PAGE {page_number}")
        print(f"   Dimensions: {page.rect.width:.1f} x {page.rect.height:.1f} points")
        print(f"   (1 inch = 72 points)")
        
        # Get page annotations/fields if any
        print(f"\n   Page bounds:")
        print(f"   Top-left:     (0, 0)")
        print(f"   Top-right:    ({page.rect.width:.1f}, 0)")
        print(f"   Bottom-left:  (0, {page.rect.height:.1f})")
        print(f"   Bottom-right: ({page.rect.width:.1f}, {page.rect.height:.1f})")
        
        # Check for existing text/annotations
        text_instances = page.get_text("dict")
        if text_instances and text_instances.get("blocks"):
            print(f"\n   Found {len(text_instances['blocks'])} text blocks on this page")
        
        # Manual coordinate input
        print(f"\n   Enter field coordinates for this page (or press Enter to skip):")
        page_coords = {}
        
        while True:
            field_name = input(f"\n   Field name (or Enter to finish page): ").strip()
            if not field_name:
                break
            
            try:
                x = float(input(f"   X coordinate (left margin): "))
                y = float(input(f"   Y coordinate (from top): "))
                width = float(input(f"   Width: "))
                height = float(input(f"   Height: "))
                
                field_type = input(f"   Field type (text/textarea/image): ").strip().lower()
                if field_type not in ['text', 'textarea', 'image']:
                    field_type = 'text'
                
                page_coords[field_name] = {
                    'x': x,
                    'y': y,
                    'width': width,
                    'height': height,
                    'field_type': field_type
                }
                
                if field_type in ['text', 'textarea']:
                    font_size = int(input(f"   Font size (default 11): ") or "11")
                    alignment = input(f"   Alignment (left/center/right, default left): ").strip() or "left"
                    page_coords[field_name]['font_size'] = font_size
                    page_coords[field_name]['alignment'] = alignment
                    
                    if field_type == 'textarea':
                        max_lines = int(input(f"   Max lines (default 5): ") or "5")
                        line_height = int(input(f"   Line height (default 20): ") or "20")
                        page_coords[field_name]['max_lines'] = max_lines
                        page_coords[field_name]['line_height'] = line_height
                
                elif field_type == 'image':
                    fit = input(f"   Fit mode (contain/cover, default contain): ").strip() or "contain"
                    page_coords[field_name]['fit'] = fit
                
                print(f"   ✓ Saved coordinates for '{field_name}'")
                
            except ValueError as e:
                print(f"   ✗ Invalid input: {e}")
                continue
        
        if page_coords:
            coordinates[page_number] = page_coords
    
    pdf_document.close()
    
    # Save coordinates to file
    output_path = Path(output_file)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(coordinates, f, indent=2)
    
    print(f"\n{'='*60}")
    print(f"✓ Coordinates saved to: {output_path}")
    print(f"{'='*60}")
    
    # Print Python dictionary format
    print("\nPython dictionary format (copy to pdf_mappings.py):")
    print("\nPDF_FIELD_MAPPINGS = {")
    for page_num, fields in coordinates.items():
        print(f"    {page_num}: {{")
        for field_name, config in fields.items():
            print(f"        '{field_name}': {{")
            for key, value in config.items():
                if isinstance(value, str):
                    print(f"            '{key}': '{value}',")
                else:
                    print(f"            '{key}': {value},")
            print(f"        }},")
        print(f"    }},")
    print("}")


def extract_text_positions(pdf_path: str):
    """
    Extract all text positions from PDF to help with calibration
    
    Args:
        pdf_path: Path to PDF
    """
    pdf_document = fitz.open(pdf_path)
    
    print("\n" + "="*60)
    print("TEXT POSITION ANALYSIS")
    print("="*60)
    
    for page_num in range(len(pdf_document)):
        page = pdf_document[page_num]
        page_number = page_num + 1
        
        print(f"\n📄 PAGE {page_number}")
        
        # Get text with positions
        text_dict = page.get_text("dict")
        
        for block_num, block in enumerate(text_dict.get("blocks", [])):
            if block.get("type") == 0:  # Text block
                bbox = block.get("bbox")
                if bbox:
                    x0, y0, x1, y1 = bbox
                    print(f"\n   Block {block_num}:")
                    print(f"   Position: x={x0:.1f}, y={y0:.1f}")
                    print(f"   Size: {x1-x0:.1f} x {y1-y0:.1f}")
                    
                    # Get text content (first few words)
                    for line in block.get("lines", [])[:2]:
                        text = ""
                        for span in line.get("spans", []):
                            text += span.get("text", "")
                        if text:
                            print(f"   Text: {text[:50]}...")
                            break
    
    pdf_document.close()


if __name__ == '__main__':
    import sys
    
    # Default PDF path
    default_pdf = '../SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf'
    
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
    else:
        pdf_path = default_pdf
    
    print("PDF Coordinate Calibration Tool")
    print("="*60)
    print(f"PDF: {pdf_path}\n")
    
    choice = input("Choose mode:\n1. Calibrate coordinates (manual input)\n2. Extract existing text positions\n\nChoice (1 or 2): ").strip()
    
    if choice == '2':
        extract_text_positions(pdf_path)
    else:
        calibrate_pdf(pdf_path)
