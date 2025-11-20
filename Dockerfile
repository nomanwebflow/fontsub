# Multi-stage Dockerfile for FontSub application
# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Python backend with built frontend
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/frontend/dist /app/static

# Create necessary directories
RUN mkdir -p /app/uploads /app/outputs /var/log/supervisor

# Copy nginx configuration
COPY <<EOF /etc/nginx/sites-available/default
server {
    listen 8080;
    server_name _;

    # Serve frontend static files
    location / {
        root /app/static;
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API requests to FastAPI backend
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host \$host;
    }
}
EOF

# Create supervisor configuration
COPY <<EOF /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true
user=root
logfile=/var/log/supervisor/supervisord.log
pidfile=/var/run/supervisord.pid

[program:nginx]
command=/usr/sbin/nginx -g "daemon off;"
autostart=true
autorestart=true
stdout_logfile=/var/log/supervisor/nginx.log
stderr_logfile=/var/log/supervisor/nginx_error.log

[program:uvicorn]
command=uvicorn app.main:app --host 127.0.0.1 --port 8000
directory=/app
autostart=true
autorestart=true
stdout_logfile=/var/log/supervisor/uvicorn.log
stderr_logfile=/var/log/supervisor/uvicorn_error.log
environment=PORT=8000
EOF

# Expose port
EXPOSE 8080

# Set environment variables
ENV PORT=8080 \
    PYTHONUNBUFFERED=1 \
    UPLOAD_DIR=/app/uploads \
    OUTPUT_DIR=/app/outputs

# Start supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
