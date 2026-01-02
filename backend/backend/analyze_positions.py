"""Quick template position analyzer"""
import fitz

doc = fitz.open(r'D:\dt playbook\SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf')

print('Analyzing key pages for input field positions...')
print()

# Page 3 analysis - Problem worksheet
page3 = doc[2]
print('PAGE 3 - Problem Worksheet:')
for block in page3.get_text('dict')['blocks']:
    if block['type'] == 0:
        for line in block.get('lines', []):
            for span in line.get('spans', []):
                text = span.get('text', '')
                if 'help' in text.lower() or 'because' in text.lower() or 'write' in text.lower():
                    bbox = line['bbox']
                    print(f'  "{text[:50]}" at y={bbox[1]:.0f}-{bbox[3]:.0f}')

print()
print('PAGE 4 - Empathy Questions:')
page4 = doc[3]
for block in page4.get_text('dict')['blocks']:
    if block['type'] == 0:
        for line in block.get('lines', []):
            for span in line.get('spans', []):
                text = span.get('text', '')
                if any(w in text.lower() for w in ['who', 'what', 'when', 'where', 'how', 'why', 'explain']):
                    bbox = line['bbox']
                    print(f'  "{text[:40]}" at ({bbox[0]:.0f}, {bbox[1]:.0f})-({bbox[2]:.0f}, {bbox[3]:.0f})')

print()
print('PAGE 5 - Find a User:')
page5 = doc[4]
for block in page5.get_text('dict')['blocks']:
    if block['type'] == 0:
        for line in block.get('lines', []):
            for span in line.get('spans', []):
                text = span.get('text', '')
                bbox = line['bbox']
                if any(w in text.lower() for w in ['name', 'age', 'problem', 'feel', 'wish', 'picture', 'user']):
                    print(f'  "{text[:40]}" at ({bbox[0]:.0f}, {bbox[1]:.0f})')

print()
print('PAGE 8 - 6 Ideas:')
page8 = doc[7]
for block in page8.get_text('dict')['blocks']:
    if block['type'] == 0:
        for line in block.get('lines', []):
            for span in line.get('spans', []):
                text = span.get('text', '')
                if 'idea' in text.lower():
                    bbox = line['bbox']
                    print(f'  "{text[:25]}" at ({bbox[0]:.0f}, {bbox[1]:.0f})')

print()
print('PAGE 10 - Best Idea:')
page10 = doc[9]
for block in page10.get_text('dict')['blocks']:
    if block['type'] == 0:
        for line in block.get('lines', []):
            for span in line.get('spans', []):
                text = span.get('text', '')
                if any(w in text.lower() for w in ['best', 'draw', 'write', 'idea', 'called', 'super']):
                    bbox = line['bbox']
                    print(f'  "{text[:45]}" at ({bbox[0]:.0f}, {bbox[1]:.0f})')

doc.close()
print()
print('Analysis complete!')
