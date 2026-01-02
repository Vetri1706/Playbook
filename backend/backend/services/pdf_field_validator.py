"""
PDF Field Validator - Production-Grade Field Mapping Validation
Ensures 100% field coverage and detects rendering issues before generation
"""
import logging
from typing import Dict, Any, List, Set, Tuple
from pathlib import Path
import fitz

from pdf_mappings import (
    PDF_FIELD_MAPPINGS,
    PDF_WIDTH,
    PDF_HEIGHT,
    get_page_fields,
    get_all_text_fields,
    get_all_image_fields
)

logger = logging.getLogger(__name__)


class PDFFieldValidator:
    """Validates PDF field mappings and data integrity"""
    
    def __init__(self, template_path: str):
        """Initialize validator with PDF template"""
        self.template_path = Path(template_path)
        if not self.template_path.exists():
            raise FileNotFoundError(f"Template not found: {template_path}")
        
        # Load template to get actual page dimensions
        self.pdf_doc = fitz.open(str(self.template_path))
        self.page_count = len(self.pdf_doc)
        self.page_dimensions = {}
        
        for page_num in range(self.page_count):
            page = self.pdf_doc[page_num]
            self.page_dimensions[page_num + 1] = {
                'width': page.rect.width,
                'height': page.rect.height
            }
        
        self.pdf_doc.close()
    
    def validate_all_mappings(self) -> Tuple[bool, List[str]]:
        """
        Validate all field mappings for correctness
        
        Returns:
            Tuple of (is_valid, list_of_errors)
        """
        errors = []
        
        # 1. Check for page index mismatches
        for page_num in PDF_FIELD_MAPPINGS.keys():
            if page_num < 1 or page_num > self.page_count:
                errors.append(f"❌ Page {page_num} mapped but only {self.page_count} pages exist")
        
        # 2. Validate each field's coordinates
        for page_num, fields in PDF_FIELD_MAPPINGS.items():
            if page_num not in self.page_dimensions:
                continue
                
            page_width = self.page_dimensions[page_num]['width']
            page_height = self.page_dimensions[page_num]['height']
            
            for field_name, config in fields.items():
                field_errors = self._validate_field_config(
                    page_num, field_name, config, page_width, page_height
                )
                errors.extend(field_errors)
        
        is_valid = len(errors) == 0
        
        if is_valid:
            logger.info("✅ All field mappings validated successfully")
        else:
            logger.error(f"❌ Found {len(errors)} validation errors:")
            for error in errors:
                logger.error(f"  {error}")
        
        return is_valid, errors
    
    def _validate_field_config(
        self,
        page_num: int,
        field_name: str,
        config: Dict[str, Any],
        page_width: float,
        page_height: float
    ) -> List[str]:
        """Validate a single field configuration"""
        errors = []
        
        # Required keys
        required_keys = ['x', 'y', 'width', 'field_type']
        for key in required_keys:
            if key not in config:
                errors.append(
                    f"❌ Page {page_num}, field '{field_name}': Missing required key '{key}'"
                )
                return errors  # Can't validate further
        
        x = config['x']
        y = config['y']
        width = config['width']
        height = config.get('height', 50)
        field_type = config['field_type']
        
        # Validate coordinates are within page bounds
        if x < 0 or x >= page_width:
            errors.append(
                f"❌ Page {page_num}, field '{field_name}': x={x} outside page width {page_width}"
            )
        
        if y < 0 or y >= page_height:
            errors.append(
                f"❌ Page {page_num}, field '{field_name}': y={y} outside page height {page_height}"
            )
        
        if x + width > page_width:
            errors.append(
                f"❌ Page {page_num}, field '{field_name}': Bounding box exceeds page width "
                f"(x={x} + width={width} = {x+width} > {page_width})"
            )
        
        if y + height > page_height:
            errors.append(
                f"⚠️  Page {page_num}, field '{field_name}': Bounding box exceeds page height "
                f"(y={y} + height={height} = {y+height} > {page_height})"
            )
        
        # Validate field-type specific requirements
        if field_type in ['text', 'textarea']:
            if 'font_size' not in config:
                errors.append(
                    f"⚠️  Page {page_num}, field '{field_name}': No font_size specified"
                )
            
            if field_type == 'textarea':
                if 'max_lines' not in config:
                    errors.append(
                        f"⚠️  Page {page_num}, field '{field_name}': textarea without max_lines"
                    )
        
        elif field_type == 'image':
            if height <= 0:
                errors.append(
                    f"❌ Page {page_num}, field '{field_name}': Image field needs height"
                )
        
        return errors
    
    def check_data_coverage(
        self,
        user_responses: Dict[str, Any],
        images: Dict[str, str] = None
    ) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        """
        Compare provided data against field mappings
        
        Returns:
            Tuple of (expected_but_missing, provided_but_unmapped)
        """
        # Get all expected field names from mappings
        expected_fields = set()
        for page_num, fields in PDF_FIELD_MAPPINGS.items():
            expected_fields.update(fields.keys())
        
        # Get provided field names
        provided_text_fields = set(user_responses.keys()) if user_responses else set()
        provided_image_fields = set(images.keys()) if images else set()
        provided_fields = provided_text_fields | provided_image_fields
        
        # Calculate differences
        missing_fields = {}
        for field in expected_fields:
            if field not in provided_fields:
                # Find which page this field is on
                for page_num, fields in PDF_FIELD_MAPPINGS.items():
                    if field in fields:
                        field_type = fields[field].get('field_type', 'unknown')
                        if field not in missing_fields:
                            missing_fields[field] = {
                                'page': page_num,
                                'type': field_type
                            }
        
        unmapped_fields = {}
        for field in provided_fields:
            if field not in expected_fields:
                unmapped_fields[field] = {
                    'has_value': field in provided_text_fields,
                    'has_image': field in provided_image_fields
                }
        
        return missing_fields, unmapped_fields
    
    def generate_coverage_report(
        self,
        user_responses: Dict[str, Any],
        images: Dict[str, str] = None,
        trace_id: str = "unknown"
    ) -> str:
        """Generate a detailed coverage report"""
        missing, unmapped = self.check_data_coverage(user_responses, images)
        
        report = []
        report.append(f"\n{'='*60}")
        report.append(f"PDF FIELD COVERAGE REPORT [{trace_id}]")
        report.append(f"{'='*60}")
        
        # Statistics
        total_expected = sum(len(fields) for fields in PDF_FIELD_MAPPINGS.values())
        total_provided = len(user_responses or {}) + len(images or {})
        coverage_pct = ((total_provided - len(unmapped)) / total_expected * 100) if total_expected > 0 else 0
        
        report.append(f"Total expected fields: {total_expected}")
        report.append(f"Total provided data:   {total_provided}")
        report.append(f"Coverage:              {coverage_pct:.1f}%")
        report.append("")
        
        # Missing data
        if missing:
            report.append(f"⚠️  MISSING DATA ({len(missing)} fields):")
            for field, info in sorted(missing.items(), key=lambda x: x[1]['page']):
                report.append(f"   Page {info['page']:2d} | {info['type']:10s} | {field}")
        else:
            report.append("✅ All expected fields have data")
        
        report.append("")
        
        # Unmapped data
        if unmapped:
            report.append(f"⚠️  UNMAPPED DATA ({len(unmapped)} fields):")
            for field, info in unmapped.items():
                source = "text" if info['has_value'] else "image"
                report.append(f"   {source:5s} | {field}")
            report.append("   → These fields have data but no PDF mapping!")
        else:
            report.append("✅ No unmapped data provided")
        
        report.append(f"{'='*60}\n")
        
        return "\n".join(report)


def validate_pdf_system(template_path: str) -> bool:
    """
    Comprehensive system validation - run at startup or via CLI
    
    Returns:
        bool: True if system is valid
    """
    try:
        validator = PDFFieldValidator(template_path)
        is_valid, errors = validator.validate_all_mappings()
        
        if not is_valid:
            logger.error("PDF system validation FAILED:")
            for error in errors:
                logger.error(f"  {error}")
            return False
        
        logger.info("✅ PDF system validation PASSED")
        return True
        
    except Exception as e:
        logger.error(f"PDF system validation error: {e}", exc_info=True)
        return False
