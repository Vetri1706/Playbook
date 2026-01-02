"""
Test suite for PDF generation service
"""
import pytest
import os
from pathlib import Path
from services.pdf_generator import PDFGeneratorService


@pytest.fixture
def temp_output_dir(tmp_path):
    """Create temporary output directory"""
    return tmp_path / "generated_pdfs"


@pytest.fixture
def sample_responses():
    """Sample user responses"""
    return {
        'problem_who_it_helps': 'This will help students who need homework reminders',
        'problem_because': 'They forget their assignments',
        'empathy_who': 'My friend Sarah',
        'product_statement': 'Homework Helper App'
    }


def test_pdf_generator_initialization(temp_output_dir):
    """Test PDF generator can be initialized"""
    template_path = '../SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf'
    
    # Skip if template doesn't exist
    if not Path(template_path).exists():
        pytest.skip("PDF template not found")
    
    generator = PDFGeneratorService(template_path, str(temp_output_dir))
    
    assert generator.template_path.exists()
    assert generator.output_dir.exists()


def test_generate_pdf_basic(temp_output_dir, sample_responses):
    """Test basic PDF generation"""
    template_path = '../SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf'
    
    if not Path(template_path).exists():
        pytest.skip("PDF template not found")
    
    generator = PDFGeneratorService(template_path, str(temp_output_dir))
    
    output_path = generator.generate_filled_pdf(
        user_responses=sample_responses,
        output_filename='test_output.pdf'
    )
    
    assert output_path.exists()
    assert output_path.suffix == '.pdf'
    assert output_path.stat().st_size > 0


def test_get_pdf_info():
    """Test getting PDF info"""
    template_path = '../SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf'
    
    if not Path(template_path).exists():
        pytest.skip("PDF template not found")
    
    generator = PDFGeneratorService(template_path, './test_output')
    info = generator.get_pdf_info()
    
    assert 'page_count' in info
    assert 'pages' in info
    assert info['page_count'] > 0
    assert len(info['pages']) == info['page_count']


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
