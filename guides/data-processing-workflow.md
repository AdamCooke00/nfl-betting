# Data Processing Workflow

## Overview
Transform raw NFL data from API into structured datasets for betting analysis.

## Prerequisites
- Virtual environment activated
- `nfl-data-py` installed

## Step 1: Fetch Raw Data
```bash
python backend/fetch_2024_data.py
```
**Output**: `2024_season_results.csv` (285 games, 46 columns)

## Step 2: Process Data
```bash
mkdir processed  # if doesn't exist
python backend/etl_pipeline.py
```
**Output**: 4 files in `processed/`
- `team_games.csv` - Team-centric view (570 rows)
- `game_metadata.csv` - Game context data
- `betting_lines.csv` - Odds and spreads
- `derived_features.csv` - Rolling averages, ATS metrics

## Step 3: Validate Results
```bash
python backend/validate_data.py
```
**Confirms**: Data integrity, feature calculation, team performance metrics

## Data Structure
- **Raw**: Game-centric (285 rows)
- **Processed**: Team-centric (570 rows = 285 games × 2 teams)
- **Features**: 12 rolling averages (3, 5, 10-game windows)

## Complete Rebuild
To start fresh:
```bash
rm -f *.csv && rm -rf processed/
python backend/fetch_2024_data.py
mkdir processed
python backend/etl_pipeline.py
```