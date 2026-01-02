"""
Comprehensive PDF Generation Test
Tests all fields with realistic data to verify calibration
"""
import sys
import os
sys.path.insert(0, '.')

from services.pdf_generator import PDFGeneratorService
from pathlib import Path

def test_full_pdf_generation():
    """Generate a test PDF with all fields populated"""
    
    print("=" * 70)
    print("COMPREHENSIVE PDF GENERATION TEST")
    print("=" * 70)
    
    # Initialize generator
    generator = PDFGeneratorService(
        template_path=r'D:\dt playbook\SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf',
        output_dir=r'D:\dt playbook\design-thinking-playbook-website\backend\generated_pdfs'
    )
    
    # Comprehensive test data covering ALL fields
    user_responses = {
        # Page 1: Cover
        'student_name': 'Priya Sharma - Design Thinking Hero',
        
        # Page 2: Welcome (usually auto-filled)
        'welcome_message': 'Welcome to your Design Thinking adventure! Get ready to be creative and help solve real problems.',
        
        # Page 3: Problem Worksheet
        'problem_who_it_helps': 'I want to help elderly grandparents who often forget to take their daily medicines on time.',
        'problem_because': 'Because when elderly people miss their medicines, their health can get worse. My grandmother sometimes forgets her morning medicines and then feels weak. This makes the whole family worried. I want to create something that helps all grandparents remember their medicines easily!',
        
        # Page 4: Empathize Questions (6 fields)
        'empathy_who': 'My grandmother Kamla, who is 75 years old. She lives with us but sometimes stays alone during the day.',
        'empathy_what': 'She forgets to take her morning and evening medicines. Sometimes she takes the wrong pills or the wrong amount.',
        'empathy_when': 'It happens most often in the morning when everyone is busy getting ready, and in the evening when she watches TV.',
        'empathy_where': 'At home, especially in the kitchen where she keeps her medicines, and in the living room.',
        'empathy_how': 'She gets confused looking at many different medicine bottles. The names are hard to read and she cannot remember which one to take when.',
        'empathy_why': 'Because her eyesight is weak and her memory is not as good as before. She needs simple visual cues and reminders.',
        
        # Page 5: User Profile - Individual fields
        'user_name': 'Grandmother Kamla',
        'user_age': '75 years old',
        'user_problem': 'Forgetting to take daily medicines on time',
        'problem_when': 'Morning and evening, when family is busy',
        'user_feeling': 'Worried, confused, sometimes scared',
        'user_wish': 'A simple way to remember medicine times',
        # Legacy combined field (for backwards compat)
        'user_profile_description': '''Name: Grandmother Kamla
Age: 75 years old
Location: Mumbai, India
Problem: Forgetting daily medicines
Feelings: Worried and confused about which medicine to take
Wish: A simple way to remember and take the right medicine at the right time''',
        
        # Page 6: Sad/Happy Spaces (descriptions - images separate)
        'sad_space_description': 'Grandma feeling confused and worried about her medicines',
        'happy_space_description': 'Grandma smiling because she took the right medicine easily!',
        
        # Page 7: Product Statement
        'product_statement': '''My product will help elderly grandparents like Kamla solve the problem of forgetting their daily medicines.

The solution is a colorful, talking pill box with:
- Big, easy-to-read compartments for each day
- Friendly voice reminders that say "Time for your medicine!"
- Pictures of sun and moon to show morning and evening medicines
- A simple button to press when medicine is taken

This will help grandparents stay healthy and families worry less!''',
        
        # Page 8: 6 Ideas (just titles, images separate)
        'idea_1_title': 'Talking Pill Box',
        'idea_2_title': 'Medicine Reminder Watch',
        'idea_3_title': 'Family App Alert',
        'idea_4_title': 'Smart Medicine Cabinet',
        'idea_5_title': 'Picture Medicine Chart',
        'idea_6_title': 'Robot Medicine Helper',
        
        # Page 9: Validation
        'selected_idea_name': 'Talking Pill Box',
        
        # Page 10: Prototype
        'prototype_description': 'The Talking Pill Box - A colorful box with 7 compartments (one for each day). It has a speaker that reminds grandma to take medicine. Big happy faces on the buttons!',
        
        # Page 11: Innovation Stack (optional)
        'innovation_layer_1': 'AI Tech',
        'innovation_layer_2': 'IoT',
        'innovation_layer_3': 'Health',
        'innovation_layer_4': 'Elder Care',
        'innovation_layer_5': 'Family',
        
        # Page 12: Final Message
        'final_message': '''Congratulations, Priya! 

You have completed the Design Thinking Playbook and created an amazing solution to help grandparents remember their medicines.

You are now a certified Design Thinking Hero!

Keep creating, keep innovating, and keep helping others!'''
    }
    
    # Create sample test images (small colored squares as placeholders)
    images = {}  # For now, test without images to verify text positioning
    
    # Generate the PDF
    print("\nGenerating PDF with all fields...")
    output_path = generator.generate_filled_pdf(
        user_responses,
        'FULL_CALIBRATION_TEST.pdf',
        images=images
    )
    
    print("\n" + "=" * 70)
    print("TEST COMPLETE!")
    print("=" * 70)
    print(f"\nOutput PDF: {output_path}")
    print(f"File size: {output_path.stat().st_size:,} bytes")
    print("\nPlease open the PDF to verify:")
    print("  1. Text appears in the correct positions")
    print("  2. Text is inside the designated boxes")
    print("  3. Text is readable and properly formatted")
    print("  4. No text is cut off or overflowing")
    print("=" * 70)
    
    return output_path


if __name__ == '__main__':
    test_full_pdf_generation()
