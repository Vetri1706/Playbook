"""
PDF Field Coordinate Mapping Configuration - CALIBRATED VERSION
Maps JSON response fields to exact (x, y) coordinates on the PDF template

CRITICAL NOTES:
- PDF page dimensions: 768x576 points (landscape PowerPoint slide)
- Coordinate system: TOP-LEFT origin (x goes right, y goes DOWN)
- All coordinates have been calibrated against the actual template
- Text is rendered at the baseline (y coordinate is where text sits)
"""

# PDF Page dimensions (from actual PDF template)
PDF_WIDTH = 768.0   # Actual page width in points
PDF_HEIGHT = 576.0  # Actual page height in points

# Font settings - optimized for the playbook style
DEFAULT_FONT = "Helvetica"
DEFAULT_FONT_SIZE = 11
TITLE_FONT_SIZE = 14
HEADING_FONT_SIZE = 12

# =============================================================================
# CALIBRATED FIELD MAPPINGS
# Based on template analysis - positions verified against actual PDF
# =============================================================================

PDF_FIELD_MAPPINGS = {
    # =========================================================================
    # PAGE 1: Cover Page - CALIBRATED
    # Template analysis:
    #   "SNS" at y=129-184
    #   "DESIGN THINKING" at y=191-246  
    #   "PLAYBOOK" at y=243-319
    #   "Designed for: Grade 1 to 5 Heroes" at y=316-353
    # Student name should appear BELOW the hero text at y~370
    # =========================================================================
    1: {
        "student_name": {
            "x": 180,
            "y": 375,       # Below "Designed for: Grade 1-5 Heroes" which ends at y=353
            "width": 400,
            "height": 50,
            "font_size": 20,
            "alignment": "center",
            "field_type": "text",
            "description": "Student's name on cover page"
        }
    },
    
    # =========================================================================
    # PAGE 2: Welcome / Introduction
    # This page has the 5 steps diagram - no user input fields typically
    # If welcome_message needed, place it in available space
    # =========================================================================
    2: {
        "welcome_message": {
            "x": 100,
            "y": 200,       # In the middle area between title and steps
            "width": 560,
            "height": 80,
            "font_size": 12,
            "alignment": "center",
            "field_type": "textarea",
            "max_lines": 3,
            "line_height": 24,
            "description": "Welcome message (optional)"
        }
    },
    
    # =========================================================================
    # PAGE 3: Problem Worksheet - CALIBRATED
    # Template analysis:
    #   "User's Problem" header at (239, 58-99)
    #   Instructions at y=100-114, y=260-288
    #   "This will help" label at y=289-304 (left edge x=240)
    #   "Because" label at y=349-364 (left edge x=240)
    # Input fields START immediately after label ends
    # =========================================================================
    3: {
        "problem_statement": {
            "x": 240,
            "y": 120,
            "width": 470,
            "height": 135,
            "font_size": 12,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 6,
            "line_height": 20,
            "description": "Main problem statement in the large box"
        },
        "problem_who_it_helps": {
            "x": 298,       # After "This will help" text ends (~x=286)
            "y": 286,       # Same baseline as the label
            "width": 400,
            "height": 45,
            "font_size": 11,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 2,
            "line_height": 18,
            "description": "Who the solution will help"
        },
        "problem_because": {
            "x": 282,       # After "Because" text ends (~x=269)
            "y": 346,       # Same baseline as the label
            "width": 420,
            "height": 130,
            "font_size": 11,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 6,
            "line_height": 20,
            "description": "Why this problem matters"
        }
    },
    
    # =========================================================================
    # PAGE 4: Empathize & Define - 6 Question Grid - CALIBRATED
    # Template analysis (2 rows x 3 columns):
    #   Row 1 Labels: "Explain who is facing the problem" x=260 y=155-183
    #                 "What is happening to them?" x=427 y=156-184
    #                 "When it happens?" x=592 y=156-171
    #   Row 2 Labels: "Where it happens?" x=260 y=326-340
    #                 "How it affects?" x=427 y=325-339  
    #                 "Why was it a problem?" x=599 y=324-352
    # Input boxes positioned BELOW labels in each grid cell
    # =========================================================================
    4: {
        # Row 1 - Labels end at y~183, inputs start at y=188
        "empathy_who": {
            "x": 260,
            "y": 188,       # Below "Explain who..." label (ends at 183)
            "width": 150,
            "height": 120,
            "font_size": 9,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 7,
            "line_height": 15,
            "description": "Who is facing the problem"
        },
        "empathy_what": {
            "x": 427,
            "y": 188,       # Below "What is happening" label
            "width": 150,
            "height": 120,
            "font_size": 9,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 7,
            "line_height": 15,
            "description": "What is happening to them"
        },
        "empathy_when": {
            "x": 592,
            "y": 175,       # Below "When it happens" label (shorter label ends at 171)
            "width": 150,
            "height": 120,
            "font_size": 9,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 7,
            "line_height": 15,
            "description": "When does the problem occur"
        },
        # Row 2 - Labels end at y~352, inputs start at y=357
        "empathy_where": {
            "x": 260,
            "y": 345,       # Below "Where it happens" label
            "width": 150,
            "height": 120,
            "font_size": 9,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 7,
            "line_height": 15,
            "description": "Where does the problem happen"
        },
        "empathy_how": {
            "x": 427,
            "y": 345,       # Below "How it affects" label
            "width": 150,
            "height": 120,
            "font_size": 9,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 7,
            "line_height": 15,
            "description": "How does the problem affect them"
        },
        "empathy_why": {
            "x": 599,
            "y": 357,       # Below "Why was it a problem" label (ends at 352)
            "width": 145,
            "height": 115,
            "font_size": 9,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 7,
            "line_height": 15,
            "description": "Why is this a problem"
        }
    },
    
    # =========================================================================
    # PAGE 5: Find Your User - CALIBRATED (2x3 Grid + Picture)
    # Template analysis:
    #   - "Activity 1: Find a User" header at (215, 51-91)
    #   - Row 1: "What is the user name?" (232,111-128) | "How old is the user?" (585,110-127)
    #   - Row 2: "What problem do they have?" (220,216-234) | "When does it happen?" (583,216-234)
    #   - Row 3: "How do they feel?" (240,315-333) | "What do they wish?" (583,314-332)
    #   - "My user picture" at (43, 345-366) - LEFT SIDE
    # Each input field below its respective question label
    # =========================================================================
    5: {
        # Row 1 inputs (below labels at y~128)
        "user_name": {
            "x": 232,
            "y": 133,       # Below "What is the user name?" label
            "width": 300,
            "height": 70,
            "font_size": 10,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 4,
            "line_height": 16,
            "description": "User's name"
        },
        "user_age": {
            "x": 585,
            "y": 133,       # Below "How old is the user?" label
            "width": 150,
            "height": 70,
            "font_size": 10,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 4,
            "line_height": 16,
            "description": "User's age"
        },
        # Row 2 inputs (below labels at y~234)
        "user_problem": {
            "x": 220,
            "y": 240,       # Below "What problem do they have?" label
            "width": 310,
            "height": 65,
            "font_size": 10,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 4,
            "line_height": 15,
            "description": "User's problem"
        },
        "problem_when": {
            "x": 583,
            "y": 240,       # Below "When does it happen?" label
            "width": 150,
            "height": 65,
            "font_size": 10,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 4,
            "line_height": 15,
            "description": "When problem happens"
        },
        # Row 3 inputs (below labels at y~333)
        "user_feeling": {
            "x": 240,
            "y": 338,       # Below "How do they feel?" label
            "width": 290,
            "height": 65,
            "font_size": 10,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 4,
            "line_height": 15,
            "description": "How user feels"
        },
        "user_wish": {
            "x": 583,
            "y": 338,       # Below "What do they wish?" label
            "width": 150,
            "height": 65,
            "font_size": 10,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 4,
            "line_height": 15,
            "description": "What user wishes for"
        },
        # User picture - LEFT SIDE (below the row 3)
        "user_profile_image": {
            "x": 43,
            "y": 370,       # Below "My user picture" label (at 345-366)
            "width": 130,
            "height": 110,
            "field_type": "image",
            "fit": "contain",
            "description": "User profile drawing"
        },
        # Keep backwards compatibility
        "user_profile_description": {
            "x": 232,
            "y": 133,       # Same as user_name for backwards compat
            "width": 500,
            "height": 290,
            "font_size": 10,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 16,
            "line_height": 17,
            "description": "User profile details - combined field for backwards compatibility"
        }
    },
    
    # =========================================================================
    # PAGE 6: Sad and Happy Spaces - CALIBRATED
    # Template analysis:
    #   - "How Do They Feel?" header at (211, 53-93)
    #   - Instructions at y=92-135: "In this space, draw or write up to 3 sad & happy moments of how your user feels"
    #   - "Sad Space (User's Problems)" at (264, 136-158)
    #   - "Happy Space (Solutions to the Problems)" at (472, 136-179)
    # Two large drawing areas side by side below headers
    # =========================================================================
    6: {
        "sad_space_drawing": {
            "x": 264,
            "y": 165,       # Below "Sad Space" header (ends at 158)
            "width": 195,
            "height": 280,
            "field_type": "image",
            "fit": "contain",
            "description": "Drawing of user's sad moments/problems"
        },
        "sad_space_description": {
            "x": 264,
            "y": 450,       # Below drawing area
            "width": 195,
            "height": 40,
            "font_size": 9,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 2,
            "line_height": 15,
            "description": "Description of sad space"
        },
        "happy_space_drawing": {
            "x": 472,
            "y": 185,       # Below "Happy Space" header (ends at 179)
            "width": 195,
            "height": 260,
            "field_type": "image",
            "fit": "contain",
            "description": "Drawing of user's happy moments/solutions"
        },
        "happy_space_description": {
            "x": 472,
            "y": 450,       # Below drawing area
            "width": 195,
            "height": 40,
            "font_size": 9,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 2,
            "line_height": 15,
            "description": "Description of happy space"
        }
    },
    
    # =========================================================================
    # PAGE 7: My Product Will Help - CALIBRATED
    # Template analysis:
    #   - "My Product Will Help!" header at (211, 62-102)
    #   - "This page will help students..." at (211, 99-122)
    #   - "Forming the problems to solve" at (211, 156-178)
    #   - "Which problem am I solving for?" at y=197, y=267, y=336 (3 prompts)
    # Users fill in after each prompt - single textarea spans all 3
    # =========================================================================
    7: {
        "product_statement": {
            "x": 350,       # After "Which problem..." text (~x=341)
            "y": 195,       # At baseline of first prompt
            "width": 380,
            "height": 290,
            "font_size": 12,
            "alignment": "left",
            "field_type": "textarea",
            "max_lines": 14,
            "line_height": 20,
            "description": "Product statement answers for all 3 prompts"
        }
    },
    
    # =========================================================================
    # PAGE 8: Crazy 6 Ideas - CALIBRATED (2 rows x 3 columns grid)
    # Template analysis:
    #   - "Crazy 6 Ideas:" header at (209, 133-159)
    #   - Instructions at (209, 154-177)
    #   - Row 1: "Idea 1" at (260,199-220), "Idea 2" at (413,200-221), "Idea 3" at (566,197-219)
    #   - Row 2: "Idea 4" at (260,355-377), "Idea 5" at (416,355-377), "Idea 6" at (566,360-381)
    # Drawing areas start below each label, title text goes below drawing
    # =========================================================================
    8: {
        # Row 1 - Ideas 1, 2, 3 (labels end at y~220, drawings start at y=225)
        "idea_1_drawing": {
            "x": 260,
            "y": 225,       # Below "Idea 1" label (ends at 220)
            "width": 130,
            "height": 110,
            "field_type": "image",
            "fit": "contain",
            "description": "Drawing for Idea 1"
        },
        "idea_1_title": {
            "x": 260,
            "y": 340,       # Below drawing
            "width": 130,
            "height": 18,
            "font_size": 9,
            "alignment": "center",
            "field_type": "text",
            "description": "Title for Idea 1"
        },
        "idea_2_drawing": {
            "x": 413,
            "y": 225,       # Below "Idea 2" label (ends at 221)
            "width": 130,
            "height": 110,
            "field_type": "image",
            "fit": "contain",
            "description": "Drawing for Idea 2"
        },
        "idea_2_title": {
            "x": 413,
            "y": 340,       # Below drawing
            "width": 130,
            "height": 18,
            "font_size": 9,
            "alignment": "center",
            "field_type": "text",
            "description": "Title for Idea 2"
        },
        "idea_3_drawing": {
            "x": 566,
            "y": 225,       # Below "Idea 3" label (ends at 219)
            "width": 130,
            "height": 110,
            "field_type": "image",
            "fit": "contain",
            "description": "Drawing for Idea 3"
        },
        "idea_3_title": {
            "x": 566,
            "y": 340,       # Below drawing
            "width": 130,
            "height": 18,
            "font_size": 9,
            "alignment": "center",
            "field_type": "text",
            "description": "Title for Idea 3"
        },
        # Row 2 - Ideas 4, 5, 6 (labels end at y~381, drawings start at y=386)
        "idea_4_drawing": {
            "x": 260,
            "y": 382,       # Below "Idea 4" label (ends at 377)
            "width": 130,
            "height": 95,
            "field_type": "image",
            "fit": "contain",
            "description": "Drawing for Idea 4"
        },
        "idea_4_title": {
            "x": 260,
            "y": 480,       # Below drawing, above page number
            "width": 130,
            "height": 16,
            "font_size": 8,
            "alignment": "center",
            "field_type": "text",
            "description": "Title for Idea 4"
        },
        "idea_5_drawing": {
            "x": 416,
            "y": 382,       # Below "Idea 5" label
            "width": 130,
            "height": 95,
            "field_type": "image",
            "fit": "contain",
            "description": "Drawing for Idea 5"
        },
        "idea_5_title": {
            "x": 416,
            "y": 480,       # Below drawing
            "width": 130,
            "height": 16,
            "font_size": 8,
            "alignment": "center",
            "field_type": "text",
            "description": "Title for Idea 5"
        },
        "idea_6_drawing": {
            "x": 566,
            "y": 386,       # Below "Idea 6" label (ends at 381)
            "width": 130,
            "height": 95,
            "field_type": "image",
            "fit": "contain",
            "description": "Drawing for Idea 6"
        },
        "idea_6_title": {
            "x": 566,
            "y": 480,       # Below drawing
            "width": 130,
            "height": 16,
            "font_size": 8,
            "alignment": "center",
            "field_type": "text",
            "description": "Title for Idea 6"
        }
    },
    
    # =========================================================================
    # PAGE 9: Idea Validation/Evaluation Table - CALIBRATED
    # Template analysis:
    #   - "Validating the Ideas" header at (249, 52-93)
    #   - Instructions at y=87-147
    #   - Table headers at y=177-205: "Ideas" (281), "Score your Idea out of 10" (385), "Does it solve the problem well" (536)
    #   - Table rows at: y=237 (Idea 1), y=288 (Idea 2), y=338 (Idea 3), y=387 (Idea 4), y=437 (Idea 5), y=486 (Idea 6)
    # =========================================================================
    9: {
        "selected_idea_name": {
            "x": 540,
            "y": 148,       # In space between instructions and table
            "width": 200,
            "height": 25,
            "font_size": 12,
            "alignment": "center",
            "field_type": "text",
            "bold": True,
            "description": "Name of the selected/winning idea"
        },
        "selected_idea_drawing": {
            "x": 580,
            "y": 280,       # In right margin area
            "width": 160,
            "height": 180,
            "field_type": "image",
            "fit": "contain",
            "description": "Drawing of the selected idea"
        },
        "validation_scores": {
            "x": 220,
            "y": 230,       # Table starts below headers
            "width": 300,
            "height": 280,
            "field_type": "table",
            "rows": [
                "Idea 1",
                "Idea 2",
                "Idea 3",
                "Idea 4",
                "Idea 5",
                "Idea 6"
            ],
            "cell_height": 40,
            "font_size": 10,
            "description": "Validation scores table"
        }
    },
    
    # =========================================================================
    # PAGE 10: Best Idea Prototype - CALIBRATED
    # Template analysis:
    #   - "My Best Idea:" header at (229, 69-109)
    #   - "Look at 6 ideas..." instructions at (229, 112-133)
    #   - "Write/ Draw your best idea BIG here" at (229, 152-181)
    #   - "The super IDEA is called (give it a fun name!): ___" at (232, 487-508)
    #   - Page number "8" at (695, 476-496)
    # Large drawing area with name field at bottom
    # =========================================================================
    10: {
        "prototype_drawing": {
            "x": 229,
            "y": 185,       # Below "Write/ Draw..." instruction (ends at 181)
            "width": 500,
            "height": 285,
            "field_type": "image",
            "fit": "contain",
            "description": "Best idea prototype drawing"
        },
        "prototype_description": {
            "x": 525,       # After "The super IDEA is called..." prompt
            "y": 483,       # At baseline of the prompt (487)
            "width": 165,
            "height": 30,
            "font_size": 11,
            "alignment": "left",
            "field_type": "text",
            "description": "Name of the prototype/super idea"
        }
    },
    
    # =========================================================================
    # PAGE 11: Innovation Stack
    # Template layout (mostly an infographic):
    #   - "INDIAN UNICORN STARTUPS" at (325, 73)
    #   - "7+7 INNOVATION STACK" at (335, 426)
    #   - "7 Innovation Technologies" at (106, 449)
    #   - "7 Innovation Industry Verticals" at (541, 449)
    # This page is mostly informational - limited user input
    # =========================================================================
    11: {
        "innovation_layer_1": {
            "x": 100,
            "y": 500,       # Below the infographic
            "width": 120,
            "height": 30,
            "font_size": 9,
            "alignment": "center",
            "field_type": "text",
            "description": "Innovation layer 1"
        },
        "innovation_layer_2": {
            "x": 230,
            "y": 500,
            "width": 120,
            "height": 30,
            "font_size": 9,
            "alignment": "center",
            "field_type": "text",
            "description": "Innovation layer 2"
        },
        "innovation_layer_3": {
            "x": 360,
            "y": 500,
            "width": 120,
            "height": 30,
            "font_size": 9,
            "alignment": "center",
            "field_type": "text",
            "description": "Innovation layer 3"
        },
        "innovation_layer_4": {
            "x": 490,
            "y": 500,
            "width": 120,
            "height": 30,
            "font_size": 9,
            "alignment": "center",
            "field_type": "text",
            "description": "Innovation layer 4"
        },
        "innovation_layer_5": {
            "x": 620,
            "y": 500,
            "width": 120,
            "height": 30,
            "font_size": 9,
            "alignment": "center",
            "field_type": "text",
            "description": "Innovation layer 5"
        }
    },
    
    # =========================================================================
    # PAGE 12: Final Message and Signature (Certificate Page)
    # This is likely a certificate/completion page
    # =========================================================================
    12: {
        "final_message": {
            "x": 100,
            "y": 200,
            "width": 560,
            "height": 180,
            "font_size": 14,
            "alignment": "center",
            "field_type": "textarea",
            "max_lines": 6,
            "line_height": 26,
            "description": "Final message or certificate text"
        },
        "student_signature": {
            "x": 300,
            "y": 420,
            "width": 160,
            "height": 100,
            "field_type": "image",
            "fit": "contain",
            "description": "Student signature or completion mark"
        }
    }
}


def get_field_mapping(page_number, field_name):
    """
    Get coordinate mapping for a specific field
    
    Args:
        page_number: PDF page number (1-indexed)
        field_name: Name of the field
        
    Returns:
        dict: Field mapping configuration or None
    """
    return PDF_FIELD_MAPPINGS.get(page_number, {}).get(field_name)


def get_page_fields(page_number):
    """
    Get all fields for a specific page
    
    Args:
        page_number: PDF page number (1-indexed)
        
    Returns:
        dict: All field mappings for the page
    """
    return PDF_FIELD_MAPPINGS.get(page_number, {})


def get_all_text_fields():
    """Get all text and textarea field names across all pages"""
    text_fields = []
    for page_num, fields in PDF_FIELD_MAPPINGS.items():
        for field_name, config in fields.items():
            if config.get('field_type') in ['text', 'textarea']:
                text_fields.append({
                    'page': page_num,
                    'field': field_name,
                    'type': config['field_type']
                })
    return text_fields


def get_all_image_fields():
    """Get all image field names across all pages"""
    image_fields = []
    for page_num, fields in PDF_FIELD_MAPPINGS.items():
        for field_name, config in fields.items():
            if config.get('field_type') == 'image':
                image_fields.append({
                    'page': page_num,
                    'field': field_name
                })
    return image_fields
