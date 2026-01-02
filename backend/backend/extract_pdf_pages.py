"""
PDF Page Extractor - One-time setup script
Extracts each page from the original PDF as a high-resolution PNG image
These images will be used as backgrounds in the HTML templates
"""
import fitz  # PyMuPDF
from pathlib import Path
import sys

def extract_pages_as_images(
    pdf_path: str,
    output_dir: str,
    dpi: int = 150
) -> list[Path]:
    """
    Extract all pages from PDF as high-resolution PNG images
    
    Args:
        pdf_path: Path to source PDF
        output_dir: Directory to save PNG images
        dpi: Resolution (150 recommended for web, 300 for print)
    
    Returns:
        List of created image paths
    """
    pdf_path = Path(pdf_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")
    
    print(f"📄 Opening PDF: {pdf_path.name}")
    doc = fitz.open(pdf_path)
    
    # Calculate zoom for desired DPI (72 is default PDF DPI)
    zoom = dpi / 72
    matrix = fitz.Matrix(zoom, zoom)
    
    created_files = []
    
    print(f"🖼️  Extracting {len(doc)} pages at {dpi} DPI...")
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # Render page to pixmap
        pix = page.get_pixmap(matrix=matrix)
        
        # Save as PNG
        output_path = output_dir / f"page_{page_num + 1:02d}.png"
        pix.save(output_path)
        
        print(f"  ✅ Page {page_num + 1}: {output_path.name} ({pix.width}x{pix.height}px)")
        created_files.append(output_path)
    
    doc.close()
    
    print(f"\n✅ Successfully extracted {len(created_files)} pages")
    print(f"📁 Output directory: {output_dir.absolute()}")
    
    return created_files


def main():
    # Configuration
    PDF_PATH = r"D:\dt playbook\SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf"
    OUTPUT_DIR = "static/pdf_backgrounds"
    DPI = 150  # 150 for web quality, 300 for print quality
    
    try:
        images = extract_pages_as_images(PDF_PATH, OUTPUT_DIR, DPI)
        
        print("\n" + "="*60)
        print("EXTRACTION COMPLETE")
        print("="*60)
        print(f"Total images: {len(images)}")
        print(f"Location: {Path(OUTPUT_DIR).absolute()}")
        print("\nNext steps:")
        print("1. Review extracted images in static/pdf_backgrounds/")
        print("2. These will be used as HTML page backgrounds")
        print("3. Run the Flask server to generate PDFs")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
