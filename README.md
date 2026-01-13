# Rug Pull Detection Dashboard

A modern React application for real-time rug pull detection using comprehensive deep learning approaches, featuring Apache Arrow Flight protocol for high-performance transaction streaming.

## Features

- 🎯 **Hero Section** - Clean, modern landing page with focus on rug pull detection
- ⚡ **Apache Arrow Flight** - Detailed explanation of streaming protocol advantages
- 🏗️ **Architecture Diagram** - Visual representation of the data pipeline
- 🚀 **Dashboard Navigation** - Ready-to-use button linking to `/dashboard` route

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Access to Redis server at `20.46.50.39:6379`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the backend server (in one terminal):
```bash
npm run dev:server
```

3. Start the frontend development server (in another terminal):
```bash
npm run dev
```

Or run both simultaneously:
```bash
npm run dev:all
```

4. Open your browser and navigate to `http://localhost:5173`

### Dashboard

Navigate to `http://localhost:5173/dashboard` to see the real-time pool monitoring dashboard.

The dashboard will:
- Connect to Redis server at `20.46.50.39` and listen to the `pool-monitor` channel
- Wait 40 seconds after receiving a pool payload
- Fetch data from DexScreener API
- Display pool information in beautiful cards

## Project Structure

```
rugpulldashboard/
├── src/
│   ├── pages/
│   │   ├── Home.jsx          # Main landing page
│   │   └── Home.css          # Home page styles
│   ├── App.jsx               # Main app component with routing
│   ├── App.css               # App-level styles
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Technologies Used

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Framer Motion** - Animations and transitions
- **CSS3** - Styling with modern features

### Backend
- **Express** - Web server
- **Redis** - Pub/Sub for pool monitoring
- **WebSocket** - Real-time communication
- **DexScreener API** - Token and pool data

## Routes

- `/` - Landing page with hero, features, and architecture sections
- `/dashboard` - Real-time pool monitoring dashboard with WebSocket connection

## Design Inspiration

The design is inspired by [Helius.dev](https://www.helius.dev/), featuring:
- Dark theme with accent colors
- Smooth scroll animations
- Modern typography
- Responsive layout
- Clean, professional aesthetic

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

MIT


