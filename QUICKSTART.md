# 🚀 SNS Design Thinking Playbook - Quick Start Guide

## ✅ Installation Complete!

Your SNS Design Thinking Playbook web application has been successfully set up.

## 📋 What Has Been Created

### ✅ Core Files (19 files)

1. **Configuration Files** (6)

   - package.json
   - tsconfig.json
   - next.config.js
   - tailwind.config.ts
   - postcss.config.js
   - .eslintrc.json

2. **App Pages** (7)

   - app/layout.tsx (Root layout)
   - app/page.tsx (Landing page)
   - app/step1/page.tsx (Empathize & Define)
   - app/step2/page.tsx (Define Problem)
   - app/step3/page.tsx (Ideate - Crazy 6)
   - app/step4/page.tsx (Evaluate)
   - app/step5/page.tsx (Final Solution)
   - app/print/page.tsx (Print/PDF)

3. **Components** (9)

   - CanvasDrawing.tsx (Drawing canvas)
   - DrawingBox.tsx (Idea boxes)
   - FloatingPrintButton.tsx
   - InputField.tsx
   - PageFooter.tsx
   - PageHeader.tsx
   - PlaybookPage.tsx
   - ProgressBar.tsx
   - TextArea.tsx

4. **Context & Utils** (3)

   - context/PlaybookContext.tsx
   - utils/constants.ts
   - utils/pdfGenerator.ts

5. **Styles** (1)
   - app/globals.css

## 🎯 Next Steps

### 1. Start Development Server

```bash
npm run dev
```

### 2. Open Browser

Navigate to: **http://localhost:3000**

### 3. Add Character Images (Optional)

Place PNG images in `public/images/`:

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

**Note:** App works with emoji placeholders until images are added.

## 🎨 Features Implemented

✅ **5 Complete Steps** - All design thinking stages
✅ **Drawing & Writing** - Toggle between input modes
✅ **State Management** - React Context API
✅ **Print & PDF** - Export functionality
✅ **Responsive Design** - Mobile, tablet, desktop
✅ **Progress Tracking** - Visual step indicator
✅ **SNS Branding** - Correct color palette

## 🧪 Testing the App

1. **Landing Page**: Click "Start Mission"
2. **Step 1**: Enter name, age, problem, and feelings
3. **Step 2**: Fill in the problem story (4 questions)
4. **Step 3**: Create 6 wild ideas (draw or write)
5. **Step 4**: Score and evaluate your ideas
6. **Step 5**: Choose best idea and create solution
7. **Print**: Preview and download PDF

## 📱 Device Testing

- **Desktop**: Full experience with side-by-side layouts
- **Tablet**: Adaptive grid layouts
- **Mobile**: Single-column stacked design
- **Touch**: Canvas drawing works on touch devices

## 🎨 Color Reference

```
Orange: #F37021 (Primary/SNS Brand)
Green:  #00A651 (Secondary/SNS Brand)
Light Orange: #FEF3ED (Backgrounds)
Light Green: #E8F5ED (Backgrounds)
Dark: #222222 (Text)
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Option 2: Build Locally

```bash
npm run build
npm start
```

## 📝 Project Status

**Phase 1-4: ✅ COMPLETE**

- ✅ Project setup
- ✅ Core components
- ✅ All pages (landing + 5 steps + print)
- ✅ Print/PDF feature
- ✅ Responsive design

**Ready for:**

- Student testing
- Image integration
- Deployment

## 🆘 Troubleshooting

### Issue: Port already in use

```bash
# Kill process on port 3000
npx kill-port 3000
# Then restart
npm run dev
```

### Issue: TypeScript errors

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Issue: Module not found

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## 📚 Documentation

- Full README: `README.md`
- Image guide: `public/images/README.md`
- Implementation plan: `plan-snsDesignThinkingPlaybook.prompt.md`

## 🎉 Success!

Your SNS Design Thinking Playbook is ready to use!

**Run `npm run dev` and start creating amazing solutions!**

---

**Built with:**

- Next.js 15
- TypeScript
- Tailwind CSS
- React Context API
- html2canvas + jsPDF

**© SNS Institutions - SNS Academy**
