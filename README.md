# NFL Betting Backend System

Autonomous data pipeline for NFL betting analysis with intelligent data fetching and normalized database storage.

## Features

- Autonomous operation (no configuration needed)
- Smart data fetching (only fetches missing/updated data)
- 2-week revision window for recent games
- Seasonal awareness (automatically detects current NFL season/week)
- Normalized 3NF database schema (1,425+ games across 2020-2025 seasons)
- High-level query interface for betting analysis
- Automatic scheduling during NFL season

## Quick Start

### Prerequisites
- Python 3.8+
- SQLite (included with Python)

### Installation

```bash
cd backend
pip install -r requirements.txt
```

### Basic Usage

```python
from autonomous_pipeline import AutonomousNFLPipeline
from queries import NFLQueries

# Run autonomous update
pipeline = AutonomousNFLPipeline()
result = pipeline.run()

# Query data
queries = NFLQueries()
recent_games = queries.get_games_by_week(2024, 2)
```

## Architecture

### Core Components

- **autonomous_pipeline.py**: Autonomous data pipeline that knows what to do
- **database.py**: SQLAlchemy models and normalized schema (3NF)
- **etl_pipeline_db.py**: ETL processing engine for data transformation
- **queries.py**: High-level database query interface
- **scheduler.py**: Automatic scheduling for production use

### Database Schema

```
games (1,425 records)
├── betting_lines (spread, totals, moneylines)
├── game_conditions (stadium, weather, referee)
├── team_performances (per-team game stats)
└── team_stats_snapshot (rolling averages)
```

### Smart Fetching Logic

1. **Historical seasons (2020-2023)**: Only fetch if completely missing
2. **Current season**: Fetch missing games + recent games within 2-week window
3. **Future games**: Fetch schedule data only

## Usage Examples

### Run Autonomous Update
```python
pipeline = AutonomousNFLPipeline()
result = pipeline.run()
print(f"Updated {result['games_updated']} games")
```

### Query Team Performance
```python
queries = NFLQueries()
chiefs_games = queries.get_team_games("KC", season=2024)
```

### Get Betting Analysis
```python
# Get games with betting lines
games_with_lines = queries.get_games_with_betting_lines(season=2024, week=2)

# Get team statistics
team_stats = queries.get_team_rolling_stats("KC", season=2024, week=10)
```

## Scheduling

### Windows (Batch File)
```bash
# Run once
run_pipeline.bat
```

### Python Scheduler
```python
# Automatic scheduling (4 hours during season, daily off-season)
python scheduler.py
```

### Linux (Systemd Service)
```bash
# Setup service
sudo cp nfl-pipeline.service /etc/systemd/system/
sudo systemctl enable nfl-pipeline
sudo systemctl start nfl-pipeline
```

## Configuration

Default database: `nfl_autonomous.db` (1MB SQLite file)

Customize database path:
```python
pipeline = AutonomousNFLPipeline(db_path="custom_path.db")
```

## Troubleshooting

### Common Issues

**Import Error**: Ensure all dependencies installed: `pip install -r requirements.txt`

**Database Lock**: Close any SQLite browser connections to `nfl_autonomous.db`

**API Failures**: Pipeline gracefully handles nfl_data_py API timeouts

**Missing Data**: Run `pipeline.run()` to fetch missing games

### Database Verification
```bash
sqlite3 nfl_autonomous.db "SELECT COUNT(*) FROM games;"
# Expected: 1425+ games
```
