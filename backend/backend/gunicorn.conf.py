# Gunicorn Configuration for Design Thinking Playbook Backend
# Usage: gunicorn -c gunicorn.conf.py app:app

import multiprocessing
import os

# Server Socket
bind = os.getenv('BIND', '0.0.0.0:8000')
backlog = 2048

# Worker Processes
workers = int(os.getenv('WORKERS', multiprocessing.cpu_count() * 2 + 1))
worker_class = 'sync'  # Use 'gevent' or 'eventlet' for async
worker_connections = 1000
max_requests = 1000  # Restart workers after handling this many requests
max_requests_jitter = 50  # Add randomness to prevent all workers restarting at once
timeout = 300  # 5 minutes for PDF generation
keepalive = 2

# Logging
accesslog = '-'  # Log to stdout
errorlog = '-'   # Log to stderr
loglevel = os.getenv('LOG_LEVEL', 'info')
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process Naming
proc_name = 'dt-playbook-backend'

# Server Mechanics
daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# SSL (if needed)
# keyfile = '/path/to/key.pem'
# certfile = '/path/to/cert.pem'

# Development vs Production
reload = os.getenv('FLASK_ENV') == 'development'
reload_extra_files = []

# Preload app to save memory
preload_app = True

# Server Hooks
def on_starting(server):
    """Called just before the master process is initialized."""
    print("Starting Gunicorn server...")

def on_reload(server):
    """Called when the server is reloading."""
    print("Reloading Gunicorn server...")

def when_ready(server):
    """Called just after the server is started."""
    print(f"Gunicorn server is ready. Listening on {bind}")

def worker_int(worker):
    """Called when a worker receives SIGINT or SIGQUIT."""
    print(f"Worker {worker.pid} received SIGINT or SIGQUIT")

def worker_abort(worker):
    """Called when a worker times out."""
    print(f"Worker {worker.pid} timed out and is being killed")

def pre_fork(server, worker):
    """Called just before a worker is forked."""
    pass

def post_fork(server, worker):
    """Called just after a worker has been forked."""
    print(f"Worker spawned (pid: {worker.pid})")

def post_worker_init(worker):
    """Called just after a worker has initialized the application."""
    print(f"Worker initialized (pid: {worker.pid})")

def worker_exit(server, worker):
    """Called just after a worker has been exited."""
    print(f"Worker exited (pid: {worker.pid})")

def child_exit(server, worker):
    """Called just after a worker has been exited, in the child process."""
    pass

def nworkers_changed(server, new_value, old_value):
    """Called when the number of workers changes."""
    print(f"Number of workers changed from {old_value} to {new_value}")

def on_exit(server):
    """Called just before the master process exits."""
    print("Shutting down Gunicorn server...")
