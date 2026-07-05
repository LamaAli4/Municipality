# Municipality Portal

A full-stack municipal services web application built with React and TypeScript. The platform serves four distinct user roles — Citizens, Employees, Department Managers, and Admins — each with a dedicated portal and workflow.

## Live Demo

Deployed on Vercel: [https://municipality-1mqi-ev5gkl3q9-lama-alis-projects.vercel.app/](https://municipality-1mqi-ev5gkl3q9-lama-alis-projects.vercel.app/)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Data fetching | TanStack React Query |
| HTTP client | Axios |
| Animations | Framer Motion |
| Charts | Recharts |
| Notifications | React Toastify |
| File storage | ImageKit |
| State | Zustand |
| Validation | Zod |

## Portals & Features

### Citizen Portal
- Browse and apply for municipal services with document upload
- Payment flow: transfer number, provider (Jawwal Pay / PalPay / Bank Transfer), receipt upload
- Track service request status and task progress
- Submit and track complaints (with real-time status: Submitted → Under Review → Resolved / Closed)
- View utility bills and pay online
- Submit property damage assessments with image uploads
- Account management and password change

### Employee Portal
- Kanban task board (Backlog / In Progress / Completed / Failed)
- Task detail view with citizen documents and internal document upload (PDF only)
- Approve or reject assigned tasks

### Department Manager Portal
- Department and section management
- Staff management and performance overview

### Admin Portal
- Citizens management (view, verify, enable/disable)
- Staff management across departments and sections
- Service management (create, publish, edit, delete)
- Complaints management with full workflow (Start Review → Resolve / Close)
- Damage assessments review with severity filtering
- Dashboard with system statistics

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/LamaAli4/Municipality.git
cd Municipality
npm install
```

### Environment

Create a `.env` file in the root with your API base URL:

```env
VITE_API_BASE_URL=https://your-api-url.com
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/ui/      # Shared UI components (Button, Input, Modal, etc.)
├── layout/             # App shell layouts (Sidebar, MainLayout, etc.)
├── lib/                # Axios instance, types, icons, utilities
├── portals/            # Role-based portal entry points
├── router/             # Admin router (page-switch pattern)
├── services/           # React Query hooks per domain
└── view/               # Page components
    ├── citizen/        # Citizen portal pages
    ├── employee/       # Employee portal pages
    ├── manager/        # Department manager pages
    └── modals/         # Shared modal dialogs
```

## API

Backend: [TechnoAmar API](https://technoamar-production.up.railway.app)

Full Swagger docs available at `/api` on the backend URL.
