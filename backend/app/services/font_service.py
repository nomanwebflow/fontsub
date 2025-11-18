"""
Font service for font manipulation using fontTools.
"""
from fontTools.ttLib import TTFont
from fontTools import subset
from pathlib import Path
import os
from typing import List, Dict, Optional
import logging

import zipfile
from app.models.font_models import FontMetadata, GlyphInfo

logger = logging.getLogger(__name__)


class FontService:
    """Service for font processing operations"""

    def create_zip_archive(self, file_paths: List[str], session_id: str, font_name: Optional[str] = None) -> Optional[str]:
        """
        Create a zip archive from a list of files.
        Args:
            file_paths: List of paths to the files to be zipped
            session_id: The session ID, used for naming the output zip file
            font_name: Optional font family name for cleaner zip filename
        Returns:
            Path to the created zip archive, or None if no files were provided
        """
        if not file_paths:
            return None

        output_dir = Path(file_paths[0]).parent

        # Create a clean zip filename based on font name
        if font_name:
            # Clean the font name to be filesystem-safe
            clean_name = "".join(c if c.isalnum() or c in ('-', '_') else '-' for c in font_name)
            clean_name = clean_name.strip('-').lower()
            zip_filename = f"{clean_name}-subset.zip"
        else:
            zip_filename = "font-subsets.zip"

        zip_filepath = output_dir / zip_filename

        try:
            with zipfile.ZipFile(zip_filepath, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for file_path in file_paths:
                    p = Path(file_path)
                    if p.exists() and p.is_file():
                        zipf.write(file_path, p.name)
            return str(zip_filepath)
        except Exception as e:
            logger.error(f"Error creating zip archive: {str(e)}")
            return None

    def extract_metadata(self, font_path: str) -> FontMetadata:
        """
        Extract metadata from a font file.

        Args:
            font_path: Path to the font file

        Returns:
            FontMetadata object with font information
        """
        try:
            font = TTFont(font_path)

            # Get name table
            name_table = font['name']

            # Extract basic metadata
            family_name = self._get_name_record(name_table, 1) or "Unknown"
            style_name = self._get_name_record(name_table, 2) or "Regular"
            full_name = self._get_name_record(name_table, 4) or family_name
            version = self._get_name_record(name_table, 5) or "Unknown"
            designer = self._get_name_record(name_table, 9) or None
            description = self._get_name_record(name_table, 10) or None

            # Get character set
            character_set = []
            glyphs = []

            if 'cmap' in font:
                for table in font['cmap'].tables:
                    if table.isUnicode():
                        for code_point, glyph_name in table.cmap.items():
                            try:
                                char = chr(code_point)
                                character_set.append(char)
                                glyphs.append(GlyphInfo(
                                    unicode=code_point,
                                    name=glyph_name,
                                    character=char
                                ))
                            except ValueError:
                                pass

            # Remove duplicates and sort
            character_set = sorted(list(set(character_set)))

            # Get file info
            file_size = os.path.getsize(font_path)
            file_ext = Path(font_path).suffix.lower()

            font.close()

            return FontMetadata(
                family_name=family_name,
                style_name=style_name,
                full_name=full_name,
                version=version,
                designer=designer,
                description=description,
                glyph_count=len(glyphs),
                character_set=character_set,
                glyphs=glyphs,
                file_size=file_size,
                format=file_ext
            )

        except Exception as e:
            logger.error(f"Error extracting metadata: {str(e)}")
            raise

    def create_subset(
        self,
        font_path: str,
        characters: str,
        output_dir: str,
        font_name_suffix: str = "Subset",
        custom_font_name: Optional[str] = None
    ) -> str:
        """
        Create a subset of the font containing only specified characters.

        Args:
            font_path: Path to the original font file
            characters: String of characters to include in subset
            output_dir: Directory to save the subset font
            font_name_suffix: Suffix to add to the output filename
            custom_font_name: Custom font filename (without extension)

        Returns:
            Path to the subset font file
        """
        try:
            # Load font
            font = TTFont(font_path)

            # Get unique characters
            unique_chars = set(characters)

            # Convert characters to Unicode code points
            unicodes = [ord(char) for char in unique_chars]

            # Create output filename
            input_path = Path(font_path)
            if custom_font_name:
                # Use custom name if provided
                output_filename = f"{custom_font_name}{input_path.suffix}"
            else:
                # Use default naming with suffix
                output_filename = f"{input_path.stem}-{font_name_suffix}{input_path.suffix}"
            output_path = Path(output_dir) / output_filename

            # Create subsetter
            subsetter = subset.Subsetter()

            # Configure subsetter options (matching fonttools best practices)
            subsetter.options.name_IDs = ['*']
            subsetter.options.name_legacy = True
            subsetter.options.name_languages = ['*']
            subsetter.options.layout_features = ['*']  # Keep all layout features
            subsetter.options.no_hinting = True  # Remove hinting for smaller file size
            subsetter.options.glyph_names = True  # Keep glyph names
            subsetter.options.symbol_cmap = True  # Keep symbol cmap
            subsetter.options.legacy_cmap = True  # Keep legacy cmap
            subsetter.options.notdef_glyph = True  # Keep .notdef glyph
            subsetter.options.notdef_outline = True  # Keep .notdef outline
            subsetter.options.recommended_glyphs = True  # Keep recommended glyphs
            subsetter.options.drop_tables += ['GSUB', 'GPOS']  # Drop complex layout tables

            # Populate subset with unicodes
            subsetter.populate(unicodes=unicodes)

            # Subset the font
            subsetter.subset(font)

            # Save subset font
            font.save(str(output_path))
            font.close()

            logger.info(f"Created subset: {output_path}")

            return str(output_path)

        except Exception as e:
            logger.error(f"Error creating subset: {str(e)}")
            raise

    def convert_formats(
        self,
        font_path: str,
        formats: List[str],
        output_dir: str,
        custom_font_name: Optional[str] = None
    ) -> List[Dict[str, str]]:
        """
        Convert font to specified formats.

        Args:
            font_path: Path to the font file
            formats: List of output formats (ttf, woff, woff2)
            output_dir: Directory to save converted fonts
            custom_font_name: Optional custom filename (without extension)

        Returns:
            List of output file information
        """
        try:
            font = TTFont(font_path)
            input_path = Path(font_path)
            output_files = []

            for format_type in formats:
                format_type = format_type.lower().strip('.')

                if format_type not in ['ttf', 'woff', 'woff2']:
                    logger.warning(f"Unsupported format: {format_type}")
                    continue

                # Use custom name if provided, otherwise use the input filename
                base_name = custom_font_name if custom_font_name else input_path.stem
                output_filename = f"{base_name}.{format_type}"
                output_path = Path(output_dir) / output_filename

                # Save in the specified format
                if format_type == 'woff':
                    font.flavor = 'woff'
                elif format_type == 'woff2':
                    font.flavor = 'woff2'
                else:
                    font.flavor = None

                font.save(str(output_path))

                file_size = os.path.getsize(output_path)

                output_files.append({
                    "filename": output_filename,
                    "format": format_type,
                    "size": file_size,
                    "path": str(output_path)
                })

                logger.info(f"Converted to {format_type}: {output_path}")

            font.close()

            return output_files

        except Exception as e:
            logger.error(f"Error converting formats: {str(e)}")
            raise

    def _get_name_record(self, name_table, name_id: int) -> Optional[str]:
        """
        Get a name record from the name table.

        Args:
            name_table: Font name table
            name_id: Name ID to retrieve

        Returns:
            Name string or None
        """
        try:
            record = name_table.getName(name_id, 3, 1, 0x409)  # Windows, Unicode, English
            if record:
                return record.toUnicode()

            record = name_table.getName(name_id, 1, 0, 0)  # Mac, Roman, English
            if record:
                return record.toUnicode()

            return None

        except Exception:
            return None
