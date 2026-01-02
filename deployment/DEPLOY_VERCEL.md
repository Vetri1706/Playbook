# Deploy (Frontend on Vercel + Backend elsewhere)

Vercel can host the Next.js frontend. Your Flask backend (PDF generation + static page PNGs) should be deployed separately (Render / Railway / Fly.io / VPS, etc.).

This repo is already set up so the frontend can call the backend in two ways:

- **Recommended:** Same-origin calls via `/api/...` and `/static/...` using Vercel rewrites (no CORS).
- **Alternative:** Direct backend URL via `NEXT_PUBLIC_BACKEND_URL`.

## 1) Deploy the backend first

Pick a backend host that supports Python + your dependencies (PyMuPDF/fitz). Then set these environment variables there:

- `FLASK_ENV=production`
- `SECRET_KEY=...`
- `JWT_SECRET_KEY=...` (if auth is used)
- `PDF_TEMPLATE_PATH=...` (path to the PDF template on that server)

Make sure the backend serves these URLs:

- `GET /health` (or `/api/health`)
- `POST /api/generate-pdf-direct`
- `GET /static/pdf_backgrounds/page_01.png` (and other pages)

When it’s live, note the backend base URL, e.g. `https://dt-backend.onrender.com`.

## 2) Configure Vercel to proxy to the backend (recommended)

This repo includes a root `vercel.json` rewrite template. Update it:

- Replace `https://YOUR-BACKEND-DOMAIN.com` with your real backend URL.

This makes these work from the browser:

- `/api/...` -> backend `/api/...`
- `/static/...` -> backend `/static/...`

So the app and the PDF background images load from the same origin.

## 3) Deploy the frontend to Vercel

1. Push to GitHub
2. Vercel → **New Project** → import repo → Deploy

### Environment variables on Vercel

Usually you do **not** need to set `NEXT_PUBLIC_BACKEND_URL` if you use `vercel.json` rewrites.

Only set this if you want to bypass rewrites:

- `NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com`

Optional:

- `NEXT_PUBLIC_PDF_API_KEY=...` (only if your backend checks `X-API-Key`)

## 4) Verify

Open your Vercel URL and check:

- Template pages show up (images load)
- PDF download works

Quick checks in browser:

- Visit `https://your-vercel-app.vercel.app/static/pdf_backgrounds/page_01.png`
- Open DevTools → Network → `generate-pdf-direct` returns `200` and downloads a PDF
