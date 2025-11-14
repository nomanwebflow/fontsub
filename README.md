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
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

## Environment Variables

### Frontend
- `VITE_API_URL`: Backend API URL

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
