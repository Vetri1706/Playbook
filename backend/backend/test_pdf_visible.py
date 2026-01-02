"""
Quick test to add HIGHLY VISIBLE text to PDF to verify rendering works
"""
import fitz
from pathlib import Path

# Open the template
template_path = Path(r"D:\dt playbook\SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf")
output_path = Path(r"D:\dt playbook\design-thinking-playbook-website\backend\test_visible_output.pdf")

print(f"Opening: {template_path}")
pdf = fitz.open(str(template_path))

print(f"Pages: {len(pdf)}")

# Add SUPER VISIBLE text to each page
for page_num in range(len(pdf)):
    page = pdf[page_num]
    print(f"Processing page {page_num + 1}")
    
    # Add a HUGE RED rectangle with HUGE BLACK text in the CENTER of every page
    page_width = page.rect.width
    page_height = page.rect.height
    
    # Draw a big red rectangle in the center
    center_x = page_width / 2 - 150
    center_y = page_height / 2 - 50
    
    # Add red background rectangle
    shape = page.new_shape()
    rect = fitz.Rect(center_x, center_y, center_x + 300, center_y + 100)
    shape.draw_rect(rect)
    shape.finish(fill=(1, 0, 0), color=(0, 0, 0), width=3)  # Red fill, black border
    shape.commit()
    
    # Add huge black text on top
    text_rect = fitz.Rect(center_x, center_y, center_x + 300, center_y + 100)
    page.insert_textbox(
        text_rect,
        f"TEST TEXT\nPAGE {page_num + 1}\nVISIBLE!",
        fontsize=24,
        fontname="helv",
        align=fitz.TEXT_ALIGN_CENTER,
        color=(0, 0, 0),  # Black
        overlay=True
    )
    
    # Also add text at top-left corner
    corner_rect = fitz.Rect(10, 10, 200, 60)
    shape2 = page.new_shape()
    shape2.draw_rect(corner_rect)
    shape2.finish(fill=(1, 1, 0))  # Yellow background
    shape2.commit()
    
    page.insert_textbox(
        corner_rect,
        f"Top Left Corner\nPage {page_num + 1}",
        fontsize=14,
        fontname="helv",
        align=fitz.TEXT_ALIGN_LEFT,
        color=(0, 0, 1),  # Blue
        overlay=True
    )

# Save
pdf.save(str(output_path))
pdf.close()

print(f"\n✓ Saved to: {output_path}")
print(f"Open this file to verify that text rendering works!")
