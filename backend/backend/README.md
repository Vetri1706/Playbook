# Design Thinking Playbook - PDF Generation Backend

## 🎯 Overview

This backend service dynamically generates filled PDF files using the Design Thinking Playbook template and user responses collected from the frontend application. It overlays text and images onto an existing PDF template while maintaining the original design.

## 📋 Features

- ✅ **Template-Based Generation**: Uses original PDF as template (no redesign)
- ✅ **Multi-Page Support**: Handles all 12 pages of the playbook
- ✅ **Text Overlay**: Inserts user responses at precise coordinates
- ✅ **Image Integration**: Embeds drawings and sketches from canvas
- ✅ **Auto Text Wrapping**: Handles long text with line breaks
- ✅ **Validation Tables**: Renders scoring tables with checkmarks
- ✅ **Secure Access**: JWT-based authentication
- ✅ **User Isolation**: Users can only access their own projects
- ✅ **RESTful API**: Clean API endpoints for all operations

## 🏗️ Architecture

```
backend/
├── app.py                      # Main Flask application
├── config.py                   # Configuration management
├── models.py                   # Database models (SQLAlchemy)
├── auth.py                     # Authentication & authorization
├── pdf_mappings.py            # PDF coordinate mappings
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
│
├── services/
│   └── pdf_generator.py      # Core PDF generation service
│
├── routes/
│   └── pdf_routes.py         # API endpoints
│
├── utils/
│   └── pdf_calibrator.py     # Coordinate calibration tool
│
└── examples/
    └── usage_examples.py     # Usage examples
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Initialize Database

```bash
python -c "from app import create_app; from models import init_db; app = create_app(); init_db(app)"
```

### 4. Run the Server

```bash
python app.py
```

Server will start at `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```http
GET /api/health
```

### Generate PDF
```http
POST /api/generate-pdf
Content-Type: application/json
Authorization: Bearer <token>

{
  "project_id": 123
}

Response:
{
  "success": true,
  "pdf_id": 456,
  "download_url": "/api/download-pdf/456",
  "filename": "design_thinking_playbook_user_20240115.pdf",
  "file_size": 1234567
}
```

### Download PDF
```http
GET /api/download-pdf/{pdf_id}
Authorization: Bearer <token>

Returns: PDF file as attachment
```

### Upload Image
```http
POST /api/upload-image
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- project_id: 123
- field_name: "idea_1_drawing"
- image: <file>

Response:
{
  "success": true,
  "image_id": 789,
  "field_name": "idea_1_drawing",
  "filename": "drawing_123.png"
}
```

### Save Response
```http
POST /api/save-response
Content-Type: application/json
Authorization: Bearer <token>

{
  "project_id": 123,
  "field_name": "problem_who_it_helps",
  "field_value": "This will help students...",
  "page_number": 3
}

Response:
{
  "success": true,
  "response_id": 456
}
```

### Get Project Responses
```http
GET /api/project/{project_id}/responses
Authorization: Bearer <token>

Response:
{
  "project_id": 123,
  "responses": {
    "problem_who_it_helps": "This will help...",
    "empathy_who": "My user is..."
  }
}
```

## 🗺️ PDF Field Mappings

The coordinate mappings are defined in `pdf_mappings.py`. Each field has:

- `x, y`: Position coordinates (points, 72 points = 1 inch)
- `width, height`: Field dimensions
- `field_type`: text, textarea, image, or table
- `font_size`: Font size for text fields
- `alignment`: left, center, or right
- `max_lines`: Maximum lines for textarea
- `line_height`: Line spacing for textarea

### Example Mapping:

```python
3: {  # Page 3
    "problem_who_it_helps": {
        "x": 50,
        "y": 400,
        "width": 500,
        "height": 120,
        "font_size": 11,
        "alignment": "left",
        "field_type": "textarea",
        "max_lines": 6,
        "line_height": 20
    }
}
```

## 🔧 Calibrating Coordinates

The provided coordinates are **approximate**. Use the calibration tool to find exact positions:

```bash
python utils/pdf_calibrator.py
```

This tool helps you:
1. View PDF dimensions
2. Extract existing text positions
3. Manually input field coordinates
4. Export coordinates as JSON or Python dict

## 💡 Usage Examples

See `examples/usage_examples.py` for complete examples:

```python
from services.pdf_generator import PDFGeneratorService

# Initialize
generator = PDFGeneratorService(
    template_path='path/to/template.pdf',
    output_dir='./generated_pdfs'
)

# Prepare data
user_responses = {
    'problem_who_it_helps': 'This will help students...',
    'empathy_who': 'My classmate Sarah...'
}

images = {
    'idea_1_drawing': './uploads/drawing1.png',
    'prototype_drawing': './uploads/prototype.png'
}

# Generate PDF
output_path = generator.generate_filled_pdf(
    user_responses=user_responses,
    output_filename='output.pdf',
    images=images
)
```

## 🗄️ Database Schema

### Users
- id, username, email, password_hash
- full_name, grade, school
- created_at, updated_at

### Projects
- id, user_id, title, status
- created_at, updated_at, completed_at

### Responses
- id, project_id, field_name, field_value, page_number
- created_at, updated_at

### ImageUploads
- id, project_id, field_name, filename, file_path
- file_size, mime_type, uploaded_at

### GeneratedPDFs
- id, project_id, filename, file_path, file_size
- generated_at, download_count

## 🔐 Security

### Authentication
- JWT-based token authentication
- Tokens expire after 24 hours (configurable)

### Authorization
- Users can only access their own projects
- Decorators enforce access control: `@login_required`, `@project_access_required`

### File Upload Security
- Filename sanitization
- Extension whitelist (png, jpg, jpeg)
- File size limits (5MB default)
- User-isolated storage directories

## ⚙️ Configuration

Environment variables (`.env`):

```bash
# Flask
FLASK_ENV=development
SECRET_KEY=your-secret-key

# Database
DATABASE_URL=sqlite:///dt_playbook.db

# PDF
PDF_TEMPLATE_PATH=../SNS DT Playbook.pdf
PDF_OUTPUT_DIR=./generated_pdfs
MAX_PDF_SIZE_MB=50

# Security
JWT_SECRET_KEY=your-jwt-secret
JWT_EXPIRATION_HOURS=24

# Uploads
UPLOAD_FOLDER=./uploads
ALLOWED_EXTENSIONS=png,jpg,jpeg
MAX_IMAGE_SIZE_MB=5

# CORS
FRONTEND_URL=http://localhost:5173
```

## 🧪 Testing

Run examples:
```bash
python examples/usage_examples.py
```

Test API endpoints:
```bash
# Health check
curl http://localhost:5000/api/health

# Generate PDF (requires auth token)
curl -X POST http://localhost:5000/api/generate-pdf \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"project_id": 123}'
```

## 📦 Dependencies

### Core Libraries
- **PyMuPDF (fitz)**: PDF manipulation and overlay
- **Pillow**: Image processing
- **Flask**: Web framework
- **SQLAlchemy**: ORM for database
- **PyJWT**: JWT authentication

### Why PyMuPDF?
- Fast and efficient
- Direct coordinate-based insertion
- Excellent image handling
- Maintains original PDF quality
- No need to recreate PDF from scratch

## 🔄 Workflow

1. **Frontend collects responses** → Saves to backend via API
2. **User clicks "Generate PDF"** → Frontend calls `/api/generate-pdf`
3. **Backend fetches data** → Retrieves responses and images from DB
4. **PDF generation** → Overlays content on template using coordinates
5. **Save & return** → Stores PDF file and returns download link
6. **User downloads** → Frontend provides download button

## 📝 Field Name Reference

### Page 3: Problem Worksheet
- `problem_who_it_helps`
- `problem_because`

### Page 4: Empathize
- `empathy_who`, `empathy_what`, `empathy_when`
- `empathy_where`, `empathy_how`, `empathy_why`

### Page 5: User Profile
- `user_profile_image`
- `user_profile_description`

### Page 6: Sad/Happy Spaces
- `sad_space_description`, `sad_space_drawing`
- `happy_space_description`, `happy_space_drawing`

### Page 7: Product Statement
- `product_statement`

### Page 8: Crazy 6 Ideas
- `idea_1_drawing`, `idea_1_title`
- `idea_2_drawing`, `idea_2_title`
- ... (up to idea_6)

### Page 9: Validation
- `selected_idea_name`
- `selected_idea_drawing`
- `validation_scores` (dict of criterion → bool)

### Page 10: Prototype
- `prototype_drawing`
- `prototype_description`

### Page 11: Innovation Stack
- `innovation_layer_1` through `innovation_layer_5`

### Page 12: Final Message
- `final_message`
- `student_signature`

## 🛠️ Troubleshooting

### PDF not generating
- Check template path in `.env`
- Verify PDF template exists
- Check logs for coordinate errors

### Images not appearing
- Verify image paths are correct
- Check file permissions
- Ensure images are PNG/JPEG

### Text overflow
- Adjust `max_lines` in mapping
- Reduce `font_size`
- Increase field `height`

### Coordinates misaligned
- Use calibration tool to find exact positions
- PDF coordinates may differ from visual editor
- Test with small text samples first

## 📚 Further Development

### Recommended Enhancements
1. Add batch PDF generation
2. Implement PDF caching
3. Add email delivery of PDFs
4. Create admin dashboard
5. Add PDF preview before download
6. Support multiple templates
7. Add watermarking
8. Implement PDF compression

## 📄 License

Internal project for educational use.

## 👥 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for Design Thinking Education**
