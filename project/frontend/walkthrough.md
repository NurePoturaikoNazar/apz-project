# Aquila Frontend Implementation

The frontend for the Aquila application has been completely implemented according to the «Cyber-Minimalism» design requirements (SPA with Vue.js 3 and Vite). It is fully integrated with the backend API endpoints and utilizes modern tools like Pinia, Vue Router, Vue i18n, and ApexCharts.

## 1. Project Setup & Architecture

- **Stack**: Vue 3 (Composition API), Vite, Vue Router, Pinia, Axios, Vue-i18n, Sass, Vue3-ApexCharts.
- **Vite Config**: Configured `vite.config.js` to proxy `/api` requests to `http://localhost:3000` (the backend Express app) and configured SCSS global injection.
- **File Structure**:
  - `src/api`: Axios instance with JWT interceptors, API service modules (`auth`, `users`, `rooms`, `devices`, `telemetry`, `alerts`, `snapshots`).
  - `src/stores`: Pinia stores for `auth` (handles login/logout, JWT, admin logic) and `ui` (handles toasts, sidebar toggle, locale).
  - `src/i18n`: Internationalization with Ukrainian (`ua.json`) and English (`en.json`) support.
  - `src/router`: Route definitions, handling global navigation guards (`requiresAuth`, `requiresAdmin`).
  - `src/assets/styles`: Global SCSS including `_variables.scss` for design tokens (colors, gradients, glassmorphism), `_animations.scss` for micro-animations, and `main.scss` for layout resets.
  - `src/components`: UI primitives (`BaseButton`, `BaseCard`, `BaseModal`, etc.) and complex components (`RoomCard`, `TelemetryChart`, etc.).
  - `src/views`: All application pages categorized logically (`auth`, `dashboard`, `rooms`, `events`, `analytics`, `admin`).

## 2. Design System: Cyber-Minimalism

- **Theme**: Dark mode by default (`$bg-primary: #0B0E14`).
- **Glassmorphism**: Extensively used throughout cards, sidebars, and modals with translucent backgrounds (`rgba(17, 22, 32, 0.6)`) and `backdrop-filter: blur(12px)`.
- **Neon Accents**: Applied gradients (`$gradient-blue`, `$gradient-cyan`, `$gradient-purple`) and glowing shadows on active elements and hover states.
- **Animations**: Integrated smooth micro-animations (`fade-in`, `slide-in`, `scale-in`, `glowPulseRed`) specifically in buttons, hover states, chart mounting, and active alerts.

## 3. Core Features

### Authentication
- JWT integration using Pinia and Axios interceptors.
- `LoginView` implements the auth UI and directly connects to the backend. The backend determines if a user is an admin by checking if the email is exactly `admin`.

### Dashboard & Analytics
- Implemented `DashboardView` providing key metrics (Total Rooms, Online Devices, Active Alerts) using `SkeletonLoader` elements during data fetches.
- Real-time `TelemetryChart` using **ApexCharts**. The charts implement gradients and animations to display historical environmental data (Temperature, Humidity, Light, Sound).

### Room & Device Management
- `RoomsView` visualizes the organization of smart home setups.
- `RoomDetailView` acts as the command center for a single room, presenting the real-time telemetry graphs and the status of all associated devices.
- `RoomCard` and `DeviceCard` provide visual status indicators (online/offline, alerts).

### Event Monitoring
- `EventsView` categorizes system notifications into Alerts and Camera Snapshots.
- Active system alerts feature a glowing red visual indicator across the dashboard and sidebars.

### Admin Controls
- Secured behind the `requiresAdmin` route guard.
- **System Management**: Easily add, edit, and delete rooms and their child devices.
- **User Management**: Creating and deleting users. Modifying credentials.
- **Audit Logs**: Viewing the entire event history of the system, complete with `exportCSV` and `exportPDF` functionalities (using `papaparse` and `jspdf-autotable`).

## Verification & Deployment

- Successfully resolved Vite dependencies and confirmed compilation without errors using `npm run build`.
- Local development server runs on `localhost:5173`. You can start it at any time with `npm run dev`.

> [!TIP]
> The app is ready for testing! You can access it by opening the local dev server. For demo access, you can click the "Admin" or "User" buttons on the Login page to pre-fill credentials.
