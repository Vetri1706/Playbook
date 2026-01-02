"""Analyze Page 5 layout specifically"""
import fitz

doc = fitz.open(r'D:\dt playbook\SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf')

print('PAGE 5 - Detailed Analysis')
print('=' * 70)
page5 = doc[4]

# Get all text with positions
text_dict = page5.get_text('dict')
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
    print(f"  ({t['x']:>4.0f}, {t['y']:>4.0f})-({t['x2']:>4.0f}, {t['y2']:>4.0f}): \"{t['text'][:45]}\"")

print('\n' + '=' * 70)
print('Key positions for input fields:')
print('=' * 70)

# Find specific labels
labels_to_find = [
    'user name', 'age', 'problem', 'feel', 'wish', 'happen', 'picture'
]

for label in labels_to_find:
    for t in all_text:
        if label in t['text'].lower():
            print(f"  '{label}' -> Label at ({t['x']:.0f}, {t['y']:.0f})")
            print(f"           -> Input box should be around y={t['y2'] + 5:.0f}")

doc.close()
