"""
Pydantic models for font-related data structures.
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict


class GlyphInfo(BaseModel):
    """Information about a single glyph"""
    unicode: Optional[int] = None
    name: str
    character: Optional[str] = None


class FontMetadata(BaseModel):
    """Metadata extracted from a font file"""
    session_id: Optional[str] = None
    file_path: Optional[str] = None
    family_name: str
    style_name: str
    full_name: str
    version: Optional[str] = None
    designer: Optional[str] = None
    description: Optional[str] = None
    glyph_count: int
    character_set: List[str] = Field(default_factory=list)
    glyphs: List[GlyphInfo] = Field(default_factory=list)
    file_size: int
    format: str


class SubsetRequest(BaseModel):
    """Request to create a font subset"""
    session_id: str
    characters: str = Field(..., description="Characters to include in subset")
    font_name_suffix: Optional[str] = Field(default="Subset", description="Suffix to add to font name")
    custom_font_name: Optional[str] = Field(default=None, description="Custom font filename (without extension)")
    unicode_ranges: Optional[List[str]] = Field(default=None, description="Unicode ranges to include")


class ExportRequest(BaseModel):
    """Request to export font in specific formats"""
    session_id: str
    formats: List[str] = Field(..., description="Output formats: ttf, woff, woff2")
    font_name: Optional[str] = Field(default=None, description="Custom font name")


class SubsetResponse(BaseModel):
    """Response after creating a subset"""
    status: str
    message: str
    subset_path: str
    character_count: int
    original_size: int
    subset_size: int
    compression_ratio: float


class ExportResponse(BaseModel):
    """Response after exporting font"""
    status: str
    message: str
    files: List[Dict[str, str]]
