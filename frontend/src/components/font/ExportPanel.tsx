import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Download, FileType, Loader2 } from 'lucide-react';
import { fontApi } from '@/api/fontApi';
import { toast } from 'sonner';

interface ExportPanelProps {
  selectedCharacters: string;
  fontFamily: string;
}

export function ExportPanel({ selectedCharacters, fontFamily }: ExportPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fontNameSuffix, setFontNameSuffix] = useState('Subset');
  const [customFileName, setCustomFileName] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<Set<string>>(new Set(['woff2']));
  const [exportedFiles, setExportedFiles] = useState<Array<{ filename: string; format: string; size: number }>>([]);

  const formats = [
    { id: 'ttf', label: 'TTF', description: 'TrueType Font' },
    { id: 'woff', label: 'WOFF', description: 'Web Open Font Format' },
    { id: 'woff2', label: 'WOFF2', description: 'Web Open Font Format 2 (recommended)' },
  ];

  const toggleFormat = (formatId: string) => {
    const newFormats = new Set(selectedFormats);
    if (newFormats.has(formatId)) {
      newFormats.delete(formatId);
    } else {
      newFormats.add(formatId);
    }
    setSelectedFormats(newFormats);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleGenerate = async () => {
    if (!selectedCharacters || selectedCharacters.length === 0) {
      toast.error('Please select at least one character');
      return;
    }

    if (selectedFormats.size === 0) {
      toast.error('Please select at least one output format');
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    setExportedFiles([]);

    try {
      // Generate subset
      toast.loading('Generating subset...', { id: 'export' });
      setProgress(30);

      await fontApi.generateSubset(selectedCharacters, fontNameSuffix, customFileName || undefined);

      setProgress(60);

      // Export to selected formats
      toast.loading('Exporting font files...', { id: 'export' });

      const response = await fontApi.exportFont(Array.from(selectedFormats), customFileName || undefined);

      setProgress(100);
      setExportedFiles(response.files);

      toast.success(`Successfully exported ${response.files.length} file(s)!`, { id: 'export' });
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to export font', { id: 'export' });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleDownload = (filename: string) => {
    const url = fontApi.getDownloadUrl(filename);
    window.open(url, '_blank');
  };

  const handleDownloadAll = () => {
    const url = fontApi.getDownloadAllUrl();
    window.open(url, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate & Export</CardTitle>
        <CardDescription>
          Configure and export font subsets for all loaded fonts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Custom File Name */}
        <div className="space-y-2">
          <Label htmlFor="custom-filename">Custom File Name (Optional)</Label>
          <Input
            id="custom-filename"
            value={customFileName}
            onChange={(e) => setCustomFileName(e.target.value)}
            placeholder={`Leave empty for default: ${fontFamily}-${fontNameSuffix}`}
            disabled={isProcessing}
            aria-describedby="custom-filename-help"
          />
          <p id="custom-filename-help" className="text-xs text-muted-foreground">
            Enter a custom name for your font files (without extension)
          </p>
        </div>

        {/* Font Name Suffix */}
        <div className="space-y-2">
          <Label htmlFor="font-suffix">Font Name Suffix</Label>
          <Input
            id="font-suffix"
            value={fontNameSuffix}
            onChange={(e) => setFontNameSuffix(e.target.value)}
            placeholder="e.g., Subset, Custom"
            disabled={isProcessing}
            aria-describedby="font-suffix-help"
          />
          <p id="font-suffix-help" className="text-xs text-muted-foreground">
            Used when custom file name is not provided
          </p>
        </div>

        {/* Format Selection */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Output Formats</legend>
          <div className="grid gap-3" role="group" aria-label="Select output font formats">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => toggleFormat(format.id)}
                disabled={isProcessing}
                role="checkbox"
                aria-checked={selectedFormats.has(format.id)}
                aria-label={`${format.label} - ${format.description}`}
                className={`
                  flex items-start gap-3 p-4 border rounded-lg text-left transition-colors
                  ${selectedFormats.has(format.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                  }
                  ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div
                  className={`
                    mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center
                    ${selectedFormats.has(format.id)
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                    }
                  `}
                  aria-hidden="true"
                >
                  {selectedFormats.has(format.id) && (
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{format.label}</div>
                  <div className="text-sm text-muted-foreground">{format.description}</div>
                </div>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Selected Characters Info */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Selected Characters:</span>
              <span className="font-medium">{selectedCharacters.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Output Formats:</span>
              <span className="font-medium">{selectedFormats.size}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        {isProcessing && (
          <div className="space-y-2" role="status" aria-live="polite" aria-atomic="true">
            <Progress value={progress} className="h-2" aria-label={`Export progress: ${progress}%`} />
            <p className="text-sm text-center text-muted-foreground">
              Processing... {progress}%
            </p>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isProcessing || selectedCharacters.length === 0 || selectedFormats.size === 0}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FileType className="mr-2 h-4 w-4" />
              Generate Subset
            </>
          )}
        </Button>

        {/* Export Results */}
        {exportedFiles.length > 0 && (
          <div className="space-y-3 pt-4 border-t" role="region" aria-labelledby="exported-files-label">
            <div className="flex items-center justify-between">
              <Label id="exported-files-label">Exported Files ({exportedFiles.length})</Label>
              {exportedFiles.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadAll}
                  aria-label={`Download all ${exportedFiles.length} files`}
                >
                  <Download className="mr-2 h-3 w-3" aria-hidden="true" />
                  Download All
                </Button>
              )}
            </div>

            <ul className="space-y-2" role="list">
              {exportedFiles.map((file, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleDownload(file.filename)}
                    className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label={`Download ${file.filename}, ${file.format.toUpperCase()} format, ${formatFileSize(file.size)}`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{file.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.format.toUpperCase()} • {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Download className="h-4 w-4 flex-shrink-0 ml-2" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
