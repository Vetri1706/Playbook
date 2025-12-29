# SNS Design Thinking Playbook

An interactive web application that digitizes the SNS Design Thinking Playbook for Grade 1-5 students with **hero-themed pages** and **kid-friendly design**!

## 🦸 Hero Features

Each step features a different superhero with custom color themes:

- 🕷️ **Spider-Man** - Red & Blue (Landing Page)
- 🦸‍♀️ **Kim Possible** - Orange & Brown (Step 1)
- 👾 **Thanos** + 🐷 **Peppa Pig** - Purple & Pink (Step 2)
- 🐾 **Black Panther** + 🐱🐭 **Tom & Jerry** - Black & Yellow (Step 3)
- ⛄ **Olaf & Sven** - Frozen Blue (Step 4)
- 🛡️ **Captain America** - Red, White & Blue (Step 5)

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Adding Hero Images (Optional)

The app works perfectly with emoji placeholders, but you can add real images:

### Method 1: Extract from PDF

1. Open `SNS DT Playbook for SNS 1-5 Std Students.pptx.pdf`
2. Right-click each hero → "Save Image As..."
3. Save to `public/images/` with these names:
   - `spiderman.png`, `kim-possible.png`, `thanos.png`, `peppa-pig.png`
   - `black-panther.png`, `tom-jerry.png`, `olaf-sven.png`, `captain-america.png`
   - `sns-logo.png`, `sns-academy-logo.png`

### Method 2: Use Online Tool

Run the extraction helper:

```bash
node extract-pdf-images.js
```

**Note:** The app automatically uses images if available, emojis otherwise!

## 📁 Project Structure

```
d:/appp/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with context provider
│   ├── page.tsx           # Landing page (Spider-Man theme)
│   ├── globals.css        # Global styles
│   ├── step1/page.tsx     # Step 1: Empathize & Define (Kim Possible)
│   ├── step2/page.tsx     # Step 2: Define Problem (Thanos & Peppa)
│   ├── step3/page.tsx     # Step 3: Ideate (Black Panther & Tom/Jerry)
│   ├── step4/page.tsx     # Step 4: Evaluate (Olaf & Sven)
│   ├── step5/page.tsx     # Step 5: Final Solution (Captain America)
│   └── print/page.tsx     # Print preview & PDF export
├── components/            # Reusable React components
│   ├── CanvasDrawing.tsx  # HTML5 canvas for drawing
│   ├── DrawingBox.tsx     # Idea box with draw/write toggle
│   ├── FloatingPrintButton.tsx
│   ├── HeroImage.tsx      # Hero image component with fallback
│   ├── InputField.tsx
│   ├── PageFooter.tsx
│   ├── PageHeader.tsx     # Hero-themed headers
│   ├── PlaybookPage.tsx
│   ├── ProgressBar.tsx
│   └── TextArea.tsx
├── context/
│   └── PlaybookContext.tsx # Global state management
├── utils/
│   ├── constants.ts       # Character data & hero color themes
│   └── pdfGenerator.ts    # PDF export functionality
└── public/
    └── images/            # Character illustrations (to be added)
```

## 🎨 Features

### Completed Features ✅

- ✅ All 5 steps with interactive forms
- ✅ Text and drawing input modes
- ✅ Canvas drawing with touch support
- ✅ Global state management (Context API)
- ✅ Progress tracking
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Print preview page
- ✅ PDF export functionality
- ✅ SNS brand colors and styling
- ✅ Step navigation with footer buttons
- ✅ Floating "Save & Print" button

### Pages Overview

**Landing Page (`/`)**

- Welcome screen with CTA button
- Introduction to the playbook

**Step 1 (`/step1`)** - Empathize & Define

- User name and age input
- Problem statement
- Feelings expression (draw or write)

**Step 2 (`/step2`)** - Define Problem Story

- Who is facing the problem?
- What is happening?
- When/Where does it happen?
- Why is it a problem?

**Step 3 (`/step3`)** - Ideate: Crazy 6

- 6 idea boxes
- Draw or write mode for each idea
- Creative brainstorming

**Step 4 (`/step4`)** - Evaluate: The Scorecard

- Score each idea (1-10 slider)
- Yes/No radio buttons for problem-solving
- Visual table format

**Step 5 (`/step5`)** - Prototype: Final Solution

- Name your best idea
- Draw or describe the solution
- Summary explanation

**Print Page (`/print`)**

- Complete playbook preview
- Print to browser
- Download as PDF

## 🎨 Color Palette

```css
Primary Orange: #F37021
Primary Green:  #00A651
Light Orange:   #FEF3ED
Light Green:    #E8F5ED
Dark Text:      #222222
```

## 📝 Adding Character Images

Place character images in `public/images/`:

- spiderman.png
- kim-possible.png
- thanos.png
- peppa-pig.png
- black-panther.png
- tom-jerry.png
- olaf-sven.png
- captain-america.png
- sns-logo.png
- sns-academy-logo.png

Images should be transparent PNGs for best results.

## 🛠️ Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React Context API** - State management
- **html2canvas** - Screenshot generation
- **jsPDF** - PDF creation

## 📱 Responsive Design

- **Desktop**: Full layout with side-by-side content
- **Tablet**: Adaptive grid layouts
- **Mobile**: Stacked single-column layout

## 🖨️ Print Features

The print page (`/print`) provides:

1. **Browser Print**: Standard print dialog (Ctrl+P / Cmd+P)
2. **PDF Download**: Generate and download PDF file
3. **A4 Format**: Optimized for A4 paper size

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Deploy with one click

Or use Vercel CLI:

```bash
npm install -g vercel
vercel
```

## 📄 License

© SNS Institutions - SNS Academy

## 🎓 Educational Purpose

This playbook is designed for Grade 1-5 students to learn Design Thinking methodology through an interactive, engaging digital experience.

---

**Status:** ✅ Phase 1-4 Complete | MVP Ready

**Next Steps:**

- Add actual character images
- Test on multiple devices
- Gather student feedback
- Add data persistence (localStorage)
- Teacher dashboard (future enhancement)
