# Vocali

A modern voice interface platform built with React.js, TypeScript, Tailwind CSS, and Vite.

## 🚀 Features

- **React 19** with TypeScript for type safety
- **Tailwind CSS v4** for modern, responsive styling
- **Vite** for fast development and building
- **Modern UI** with beautiful gradients and animations
- **Hot Module Replacement (HMR)** for instant updates
- **Real-time Audio Recording** with live transcription using Speechmatics
- **Audio File Upload** with transcription processing
- **User Authentication** with Redux state management
- **Notifications** with Notiflix
- **Client-side Routing** with React Router DOM

## 🛠️ Tech Stack

- **Frontend**: React.js 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **State Management**: Redux Toolkit + React Redux
- **Real-time Transcription**: Speechmatics API (`@speechmatics/real-time-client`, `@speechmatics/real-time-client-react`)
- **Audio Input**: `@speechmatics/browser-audio-input`
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Notiflix
- **Routing**: React Router DOM

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vocali
```

2. Install dependencies:
```bash
pnpm install
```

## 🚀 Development

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Speechmatics Configuration
# Get your API key from: https://portal.speechmatics.com/
VITE_SPEECHMATICS_API_KEY=your_speechmatics_api_key_here
```

### Start Development Server

Start the development server:
```bash
pnpm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Build

Build for production:
```bash
pnpm run build
```

Preview the production build:
```bash
pnpm run preview
```

## 📁 Project Structure

```
VOCALI-INTERFACE/
│
├── my-app/
│ ├── node_modules/     # Installed dependencies
│ ├── public/           # Static files
│ │
│ ├── src/
│ │ ├── assets/         # Images, icons and static resources
│ │ ├── components/     # Reusable React components
│ │ ├── pages/          # Application pages
│ │ ├── redux/          # Redux store, slices and state logic
│ │ ├── services/       # API calls and external services
│ │ ├── types/          # TypeScript type definitions
│ │ │
│ │ ├── App.tsx         # Root React component
│ │ ├── main.tsx        # Application entry point
│ │ ├── index.css       # Global styles
│ │ └── vite-env.d.ts   # Vite TypeScript definitions
│ │
│ ├── .env              # Environment variables (not committed)
│ ├── .env.example      # Example environment variables
│ ├── .gitignore        # Git ignore rules
│ │
│ ├── index.html        # Main HTML template
│ ├── package.json      # Project dependencies and scripts
│ ├── pnpm-lock.yaml    # PNPM lock file
│ │
│ ├── tailwind.config.js # TailwindCSS configuration
│ ├── postcss.config.js # PostCSS configuration
│ ├── eslint.config.js # ESLint configuration
│ │
│ ├── tsconfig.json     # TypeScript configuration
│ ├── tsconfig.app.json
│ ├── tsconfig.node.json
│ │
│ └── vite.config.ts    # Vite configuration
│
└── README.md           # Project documentation
```
## 🎨 Customization

The project uses Tailwind CSS for styling. You can customize the design by:

1. Modifying `tailwind.config.js` for theme customization
2. Adding custom components in `src/components/`
3. Updating the main App component in `src/App.tsx`

## 📝 Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.