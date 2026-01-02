
# SNS Design Thinking Playbook - Next.js Web App Implementation Plan

## Project Overview
Build a complete, single-page web application that digitizes the "SNS Design Thinking Playbook" for Grade 1-5 students. The app will be interactive, allowing students to fill answers, draw ideas, and generate a printable PDF matching the original playbook design.

---

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS (responsive design + brand color matching)
- **State Management**: React Context API (persist user inputs across pages)
- **PDF Generation**: html2canvas + jsPDF (print-ready output)
- **Drawing**: HTML5 Canvas (with text fallback for MVP)
- **Deployment**: Vercel (native Next.js support)

---

## Color Palette (Strict)
```
Primary Orange: #F37021 (SNS Branding)
Primary Green: #00A651 (SNS Branding)
Background White: #FFFFFF
Light Orange: #FEF3ED (backgrounds)
Light Green: #E8F5ED (backgrounds)
Text Dark: #222222
```

---

## Project File Structure

```
d:/appp/
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── .eslintrc.json
├── .gitignore
├── public/
│   └── images/
│       ├── spiderman.png
│       ├── thanos.png
│       ├── peppa-pig.png
│       ├── kim-possible.png
│       ├── black-panther.png
│       ├── tom-jerry.png
│       ├── olaf-sven.png
│       ├── captain-america.png
│       ├── sns-logo.png
│       └── sns-academy-logo.png
├── src/
│   ├── app/
│   │   ├── layout.tsx (Root layout with Context provider)
│   │   ├── page.tsx (Landing page)
│   │   ├── globals.css (Tailwind imports)
│   │   ├── step1/
│   │   │   └── page.tsx
│   │   ├── step2/
│   │   │   └── page.tsx
│   │   ├── step3/
│   │   │   └── page.tsx
│   │   ├── step4/
│   │   │   └── page.tsx
│   │   ├── step5/
│   │   │   └── page.tsx
│   │   └── print/
│   │       └── page.tsx (PDF generation view)
│   ├── context/
│   │   └── PlaybookContext.tsx (Global state for all user inputs)
│   ├── components/
│   │   ├── PlaybookPage.tsx (A4 wrapper with aspect ratio + scaling)
│   │   ├── PageHeader.tsx (Title + Character + Progress indicator)
│   │   ├── PageFooter.tsx (Navigation buttons)
│   │   ├── Canvas Drawing.tsx (HTML5 Canvas drawing pad)
│   │   ├── DrawingBox.tsx (Single idea drawing box)
│   │   ├── InputField.tsx (Reusable text input)
│   │   ├── TextArea.tsx (Reusable textarea)
│   │   ├── FloatingPrintButton.tsx (Fixed "Save & Print" CTA)
│   │   └── ProgressBar.tsx (Step indicator)
│   └── utils/
│       ├── pdfGenerator.ts (html2canvas + jsPDF logic)
│       └── constants.ts (Color vars, character data, step metadata)
```

---

## Page-by-Page Specification

### Page 1: Landing Page (The Welcome)
**Route**: `/`
**Character**: Spider-Man (hanging from web)
**Layout**:
- Header: SNS Institutions + SNS Academy logos (top center)
- Main visual: Spider-Man illustration (centered, 40% of viewport)
- Title: "Design Thinking Playbook" (large, orange, bold)
- Subtitle: "Join the mission to solve problems like a superhero!" (green, smaller)
- CTA Button: "Start Mission" (orange bg, white text, 200px width)
- Footer: Tagline "Let's think like designers!" (gray, small)

**Inputs**: None (navigation only)

---

### Page 2: Step 1 - Empathize & Define (The Detective)
**Route**: `/step1`
**Character**: Kim Possible (top right, illustrating detective mode)
**Content Title**: "Step 1: Empathize & Define - The Detective"

**Input Fields** (stored in PlaybookContext):
1. **User Name** (Text Input)
   - Placeholder: "Enter your name"
   - Label: "Who are you?"
   
2. **Age** (Number Input)
   - Placeholder: "8"
   - Label: "How old are you?"

3. **Problem Statement** (Text Area)
   - Label: "What problem do you want to solve?"
   - Placeholder: "Describe the problem here..."
   - Height: 150px

4. **Feelings Drawing Section** (Toggle: Draw or Write)
   - Tab 1: "Draw Your Feelings" (Canvas drawing pad, 300x200px)
   - Tab 2: "Write About Your Feelings" (Text area)
   - Label: "Show how the person with the problem feels (sad, happy, confused...)"

**Layout**: 
- 2-column on desktop, 1-column on tablet/mobile
- Left: Input fields
- Right: Kim Possible illustration

---

### Page 3: Step 2 - Define (The Problem Story)
**Route**: `/step2`
**Characters**: Thanos (left) and Peppa Pig (right)
**Content Title**: "Step 2: Define - The Problem Story"

**Input Fields** (2x2 grid layout):
1. **"Who is facing the problem?"** (Text area)
2. **"What is happening?"** (Text area)
3. **"When/Where does it happen?"** (Text area)
4. **"Why is it a problem?"** (Text area)

**Layout**:
- 2x2 grid of large text areas on desktop
- Full-width stack on mobile
- Characters positioned at top corners (Thanos left, Peppa Pig right)

---

### Page 4: Step 3 - Ideate (Crazy 6)
**Route**: `/step3`
**Characters**: Black Panther (top left) and Tom & Jerry (top right)
**Content Title**: "Step 3: Ideate - Crazy 6"
**Subtitle**: "Come up with 6 wild ideas! Don't worry about being perfect—be CRAZY!"

**Interaction**: 2x3 Grid of Idea Boxes
- Each box is labeled "Idea 1" through "Idea 6"
- **Toggle per box**: "Text Mode" vs "Draw Mode"
  - Text Mode: Large text area (100px height)
  - Draw Mode: HTML5 Canvas (250x200px) with clear/save buttons
- Store all 6 ideas in context (both text and canvas data as data URLs)

**Layout**:
- 3 columns on desktop (2x3 grid, responsive)
- 2 columns on tablet
- 1 column on mobile

---

### Page 5: Step 4 - Evaluate (The Scorecard)
**Route**: `/step4`
**Characters**: Olaf and Sven (Frozen characters, top center)
**Content Title**: "Step 4: Evaluate - The Scorecard"

**Table/Scorecard**:
| Idea Name | Score (1-10) | Does it solve the problem? |
|-----------|--------------|---------------------------|
| Idea 1    | [Slider]     | [Radio: Yes/No]           |
| Idea 2    | [Slider]     | [Radio: Yes/No]           |
| ...       | ...          | ...                       |
| Idea 6    | [Slider]     | [Radio: Yes/No]           |

**Logic**:
- Pre-populate "Idea Name" from Step 3
- Allow score input (1-10 slider or number input)
- Allow Yes/No selection
- Store all data in context

**Layout**: 
- Responsive table (scrollable on mobile)

---

### Page 6: Step 5 - The Final Solution
**Route**: `/step5`
**Character**: Captain America Shield (large, center)
**Content Title**: "Step 5: The Final Solution - Your Super IDEA"

**Input Fields**:
1. **"My best idea is..."** (Large drawing canvas OR text area)
   - Size: 400x300px
   - Toggle: Draw vs Write
   
2. **"The super IDEA is called..."** (Text input)
   - Placeholder: "Give your idea a cool name!"
   - Max length: 100 characters

3. **Quick Summary** (Text area)
   - Label: "How will your idea solve the problem?"
   - Height: 200px

**Button**: 
- Primary: "Save & Print Playbook" (floating button OR inline)

**Layout**:
- Single column, centered
- Character (Captain America) positioned behind or beside text areas

---

### Page 7: Print Preview Page
**Route**: `/print`
**Purpose**: Full-page preview of all user's inputs formatted as A4 printable document

**Content** (Render all steps with user data):
- Header: SNS logos + Title
- Step 1: User info + Problem + Feelings
- Step 2: Problem story answers
- Step 3: All 6 ideas (text or rendered canvas images)
- Step 4: Scorecard with user selections
- Step 5: Final solution
- Footer: "Printed from SNS Design Thinking Playbook"

**Styling**:
- A4 aspect ratio (210mm x 297mm)
- White background
- Print CSS: Hide all buttons, optimize for PDF
- Use `@media print` rules

**Action**:
- "Print" button → Opens browser print dialog (Ctrl+P / Cmd+P)
- "Download PDF" button → Uses html2canvas + jsPDF to generate PDF file

---

## Component Architecture

### PlaybookPage.tsx
Wrapper component for all step pages.
```
Props:
  - stepNumber: number (1-5)
  - title: string
  - character: {src: string, alt: string, position: "left"|"right"|"top"}
  - children: React.ReactNode

Features:
  - A4 aspect ratio container (210mm:297mm = 21:29.7)
  - Adaptive scaling based on viewport
  - Padding for margins
  - Maintains proper page break for printing
```

### CanvasDrawing.tsx
Reusable HTML5 Canvas drawing component.
```
Props:
  - width: number
  - height: number
  - onSave: (dataURL: string) => void
  - onClear: () => void

Features:
  - Freehand drawing with mouse/touch
  - Undo/Redo buttons (optional)
  - Clear canvas button
  - Export as data URL for storage/printing
```

### FloatingPrintButton.tsx
Fixed position button on all pages.
```
Props:
  - onClick: () => void
  - steps: CompletedSteps (indicator which steps are filled)

Features:
  - "Save & Print Playbook" text
  - Shows progress (e.g., "4/5 Steps Complete")
  - Enabled/disabled based on input validation
  - Color: Primary orange background
```

### PlaybookContext.tsx
Global state management.
```
State structure:
{
  user: {
    name: string
    age: number
  }
  step1: {
    problem: string
    feelings: {
      mode: "draw" | "write"
      content: string (for write) | dataURL (for draw)
    }
  }
  step2: {
    who: string
    what: string
    when: string
    why: string
  }
  step3: {
    ideas: Array<{
      id: number
      mode: "draw" | "write"
      content: string | dataURL
    }>
  }
  step4: {
    evaluations: Array<{
      ideaId: number
      score: number
      solvesProblem: "yes" | "no"
    }>
  }
  step5: {
    bestIdea: {
      mode: "draw" | "write"
      content: string | dataURL
    }
    ideaName: string
    summary: string
  }
}

Methods:
  - updateStep1(data)
  - updateStep2(data)
  - updateStep3(ideas)
  - updateStep4(evaluations)
  - updateStep5(data)
  - resetAll()
  - exportData() → JSON
  - importData(JSON)
```

---

## Tailwind Configuration
**File**: `tailwind.config.ts`

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        'sns-orange': '#F37021',
        'sns-green': '#00A651',
        'sns-light-orange': '#FEF3ED',
        'sns-light-green': '#E8F5ED',
        'sns-dark': '#222222',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'sans-serif'],
      },
      aspectRatio: {
        'a4': '21 / 29.7',
      },
    },
  },
}
```

---

## Implementation Roadmap (Phases)

### Phase 1: Project Setup (Day 1)
- [ ] Initialize Next.js project with TypeScript
- [ ] Install dependencies (Tailwind, jsPDF, html2canvas)
- [ ] Configure tailwind.config.ts with brand colors
- [ ] Create folder structure
- [ ] Set up PlaybookContext

### Phase 2: Core Components (Day 2-3)
- [ ] Build PlaybookPage wrapper component
- [ ] Build CanvasDrawing component
- [ ] Build InputField, TextArea reusable components
- [ ] Build FloatingPrintButton
- [ ] Build ProgressBar indicator

### Phase 3: Pages (Day 4-7)
- [ ] Landing page (/)
- [ ] Step 1 page (/step1)
- [ ] Step 2 page (/step2)
- [ ] Step 3 page (/step3)
- [ ] Step 4 page (/step4)
- [ ] Step 5 page (/step5)

### Phase 4: Print Feature (Day 8)
- [ ] Build /print page with full playbook preview
- [ ] Implement html2canvas integration
- [ ] Implement jsPDF export
- [ ] Test print layout on A4 format
- [ ] Create print CSS (@media print rules)

### Phase 5: Testing & Polish (Day 9-10)
- [ ] Test on tablet (iPad) and mobile (iPhone)
- [ ] Test drawing on touch devices
- [ ] Verify PDF export quality
- [ ] Accessibility audit (WCAG 2.1)
- [ ] Performance optimization

---

## Key Technical Considerations

### 1. Canvas Data Persistence
- Store canvas drawings as base64 data URLs in Context
- On render, convert data URLs back to img elements for display/printing
- Alternative: Use localStorage for redundancy

### 2. A4 Aspect Ratio & Responsive Scaling
```
A4 = 210mm × 297mm (ratio 21:29.7)
CSS: aspect-ratio: 21 / 29.7
Scale container width to fit viewport, height auto-scales
Max-width: 900px (limit desktop view)
```

### 3. Print Optimization
```css
@media print {
  body { margin: 0; padding: 0; }
  .page { page-break-after: always; }
  .floating-button { display: none; }
  .no-print { display: none; }
}
```

### 4. Touch & Draw Support
- Use `PointerEvent` API (supports mouse + touch)
- Prevent default touch behaviors (scrolling while drawing)
- Test on iOS Safari (canvas touch handling differs)

### 5. Mobile Image Optimization
- Use `next/image` for character illustrations
- Provide WebP + PNG fallbacks
- Lazy load images below fold

### 6. Form Validation
- Require at least name + age on Step 1
- Require at least one idea on Step 3
- Warn if user attempts to print with incomplete data
- Allow "draft" mode (incomplete) but highlight missing sections in print preview

---

## Dependencies to Install
```json
{
  "next": "^15.0.0",
  "react": "^18.0.0",
  "tailwindcss": "^3.4.0",
  "html2canvas": "^1.4.1",
  "jspdf": "^2.5.1",
  "typescript": "^5.3.0"
}
```

---

## Design System Constants
**File**: `src/utils/constants.ts`

```typescript
export const CHARACTERS = {
  spiderman: { src: '/images/spiderman.png', alt: 'Spider-Man' },
  kimpossible: { src: '/images/kim-possible.png', alt: 'Kim Possible' },
  thanos: { src: '/images/thanos.png', alt: 'Thanos' },
  peppapig: { src: '/images/peppa-pig.png', alt: 'Peppa Pig' },
  blackpanther: { src: '/images/black-panther.png', alt: 'Black Panther' },
  tomjerry: { src: '/images/tom-jerry.png', alt: 'Tom & Jerry' },
  olaf: { src: '/images/olaf-sven.png', alt: 'Olaf & Sven' },
  captainamerica: { src: '/images/captain-america.png', alt: 'Captain America' },
}

export const STEPS = [
  { number: 1, title: 'Empathize & Define', char: 'kimpossible' },
  { number: 2, title: 'Define Problem', char: 'thanos' },
  { number: 3, title: 'Ideate - Crazy 6', char: 'blackpanther' },
  { number: 4, title: 'Evaluate', char: 'olaf' },
  { number: 5, title: 'Final Solution', char: 'captainamerica' },
]

export const COLORS = {
  primary: '#F37021',
  secondary: '#00A651',
  light: '#FEF3ED',
  dark: '#222222',
}
```

---

## MVP vs Full Features

### MVP (Minimum Viable Product)
- ✅ All 5 steps with input fields
- ✅ Text-based inputs (no drawing initially)
- ✅ Simple print preview (HTML render)
- ✅ PDF export using html2canvas
- ✅ Mobile responsive
- ⏸️ Drawing canvas (optional, can be added later)
- ⏸️ Advanced validation & error states
- ⏸️ Data persistence (localStorage)

### Future Enhancements
- Drawing canvas with Undo/Redo
- Local storage persistence (resume playbook)
- Teacher dashboard to view student submissions
- Collaborative mode (multiple students)
- Animated character movements
- Sound effects (optional)
- Multi-language support
- Assessment scoring system

---

## Next Steps
1. **Confirm PDF structure** — Share what you see in the playbook PDF or provide original .pptx
2. **Acquire character images** — Find transparent PNGs and place in `/public/images`
3. **Initialize project** — Run `npm create next-app@latest`
4. **Set colors & fonts** — Configure tailwind.config.ts
5. **Begin implementation** — Start with Phase 1 (Project Setup)

---

## Notes
- **No emojis** will be used; all visual elements are character illustrations
- **Color accuracy** is critical for SNS branding — use provided hex codes exactly
- **Print quality** must match original PDF — test extensively before release
- **Accessibility** is important for young learners — ensure proper contrast & keyboard navigation
- **Performance** — optimize for slow networks (students may use school WiFi)
