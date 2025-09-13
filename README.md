# NFL Betting Analysis System

Full-stack NFL betting analysis platform with autonomous data pipeline and interactive dashboard.

## Project Structure

```
nfl-betting/
├── backend/          # Autonomous NFL data pipeline
└── frontend/         # React betting dashboard
```

## Quick Start

### Backend (Data Pipeline)
```bash
cd backend
pip install -r requirements.txt
python autonomous_pipeline.py  # Creates full database in ~14 seconds
```

### Frontend (Dashboard)
```bash
cd frontend
npm install
npm run dev
```

## Features

### 🤖 Autonomous Backend
- **Zero-config startup**: Just run and it knows what to do
- **Smart data fetching**: Only gets missing/updated games
- **Season awareness**: Automatically detects current NFL week
- **Complete database**: 1,425+ games with betting data (2020-2025)
- **Fast execution**: 1.7s maintenance, 14s full bootstrap

### 📊 Interactive Frontend
- **Real-time dashboard**: Live betting odds and predictions
- **Team analytics**: Performance charts and trends
- **Game analysis**: Detailed betting breakdowns
- **Responsive design**: Works on all devices

## Documentation

- **[Backend Documentation](backend/README.md)** - Data pipeline, database schema, and scheduling
- **[Frontend Documentation](frontend/README.md)** - React components, development, and deployment

## Development Workflow

1. **Backend**: Run `python autonomous_pipeline.py` to populate database
2. **Frontend**: Run `npm run dev` to start dashboard
3. **Data Updates**: Pipeline automatically fetches new games and updates scores

## Tech Stack

- **Backend**: Python, SQLAlchemy, SQLite, nfl_data_py
- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite, SWR, Recharts
- **Database**: Normalized SQLite with betting lines, team stats, and conditions

## Production Deployment

### Backend Scheduling
- **Windows**: Use `run_pipeline.bat` with Task Scheduler
- **Cross-platform**: Run `python scheduler.py` for continuous operation

### Frontend Deployment
- **Development**: `npm run dev`
- **Production**: `npm run build` then deploy `dist/` folder

---

*This project uses an autonomous data pipeline that requires no configuration - it automatically knows what data to fetch based on the current NFL season and existing database state.*