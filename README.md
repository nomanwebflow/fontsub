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
- Next.js 15 + TypeScript
- React with App Router
- Tailwind CSS
- shadcn/ui components
- Switzer font
- Edge Runtime support for Webflow Cloud

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
npm run dev  # Runs on http://localhost:3000
```

Create a `.env.local` file in the frontend directory:
```bash
API_URL=http://localhost:8000
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

## Deployment

### Webflow Cloud

This application is configured for deployment to Webflow Cloud with Next.js and Edge Runtime support.

**See [WEBFLOW_DEPLOYMENT.md](./WEBFLOW_DEPLOYMENT.md) for detailed deployment instructions.**

Quick deployment checklist:
1. Deploy the FastAPI backend to your preferred hosting provider
2. Connect your GitHub repository to Webflow Cloud
3. Set the `API_URL` environment variable in Webflow Cloud
4. Webflow Cloud will automatically detect and deploy the Next.js app

## Environment Variables

### Frontend
- `API_URL`: Backend API URL (injected at runtime in Webflow Cloud)

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

API documentation is available at `/docs` endpoint when running the backend server.

## License

MIT
