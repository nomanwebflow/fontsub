import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { FontMetadata } from '@/types/font';

interface FontPreviewProps {
  metadata: FontMetadata | FontMetadata[];
  fontDataUrl?: string;
}

export function FontPreview({ metadata, fontDataUrl }: FontPreviewProps) {
  // Handle both single and array of fonts
  const fonts = Array.isArray(metadata) ? metadata : [metadata];
  const primaryFont = fonts[0];
  const isMultiVariant = fonts.length > 1;
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Font Preview</CardTitle>
        <CardDescription>
          Font metadata and character set preview
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Font Metadata */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold">{primaryFont.family_name}</h3>
            {isMultiVariant ? (
              <p className="text-sm text-muted-foreground">
                {fonts.length} variants: {fonts.map(f => f.style_name).join(', ')}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {primaryFont.style_name}
              </p>
            )}
          </div>

          {isMultiVariant ? (
            // Show combined stats for multiple variants
            <div className="space-y-3">
              {fonts.map((font, index) => (
                <div key={index} className="border-l-2 border-primary/30 pl-4 space-y-2">
                  <h4 className="text-sm font-medium">{font.style_name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Format:</span>
                      <span className="ml-2 font-medium">{font.format.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">File Size:</span>
                      <span className="ml-2 font-medium">{formatFileSize(font.file_size)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Glyphs:</span>
                      <span className="ml-2 font-medium">{font.glyph_count}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Characters:</span>
                      <span className="ml-2 font-medium">{font.character_set.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Show stats for single variant
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Format:</span>
                <span className="ml-2 font-medium">{primaryFont.format.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">File Size:</span>
                <span className="ml-2 font-medium">{formatFileSize(primaryFont.file_size)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Glyphs:</span>
                <span className="ml-2 font-medium">{primaryFont.glyph_count}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Characters:</span>
                <span className="ml-2 font-medium">{primaryFont.character_set.length}</span>
              </div>
            </div>
          )}

          {primaryFont.designer && (
            <div className="text-sm">
              <span className="text-muted-foreground">Designer:</span>
              <span className="ml-2">{primaryFont.designer}</span>
            </div>
          )}

          {primaryFont.version && (
            <div className="text-sm">
              <span className="text-muted-foreground">Version:</span>
              <span className="ml-2">{primaryFont.version}</span>
            </div>
          )}
        </div>

        {/* Font Preview */}
        {fontDataUrl && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Preview Text</h4>
            <style>
              {`
                @font-face {
                  font-family: 'UploadedFont';
                  src: url('${fontDataUrl}');
                }
              `}
            </style>
            <div className="space-y-2">
              <p style={{ fontFamily: 'UploadedFont', fontSize: '36px' }}>
                The quick brown fox jumps over the lazy dog
              </p>
              <p style={{ fontFamily: 'UploadedFont', fontSize: '24px' }}>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
              </p>
              <p style={{ fontFamily: 'UploadedFont', fontSize: '24px' }}>
                abcdefghijklmnopqrstuvwxyz
              </p>
              <p style={{ fontFamily: 'UploadedFont', fontSize: '24px' }}>
                0123456789 !@#$%^&*()
              </p>
            </div>
          </div>
        )}

        {/* Character Set Preview */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Character Set Preview</h4>
          <div className="border rounded-lg p-4 max-h-48 overflow-auto">
            <div
              className="flex flex-wrap gap-1 text-lg leading-relaxed"
              style={fontDataUrl ? { fontFamily: 'UploadedFont' } : {}}
            >
              {primaryFont.character_set.slice(0, 200).map((char, index) => (
                <span
                  key={index}
                  className="hover:bg-accent hover:text-accent-foreground px-1 rounded cursor-default"
                  title={`U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`}
                >
                  {char}
                </span>
              ))}
              {primaryFont.character_set.length > 200 && (
                <span className="text-muted-foreground text-sm px-2">
                  +{primaryFont.character_set.length - 200} more
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
