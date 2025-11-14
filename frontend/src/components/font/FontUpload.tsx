import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileType, Loader2 } from 'lucide-react';
import { fontApi } from '@/api/fontApi';
import type { FontMetadata } from '@/types/font';
import { toast } from 'sonner';

interface FontUploadProps {
  onFontsUploaded: (metadata: FontMetadata[]) => void;
}

export function FontUpload({ onFontsUploaded }: FontUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);

    try {
      const count = acceptedFiles.length;
      toast.loading(`Uploading ${count} font${count > 1 ? 's' : ''}...`, { id: 'upload' });

      const uploadedFonts: FontMetadata[] = [];

      for (const file of acceptedFiles) {
        const metadata = await fontApi.uploadFont(file);
        uploadedFonts.push(metadata);
      }

      toast.success(`${count} font${count > 1 ? 's' : ''} uploaded successfully!`, { id: 'upload' });
      onFontsUploaded(uploadedFonts);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload fonts', { id: 'upload' });
    } finally {
      setIsUploading(false);
    }
  }, [onFontsUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'font/ttf': ['.ttf'],
      'font/otf': ['.otf'],
      'font/woff': ['.woff'],
      'font/woff2': ['.woff2'],
    },
    multiple: true,
    disabled: isUploading,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Fonts</CardTitle>
        <CardDescription>
          Upload one or more font files to begin. Supported formats: TTF, OTF, WOFF, WOFF2
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          role="button"
          tabIndex={0}
          aria-label="Upload font files. Drag and drop files here or click to select"
          aria-disabled={isUploading}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
          `}
        >
          <input {...getInputProps()} aria-label="Font file upload input" />

          <div className="flex flex-col items-center gap-4">
            {isUploading ? (
              <Loader2 className="h-12 w-12 animate-spin text-primary" aria-hidden="true" />
            ) : (
              <Upload className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
            )}

            <div className="space-y-2">
              <p className="text-lg font-medium" id="upload-instructions">
                {isDragActive ? 'Drop font files here' : 'Drag & drop font files here'}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse (multiple files supported)
              </p>
            </div>

            <Button variant="secondary" disabled={isUploading} tabIndex={-1} aria-hidden="true">
              <FileType className="mr-2 h-4 w-4" aria-hidden="true" />
              Select Font Files
            </Button>
          </div>
        </div>
        {isUploading && (
          <div role="status" aria-live="polite" className="sr-only">
            Uploading fonts, please wait...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
