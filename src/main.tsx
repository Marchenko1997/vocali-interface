import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { MoodProvider } from './context/MoodContext.tsx'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MoodProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MoodProvider>
  </StrictMode>,
);
