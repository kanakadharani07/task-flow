# TaskFlow – Smart Task Management Platform

TaskFlow is a premium, startup-quality task management application built with the modern MERN stack principles (adapted for Firebase for real-time performance and reliability in this environment).

## Features

- **Authentication**: Secure Google-style email/password auth with persistence.
- **Dashboard**: Interactive data visualizations with Recharts, highlighting productivity and task distribution.
- **Kanban Board**: Real-time status management with smooth Framer Motion transitions.
- **Tasks Management**: Full CRUD capabilities with priority, deadline, and category support.
- **Calendar**: Visual deadline tracking and scheduling.
- **Admin Command Center**: Complete user and system management for admins.
- **Responsive UI**: Premium SaaS design with a custom Tailwind theme, glassmorphism, and mobile optimization.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React, Recharts.
- **Backend / Database**: Firebase (Authentication, Firestore Real-time Database).
- **Styling**: Radical SaaS theme with custom fonts (Inter & Outfit).

## Deployment Guide

1. **Firebase Setup**:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
   - Enable Authentication (Email/Password).
   - Provision a Firestore Database in your preferred region.
   - Add your web app config to `firebase-applet-config.json`.

2. **Security Rules**:
   - Deploy the provided `firestore.rules` to ensure data isolation.

3. **Environment Variables**:
   - Configure `GEMINI_API_KEY` in your environment for future AI-powered features.

## Getting Started

```bash
npm install
npm run dev
```

## Folder Structure

- `/src/components`: Reusable UI components and layouts.
- `/src/pages`: Feature-specific pages (Dashboard, Kanban, etc.).
- `/src/lib`: Logic for Firebase and general utilities.
- `/src/context`: React Context for state management.
- `/src/hooks`: Custom hooks for data fetching.

---

Built with ❤️ for TaskFlow.
