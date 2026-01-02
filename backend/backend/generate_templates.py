"""
Automated HTML Template Generator
Creates Jinja2 page templates from pdf_mappings.py coordinates
Converts coordinate-based layout to HTML+CSS positioning
"""
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent))

from pdf_mappings import PDF_FIELD_MAPPINGS, get_page_fields

def generate_page_template(page_num: int, fields: dict) -> str:
    """Generate HTML template for a single page"""
    
    template = f'''<!-- Page {page_num} -->
<div class="page" id="page-{page_num}">
    <div class="page-background">
        <img src="{{{{ url_for('static', filename='pdf_backgrounds/page_{page_num:02d}.png') }}}}" alt="Page {page_num} Background">
    </div>
    <div class="page-content">
'''
    
    for field_name, field_config in fields.items():
        field_type = field_config.get('field_type', 'text')
        
        # Convert PDF coordinates (points at 72dpi) to inches
        x_in = field_config['x'] / 72
        y_in = field_config['y'] / 72
        width_in = field_config['width'] / 72
        height_in = field_config['height'] / 72
        
        # Determine CSS classes based on field type
        css_classes = ['content-block']
        
        if field_type == 'textarea':
            css_classes.extend(['text-block', 'multi-line', 'text-small'])
            template += f'''        <!-- {field_name} -->
        <div class="{{{{ ' '.join({css_classes}) }}}} {{% if not data.{field_name} %}}missing-data{{% endif %}}"
             data-field-name="{field_name}"
             style="top: {y_in:.2f}in; left: {x_in:.2f}in; width: {width_in:.2f}in; height: {height_in:.2f}in; line-height: 1.4;">
            {{{{ data.{field_name} or '[Not provided]' }}}}
        </div>

'''
        elif field_type == 'text':
            css_classes.extend(['text-block', 'single-line', 'text-small'])
            template += f'''        <!-- {field_name} -->
        <div class="{{{{ ' '.join({css_classes}) }}}} {{% if not data.{field_name} %}}missing-data{{% endif %}}"
             data-field-name="{field_name}"
             style="top: {y_in:.2f}in; left: {x_in:.2f}in; width: {width_in:.2f}in; height: {height_in:.2f}in;">
            {{{{ data.{field_name} or '[Not provided]' }}}}
        </div>

'''
        elif field_type == 'image':
            template += f'''        <!-- {field_name} -->
        <div class="image-block content-block {{% if not images.{field_name} %}}missing-data{{% endif %}}"
             data-field-name="{field_name}"
             style="top: {y_in:.2f}in; left: {x_in:.2f}in; width: {width_in:.2f}in; height: {height_in:.2f}in;">
            {{% if images.{field_name} %}}
            <img src="{{{{ url_for('static', filename='uploads/' + images.{field_name}) }}}}" alt="{field_name}">
            {{% else %}}
            <div class="placeholder" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; border: 2px dashed #ccc;">
                [Image Not Provided]
            </div>
            {{% endif %}}
        </div>

'''
        elif field_type == 'table':
            template += f'''        <!-- {field_name} table -->
        <table class="table-block content-block {{% if not data.{field_name} %}}missing-data{{% endif %}}"
               data-field-name="{field_name}"
               style="top: {y_in:.2f}in; left: {x_in:.2f}in; width: {width_in:.2f}in;">
            {{% if data.{field_name} %}}
            {{% for row in data.{field_name} %}}
            <tr>
                {{% for cell in row %}}
                <td>{{{{ cell }}}}</td>
                {{% endfor %}}
            </tr>
            {{% endfor %}}
            {{% else %}}
            <tr><td class="placeholder">[Table Not Provided]</td></tr>
            {{% endif %}}
        </table>

'''
    
    template += '''    </div>
</div>
'''
    
    return template


def generate_all_templates():
    """Generate HTML templates for all pages"""
    output_dir = Path(__file__).parent / 'templates' / 'pdf' / 'pages'
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("="*60)
    print("GENERATING HTML PAGE TEMPLATES")
    print("="*60)
    
    # Page name mappings
    page_names = {
        1: 'cover',
        2: 'welcome',
        3: 'problem',
        4: 'empathize',
        5: 'user_profile',
        6: 'sad_happy',
        7: 'product_statement',
        8: 'ideas',
        9: 'validation',
        10: 'prototype',
        11: 'innovation_stack',
        12: 'final_message'
    }
    
    generated_files = []
    
    for page_num in range(1, 13):  # 12 pages
        # Get fields for this page
        fields = get_page_fields(page_num)
        
        # Generate template
        template_content = generate_page_template(page_num, fields)
        
        # Write to file
        page_name = page_names.get(page_num, f'page{page_num}')
        output_file = output_dir / f'page_{page_num:02d}_{page_name}.html'
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(template_content)
        
        print(f"✅ Page {page_num:2d}: {output_file.name} ({len(fields)} fields)")
        generated_files.append(output_file)
    
    print("\n" + "="*60)
    print(f"✅ Generated {len(generated_files)} page templates")
    print(f"📁 Location: {output_dir}")
    print("="*60)
    
    return generated_files


if __name__ == '__main__':
    generate_all_templates()
