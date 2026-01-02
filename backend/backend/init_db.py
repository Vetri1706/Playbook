"""
Database initialization and migration script
"""
from app import create_app
from models import db, User, Project


def init_database():
    """Initialize the database with tables"""
    print("Initializing database...")
    
    app = create_app()
    
    with app.app_context():
        # Drop all tables (use with caution in production!)
        # db.drop_all()
        
        # Create all tables
        db.create_all()
        
        print("✓ Database tables created successfully!")
        
        # Check tables
        print("\nCreated tables:")
        for table in db.metadata.tables.keys():
            print(f"  - {table}")


def create_test_user():
    """Create a test user for development"""
    print("\nCreating test user...")
    
    app = create_app()
    
    with app.app_context():
        # Check if user exists
        existing = User.query.filter_by(username='testuser').first()
        
        if existing:
            print("✗ Test user already exists")
            return
        
        # Create user
        user = User(
            username='testuser',
            email='test@example.com',
            full_name='Test Student',
            grade='5th',
            school='Example School'
        )
        user.set_password('password123')
        
        db.session.add(user)
        db.session.commit()
        
        print(f"✓ Test user created!")
        print(f"  Username: testuser")
        print(f"  Password: password123")
        print(f"  User ID: {user.id}")


def create_test_project():
    """Create a test project with sample data"""
    print("\nCreating test project...")
    
    app = create_app()
    
    with app.app_context():
        # Get test user
        user = User.query.filter_by(username='testuser').first()
        
        if not user:
            print("✗ Test user not found. Run create_test_user() first.")
            return
        
        # Create project
        project = Project(
            user_id=user.id,
            title='My First Design Thinking Project',
            status='in_progress'
        )
        
        db.session.add(project)
        db.session.commit()
        
        print(f"✓ Test project created!")
        print(f"  Project ID: {project.id}")
        print(f"  User: {user.username}")


if __name__ == '__main__':
    print("="*60)
    print("DATABASE SETUP UTILITY")
    print("="*60)
    
    init_database()
    create_test_user()
    create_test_project()
    
    print("\n" + "="*60)
    print("✓ Setup complete!")
    print("="*60)
    print("\nYou can now:")
    print("1. Run the server: python app.py")
    print("2. Test the API endpoints")
    print("3. Generate test PDFs")
