import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { FontMetadata } from '@/types/font';
import { toast } from 'sonner';

interface CharacterSelectionProps {
  metadata: FontMetadata;
  onSelectionChange: (characters: string) => void;
  selectedCharacters: string;
}

// Default English character set
const getDefaultEnglishChars = () => {
  const chars: string[] = []
  // Basic Latin (U+0020-007E)
  for (let i = 0x0020; i <= 0x007E; i++) {
    chars.push(String.fromCharCode(i))
  }
  // Latin-1 Supplement (U+00A0-00FF)
  for (let i = 0x00A0; i <= 0x00FF; i++) {
    chars.push(String.fromCharCode(i))
  }
  // Additional characters
  chars.push(String.fromCharCode(0x0152, 0x0153, 0x0160, 0x0161, 0x0178, 0x017D, 0x017E))
  return chars.join('')
}

export function CharacterSelection({ metadata, onSelectionChange, selectedCharacters }: CharacterSelectionProps) {
  const [activePreset, setActivePreset] = useState<string>('default-english');

  const handleTextInputChange = (value: string) => {
    const uniqueChars = Array.from(new Set(value.split(''))).join('');
    onSelectionChange(uniqueChars);
    setActivePreset(''); // Clear active preset when manually editing
  };

  const selectPreset = (preset: string) => {
    let chars = '';

    switch (preset) {
      case 'default-english':
        chars = getDefaultEnglishChars();
        break;
      case 'alphanumeric':
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        break;
      case 'numbers':
        chars = '0123456789';
        break;
      case 'uppercase':
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        break;
      case 'lowercase':
        chars = 'abcdefghijklmnopqrstuvwxyz';
        break;
      case 'punctuation':
        chars = '.,;:!?"\'()[]{}/*-+=<>@#$%^&_|\\`~';
        break;
      case 'all':
        chars = metadata.character_set.join('');
        break;
      default:
        break;
    }

    // Filter to only include characters available in the font
    const availableChars = chars.split('').filter(c => metadata.character_set.includes(c)).join('');
    onSelectionChange(availableChars);
    setActivePreset(preset);
    toast.success(`Selected ${availableChars.length} characters from ${preset.replace('-', ' ')} preset`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Character Selection</CardTitle>
        <CardDescription>
          Select characters to include in your font subset
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Text Input Area */}
        <div className="space-y-2">
          <Label htmlFor="text-input">Enter text to generate subset</Label>
          <textarea
            id="text-input"
            className="w-full min-h-[200px] p-4 bg-slate-500 text-slate-100 border border-slate-700 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
            placeholder="Type or paste any text here. All unique characters will be included in your subset..."
            value={selectedCharacters}
            onChange={(e) => handleTextInputChange(e.target.value)}
            aria-describedby="character-count"
          />
          <p id="character-count" className="text-sm text-muted-foreground" role="status" aria-live="polite">
            {selectedCharacters.length} unique character{selectedCharacters.length !== 1 ? 's' : ''} selected
          </p>
        </div>

        {/* Preset Buttons */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Choose a preset character set</legend>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Character set presets">
            <Button
              variant={activePreset === 'default-english' ? 'default' : 'outline'}
              onClick={() => selectPreset('default-english')}
              className="text-sm"
              aria-pressed={activePreset === 'default-english'}
            >
              Default English
            </Button>
            <Button
              variant={activePreset === 'alphanumeric' ? 'default' : 'outline'}
              onClick={() => selectPreset('alphanumeric')}
              className="text-sm"
              aria-pressed={activePreset === 'alphanumeric'}
            >
              Alphanumeric
            </Button>
            <Button
              variant={activePreset === 'numbers' ? 'default' : 'outline'}
              onClick={() => selectPreset('numbers')}
              className="text-sm"
              aria-pressed={activePreset === 'numbers'}
            >
              Numbers Only
            </Button>
            <Button
              variant={activePreset === 'uppercase' ? 'default' : 'outline'}
              onClick={() => selectPreset('uppercase')}
              className="text-sm"
              aria-pressed={activePreset === 'uppercase'}
            >
              Uppercase
            </Button>
            <Button
              variant={activePreset === 'lowercase' ? 'default' : 'outline'}
              onClick={() => selectPreset('lowercase')}
              className="text-sm"
              aria-pressed={activePreset === 'lowercase'}
            >
              Lowercase
            </Button>
            <Button
              variant={activePreset === 'punctuation' ? 'default' : 'outline'}
              onClick={() => selectPreset('punctuation')}
              className="text-sm"
              aria-pressed={activePreset === 'punctuation'}
            >
              Punctuation
            </Button>
            <Button
              variant={activePreset === 'all' ? 'default' : 'outline'}
              onClick={() => selectPreset('all')}
              className="text-sm col-span-3"
              aria-pressed={activePreset === 'all'}
            >
              All Characters
            </Button>
          </div>
        </fieldset>

        {/* Selected Characters Preview */}
        {selectedCharacters && (
          <div className="space-y-2">
            <Label id="character-preview-label">Selected Characters Preview</Label>
            <div
              className="border rounded-lg p-3 max-h-32 overflow-auto bg-slate-50 dark:bg-slate-900"
              role="region"
              aria-labelledby="character-preview-label"
              aria-describedby="character-preview-desc"
            >
              <div className="flex flex-wrap gap-1">
                {Array.from(selectedCharacters).slice(0, 100).map((char, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded text-sm font-mono"
                    role="listitem"
                  >
                    {char === ' ' ? '␣' : char}
                  </span>
                ))}
                {selectedCharacters.length > 100 && (
                  <span className="text-muted-foreground text-sm px-2" id="character-preview-desc">
                    +{selectedCharacters.length - 100} more characters
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
