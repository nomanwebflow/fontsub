# Font Subsetter

A web application for creating optimized font subsets with custom character sets.

## Features

- Upload font files (TTF, OTF, WOFF, WOFF2)
- Preview font metadata and character sets
- Select specific characters for subsetting
- Preset character sets (Default English, Alphanumeric, etc.)
- Custom filename support
- Export to multiple formats (TTF, WOFF, WOFF2)
- Optimized subsetting with fontTools

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Switzer font

### Backend
- Python FastAPI
- fontTools for font manipulation
- Session-based file management

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.9+

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
# Runs on http://localhost:8001
```

## Deployment to Cloudflare

### Step 1: Install Wrangler CLI
```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare
```bash
wrangler login
```

### Step 3: Deploy Frontend to Cloudflare Pages

```bash
cd frontend
npm run deploy
```

Or manually:
```bash
cd frontend
npm run build
wrangler pages deploy dist --project-name=font-subsetter
```

### Step 4: Deploy Backend

**Option A: Use a Python-compatible platform**
- Railway: https://railway.app
- Fly.io: https://fly.io  
- Render: https://render.com

**Option B: Convert to Cloudflare Workers (TypeScript)**
The Python backend would need to be rewritten in TypeScript for Workers.

### Step 5: Update Environment Variables

Update `frontend/.env.production` with your deployed backend URL:
```env
VITE_API_URL=https://your-backend-url.com
```

Then rebuild and redeploy the frontend.

## Environment Variables

### Frontend
- `VITE_API_URL`: Backend API URL (default: http://localhost:8001)

### Backend
- `CORS_ORIGINS`: Allowed CORS origins (comma-separated)
- `UPLOAD_DIR`: Directory for uploaded files
- `OUTPUT_DIR`: Directory for output files

## Font Subsetting Options

The application uses the following fontTools options:
- `--layout-features='*'` - Keep all layout features
- `--unicodes='U+0020-007E,U+00A0-00FF,U+0152-0153,U+0160,U+0161,U+0178,U+017D-017E'` - Default English
- `--no-hinting` - Remove hinting for smaller file sizes
- `--glyph-names` - Keep glyph names
- `--symbol-cmap` - Keep symbol cmap
- `--legacy-cmap` - Keep legacy cmap
- `--notdef-glyph` - Keep .notdef glyph
- `--notdef-outline` - Keep .notdef outline
- `--recommended-glyphs` - Keep recommended glyphs
- `--drop-tables+=GSUB,GPOS` - Drop complex layout tables

## API Documentation

API documentation available at:
- Local: http://localhost:8001/docs
- Production: https://your-api-url.com/docs

## CI/CD with GitHub Actions

The repository includes a GitHub Actions workflow for automatic deployment.

Set these secrets in your GitHub repository settings:
- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID  
- `VITE_API_URL`: Your backend API URL

## License

MIT
