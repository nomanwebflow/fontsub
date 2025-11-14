export interface GlyphInfo {
  unicode: number | null;
  name: string;
  character: string | null;
}

export interface FontMetadata {
  session_id?: string;
  file_path?: string;
  family_name: string;
  style_name: string;
  full_name: string;
  version?: string;
  designer?: string;
  description?: string;
  glyph_count: number;
  character_set: string[];
  glyphs: GlyphInfo[];
  file_size: number;
  format: string;
}

export interface SubsetRequest {
  session_id: string;
  characters: string;
  font_name_suffix?: string;
  custom_font_name?: string;
  unicode_ranges?: string[];
}

export interface ExportRequest {
  session_id: string;
  formats: string[];
  font_name?: string;
}

export interface SubsetResponse {
  status: string;
  message: string;
  subset_path: string;
  character_count: number;
}

export interface ExportResponse {
  status: string;
  message: string;
  files: Array<{
    filename: string;
    format: string;
    size: number;
    path: string;
  }>;
}
