"""
Font Subsetting Backend API
FastAPI application for font processing and subsetting operations.
"""
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pathlib import Path
import os
import shutil
from typing import List, Optional
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from app.services.font_service import FontService
from app.models.font_models import FontMetadata, SubsetRequest, ExportRequest
from app.utils.session_manager import SessionManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Font Subsetting API",
    description="API for font subsetting and optimization",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
font_service = FontService()
session_manager = SessionManager()

# Ensure directories exist
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "./uploads"))
OUTPUT_DIR = Path(os.getenv("OUTPUT_DIR", "./outputs"))
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "Font Subsetting API is running"}


@app.post("/api/upload", response_model=FontMetadata)
async def upload_font(
    file: UploadFile = File(...),
    session_id: Optional[str] = Form(None)
):
    """
    Upload a font file and extract metadata.

    Args:
        file: Font file (.ttf, .otf, .woff, .woff2)
        session_id: Optional session ID for tracking

    Returns:
        FontMetadata with font information and glyph data
    """
    try:
        # Validate file type
        allowed_extensions = {".ttf", ".otf", ".woff", ".woff2"}
        file_ext = Path(file.filename).suffix.lower()

        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
            )

        # Create or get session
        if not session_id:
            session_id = session_manager.create_session()

        # Save uploaded file
        session_dir = UPLOAD_DIR / session_id
        session_dir.mkdir(exist_ok=True)

        file_path = session_dir / file.filename

        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract font metadata
        metadata = font_service.extract_metadata(str(file_path))
        metadata.session_id = session_id
        metadata.file_path = str(file_path)

        # Add metadata to session
        session_manager.add_font(session_id, metadata)

        logger.info(f"Font uploaded successfully: {file.filename} (session: {session_id})")

        return metadata

    except Exception as e:
        logger.error(f"Error uploading font: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/fonts/{session_id}", response_model=List[FontMetadata])
async def get_fonts(session_id: str):
    """
    Get all fonts in a session.

    Args:
        session_id: Session ID

    Returns:
        List of FontMetadata
    """
    try:
        fonts = session_manager.get_fonts(session_id)

        if not fonts:
            raise HTTPException(status_code=404, detail="No fonts found in session")

        return fonts

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting fonts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/subset")
async def generate_subset(request: SubsetRequest):
    """
    Generate subsets for all fonts in the session based on selected characters.

    Args:
        request: SubsetRequest with session_id, characters, and options

    Returns:
        Success message with subset info for all fonts
    """
    try:
        # Get all fonts from session
        fonts = session_manager.get_fonts(request.session_id)

        if not fonts:
            raise HTTPException(status_code=404, detail="No fonts found in session")

        # Create output directory for session
        output_dir = OUTPUT_DIR / request.session_id
        output_dir.mkdir(exist_ok=True)

        # Clear previous subset paths
        session_manager.clear_subset_paths(request.session_id)

        # Generate subset for each font
        subset_paths = []
        for metadata in fonts:
            subset_path = font_service.create_subset(
                font_path=metadata.file_path,
                characters=request.characters,
                output_dir=str(output_dir),
                font_name_suffix=request.font_name_suffix,
                custom_font_name=request.custom_font_name
            )
            subset_paths.append(subset_path)
            session_manager.add_subset_path(request.session_id, subset_path)

        logger.info(f"Generated {len(subset_paths)} subsets")

        return {
            "status": "success",
            "message": f"Generated {len(subset_paths)} subsets successfully",
            "subset_count": len(subset_paths),
            "character_count": len(request.characters)
        }

    except Exception as e:
        logger.error(f"Error generating subset: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/export")
async def export_font(request: ExportRequest):
    """
    Export all subset fonts in specified format(s).

    Args:
        request: ExportRequest with session_id and output formats

    Returns:
        Download links for all exported fonts
    """
    try:
        # Get all subset paths from session
        subset_paths = session_manager.get_subset_paths(request.session_id)

        if not subset_paths:
            raise HTTPException(status_code=404, detail="No subsets found for this session")

        # Convert each subset to requested formats
        all_output_files = []
        for subset_path in subset_paths:
            output_files = font_service.convert_formats(
                font_path=subset_path,
                formats=request.formats,
                output_dir=str(OUTPUT_DIR / request.session_id),
                custom_font_name=request.font_name
            )
            all_output_files.extend(output_files)

        logger.info(f"Exported {len(subset_paths)} fonts to formats: {request.formats}")

        return {
            "status": "success",
            "message": f"Exported {len(subset_paths)} fonts successfully",
            "files": all_output_files
        }

    except Exception as e:
        logger.error(f"Error exporting font: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/download/{session_id}/{filename}")
async def download_font(session_id: str, filename: str):
    """
    Download an exported font file.

    Args:
        session_id: Session ID
        filename: Font filename to download

    Returns:
        File download
    """
    try:
        file_path = OUTPUT_DIR / session_id / filename

        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")

        return FileResponse(
            path=str(file_path),
            filename=filename,
            media_type="application/octet-stream"
        )

    except Exception as e:
        logger.error(f"Error downloading font: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/session/{session_id}")
async def cleanup_session(session_id: str):
    """
    Clean up session data and temporary files.

    Args:
        session_id: Session ID to clean up

    Returns:
        Success message
    """
    try:
        # Clean up files
        session_upload_dir = UPLOAD_DIR / session_id
        session_output_dir = OUTPUT_DIR / session_id

        if session_upload_dir.exists():
            shutil.rmtree(session_upload_dir)

        if session_output_dir.exists():
            shutil.rmtree(session_output_dir)

        # Remove session data
        session_manager.cleanup_session(session_id)

        logger.info(f"Session cleaned up: {session_id}")

        return {"status": "success", "message": "Session cleaned up"}

    except Exception as e:
        logger.error(f"Error cleaning up session: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )
