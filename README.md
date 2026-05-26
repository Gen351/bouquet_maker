# Elegant 3D Bouquet Interactive Visualizer

An interactive floral bouquet customizer built with React, Vite, TypeScript, Tailwind CSS, and CSS-only botanical artwork. The app lets users personalize a 3D-style bouquet, edit symbolic flower letters, preview messages in themed modals, and copy a standalone HTML version of the customized bouquet.

## Project Overview

This project presents a decorative digital bouquet made from pure CSS shapes and dynamic layout logic. Users can hover over flowers, open individual message cards, change wrapping paper and ribbon styles, write a hanging note, and customize each interactive flower's title, message, and optional image URL.

The main experience is designed as a "Florist Crafting Office" where the left side displays the animated bouquet canvas and the right side contains all editing controls.

## Features

- Interactive CSS bouquet with tulips, sunflowers, daisies, leaves, stems, wrapping paper, ribbon, sparkles, and motion effects.
- Responsive bouquet scaling through a `ResizeObserver`-based canvas wrapper.
- Editable hanging note with a live character counter.
- Wrapping paper theme selector with multiple color palettes.
- Ribbon theme selector with satin-style color options.
- Botanical letter editor for six interactive flower nodes.
- Themed modal previews for tulip and sunflower messages.
- Optional custom image URL support for modal cover images.
- Copy-to-clipboard button that generates a standalone single-file HTML bouquet.
- Reset button for restoring the default bouquet configuration.
- Footer disclosure noting the AI-created nature of the project.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Lucide React icons
- CSS animations and CSS-generated artwork

## Folder Structure

```text
Flower_picker/
|-- assets/
|-- src/
|   |-- components/
|   |   |-- BouquetCanvas.tsx
|   |   |-- FlowerArt.tsx
|   |   `-- Modal.tsx
|   |-- App.tsx
|   |-- data.ts
|   |-- index.css
|   |-- main.tsx
|   `-- types.ts
|-- .env.example
|-- index.html
|-- metadata.json
|-- package.json
|-- tsconfig.json
|-- vite.config.ts
`-- README.md
```

## Getting Started

### Prerequisites

Install Node.js before running the project locally.

### Installation

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

The Vite dev server is configured to run on port `3000`.

Open the local URL shown in the terminal, usually:

```text
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

### Type Check

```bash
npm run lint
```

This runs TypeScript with `--noEmit`.

## Environment Variables

The `.env.example` file includes AI Studio-related variables:

```env
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"
```

The current bouquet visualizer UI is primarily client-side and does not require an API key for its main visual customization features. These variables are kept for compatibility with the original Google AI Studio app setup.

## Main Files

- `src/App.tsx` contains the main application state, editor controls, generated standalone HTML logic, and footer.
- `src/components/BouquetCanvas.tsx` renders the bouquet frame, wrapping paper, stems, ribbon, note card, and responsive scaling behavior.
- `src/components/FlowerArt.tsx` renders the individual CSS flowers and leaves.
- `src/components/Modal.tsx` displays the flower message preview dialog.
- `src/data.ts` stores bouquet layout data, flower message content, wrapping themes, and ribbon themes.
- `src/index.css` defines fonts, Tailwind import, animations, and custom texture styles.

## Credits

This project was generated and developed as an AI-assisted web application. The app footer also includes a disclosure card titled `P.S. - Crafted by AI`, stating that the experience was created by Google AI Studio's AI Coding Agent with Gemini intelligence.

## P.S.

P.S. This project is entirely made by AI, as stated in the footer of the app.

P.S.S. Human review is still recommended before using this as a production project, especially for accessibility, browser testing, and cleanup of generated text or encoded characters.