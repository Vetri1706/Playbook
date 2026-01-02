#!/usr/bin/env python
"""
PDF System Validation CLI
Run system checks and generate debug documentation

Usage:
    python validate_pdf_system.py [OPTIONS]

Options:
    --validate          Validate all field mappings
    --debug-pdf         Generate debug overlay PDF
    --coverage          Show field coverage report
    --template PATH     Path to PDF template (default: auto-detect)
    --data PATH         Path to sample data JSON file
    --all               Run all checks

Examples:
    python validate_pdf_system.py --all
    python validate_pdf_system.py --validate
    python validate_pdf_system.py --debug-pdf --data sample_data.json
"""
import sys
import argparse
import json
from pathlib import Path
import logging

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from services.pdf_generator import PDFGeneratorService
from services.pdf_field_validator import PDFFieldValidator, validate_pdf_system
from services.pdf_debug_renderer import PDFDebugRenderer, generate_field_map_documentation

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)


def find_template():
    """Auto-detect PDF template"""
    possible_paths = [
        Path("SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf"),
        Path("backend/SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf"),
        Path("../SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf"),
    ]
    
    for path in possible_paths:
        if path.exists():
            return str(path.absolute())
    
    raise FileNotFoundError("Could not find PDF template. Use --template to specify path")


def load_sample_data(data_path: str):
    """Load sample data from JSON file"""
    with open(data_path, 'r') as f:
        return json.load(f)


def run_validation(template_path: str):
    """Run field mapping validation"""
    print("\n" + "="*70)
    print("PDF FIELD MAPPING VALIDATION")
    print("="*70)
    
    try:
        is_valid = validate_pdf_system(template_path)
        
        if is_valid:
            print("\n✅ All validations PASSED")
            print("   - All pages are correctly indexed")
            print("   - All coordinates are within page bounds")
            print("   - All fields have required properties")
            return True
        else:
            print("\n❌ Validation FAILED - check logs for details")
            return False
            
    except Exception as e:
        logger.error(f"Validation error: {e}", exc_info=True)
        return False


def generate_debug_pdf(template_path: str, data_path: str = None):
    """Generate debug overlay PDF"""
    print("\n" + "="*70)
    print("DEBUG PDF GENERATION")
    print("="*70)
    
    try:
        # Load sample data if provided
        user_responses = {}
        images = {}
        
        if data_path:
            data = load_sample_data(data_path)
            user_responses = data.get('responses', {})
            images = data.get('images', {})
            print(f"Loaded {len(user_responses)} responses and {len(images)} images from {data_path}")
        else:
            print("No data provided - will show all fields as missing")
        
        # Generate debug PDF
        output_dir = Path("generated_pdfs")
        output_dir.mkdir(exist_ok=True)
        
        debug_path = generate_field_map_documentation(
            template_path,
            str(output_dir / "debug_field_map.pdf")
        )
        
        print(f"\n✅ Debug PDF generated: {debug_path}")
        print("   - Green boxes: Fields with data")
        print("   - Yellow boxes: Fields without data")
        print("   - Blue boxes: Image fields")
        print("   - Labels show field names and types")
        
        return True
        
    except Exception as e:
        logger.error(f"Debug PDF generation error: {e}", exc_info=True)
        return False


def show_coverage_report(template_path: str, data_path: str = None):
    """Show field coverage report"""
    print("\n" + "="*70)
    print("FIELD COVERAGE REPORT")
    print("="*70)
    
    try:
        validator = PDFFieldValidator(template_path)
        
        # Load sample data if provided
        user_responses = {}
        images = {}
        
        if data_path:
            data = load_sample_data(data_path)
            user_responses = data.get('responses', {})
            images = data.get('images', {})
        
        # Generate report
        report = validator.generate_coverage_report(user_responses, images)
        print(report)
        
        return True
        
    except Exception as e:
        logger.error(f"Coverage report error: {e}", exc_info=True)
        return False


def main():
    parser = argparse.ArgumentParser(
        description="PDF System Validation Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    
    parser.add_argument('--validate', action='store_true',
                       help='Validate all field mappings')
    parser.add_argument('--debug-pdf', action='store_true',
                       help='Generate debug overlay PDF')
    parser.add_argument('--coverage', action='store_true',
                       help='Show field coverage report')
    parser.add_argument('--template', type=str,
                       help='Path to PDF template')
    parser.add_argument('--data', type=str,
                       help='Path to sample data JSON file')
    parser.add_argument('--all', action='store_true',
                       help='Run all checks')
    
    args = parser.parse_args()
    
    # If no options specified, show help
    if not (args.validate or args.debug_pdf or args.coverage or args.all):
        parser.print_help()
        return 1
    
    # Find template
    try:
        template_path = args.template or find_template()
        print(f"\n📄 Using template: {template_path}")
    except FileNotFoundError as e:
        print(f"\n❌ Error: {e}")
        return 1
    
    # Run requested operations
    success = True
    
    if args.all or args.validate:
        success = run_validation(template_path) and success
    
    if args.all or args.debug_pdf:
        success = generate_debug_pdf(template_path, args.data) and success
    
    if args.all or args.coverage:
        success = show_coverage_report(template_path, args.data) and success
    
    # Final summary
    print("\n" + "="*70)
    if success:
        print("✅ All operations completed successfully")
        print("="*70 + "\n")
        return 0
    else:
        print("❌ Some operations failed - check logs for details")
        print("="*70 + "\n")
        return 1


if __name__ == '__main__':
    sys.exit(main())
