"""
PDF Template Analyzer - For calibrating field positions
"""
import fitz

def analyze_pdf_template():
    pdf_path = r'D:\dt playbook\SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf'
    doc = fitz.open(pdf_path)
    
    print('=' * 80)
    print('PDF TEMPLATE ANALYSIS')
    print('=' * 80)
    print(f'Total pages: {len(doc)}')
    page = doc[0]
    print(f'Page dimensions: {page.rect.width} x {page.rect.height} points')
    print()
    
    # For each page, create an image and show key text positions
    for page_num in range(len(doc)):
        page = doc[page_num]
        print(f'\n--- PAGE {page_num + 1} ---')
        
        # Find all images on the page (placeholders where we put drawings)
        images = page.get_images()
        if images:
            print(f'  Images/placeholders: {len(images)}')
        
        # Find text to understand layout
        text_dict = page.get_text('dict')
        blocks = text_dict['blocks']
        
        text_positions = []
        for block in blocks:
            if block['type'] == 0:  # Text block
                for line in block.get('lines', []):
                    for span in line.get('spans', []):
                        text = span.get('text', '').strip()
                        if text and len(text) > 3:
                            origin = span.get('origin', (0, 0))
                            size = span.get('size', 0)
                            text_positions.append({
                                'text': text[:50],
                                'x': origin[0],
                                'y': origin[1],
                                'size': size
                            })
        
        # Show key text positions
        for pos in text_positions[:10]:  # First 10
            print(f"  ({pos['x']:.0f}, {pos['y']:.0f}) [{pos['size']:.1f}pt]: \"{pos['text']}\"")
    
    doc.close()

if __name__ == '__main__':
    analyze_pdf_template()
