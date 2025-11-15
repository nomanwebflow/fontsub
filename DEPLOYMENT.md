# Deployment Guide

This guide covers deploying the Font Subsetter application to production.

## Architecture

- **Frontend**: Static site (Cloudflare Pages, Vercel, or similar)
- **Backend**: Python FastAPI (Railway, Render, or similar)

## Backend Deployment (Railway)

### Step 1: Deploy to Railway

1. Install Railway CLI (if not already installed):
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Initialize Railway project:
   ```bash
   railway init
   ```

4. Link to your Railway project:
   ```bash
   railway link
   ```

### Step 2: Set Environment Variables

Set the production environment variables in Railway:

```bash
railway variables set CORS_ORIGINS=https://your-frontend-url.pages.dev
railway variables set UPLOAD_DIR=./uploads
railway variables set OUTPUT_DIR=./outputs
railway variables set MAX_FILE_SIZE=10485760
railway variables set HOST=0.0.0.0
railway variables set PORT=8001
railway variables set ENVIRONMENT=production
```

Or set them via the Railway dashboard:
- Go to your project > Variables
- Add each variable listed above

### Step 3: Deploy

```bash
railway up
```

### Step 4: Generate Domain

```bash
railway domain
```

This will generate a Railway domain like: `your-app.up.railway.app`

Copy this URL - you'll need it for the frontend configuration.

## Frontend Deployment (Cloudflare Pages)

### Step 1: Update Environment Variables

Update `frontend/.env.production` with your Railway backend URL:

```bash
VITE_API_URL=https://your-backend.up.railway.app
```

### Step 2: Build the Frontend

```bash
cd frontend
npm run build
```

### Step 3: Deploy to Cloudflare Pages

Option A - Using Wrangler CLI:
```bash
npm run deploy
```

Option B - Using Cloudflare Dashboard:
1. Go to Cloudflare Dashboard > Pages
2. Create a new project
3. Connect your Git repository
4. Set build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `frontend`
5. Add environment variable:
   - `VITE_API_URL`: Your Railway backend URL

## Update CORS Origins

After deploying the frontend, update the backend CORS settings:

```bash
railway variables set CORS_ORIGINS=https://your-frontend.pages.dev,https://your-custom-domain.com
```

## Verifying Deployment

1. Visit your frontend URL
2. Open browser DevTools > Network tab
3. Try uploading a font file
4. Check that API requests go to your Railway backend URL
5. Verify no CORS errors

## Custom Domains

### Frontend (Cloudflare Pages)
1. Go to Pages project > Custom domains
2. Add your domain
3. Update DNS records as instructed

### Backend (Railway)
1. Go to Railway project > Settings > Domains
2. Add custom domain
3. Update DNS records with provided CNAME

## Environment Variables Reference

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend.up.railway.app
```

### Backend (Railway Variables)
```env
HOST=0.0.0.0
PORT=8001
CORS_ORIGINS=https://your-frontend.pages.dev
UPLOAD_DIR=./uploads
OUTPUT_DIR=./outputs
MAX_FILE_SIZE=10485760
ENVIRONMENT=production
```

## Troubleshooting

### CORS Errors
- Ensure frontend URL is in `CORS_ORIGINS`
- Check both with and without trailing slash
- Include all domains (Cloudflare preview URLs, custom domains)

### Backend Not Starting
- Check Railway logs: `railway logs`
- Verify Python version in `runtime.txt`
- Ensure all dependencies in `requirements.txt`

### File Upload Issues
- Check `MAX_FILE_SIZE` setting
- Verify upload/output directories are writable
- Check Railway disk space limits

## Monitoring

### Railway
- View logs: `railway logs`
- View metrics: Railway Dashboard > Metrics
- Set up alerts: Railway Dashboard > Settings > Notifications

### Cloudflare Pages
- View deployment history: Pages Dashboard
- View analytics: Pages Dashboard > Analytics
- Check function logs (if using Pages Functions)
