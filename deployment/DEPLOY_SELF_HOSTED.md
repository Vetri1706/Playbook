# Deploy (Self-hosted) — Next.js + Flask (Gunicorn) + Nginx

This repo is a full-stack app:

- Frontend: Next.js (App Router)
- Backend: Flask API + PDF generation + serves template PNGs at `/static/pdf_backgrounds/...`

This guide hosts BOTH on one domain with Nginx:

- `https://your-domain.com` → Next.js
- `https://your-domain.com/api/*` + `/static/*` → Flask backend

## 1) Build & run locally (sanity)

Frontend:

- `npm ci`
- `npm run build`

Backend:

- `cd backend/backend`
- `python3.13 -m venv venv`
- `source venv/bin/activate`
- `pip install -r requirements.txt gunicorn`
- `gunicorn -c gunicorn.conf.py app:app`

## 2) Server prerequisites (Ubuntu)

- Install: `nginx`, `python3.13`, `python3.13-venv`, `nodejs` (18+), `npm`, `certbot`

## 3) Copy code to server

Example target:

- `/home/dtplaybook/appp`

## 4) Configure environment variables

Frontend env:

- `NEXT_PUBLIC_BACKEND_URL=https://your-domain.com`

Backend env (at minimum):

- `FLASK_ENV=production`
- `BIND=127.0.0.1:8000`
- `CORS_ORIGINS=https://your-domain.com`
- `SECRET_KEY=...`
- `JWT_SECRET_KEY=...`

## 5) Nginx

- Copy `deployment/nginx-next.conf` to `/etc/nginx/sites-available/dt-playbook`
- Edit `your-domain.com`
- Enable:
  - `sudo ln -s /etc/nginx/sites-available/dt-playbook /etc/nginx/sites-enabled/`
- Test + reload:
  - `sudo nginx -t`
  - `sudo systemctl reload nginx`

## 6) SSL (LetsEncrypt)

- `sudo apt install certbot python3-certbot-nginx -y`
- `sudo certbot --nginx -d your-domain.com`

## 7) systemd services

- Copy:

  - `deployment/dt-playbook-backend.service` → `/etc/systemd/system/dt-playbook-backend.service`
  - `deployment/dt-playbook-frontend.service` → `/etc/systemd/system/dt-playbook-frontend.service`

- Reload + enable + start:

  - `sudo systemctl daemon-reload`
  - `sudo systemctl enable --now dt-playbook-backend`
  - `sudo systemctl enable --now dt-playbook-frontend`

- Logs:
  - `sudo journalctl -u dt-playbook-backend -f`
  - `sudo journalctl -u dt-playbook-frontend -f`

## 8) Verify

- Frontend: `https://your-domain.com`
- Backend health: `https://your-domain.com/api/health`
- Background PNG: `https://your-domain.com/static/pdf_backgrounds/page_01.png`
