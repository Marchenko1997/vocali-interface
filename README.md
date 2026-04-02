# Vocali

A modern voice interface platform built with React.js, TypeScript, Tailwind CSS, and Vite.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **State Management**: Redux Toolkit + React Redux
- **Real-time Transcription**: Speechmatics API
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Notiflix
- **Routing**: React Router DOM

## Installation

```bash
git clone <repository-url>
cd vocali-interface
pnpm install
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_SPEECHMATICS_API_KEY=your_key_here
```

## Development

```bash
pnpm run dev
```

The app runs at `http://localhost:3000`.

## Build

```bash
pnpm run build
pnpm run preview
```

## Project Structure

```
vocali-interface/
  public/            Static files
  src/
    assets/          Images, icons, static resources
    components/      Reusable React components
    hooks/           Custom React hooks
    pages/           Application pages
    redux/           Redux store, slices
    services/        API calls, external services
    types/           TypeScript type definitions
    App.tsx          Root component
    main.tsx         Entry point
    index.css        Global styles
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  tailwind.config.js
```

## Scripts

- `pnpm run dev` - Development server
- `pnpm run build` - Production build
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint
