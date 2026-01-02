"""Analyze Page 6 layout specifically"""
import fitz

doc = fitz.open(r'D:\dt playbook\SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf')

print('PAGE 6 - Sad/Happy Spaces Analysis')
print('=' * 70)
page6 = doc[5]

# Get all text with positions
text_dict = page6.get_text('dict')
blocks = text_dict['blocks']

# Collect all text positions
all_text = []
for block in blocks:
    if block['type'] == 0:
        for line in block.get('lines', []):
            for span in line.get('spans', []):
                text = span.get('text', '').strip()
                if text:
                    bbox = line['bbox']
                    all_text.append({
                        'text': text,
                        'x': bbox[0],
                        'y': bbox[1],
                        'x2': bbox[2],
                        'y2': bbox[3]
                    })

# Sort by y position
all_text.sort(key=lambda t: (t['y'], t['x']))

print('\nAll text positions (sorted by Y):')
for t in all_text:
    print(f"  ({t['x']:>4.0f}, {t['y']:>4.0f})-({t['x2']:>4.0f}, {t['y2']:>4.0f}): \"{t['text'][:50]}\"")

doc.close()
