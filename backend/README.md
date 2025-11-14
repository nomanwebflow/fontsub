# Font Subsetter Backend

Python FastAPI backend for font processing and subsetting operations.

## Features

- Font file upload and validation
- Metadata extraction using fontTools
- Font subsetting based on character selection
- Multi-format export (TTF, WOFF, WOFF2)
- Session management for tracking operations
- RESTful API with automatic documentation

## API Documentation

When the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Installation

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
```

## Configuration

Edit `.env` file:

```env
HOST=0.0.0.0
PORT=8000
UPLOAD_DIR=./uploads
OUTPUT_DIR=./outputs
MAX_FILE_SIZE=10485760  # 10MB
CORS_ORIGINS=http://localhost:5173
```

## Running

```bash
# Using the start script
./start.sh

# Or manually
source venv/bin/activate
python -m app.main
```

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── models/
│   │   └── font_models.py   # Pydantic models
│   ├── services/
│   │   └── font_service.py  # Font processing logic
│   └── utils/
│       └── session_manager.py  # Session handling
├── requirements.txt
├── .env.example
└── README.md
```

## API Endpoints

### Upload Font
```http
POST /api/upload
Content-Type: multipart/form-data
```

### Generate Subset
```http
POST /api/subset
Content-Type: application/json
```

### Export Font
```http
POST /api/export
Content-Type: application/json
```

### Download Font
```http
GET /api/download/{session_id}/{filename}
```

### Cleanup Session
```http
DELETE /api/session/{session_id}
```

## Development

```bash
# Install dev dependencies
pip install -r requirements.txt

# Run with auto-reload
python -m app.main

# Run tests (if available)
pytest
```

## Dependencies

- **FastAPI**: Modern web framework
- **fontTools**: Font manipulation library
- **python-multipart**: File upload support
- **brotli**: WOFF2 compression
- **uvicorn**: ASGI server

## Troubleshooting

### ImportError: No module named 'fontTools'
```bash
pip install fonttools[woff,unicode]
```

### Port already in use
Change `PORT` in `.env` file or:
```bash
PORT=8001 python -m app.main
```

### Permission denied on uploads/
```bash
mkdir -p uploads outputs
chmod 755 uploads outputs
```
