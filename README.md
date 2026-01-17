# AI-Powered Smart Campus Management System – Frontend

## 📌 Overview
This is the frontend application for the AI-Powered Smart Campus Management System. It provides a modern, responsive, and role-based user interface for administrators, staff, lecturers, and students.

Built using **React 18**, **TypeScript**, **Tailwind CSS**, and configured as a **Progressive Web App (PWA)** using Vite.

---

## 🎯 Key Features
- **Role-based Dashboards:** Custom views for students, lecturers, and admins.
- **Online Quizzes & Exams:** Comprehensive assessment system.
- **AI Anti-Cheating:** Real-time face detection during quizzes.
- **AI Analytics:** Data-driven insights and trends.
- **Smart AI Chatbot:** Automated academic guidance and support.
- **Real-time Notifications:** Instant updates via Socket.io.
- **PWA Support:** Installable on desktop/mobile with offline capabilities for schedules and notifications.

---

## 🛠️ Technology Stack
| Component | Technology |
| :--- | :--- |
| **Framework** | [React 18](https://reactjs.org/) |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) |
| **AI / Computer Vision** | [TensorFlow.js](https://www.tensorflow.org/js), [face-api.js](https://github.com/vladmandic/face-api) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Real-time** | [Socket.io-client](https://socket.io/) |
| **Backend Integration** | [Axios](https://axios-http.com/) |
| **Hosting/Services** | [Firebase](https://firebase.google.com/) |

---

## 📋 Requirements
- **Node.js:** v18.x or higher (Recommended)
- **Package Manager:** npm (v9.x+) or yarn

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "AI-Powered Smart Campus Management System/Front-end"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory (you can use `.env.example` as a template):
```bash
cp .env.example .env
```
Fill in the required environment variables (see [Environment Variables](#-environment-variables) section).

### 4. Run Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 📜 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Compiles TypeScript and builds the project for production. |
| `npm run preview` | Locally previews the production build. |
| `npm run lint` | Runs ESLint to check for code quality issues. |
| `npm run lint:fix` | Runs ESLint and automatically fixes fixable issues. |

---

## 🔑 Environment Variables
The application uses the following environment variables (defined in `.env`):

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL for the Backend API | `http://localhost:5000/api/v1` |
| `VITE_WS_URL` | WebSocket Server URL | `ws://localhost:4000` |
| `VITE_ENV` | Current environment | `development` |
| `VITE_ENABLE_CHATBOT` | Toggle AI Chatbot feature | `true` |
| `VITE_apiKey` | Firebase API Key | *(Required)* |
| `VITE_authDomain` | Firebase Auth Domain | *(Required)* |
| `VITE_projectId` | Firebase Project ID | *(Required)* |

*Refer to `.env.example` for the full list of available variables.*

---

## 📂 Project Structure
```text
src/
├── assets/         # Static assets (images, icons, etc.)
├── components/     # Reusable UI components (Atomic design)
├── config/         # App configurations and constants
├── context/        # React Context providers
├── enums/          # TypeScript enums
├── hooks/          # Custom React hooks
├── pages/          # Full page components (Role-based)
├── routes/         # Route definitions and guards
├── services/       # API integration logic (Axios)
├── store/          # Zustand store definitions
├── styles/         # Global styles and Tailwind overrides
├── tests/          # Unit and integration tests
├── types/          # Global TypeScript interfaces/types
├── utils/          # Helper functions and formatters
├── App.tsx         # Main App component
└── main.tsx        # Application entry point
```

---

## 🎥 AI Face Detection
One of the core innovations of this system is the **Anti-Cheating Module** for online quizzes:
- **Real-time Monitoring:** Uses the webcam to detect the user's presence.
- **Privacy First:** Processing is done entirely on the client side using TensorFlow.js; no video is recorded or sent to the server.
- **Auto-Violation:** The system can automatically flag or cancel a quiz if a violation is detected (e.g., face not found).

---

## 🧪 Testing
- **Directory:** `src/tests/` contains test files for components, services, and utils.
- **TODO:** Configure a test runner (e.g., Vitest or Jest) in `package.json` to execute these tests.

---

## 🔐 Authentication & Security
- **JWT Authentication:** Secure login with token-based session management.
- **RBAC:** Role-Based Access Control to ensure users only access authorized modules.
- **Protected Routes:** Navigation guards to prevent unauthorized access.

---

## 📌 License
Academic / Educational Use Only.

---

## 🎓 Project Status
✅ **Enterprise-Grade Architecture**  
✅ **Face Detection Innovation**  
✅ **PWA Ready**  
✅ **Final-Year/Dissertation Level**

---

### TODOs
- [ ] Configure Vitest/Jest for automated testing.
- [ ] Complete CI/CD pipeline integration.
- [ ] Enhance offline data synchronization for PWA.
