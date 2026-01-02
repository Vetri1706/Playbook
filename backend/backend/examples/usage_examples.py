"""
Example usage of the PDF generation service
"""
from services.pdf_generator import PDFGeneratorService
from pathlib import Path


def example_basic_usage():
    """
    Basic example: Generate a PDF with text responses
    """
    print("="*60)
    print("EXAMPLE 1: Basic PDF Generation")
    print("="*60)
    
    # Initialize the service
    template_path = '../SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf'
    output_dir = './generated_pdfs'
    
    generator = PDFGeneratorService(template_path, output_dir)
    
    # Prepare user responses (simulated data)
    user_responses = {
        # Page 3: Problem Worksheet
        'problem_who_it_helps': 'This will help students in my class who struggle to organize their homework assignments.',
        'problem_because': 'Because they often forget what homework they have and when it is due, which makes them stressed and get lower grades.',
        
        # Page 4: Empathize Questions
        'empathy_who': 'My classmate Sarah who is always worried about homework',
        'empathy_what': 'She forgets her assignments and due dates',
        'empathy_when': 'Every evening when she gets home from school',
        'empathy_where': 'At home when doing homework',
        'empathy_how': 'She feels stressed and anxious',
        'empathy_why': 'It affects her grades and makes her parents upset',
        
        # Page 7: Product Statement
        'product_statement': 'My Homework Helper App will help students track their assignments and never forget their homework again!',
        
        # Page 8: Crazy 6 Ideas (text only)
        'idea_1_title': 'Homework Calendar App',
        'idea_2_title': 'Smart Homework Alarm',
        'idea_3_title': 'Homework Buddy Robot',
        'idea_4_title': 'Assignment Sticker Chart',
        'idea_5_title': 'Homework Reminder Watch',
        'idea_6_title': 'Teacher SMS System',
        
        # Page 9: Selected Idea
        'selected_idea_name': 'Homework Calendar App',
        
        # Page 10: Prototype Description
        'prototype_description': 'A simple app where students can add all their homework with due dates. It sends notifications to remind them.',
        
        # Page 12: Final Message
        'final_message': 'I learned that understanding your users problems is very important. My Homework Helper App can really help students like Sarah!'
    }
    
    # Generate PDF
    try:
        output_path = generator.generate_filled_pdf(
            user_responses=user_responses,
            output_filename='example_basic_output.pdf'
        )
        
        print(f"\n✓ PDF generated successfully!")
        print(f"📄 Location: {output_path}")
        print(f"📊 Size: {output_path.stat().st_size / 1024:.2f} KB")
        
    except Exception as e:
        print(f"\n✗ Error: {e}")


def example_with_images():
    """
    Example with both text and images
    """
    print("\n" + "="*60)
    print("EXAMPLE 2: PDF Generation with Images")
    print("="*60)
    
    template_path = '../SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf'
    output_dir = './generated_pdfs'
    
    generator = PDFGeneratorService(template_path, output_dir)
    
    # User responses
    user_responses = {
        'problem_who_it_helps': 'This will help elderly people who feel lonely',
        'problem_because': 'Because they don\'t have many visitors and feel isolated',
        
        'empathy_who': 'My grandmother who lives alone',
        'empathy_what': 'She feels lonely and bored during the day',
        'empathy_when': 'Especially on weekdays when family is busy',
        'empathy_where': 'At her home',
        'empathy_how': 'She feels sad and disconnected',
        'empathy_why': 'Connection with others is important for happiness',
        
        'product_statement': 'My FriendBot will help elderly people feel less lonely by providing companionship and conversation',
        
        'idea_1_title': 'Video Call Robot',
        'idea_2_title': 'Story Reading Device',
        'idea_3_title': 'Pet Robot Companion',
        'idea_4_title': 'Garden Helper Bot',
        'idea_5_title': 'Music Playing Friend',
        'idea_6_title': 'Game Playing Buddy',
        
        'selected_idea_name': 'Pet Robot Companion',
        
        'prototype_description': 'A cute robot that looks like a pet. It can talk, tell jokes, remind about medicine, and play simple games.',
    }
    
    # Image paths (you would have these from user uploads)
    images = {
        # Example image paths - replace with actual paths
        # 'idea_1_drawing': './uploads/user_1/project_1/idea1.png',
        # 'idea_2_drawing': './uploads/user_1/project_1/idea2.png',
        # 'selected_idea_drawing': './uploads/user_1/project_1/best_idea.png',
        # 'prototype_drawing': './uploads/user_1/project_1/prototype.png'
    }
    
    try:
        output_path = generator.generate_filled_pdf(
            user_responses=user_responses,
            output_filename='example_with_images.pdf',
            images=images
        )
        
        print(f"\n✓ PDF generated successfully!")
        print(f"📄 Location: {output_path}")
        print(f"📊 Size: {output_path.stat().st_size / 1024:.2f} KB")
        
    except Exception as e:
        print(f"\n✗ Error: {e}")


def example_validation_scores():
    """
    Example with validation scores table
    """
    print("\n" + "="*60)
    print("EXAMPLE 3: PDF with Validation Scores")
    print("="*60)
    
    template_path = '../SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf'
    output_dir = './generated_pdfs'
    
    generator = PDFGeneratorService(template_path, output_dir)
    
    user_responses = {
        'selected_idea_name': 'Smart Water Bottle',
        
        # Validation scores (Yes/No for each criterion)
        'validation_scores': {
            'Is it helpful?': True,
            'Can I make it?': True,
            'Is it creative?': True,
            'Will people like it?': True,
            'Is it simple?': False  # Maybe too complex
        }
    }
    
    try:
        output_path = generator.generate_filled_pdf(
            user_responses=user_responses,
            output_filename='example_validation.pdf'
        )
        
        print(f"\n✓ PDF generated successfully!")
        print(f"📄 Location: {output_path}")
        
    except Exception as e:
        print(f"\n✗ Error: {e}")


def example_api_simulation():
    """
    Simulate how the API would be used
    """
    print("\n" + "="*60)
    print("EXAMPLE 4: API Usage Simulation")
    print("="*60)
    
    # This simulates what happens when the API endpoint is called
    
    # Step 1: API receives request
    print("\n1. API receives POST request to /api/generate-pdf")
    print("   Request body: { 'project_id': 123 }")
    
    # Step 2: Fetch data from database (simulated)
    print("\n2. Fetching project data from database...")
    project_id = 123
    user_id = 1
    
    # Simulated database query results
    responses_from_db = {
        'problem_who_it_helps': 'Students who need help with math',
        'problem_because': 'They find math confusing and need practice',
        'empathy_who': 'My friend Tom who struggles with fractions',
        'product_statement': 'Math Helper App will make learning math fun and easy'
    }
    
    images_from_db = {
        # These would be file paths from the ImageUpload table
        # 'idea_1_drawing': '/uploads/1/123/idea1_20240115.png'
    }
    
    print(f"   Found {len(responses_from_db)} text responses")
    print(f"   Found {len(images_from_db)} images")
    
    # Step 3: Generate PDF
    print("\n3. Generating PDF...")
    
    template_path = '../SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf'
    output_dir = './generated_pdfs'
    
    generator = PDFGeneratorService(template_path, output_dir)
    
    output_filename = f'playbook_user{user_id}_project{project_id}.pdf'
    
    try:
        output_path = generator.generate_filled_pdf(
            user_responses=responses_from_db,
            output_filename=output_filename,
            images=images_from_db
        )
        
        # Step 4: Save PDF record to database
        print("\n4. Saving PDF record to database...")
        pdf_id = 456  # Simulated database ID
        
        # Step 5: Return response
        print("\n5. API Response:")
        print({
            'success': True,
            'pdf_id': pdf_id,
            'download_url': f'/api/download-pdf/{pdf_id}',
            'filename': output_filename,
            'file_size': output_path.stat().st_size
        })
        
        print(f"\n✓ Complete workflow executed successfully!")
        
    except Exception as e:
        print(f"\n✗ Error: {e}")


def get_pdf_info():
    """
    Get information about the PDF template
    """
    print("\n" + "="*60)
    print("PDF TEMPLATE INFORMATION")
    print("="*60)
    
    template_path = '../SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf'
    output_dir = './generated_pdfs'
    
    generator = PDFGeneratorService(template_path, output_dir)
    
    info = generator.get_pdf_info()
    
    print(f"\nTotal Pages: {info['page_count']}")
    print("\nPage Details:")
    for page in info['pages']:
        print(f"  Page {page['number']}: {page['width']:.1f} x {page['height']:.1f} points")


if __name__ == '__main__':
    print("\n" + "="*60)
    print("PDF GENERATION SERVICE - EXAMPLES")
    print("="*60)
    
    # Get PDF info first
    get_pdf_info()
    
    # Run examples
    print("\n\nRunning examples...\n")
    
    try:
        example_basic_usage()
        # example_with_images()
        # example_validation_scores()
        example_api_simulation()
        
        print("\n" + "="*60)
        print("✓ All examples completed!")
        print("="*60)
        
    except Exception as e:
        print(f"\n✗ Error running examples: {e}")
        import traceback
        traceback.print_exc()
