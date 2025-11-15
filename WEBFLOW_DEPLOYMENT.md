# Deploying Font Subsetter to Webflow Cloud

This document provides instructions for deploying the Font Subsetter application to Webflow Cloud.

## Overview

Font Subsetter is now configured as a Next.js application with Edge Runtime support, making it compatible with Webflow Cloud deployment. The application uses:

- **Frontend**: Next.js 15 with App Router
- **Runtime**: Edge Runtime (Cloudflare Workers)
- **Backend**: Python FastAPI (deployed separately)
- **Styling**: Tailwind CSS with shadcn/ui components

## Architecture

The application is split into two parts:

1. **Frontend (Next.js)** - Deployed to Webflow Cloud
   - Static pages and client components
   - API routes with Edge runtime that proxy requests to the backend

2. **Backend (FastAPI)** - Deployed separately (e.g., on a VPS, cloud VM, or serverless platform)
   - Font processing with fontTools
   - File upload and session management

## Prerequisites

- A Webflow account with Cloud access
- A GitHub repository connected to Webflow
- Backend API deployed and accessible via HTTPS

## Webflow Cloud Configuration Files

The following configuration files have been set up for Webflow Cloud:

### `frontend/webflow.json`
```json
{
  "framework": "nextjs"
}
```

### `frontend/wrangler.jsonc`
```json
{
  "compatibility_date": "2025-04-01",
  "compatibility_flags": ["nodejs_compat"]
}
```

### `frontend/next.config.ts`
Configured for Webflow Cloud deployment with:
- Unoptimized images (for Edge runtime compatibility)
- TypeScript and ESLint error ignoring during build

## Environment Variables

### Required Environment Variables

Set the following environment variable in your Webflow Cloud project:

- `API_URL` - The URL of your deployed backend API (e.g., `https://api.example.com`)

**Important**: Environment variables in Webflow Cloud are injected at **runtime only**, not during the build process. The application is configured to handle this correctly.

### Setting Environment Variables in Webflow Cloud

1. Go to your Webflow Cloud project settings
2. Navigate to the Environment Variables section
3. Add the `API_URL` variable with your backend API URL
4. Save and redeploy

## Deployment Steps

### 1. Deploy the Backend

Before deploying to Webflow Cloud, ensure your FastAPI backend is deployed and accessible:

```bash
cd backend
# Follow your preferred deployment method for FastAPI
# Options: Railway, Render, DigitalOcean, AWS, etc.
```

Make note of the backend API URL (e.g., `https://your-backend.example.com`).

### 2. Connect GitHub to Webflow

1. Push your code to GitHub
2. In Webflow, go to your site dashboard
3. Navigate to Cloud settings
4. Connect your GitHub repository
5. Select the branch you want to deploy (e.g., `main` or `claude/webflow-cloud-deployment-...`)

### 3. Configure the Environment

1. In Webflow Cloud project settings, add environment variables:
   - `API_URL` = your backend URL (e.g., `https://your-backend.example.com`)

### 4. Deploy

Webflow Cloud will automatically:
1. Detect the Next.js framework from `webflow.json`
2. Install dependencies
3. Build the application
4. Deploy to Cloudflare Workers

The deployment will be available at a Webflow-provided URL or your custom domain.

## API Routes

All API routes are configured with Edge runtime and proxy requests to the backend:

- `/api/upload` - Upload font files
- `/api/subset` - Generate font subsets
- `/api/export` - Export fonts in different formats
- `/api/download/[sessionId]/[filename]` - Download generated fonts
- `/api/session/[sessionId]` - Delete session files

## Edge Runtime Compatibility

All API routes use `export const runtime = 'edge'` to ensure compatibility with Webflow Cloud's Edge runtime. This means:

- API routes run on Cloudflare Workers
- They have access to Edge runtime APIs
- They use `fetch` for HTTP requests (not axios or node-specific libraries)
- Environment variables are accessed via `process.env` at runtime

## Local Development

To run the application locally:

```bash
# Frontend (Next.js)
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000

# Backend (FastAPI)
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
# Runs on http://localhost:8001
```

Set the local environment variable:
```bash
# In frontend/.env.local
API_URL=http://localhost:8001
```

## Troubleshooting

### Build Failures

If the build fails in Webflow Cloud:

1. Check the build logs in Webflow Cloud dashboard
2. Ensure all environment variables are set correctly
3. Verify the backend API is accessible

### Runtime Errors

If you see errors at runtime:

1. Check the Webflow Cloud logs
2. Verify the `API_URL` environment variable is correct
3. Test API endpoints directly to ensure backend is responding
4. Check CORS settings in the backend

### Backend CORS Configuration

Ensure your FastAPI backend has CORS configured to accept requests from your Webflow Cloud domain:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-webflow-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Performance Considerations

- API routes run on Edge runtime for low latency
- Static pages are cached by Cloudflare CDN
- Font processing happens on the backend server
- Consider implementing caching for frequently used font subsets

## Monitoring

Monitor your deployment using:

1. Webflow Cloud dashboard for deployment status
2. Cloudflare Workers analytics for Edge runtime performance
3. Your backend server's monitoring tools for API performance

## Support

For Webflow Cloud-specific issues:
- Webflow Cloud Documentation: https://developers.webflow.com/webflow-cloud
- Webflow Help Center: https://help.webflow.com

For application-specific issues:
- Check the GitHub repository
- Review the main README.md file

## Security Notes

- Always use HTTPS for the backend API
- Keep environment variables secure
- Implement rate limiting on the backend
- Consider adding authentication for production use
- Regularly update dependencies for security patches

## Next Steps

After successful deployment:

1. Test all features thoroughly
2. Set up custom domain (if desired)
3. Configure analytics and monitoring
4. Implement error tracking (e.g., Sentry)
5. Set up CI/CD for automated deployments
6. Consider implementing caching strategies
