# Font Subsetter Frontend

React application for font subsetting with a beautiful UI built with shadcn/ui.

## Features

- Drag-and-drop font file upload
- Real-time font preview
- Interactive character selection
- Multiple export formats
- Dark/light mode toggle
- Toast notifications
- Responsive design

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast builds
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **React Dropzone** for file uploads
- **Sonner** for notifications

## Installation

```bash
npm install
```

## Configuration

Create `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npx tsc --noEmit
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── font/            # Font-specific components
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   ├── api/
│   │   └── fontApi.ts       # API client
│   ├── types/
│   │   └── font.ts          # TypeScript types
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Main component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/
├── components.json          # shadcn/ui config
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## Components

### FontUpload
Drag-and-drop component for uploading font files.

### FontPreview
Display font metadata and preview text rendering.

### CharacterSelection
Interactive component for selecting characters via:
- Text input
- Character grid
- Presets (alphanumeric, numbers, etc.)

### ExportPanel
Configure and export font subsets in multiple formats.

## shadcn/ui Components Used

- Button
- Card
- Tabs
- Dialog
- Progress
- Input
- Label
- Select
- Slider
- Sonner (Toast)

## Adding New Components

```bash
# Add a shadcn/ui component
npx shadcn@latest add [component-name]

# Example
npx shadcn@latest add badge
```

## Styling

The project uses Tailwind CSS with shadcn/ui theming:

- CSS variables for colors
- Dark mode support
- Custom radius and spacing

Edit `src/index.css` to customize the theme.

## API Integration

The frontend communicates with the Python backend via REST API.

See `src/api/fontApi.ts` for API client implementation.

## Building for Production

```bash
# Build
npm run build

# Output will be in dist/
# Serve with any static file server
npx serve dist
```

## Deployment

The built files can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

Make sure to set `VITE_API_URL` to your production backend URL.

## Troubleshooting

### Module not found errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
npx tsc --noEmit
```

### Build fails
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```
