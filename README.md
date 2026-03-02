# AI-Powered Smart Campus Management System - Frontend

## Overview

The client-side single-page application for the AI-Powered Smart Campus Management System. Provides a modern, responsive, role-based interface for administrators, staff, lecturers, and students.

Built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**, configured as a **Progressive Web App (PWA)**.

---

## Key Features

- **Role-based Dashboards** - Custom views and statistics for Admin, Staff, Lecturer, and Student roles
- **Online Quizzes & Exams** - Time-limited assessments with auto-grading
- **AI Anti-Cheating** - Real-time face detection during quizzes using TensorFlow.js and face-api.js (all processing client-side, no video sent to server)
- **AI Analytics** - Student risk prediction visualizations via Recharts
- **RAG Chatbot** - Course material Q&A powered by Gemini through the backend
- **WebRTC Video Meetings** - Online classes via simple-peer
- **Real-time Notifications** - Instant updates via Socket.IO
- **WebAuthn/Passkey** - Biometric kiosk attendance support
- **PWA Support** - Installable on desktop/mobile with offline capabilities
- **Dark Mode** - Theme toggle with persistence

---

## Technology Stack

| Category | Technology |
|---|---|
| Framework | React 18.3 |
| Language | TypeScript 5.6 |
| Build Tool | Vite 6.0 |
| Styling | Tailwind CSS 3.4 |
| State Management | Zustand 4.4 |
| Routing | React Router DOM 6.20 |
| HTTP Client | Axios 1.6 |
| Real-time | Socket.IO Client 4.8 |
| Charts | Recharts 2.10 |
| Face Detection | @vladmandic/face-api 1.7 + TensorFlow.js 4.22 |
| Video Calls | simple-peer 9.11 (WebRTC) |
| PWA | vite-plugin-pwa |
| Push/Analytics | Firebase 12.7 |
| Biometric Auth | @simplewebauthn/browser 13.2 |
| Icons | Lucide React, React Icons |

---

## Prerequisites

- **Node.js** v18+ (v20+ recommended)
- **npm** v9+

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Update the values as needed (see [Environment Variables](#environment-variables)).

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server (port 3000) |
| `npm run build` | Compile TypeScript and build for production (`dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run tests using Vitest |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run lint:fix` | Run ESLint and auto-fix issues |

---

## Environment Variables

Defined in `.env.local` (see `.env.example` for the full template):

### API Configuration

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api/v1` |
| `VITE_API_TIMEOUT` | Request timeout (ms) | `30000` |
| `VITE_AI_SERVICE_URL` | AI module URL (YOLOv8 proctoring) | `http://localhost:8001` |
| `VITE_ENV` | Environment | `development` |

### Feature Flags

| Variable | Description | Default |
|---|---|---|
| `VITE_ENABLE_CHATBOT` | Enable AI chatbot | `true` |
| `VITE_ENABLE_NOTIFICATIONS` | Enable notifications | `true` |
| `VITE_ENABLE_AI_PREDICTIONS` | Enable AI risk predictions | `true` |
| `VITE_ENABLE_ANALYTICS` | Enable Google Analytics | `false` |

### WebSocket

| Variable | Description | Default |
|---|---|---|
| `VITE_WS_URL` | WebSocket URL | `ws://localhost:4000` |

### File Uploads

| Variable | Description | Default |
|---|---|---|
| `VITE_MAX_FILE_SIZE` | Max upload size (bytes) | `5242880` |
| `VITE_ALLOWED_FILE_TYPES` | Allowed upload types | `.jpg,.jpeg,.png,.pdf,.doc,.docx` |

### Pagination

| Variable | Description | Default |
|---|---|---|
| `VITE_DEFAULT_PAGE_SIZE` | Default page size | `10` |
| `VITE_MAX_PAGE_SIZE` | Max page size | `100` |

### Analytics

| Variable | Description | Default |
|---|---|---|
| `VITE_GOOGLE_ANALYTICS_ID` | GA tracking ID | - |

### Firebase

| Variable | Description | Default |
|---|---|---|
| `VITE_apiKey` | Firebase API key | - |
| `VITE_authDomain` | Firebase auth domain | - |
| `VITE_projectId` | Firebase project ID | - |
| `VITE_storageBucket` | Firebase storage bucket | - |
| `VITE_messagingSenderId` | Firebase messaging sender ID | - |
| `VITE_appId` | Firebase app ID | - |
| `VITE_measurementId` | Firebase measurement ID | - |

---

## Project Structure

```
src/
├── main.tsx                 # Entry point, PWA service worker registration
├── App.tsx                  # Root: BrowserRouter + ThemeProvider + AuthProvider + AppRoutes
├── config/
│   └── api.config.ts        # Base URL, timeout, endpoint constants
├── context/
│   ├── AuthContext.tsx       # Auth state, login/logout/register, localStorage persistence
│   └── ThemeContext.tsx      # Dark/light theme toggle
├── routes/
│   ├── AppRoutes.tsx         # All route definitions (lazy-loaded, role-protected)
│   ├── ProtectedRoute.tsx    # Role-based route guard
│   └── PublicRoute.tsx       # Redirect authenticated users away from auth pages
├── pages/
│   ├── auth/                # Login, Register, ForgotPassword, ResetPassword
│   ├── admin/               # Admin portal (~20 pages)
│   ├── student/             # Student portal (~19 pages)
│   ├── lecturer/            # Lecturer portal (~20 pages)
│   ├── staff/               # Staff dashboard
│   └── common/              # Profile, Notifications, VideoRoom, LectureMaterials, Kiosk
├── components/
│   ├── admin/               # Admin-specific UI components
│   ├── student/             # Student-specific UI components
│   ├── lecturer/            # Lecturer-specific UI components
│   ├── shared/              # AI, Chatbot, VideoMeeting, Notifications
│   └── common/              # Reusable: Button, Card, Modal, Table, Form,
│                            # Input, Layout, Loading, SearchBar, Alert, Badge
├── services/
│   ├── api/
│   │   ├── axios.config.ts  # Axios instance with JWT interceptors
│   │   └── ai.service.ts    # AI prediction & RAG chat calls
│   ├── auth.service.ts      # Login, register, getCurrentUser
│   ├── attendance.service.ts
│   ├── notification.service.ts
│   ├── webauthn.service.ts  # Passkey/biometric auth
│   └── ...                  # student, lecturer, module, assignment, payment, etc.
├── store/
│   ├── store.ts             # Zustand store configuration
│   └── slices/              # auth, student, user, notification slices
├── hooks/                   # useAuth, useForm, useDebounce, useWebSocket,
│                            # useLocalStorage, useModal, usePagination, useSearch
├── types/                   # TypeScript type definitions
├── enums/                   # Shared enum constants
├── utils/                   # Utility/helper functions
├── assets/                  # Static assets (images, icons, fonts)
├── styles/
│   └── index.css            # Global styles + Tailwind directives
└── tests/
    ├── components/          # Component tests
    ├── services/            # Service tests
    └── utils/               # Utility tests
```

---

## Role-Based Routing

All page components use `React.lazy()` for code splitting.

| Path | Required Role | Description |
|---|---|---|
| `/login`, `/register`, `/forgot-password` | Public | Authentication pages |
| `/reset-password/:token` | Public | Password reset |
| `/kiosk` | Public | Kiosk attendance scanner |
| `/admin/*` | ADMIN | Full admin portal |
| `/student/*` | STUDENT | Student portal |
| `/lecturer/*` | LECTURER | Lecturer portal |
| `/user/*` | USER (staff) | Staff portal |
| `/video/room/:meetingCode` | LECTURER, STUDENT | WebRTC video room |

---

## API Integration

- A shared **Axios instance** (`services/api/axios.config.ts`) handles all HTTP requests to the backend.
- A **request interceptor** injects the JWT Bearer token from `localStorage`.
- A **response interceptor** catches `401` errors, clears the session, and redirects to `/login`.
- Each domain has a dedicated service file encapsulating its API calls.

---

## State Management

- **Zustand** store with slices for auth, student, user, and notifications.
- **React Context** for authentication (login/logout/token persistence) and theme (dark/light mode).
- Auth state persisted to `localStorage` and validated against `/auth/me` on app load.

---

## Authentication & Security

- **JWT Authentication** - Secure login with token-based session management
- **Role-Based Access Control (RBAC)** - Users only access authorized modules
- **Protected Routes** - Navigation guards prevent unauthorized access
- **Client-side Face Processing** - TensorFlow.js processes webcam data locally; no video data leaves the browser

---

## Path Aliases

The project configures 13 TypeScript/Vite path aliases for clean imports:

`@components`, `@pages`, `@services`, `@hooks`, `@context`, `@store`, `@types`, `@enums`, `@utils`, `@routes`, `@assets`, `@styles`, `@config`

---

## Testing

- **Framework:** Vitest + React Testing Library
- **Run:** `npm test`
- **Directory:** `src/tests/`

---

## License

ISC
