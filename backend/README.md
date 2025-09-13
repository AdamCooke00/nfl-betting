# NFL Betting Backend

Autonomous data pipeline for NFL betting analysis with intelligent data fetching and normalized database storage.

## Features

- **Autonomous operation**: No configuration needed - just run and it knows what to do
- **Smart data fetching**: Only fetches missing/updated data from NFL API
- **2-week revision window**: Updates recent games for score changes
- **Season awareness**: Automatically detects current NFL season/week (2025-aware)
- **Fast execution**: 1.7s maintenance runs, 14s full bootstrap
- **Complete database**: 1,425+ games across 2020-2025 seasons
- **Detailed logging**: File-based execution tracking

## Quick Start

### Installation
```bash
pip install -r requirements.txt
```

### Basic Usage
```bash
# Bootstrap complete database (first run)
python autonomous_pipeline.py

# Maintenance runs (subsequent runs)
python autonomous_pipeline.py
```

### Query Data
```python
from queries import NFLQueries

queries = NFLQueries()
recent_games = queries.get_games_by_week(2024, 2)
chiefs_games = queries.get_team_games("KC", season=2024)
```

## Architecture

### Core Files
- **`autonomous_pipeline.py`** - Main pipeline that knows what to do
- **`database.py`** - SQLAlchemy models and normalized schema
- **`etl_pipeline_db.py`** - ETL processing engine
- **`queries.py`** - High-level database query interface
- **`scheduler.py`** - Automatic scheduling for production

### Database Schema (3NF)
```
games (1,425 records)
├── betting_lines (spread, totals, moneylines)
├── game_conditions (stadium, weather, referee)
├── team_performances (per-team game stats)
└── team_stats_snapshot (rolling averages)
```

### Smart Logic
1. **Historical seasons (2020-2024)**: Only fetch if missing (usually complete)
2. **Current season (2025)**: Fetch missing + revision window games
3. **Assessment first**: Checks database vs API availability before fetching

## Scheduling Options

### Manual Execution
```bash
python autonomous_pipeline.py
```

### Continuous Python Scheduler
```bash
# Runs every 4 hours during NFL season, daily in off-season
python scheduler.py
```

### Windows Task Scheduler
1. Use `run_pipeline.bat`
2. Schedule in Windows Task Scheduler
3. Recommended: Every 4 hours during NFL season

## Configuration

### Default Database
- **File**: `nfl_autonomous.db` (~1MB)
- **Location**: Same directory as scripts

### Custom Database Path
```python
from autonomous_pipeline import AutonomousNFLPipeline

pipeline = AutonomousNFLPipeline(db_path="custom.db")
result = pipeline.run()
```

## Logs

- **File**: `logs/autonomous_pipeline_YYYYMM.log`
- **Format**: Timestamped entries with execution details
- **Rotation**: New file each month
- **Content**: API calls, database updates, execution times

## Troubleshooting

### Common Issues

**Import Error**: `pip install -r requirements.txt`

**Database Lock**: Close any SQLite browser connections

**No Games Found**: Pipeline creates database if missing - first run takes ~14s

**API Timeouts**: Pipeline handles nfl_data_py failures gracefully

### Database Verification
```bash
sqlite3 nfl_autonomous.db "SELECT COUNT(*) FROM games;"
# Expected: 1425+ games

sqlite3 nfl_autonomous.db "SELECT season, COUNT(*) FROM games GROUP BY season;"
# Expected: 2020(269), 2021(285), 2022(284), 2023(285), 2024(285), 2025(17+)
```

## Dependencies

- **Python 3.8+**
- **pandas**: Data processing
- **nfl_data_py**: NFL API interface
- **sqlalchemy**: Database ORM
- **schedule**: Python-based scheduling

See `requirements.txt` for exact versions.