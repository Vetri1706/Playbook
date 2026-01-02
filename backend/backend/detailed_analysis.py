"""
Detailed PDF Template Analysis
Extracts ALL text and their exact bounding boxes from every page
"""
import fitz
from pathlib import Path

# Open template - using actual PDF file
template_path = Path(r"D:\dt playbook\SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf")
doc = fitz.open(template_path)

print("=" * 80)
print("DETAILED TEMPLATE ANALYSIS - ALL TEXT WITH POSITIONS")
print("=" * 80)
print(f"\nTemplate: {template_path.name}")
print(f"Pages: {len(doc)}")
print(f"Page size: {doc[0].rect.width} x {doc[0].rect.height} points")

for page_num in range(len(doc)):
    page = doc[page_num]
    print(f"\n{'='*80}")
    print(f"PAGE {page_num + 1}")
    print("=" * 80)
    
    # Get text with details
    blocks = page.get_text("dict")["blocks"]
    
    text_items = []
    
    for block in blocks:
        if block["type"] == 0:  # Text block
            for line in block["lines"]:
                for span in line["spans"]:
                    text = span["text"].strip()
                    if text:
                        bbox = span["bbox"]
                        text_items.append({
                            "text": text,
                            "x0": bbox[0],
                            "y0": bbox[1],
                            "x1": bbox[2],
                            "y1": bbox[3],
                            "font": span["font"],
                            "size": span["size"]
                        })
    
    # Sort by y position then x
    text_items.sort(key=lambda t: (t["y0"], t["x0"]))
    
    # Group items by approximate y position (within 5 points)
    rows = []
    current_row = []
    current_y = None
    
    for item in text_items:
        if current_y is None or abs(item["y0"] - current_y) < 15:
            current_row.append(item)
            if current_y is None:
                current_y = item["y0"]
        else:
            if current_row:
                rows.append(current_row)
            current_row = [item]
            current_y = item["y0"]
    
    if current_row:
        rows.append(current_row)
    
    for row in rows:
        y_avg = sum(item["y0"] for item in row) / len(row)
        print(f"\n--- Y ~ {y_avg:.0f} ---")
        for item in sorted(row, key=lambda x: x["x0"]):
            print(f"  [{item['x0']:.0f}, {item['y0']:.0f}] → [{item['x1']:.0f}, {item['y1']:.0f}]  \"{item['text'][:50]}\"")

doc.close()
print("\n" + "=" * 80)
