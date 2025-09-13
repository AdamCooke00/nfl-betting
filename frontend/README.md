# NFL Betting Frontend

Interactive React dashboard for NFL betting analysis and predictions.

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality
- `npm run format` - Format code

## Architecture

```
src/
├── components/
│   ├── ui/           # Foundational components (Button, Card, Badge)
│   ├── composite/    # Complex components (StatCard, LoadingState)
│   └── *.tsx         # Page-level components (Dashboard, GameCard)
├── hooks/            # Custom React hooks
├── lib/              # Utilities and API clients
├── types/            # TypeScript definitions
└── theme/            # Design tokens
```

## Tech Stack

- React 19.1 + TypeScript
- Tailwind CSS v4 + Vite
- SWR for data fetching
- Recharts for charts
- ESLint + Prettier