export function SeoContent() {
  return (
    <section className="mt-16 space-y-8 text-foreground">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-3xl font-bold mb-4">What is Font Subsetting?</h2>

        <p className="text-lg mb-6 leading-relaxed">
          Font subsetting is a crucial web performance optimization technique that creates smaller font files by including only the characters you actually need. Instead of loading an entire font family with thousands of glyphs, you can reduce file sizes by 70-90% for faster page loads.
        </p>

        <h3 className="text-2xl font-semibold mb-3 mt-8">Why Use SubsetFonts?</h3>
        <ul className="list-disc pl-6 mb-6 space-y-3">
          <li className="leading-relaxed">
            <strong>Faster Website Loading:</strong> Smaller font files mean faster page load times and better Core Web Vitals scores
          </li>
          <li className="leading-relaxed">
            <strong>Reduced Bandwidth:</strong> Save on hosting costs and improve mobile experience with lighter assets
          </li>
          <li className="leading-relaxed">
            <strong>Better SEO Rankings:</strong> Google rewards fast-loading websites with higher search rankings
          </li>
          <li className="leading-relaxed">
            <strong>Improved User Experience:</strong> Visitors see content faster, reducing bounce rates
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mb-3 mt-8">Supported Font Formats</h3>
        <p className="mb-4">SubsetFonts supports all major web font formats:</p>
        <ul className="list-disc pl-6 mb-6 space-y-3">
          <li className="leading-relaxed">
            <strong>TTF (TrueType Font):</strong> Universal format supported by all browsers
          </li>
          <li className="leading-relaxed">
            <strong>OTF (OpenType Font):</strong> Modern format with advanced typography features
          </li>
          <li className="leading-relaxed">
            <strong>WOFF (Web Open Font Format):</strong> Compressed format designed for the web
          </li>
          <li className="leading-relaxed">
            <strong>WOFF2:</strong> Next-gen format with even better compression (up to 30% smaller)
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mb-3 mt-8">How to Create a Font Subset</h3>
        <ol className="list-decimal pl-6 mb-6 space-y-3">
          <li className="leading-relaxed">
            Upload your TTF, OTF, or WOFF font files using the drag-and-drop interface
          </li>
          <li className="leading-relaxed">
            Preview font metadata and available characters
          </li>
          <li className="leading-relaxed">
            Select the characters you need (presets available for English, numbers, etc.)
          </li>
          <li className="leading-relaxed">
            Choose your export format and download the optimized font subset
          </li>
        </ol>

        <h3 className="text-2xl font-semibold mb-3 mt-8">Free Font Optimization Tool</h3>
        <p className="mb-6 leading-relaxed">
          Unlike other font subsetting tools that require subscriptions or have file limits, our tool is completely free with no restrictions. Process unlimited fonts, export to any format, and optimize your web fonts without signing up or sharing personal information.
        </p>

        <h3 className="text-2xl font-semibold mb-3 mt-8">Technical Features</h3>
        <ul className="list-disc pl-6 mb-6 space-y-3">
          <li className="leading-relaxed">
            Built with fontTools (industry-standard Python library)
          </li>
          <li className="leading-relaxed">
            Client-side and server-side processing for maximum security
          </li>
          <li className="leading-relaxed">
            Preserves font hinting and OpenType features
          </li>
          <li className="leading-relaxed">
            Batch processing for multiple font variants
          </li>
          <li className="leading-relaxed">
            Unicode character selection with preview
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mb-3 mt-8">Frequently Asked Questions</h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-semibold mb-2">Is SubsetFonts really free?</h4>
            <p className="leading-relaxed">
              Yes! SubsetFonts is 100% free to use. There are no hidden costs, file size limits, or required subscriptions. You can process unlimited fonts and download as many optimized subsets as you need.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-2">What's the difference between TTF, WOFF, and WOFF2?</h4>
            <p className="leading-relaxed">
              TTF (TrueType) and OTF (OpenType) are the original font formats. WOFF is a compressed version designed specifically for web use, offering about 40% file size reduction. WOFF2 is the latest format with even better compression, reducing file sizes by up to 30% more than WOFF.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-2">How much can I reduce my font file size?</h4>
            <p className="leading-relaxed">
              Depending on your character selection, you can typically reduce font file sizes by 70-90%. For example, if you only need English characters instead of the full Unicode range, your font file could shrink from 200KB to just 20-30KB.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-2">Will subsetting affect font quality?</h4>
            <p className="leading-relaxed">
              No! Font subsetting only removes unused characters. The glyphs you include maintain their original quality, hinting, and OpenType features. Your optimized font will look identical to the original.
            </p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Learn More About Web Font Optimization</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="https://web.dev/font-best-practices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Web.dev - Font Best Practices
              </a>
            </li>
            <li>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                MDN Web Docs - @font-face
              </a>
            </li>
            <li>
              <a
                href="https://fonttools.readthedocs.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                fontTools Documentation
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
