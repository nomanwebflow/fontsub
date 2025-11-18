# SubsetFonts Deployment Guide

This document provides step-by-step instructions for deploying SubsetFonts to Google Cloud Run.

## Architecture

SubsetFonts consists of two services deployed to Google Cloud Run:

1. **Backend Service** (`fontsub`) - Python FastAPI backend
2. **Frontend Service** (`fontsub-frontend`) - React app served via Nginx

## Prerequisites

- Google Cloud SDK (`gcloud`) installed and configured
- Docker installed (if building locally)
- Access to the GCP project: `fontsubset-478311`
- Authenticated with Google Cloud: `gcloud auth login`

## Deployment

### Deploy Frontend

The frontend is built using Docker and deployed to Cloud Run.

```bash
# Navigate to the frontend directory
cd frontend

# Deploy to Cloud Run (builds and deploys in one command)
gcloud run deploy fontsub-frontend \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --platform managed \
  --port 8080

# The deployment process will:
# 1. Build the Docker image using the Dockerfile
# 2. Push to Google Container Registry
# 3. Deploy to Cloud Run
# 4. Return the service URL
```

**Service URL:** https://fontsub-frontend-1010835317622.europe-west1.run.app

### Deploy Backend

```bash
# Navigate to the backend directory
cd backend

# Deploy to Cloud Run
gcloud run deploy fontsub \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --platform managed \
  --port 8080

# Add any required environment variables with --set-env-vars if needed
```

**Service URL:** https://fontsub-1010835317622.europe-west1.run.app

## Configuration Files

### Frontend Dockerfile

Location: `frontend/Dockerfile`

Multi-stage build that:
1. Builds the React app with Node.js
2. Serves static files with Nginx

The API URL is hardcoded in the Dockerfile:
```dockerfile
RUN VITE_API_URL=https://fontsub-1010835317622.europe-west1.run.app npm run build
```

### Nginx Configuration

Location: `frontend/nginx.conf`

Includes:
- Gzip compression
- Security headers
- Cache control for static assets
- SPA routing with `try_files`

## Custom Domain

The service is accessible via the custom domain: **https://subsetfonts.com/**

To update the custom domain mapping, use the GCP Console or Cloud Run domain mapping commands.

## Deployment Checklist

Before deploying, ensure:

- [ ] All code changes are committed to git
- [ ] Environment variables are configured (if needed)
- [ ] API URLs are correct in the frontend Dockerfile
- [ ] You're authenticated with GCP: `gcloud auth login`
- [ ] You're using the correct project: `gcloud config set project fontsubset-478311`

After deployment:

- [ ] Test the service URL returned by the deployment
- [ ] Verify the custom domain (subsetfonts.com) is working
- [ ] Check Cloud Run logs for any errors: `gcloud run logs read fontsub-frontend --region europe-west1`

## Quick Reference Commands

```bash
# List all Cloud Run services
gcloud run services list --region=europe-west1

# View service details
gcloud run services describe fontsub-frontend --region=europe-west1

# View logs
gcloud run logs read fontsub-frontend --region=europe-west1 --limit=50

# View real-time logs
gcloud run logs tail fontsub-frontend --region=europe-west1

# Rollback to previous revision
gcloud run services update-traffic fontsub-frontend \
  --to-revisions=REVISION_NAME=100 \
  --region=europe-west1

# Delete a service
gcloud run services delete SERVICE_NAME --region=europe-west1
```

## Troubleshooting

### Build Failures

If the build fails:
1. Check the Dockerfile syntax
2. Verify all dependencies are in package.json
3. Check build logs in Cloud Build console

### Service Not Accessible

If the service is deployed but not accessible:
1. Check if `--allow-unauthenticated` flag was used
2. Verify the service URL from `gcloud run services list`
3. Check Cloud Run logs for runtime errors

### Domain Issues

If the custom domain is not working:
1. Verify domain mapping in GCP Console > Cloud Run > Manage Custom Domains
2. Check DNS records point to the Cloud Run service
3. Allow time for DNS propagation (up to 48 hours)

## Cost Management

Cloud Run charges based on:
- CPU and memory usage during request processing
- Number of requests
- Network egress

Free tier includes:
- 2 million requests per month
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds of compute time

Monitor costs in the GCP Console > Billing.

## CI/CD (Future Enhancement)

Consider setting up GitHub Actions or Cloud Build triggers for automatic deployments on git push to main branch.

Example Cloud Build trigger:
```yaml
steps:
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'fontsub-frontend'
      - '--source=frontend'
      - '--region=europe-west1'
      - '--allow-unauthenticated'
```
