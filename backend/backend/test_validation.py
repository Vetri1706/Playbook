"""
Simple validation test (without Flask)
"""
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from services.pdf_field_validator import validate_pdf_system
from services.pdf_debug_renderer import generate_field_map_documentation
import json

template_path = r"D:\dt playbook\SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf"

print("=" * 70)
print("PDF SYSTEM VALIDATION TEST")
print("=" * 70)

# Test 1: Validate field mappings
print("\n1. Validating field mappings...")
try:
    is_valid = validate_pdf_system(template_path)
    if is_valid:
        print("   ✅ PASS: All field mappings are valid")
    else:
        print("   ❌ FAIL: Field validation errors found")
except Exception as e:
    print(f"   ❌ ERROR: {e}")

# Test 2: Generate debug PDF
print("\n2. Generating debug PDF...")
try:
    # Load sample data
    with open('sample_data.json', 'r') as f:
        data = json.load(f)
    
    output_path = generate_field_map_documentation(
        template_path,
        "generated_pdfs/debug_field_map.pdf",
        user_responses=data.get('responses', {}),
        images=data.get('images', {})
    )
    print(f"   ✅ PASS: Debug PDF created at {output_path}")
except Exception as e:
    print(f"   ❌ ERROR: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 70)
print("TESTS COMPLETE")
print("=" * 70)
