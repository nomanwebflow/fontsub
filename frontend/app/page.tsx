'use client'

import { useState, useEffect, useMemo } from 'react'
import { FontUpload } from '@/components/font/FontUpload'
import { FontPreview } from '@/components/font/FontPreview'
import { CharacterSelection } from '@/components/font/CharacterSelection'
import { ExportPanel } from '@/components/font/ExportPanel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { FontMetadata } from '@/types/font'

interface FontFamily {
  familyName: string
  fonts: FontMetadata[]
}

// Default English character set (U+0020-007E, U+00A0-00FF, U+0152-0153, U+0160, U+0161, U+0178, U+017D-017E)
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

export default function Home() {
  const [fonts, setFonts] = useState<FontMetadata[]>([])
  const [selectedCharacters, setSelectedCharacters] = useState<string>('')

  // Set default English characters on mount
  useEffect(() => {
    setSelectedCharacters(getDefaultEnglishChars())
  }, [])

  const handleFontsUploaded = (newFonts: FontMetadata[]) => {
    setFonts(prevFonts => [...prevFonts, ...newFonts])
  }

  // Group fonts by family name
  const fontFamilies = useMemo(() => {
    const grouped = new Map<string, FontMetadata[]>()

    fonts.forEach(font => {
      const existing = grouped.get(font.family_name) || []
      existing.push(font)
      grouped.set(font.family_name, existing)
    })

    return Array.from(grouped.entries()).map(([familyName, fonts]) => ({
      familyName,
      fonts
    }))
  }, [fonts])

  // Count total font families
  const familyCount = fontFamilies.length
  const variantCount = fonts.length

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Font Subsetter</h1>
          <p className="text-muted-foreground">
            Upload, preview, and create optimized font subsets
            {familyCount > 0 && (
              <span className="ml-2 font-medium" aria-live="polite">
                ({familyCount} {familyCount === 1 ? 'family' : 'families'}
                {variantCount !== familyCount && `, ${variantCount} ${variantCount === 1 ? 'variant' : 'variants'}`})
              </span>
            )}
          </p>
        </header>

        <main id="main-content" className="space-y-6">
          {/* Upload Section */}
          <section aria-labelledby="upload-heading">
            <h2 id="upload-heading" className="sr-only">Upload Fonts</h2>
            <FontUpload onFontsUploaded={handleFontsUploaded} />
          </section>

          {/* Fonts Display */}
          {fontFamilies.length > 0 && (
            <>
              <section aria-labelledby="preview-heading">
                <h2 id="preview-heading" className="sr-only">Font Preview</h2>
                <Tabs defaultValue="0" className="w-full" aria-label="Font family tabs">
                  <TabsList
                    className="grid w-full"
                    style={{ gridTemplateColumns: `repeat(${Math.min(fontFamilies.length, 4)}, 1fr)` }}
                    role="tablist"
                  >
                    {fontFamilies.map((family, index) => (
                      <TabsTrigger
                        key={index}
                        value={String(index)}
                        aria-label={`${family.familyName}${family.fonts.length > 1 ? ` with ${family.fonts.length} variants` : ''}`}
                      >
                        {family.familyName}
                        {family.fonts.length > 1 && (
                          <span className="ml-1 text-xs opacity-70" aria-hidden="true">({family.fonts.length})</span>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {fontFamilies.map((family, index) => (
                    <TabsContent key={index} value={String(index)} className="space-y-6" role="tabpanel">
                      <FontPreview metadata={family.fonts} />
                    </TabsContent>
                  ))}
                </Tabs>
              </section>

              {/* Character Selection Section - applies to all fonts */}
              <section aria-labelledby="character-selection-heading">
                <h2 id="character-selection-heading" className="sr-only">Character Selection</h2>
                <CharacterSelection
                  metadata={fonts[0]}
                  selectedCharacters={selectedCharacters}
                  onSelectionChange={setSelectedCharacters}
                />
              </section>

              {/* Export Section - exports all fonts */}
              <section aria-labelledby="export-heading">
                <h2 id="export-heading" className="sr-only">Generate and Export</h2>
                <ExportPanel
                  selectedCharacters={selectedCharacters}
                  fontFamily={fontFamilies.map(f => f.familyName).join(', ')}
                />
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
