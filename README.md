# HireHub Onboarding Portal

A modern employee onboarding portal built with React and Vite, designed to streamline the new hire onboarding experience.

## Tech Stack

- **Framework:** React 18+
- **Build Tool:** Vite
- **Language:** JavaScript (JSX)
- **Styling:** CSS
- **Prop Validation:** PropTypes

## Features

- **Dashboard:** Centralized onboarding dashboard for new hires to track their progress
- **Task Management:** Step-by-step onboarding tasks with completion tracking
- **Document Upload:** Secure document submission for required onboarding paperwork
- **Profile Setup:** New hire profile creation and management
- **Team Introduction:** Meet-the-team directory with role and contact information
- **Progress Tracking:** Visual progress indicators for onboarding milestones
- **Responsive Design:** Fully responsive layout for desktop and mobile devices

## Folder Structure

```
hirehub-onboarding-portal/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, fonts, and other static resources
│   ├── components/          # Reusable UI components
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page/route components
│   ├── services/            # API service modules
│   ├── utils/               # Utility functions and helpers
│   ├── App.jsx              # Root application component with routing
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

## Getting Started

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd hirehub-onboarding-portal
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` by default.

### Build

Create an optimized production build:

```bash
npm run build
```

The build output will be generated in the `dist/` directory.

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run the linter to check for code quality issues:

```bash
npm run lint
```

## Environment Variables

Environment variables are managed through `.env` files and accessed via `import.meta.env`.

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL for the backend API |
| `VITE_APP_TITLE` | Application title displayed in the browser |

Create a `.env.local` file in the project root for local development:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=HireHub Onboarding Portal
```

> **Note:** Only variables prefixed with `VITE_` are exposed to the client-side code.

## Deployment

### Vercel

This project is configured for seamless deployment on Vercel.

1. **Connect Repository:** Import your Git repository in the [Vercel Dashboard](https://vercel.com/dashboard).

2. **Configure Build Settings:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Set Environment Variables:** Add all required `VITE_*` environment variables in the Vercel project settings under **Settings → Environment Variables**.

4. **Deploy:** Vercel will automatically build and deploy on every push to the main branch.

#### Manual Deployment via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### SPA Routing

For single-page application routing to work correctly on Vercel, ensure a `vercel.json` file exists in the project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## License

**Private** — All rights reserved. This project is proprietary and confidential. Unauthorized copying, distribution, or modification of this project is strictly prohibited.