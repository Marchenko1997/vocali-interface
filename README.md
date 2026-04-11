# Vocali

A voice-controlled audio platform with real-time transcription, Spotify integration, and multilingual voice commands. Built with React 19 and a FastAPI backend.

## Features

- **Real-time recording** with live transcription via Speechmatics WebSocket API
- **Spotify integration** — search, play, and browse tracks with infinite scroll
- **Favorites** — save and manage favorite Spotify tracks
- **Voice commands** — control playback, recording, favorites, and AI playlist generation hands-free (EN/RU/UK)
- **Audio file management** — upload, playback with waveform visualization, download transcriptions
- **Auth** — login, register, password reset with JWT tokens

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| State | Redux Toolkit |
| Transcription | Speechmatics real-time API (WebSocket) |
| Music | Spotify API (via FastAPI backend) |
| Audio | WaveSurfer.js, Web Audio API |
| Backend | FastAPI (separate repo) |

## Voice Commands

Voice control supports **English**, **Russian**, and **Ukrainian**. Toggle the microphone icon in the header to activate.

| Action | EN | RU | UK |
|--------|----|----|-----|
| Play track | `play <query>` | `играй / включи <query>` | `грай / увімкни <query>` |
| Pause | `pause / stop` | `пауза / стоп` | `зупини` |
| Next track | `next` | `следующий / далее` | `наступний / далі` |
| Previous | `previous / back` | `назад / предыдущий` | `попередній` |
| Favorite | `favorite` | `в избранное` | `до улюблених` |
| Record | `start recording / stop recording` | `начать запись / остановить запись` | `почати запис / зупинити запис` |
| Create playlist | `create <desc> playlist for <duration>` | `создай плейлист` | `зроби плейлист` |

### AI Playlist Generation

Voice commands can generate full playlists via AI. Say something like:

- "create jazz playlist for 30 minutes"
- "create chill playlist music for 2 hours"

The command is captured via the Web Speech API and matched by `PLAYLIST_REGEX` in `useVoiceCommands.ts`. The prompt is sent to `POST /ai/playlist` on the backend, which uses OpenRouter AI (`openai/gpt-oss-120b`) to parse the intent — extracting genre, BPM hint, duration, and number of tracks needed. Real tracks are then fetched from Spotify via `GET /spotify/search`. The resulting queue is displayed in the SpotifyPanel under the label **"AI Playlist · N tracks"**.

## Setup

```bash
git clone <repository-url>
cd vocali-interface
pnpm install
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_SPEECHMATICS_API_KEY=your_speechmatics_api_key
```

- `VITE_API_BASE_URL` — FastAPI backend URL (handles auth, audio uploads, Spotify proxy)
- `VITE_SPEECHMATICS_API_KEY` — API key from [Speechmatics](https://www.speechmatics.com/) for real-time transcription

### Run

```bash
pnpm run dev
```

The app runs at `http://localhost:3000`.

## Scripts

- `pnpm run dev` — development server
- `pnpm run build` — production build
- `pnpm run preview` — preview production build
- `pnpm run lint` — ESLint

## Project Structure

```
src/
  components/     UI components (SpotifyPanel, FavoritesPanel, RealTimeRecording, etc.)
  constants/      Voice command definitions
  hooks/          useSpotify, useVoiceCommands, useAudioFiles
  pages/          Main, Auth, Login, Register
  redux/          Store and auth slice
  services/       API client, Spotify service
  types/          TypeScript interfaces
```
