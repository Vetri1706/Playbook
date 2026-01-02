# Production Deployment Guide

## Design Thinking Playbook Backend - Production Setup

This guide provides comprehensive instructions for deploying the Flask backend to a production environment with Gunicorn and Nginx.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [Application Deployment](#application-deployment)
4. [Gunicorn Configuration](#gunicorn-configuration)
5. [Nginx Configuration](#nginx-configuration)
6. [SSL/TLS Setup](#ssltls-setup)
7. [Systemd Service](#systemd-service)
8. [Monitoring & Logging](#monitoring--logging)
9. [Security Hardening](#security-hardening)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Ubuntu 20.04/22.04 LTS or similar Linux distribution
- Python 3.13+
- At least 2GB RAM
- Domain name pointing to your server
- Root or sudo access

---

## Server Setup

### 1. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Required Packages

```bash
sudo apt install -y python3.13 python3.13-venv python3-pip nginx git supervisor
```

### 3. Create Application User

```bash
sudo useradd -m -s /bin/bash dtplaybook
sudo usermod -aG sudo dtplaybook
```

---

## Application Deployment

### 1. Clone Repository

```bash
sudo su - dtplaybook
git clone https://github.com/your-repo/design-thinking-playbook.git
cd design-thinking-playbook/backend
```

### 2. Create Virtual Environment

```bash
python3.13 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn
```

### 4. Configure Environment Variables

```bash
nano .env
```

Add the following:

```env
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-change-this
JWT_SECRET_KEY=your-jwt-secret-key-change-this
DATABASE_URL=sqlite:///dt_playbook.db
CORS_ORIGINS=https://your-domain.com
LOG_LEVEL=INFO
WORKERS=4
BIND=127.0.0.1:8000
```

### 5. Initialize Database

```bash
python init_db.py
```

### 6. Test Application

```bash
gunicorn -c gunicorn.conf.py app:app
```

Visit http://your-server-ip:8000/api/health to verify.

---

## Gunicorn Configuration

The `gunicorn.conf.py` file is pre-configured with production settings:

- **Workers**: Auto-calculated based on CPU cores (2 * cores + 1)
- **Timeout**: 300 seconds for PDF generation
- **Keepalive**: 2 seconds
- **Max Requests**: 1000 (prevents memory leaks)
- **Logging**: Outputs to stdout/stderr

### Custom Configuration

Edit `gunicorn.conf.py` to adjust:

```python
workers = 4  # Adjust based on server capacity
timeout = 300  # Increase if PDFs take longer
bind = '127.0.0.1:8000'  # Change port if needed
```

---

## Nginx Configuration

### 1. Copy Configuration File

```bash
sudo cp nginx.conf /etc/nginx/sites-available/dt-playbook
sudo ln -s /etc/nginx/sites-available/dt-playbook /etc/nginx/sites-enabled/
```

### 2. Update Domain Name

Edit `/etc/nginx/sites-available/dt-playbook`:

```nginx
server_name your-domain.com www.your-domain.com;
```

### 3. Test Configuration

```bash
sudo nginx -t
```

### 4. Reload Nginx

```bash
sudo systemctl reload nginx
```

---

## SSL/TLS Setup

### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain Certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (Certbot sets this up automatically)
sudo certbot renew --dry-run
```

### Manual SSL Certificate

If using your own certificates, update nginx.conf:

```nginx
ssl_certificate /path/to/your/fullchain.pem;
ssl_certificate_key /path/to/your/privkey.pem;
```

---

## Systemd Service

Create a systemd service for automatic startup and process management.

### 1. Create Service File

```bash
sudo nano /etc/systemd/system/dt-playbook.service
```

### 2. Add Configuration

```ini
[Unit]
Description=Design Thinking Playbook Backend
After=network.target

[Service]
Type=notify
User=dtplaybook
Group=dtplaybook
WorkingDirectory=/home/dtplaybook/design-thinking-playbook/backend
Environment="PATH=/home/dtplaybook/design-thinking-playbook/backend/venv/bin"
ExecStart=/home/dtplaybook/design-thinking-playbook/backend/venv/bin/gunicorn -c gunicorn.conf.py app:app
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 3. Enable and Start Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable dt-playbook
sudo systemctl start dt-playbook
```

### 4. Check Status

```bash
sudo systemctl status dt-playbook
sudo journalctl -u dt-playbook -f  # Follow logs
```

---

## Monitoring & Logging

### Application Logs

Gunicorn logs to stdout/stderr, which systemd captures:

```bash
# View logs
sudo journalctl -u dt-playbook -n 100

# Follow logs in real-time
sudo journalctl -u dt-playbook -f

# Filter by time
sudo journalctl -u dt-playbook --since "1 hour ago"
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/dt-playbook-access.log

# Error logs
sudo tail -f /var/log/nginx/dt-playbook-error.log
```

### Application-Level Logging

The application logs include trace IDs for request correlation:

```
2025-01-15 10:30:45 [INFO] [a3b2c1d4] POST /api/generate-pdf (200) - 3.45s
2025-01-15 10:30:45 [INFO] [a3b2c1d4] Responses count: 25
2025-01-15 10:30:45 [INFO] [a3b2c1d4] Processed: 85 fields, With data: 25 fields
```

### Monitoring Tools (Optional)

Consider integrating:

- **Prometheus + Grafana**: Metrics and dashboards
- **Sentry**: Error tracking
- **Datadog/New Relic**: APM and monitoring
- **ELK Stack**: Centralized logging

---

## Security Hardening

### 1. Firewall Setup (UFW)

```bash
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### 2. Fail2Ban (Brute Force Protection)

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Secure Environment Variables

Never commit `.env` to version control. Use secrets management:

```bash
chmod 600 .env
```

### 4. Database Backups

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * cp /home/dtplaybook/design-thinking-playbook/backend/dt_playbook.db /home/dtplaybook/backups/dt_playbook_$(date +\%Y\%m\%d).db
```

### 5. Regular Updates

```bash
# Automated security updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Troubleshooting

### Issue: 502 Bad Gateway

**Cause**: Gunicorn not running or can't connect.

**Solution**:

```bash
sudo systemctl status dt-playbook
sudo journalctl -u dt-playbook -n 50
```

Check if Gunicorn is bound to correct port in gunicorn.conf.py.

---

### Issue: PDF Generation Fails

**Cause**: Missing fonts, corrupted template, or timeout.

**Solution**:

```bash
# Check logs
sudo journalctl -u dt-playbook | grep "generate_filled_pdf"

# Verify template exists
ls -l /home/dtplaybook/design-thinking-playbook/backend/*.pdf

# Check permissions
sudo chown -R dtplaybook:dtplaybook /home/dtplaybook/design-thinking-playbook/backend
```

---

### Issue: High Memory Usage

**Cause**: Too many workers or memory leaks.

**Solution**:

```bash
# Reduce workers in gunicorn.conf.py
workers = 2

# Enable max_requests to recycle workers
max_requests = 500

# Restart service
sudo systemctl restart dt-playbook
```

---

### Issue: Slow Response Times

**Cause**: Insufficient resources or blocking I/O.

**Solution**:

```bash
# Check system resources
htop

# Enable async workers (requires gevent)
pip install gevent
# In gunicorn.conf.py: worker_class = 'gevent'

# Increase worker connections
worker_connections = 2000
```

---

### Issue: Empty PDFs Generated

**Cause**: Missing data or field mapping issues.

**Solution**:

Check application logs for warnings:

```bash
sudo journalctl -u dt-playbook | grep "WARNING: PDF generated but NO data"
```

Verify responses are saved:

```bash
# In Python shell
from models import Project, Response, db
project = Project.query.filter_by(id=1).first()
responses = Response.query.filter_by(project_id=1).all()
for r in responses:
    print(f"{r.field_name}: {r.field_value}")
```

---

## Performance Tuning

### Nginx Optimizations

```nginx
# In /etc/nginx/nginx.conf

worker_processes auto;
worker_connections 2048;

# Enable gzip
gzip on;
gzip_vary on;
gzip_min_length 256;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

# File descriptor caching
open_file_cache max=10000 inactive=30s;
open_file_cache_valid 60s;
open_file_cache_min_uses 2;
```

### Database Optimization

For production, consider PostgreSQL:

```bash
sudo apt install postgresql postgresql-contrib -y

# In .env
DATABASE_URL=postgresql://dtplaybook:password@localhost/dt_playbook_db
```

---

## Deployment Checklist

- [ ] Server hardened (firewall, fail2ban, SSH keys)
- [ ] SSL/TLS configured with Let's Encrypt
- [ ] Environment variables set in `.env`
- [ ] Database initialized
- [ ] Gunicorn service running
- [ ] Nginx reverse proxy configured
- [ ] Logs accessible and monitored
- [ ] Backups automated
- [ ] Health check endpoint responding (`/api/health`)
- [ ] Test PDF generation end-to-end
- [ ] Error tracking configured (optional)
- [ ] Monitoring dashboards setup (optional)

---

## Quick Commands Reference

```bash
# Restart backend
sudo systemctl restart dt-playbook

# Reload Nginx (no downtime)
sudo systemctl reload nginx

# View live logs
sudo journalctl -u dt-playbook -f

# Check application status
curl https://your-domain.com/api/health

# Test PDF generation
curl -X POST https://your-domain.com/api/generate-pdf \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"project_id": 1}'

# List all routes
curl https://your-domain.com/api/routes
```

---

## Support

For issues or questions:

1. Check logs: `sudo journalctl -u dt-playbook -n 100`
2. Verify configuration: `sudo nginx -t`
3. Test connectivity: `curl http://localhost:8000/api/health`
4. Review trace IDs in logs for request correlation

---

**Last Updated**: January 2025
**Version**: 1.0.0
