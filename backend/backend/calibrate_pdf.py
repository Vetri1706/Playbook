"""
PDF Template Visual Calibration Tool
Creates a reference PDF with grids and coordinates to help identify exact field positions
"""
import fitz
import os

def create_calibration_pdf():
    """Create a calibration overlay on top of the template"""
    
    template_path = r'D:\dt playbook\SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf'
    output_path = r'D:\dt playbook\design-thinking-playbook-website\backend\generated_pdfs\CALIBRATION_GRID.pdf'
    
    # Open template
    doc = fitz.open(template_path)
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        width, height = page.rect.width, page.rect.height
        
        # Draw grid every 50 points
        shape = page.new_shape()
        
        # Vertical lines
        for x in range(0, int(width), 50):
            shape.draw_line(fitz.Point(x, 0), fitz.Point(x, height))
            # Label
            shape.insert_text(fitz.Point(x + 2, 15), str(x), fontsize=6, color=(1, 0, 0))
        
        # Horizontal lines  
        for y in range(0, int(height), 50):
            shape.draw_line(fitz.Point(0, y), fitz.Point(width, y))
            # Label
            shape.insert_text(fitz.Point(5, y + 10), str(y), fontsize=6, color=(0, 0, 1))
        
        shape.finish(color=(0.8, 0.8, 0.8), width=0.3)
        shape.commit()
        
        # Add page number overlay
        page.insert_text(
            fitz.Point(width - 80, 20),
            f"Page {page_num + 1}",
            fontsize=12,
            color=(1, 0, 0)
        )
    
    doc.save(output_path)
    doc.close()
    print(f"Calibration PDF saved to: {output_path}")
    return output_path


def analyze_page_details():
    """Analyze each page in detail to find exact input field positions"""
    
    template_path = r'D:\dt playbook\SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf'
    doc = fitz.open(template_path)
    
    print("\n" + "=" * 100)
    print("DETAILED PAGE-BY-PAGE ANALYSIS FOR FIELD POSITIONS")
    print("=" * 100)
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        print(f"\n{'='*50}")
        print(f"PAGE {page_num + 1}")
        print('='*50)
        
        # Get all text blocks
        text_dict = page.get_text('dict')
        blocks = text_dict['blocks']
        
        # Find key labels and their positions to determine input field locations
        labels_found = []
        for block in blocks:
            if block['type'] == 0:  # Text
                for line in block.get('lines', []):
                    for span in line.get('spans', []):
                        text = span.get('text', '').strip()
                        if text:
                            bbox = line.get('bbox', (0,0,0,0))
                            labels_found.append({
                                'text': text,
                                'x': bbox[0],
                                'y': bbox[1],
                                'x2': bbox[2],
                                'y2': bbox[3]
                            })
        
        # Print key labels (these help identify where input fields should go)
        key_texts = [
            'Name', 'name', 'Write', 'Draw', 'Problem', 'User', 'Who', 'What', 'When',
            'Where', 'How', 'Why', 'Idea', 'Help', 'Sad', 'Happy', 'Best', 'Prototype',
            'Innovation', 'Message', 'Signature', 'Because', 'Solution'
        ]
        
        for label in labels_found:
            if any(kw.lower() in label['text'].lower() for kw in key_texts):
                print(f"  LABEL: \"{label['text'][:60]}\"")
                print(f"         Position: ({label['x']:.0f}, {label['y']:.0f}) to ({label['x2']:.0f}, {label['y2']:.0f})")
    
    doc.close()


def detect_blank_regions():
    """
    Detect blank/white regions on each page where text should be inserted
    """
    template_path = r'D:\dt playbook\SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf'
    doc = fitz.open(template_path)
    
    print("\n" + "=" * 100)
    print("BLANK REGION DETECTION (Potential Input Areas)")
    print("=" * 100)
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # Convert page to pixmap and analyze for white regions
        # This is a simpler approach - just look for text boundaries
        text_dict = page.get_text('dict')
        blocks = text_dict['blocks']
        
        print(f"\nPage {page_num + 1}: {len(blocks)} content blocks")
        
        # Get all text bounding boxes
        text_boxes = []
        for block in blocks:
            if block['type'] == 0:  # Text block
                text_boxes.append(block['bbox'])
        
        if text_boxes:
            # Find gaps between text blocks (potential input areas)
            text_boxes.sort(key=lambda b: (b[1], b[0]))  # Sort by y, then x
            print(f"  Text regions span: x={min(b[0] for b in text_boxes):.0f}-{max(b[2] for b in text_boxes):.0f}")
            print(f"                     y={min(b[1] for b in text_boxes):.0f}-{max(b[3] for b in text_boxes):.0f}")
    
    doc.close()


if __name__ == '__main__':
    create_calibration_pdf()
    analyze_page_details()
    detect_blank_regions()
