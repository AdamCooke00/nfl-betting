# Data Architecture Decision

*2025-09-06*

## Structure: Team-Centric 
**Decision**: Transform from game-centric (285 rows) to team-centric (540 rows)
**Rationale**: Required for time-series analysis, rolling averages, team trend modeling

## Storage: CSV → SQLite Migration Path
**Decision**: Start CSV, migrate to SQLite when needed
**Rationale**: Simple prototyping now, query power later

## Rolling Windows: Multiple Timeframes
**Decision**: Calculate 3, 5, 10-game rolling averages
**Rationale**: Different signals - momentum vs stability

## Betting Focus: Spread + Totals
**Decision**: Both markets, initial spread focus
**Rationale**: Complete feature set for modeling

## File Structure:
```
raw/games_raw.csv
processed/game_metadata.csv
processed/team_games.csv  
processed/betting_lines.csv
processed/derived_features.csv
```

## Key Features:
- Rolling performance metrics (3/5/10 games)
- ATS%, Over% rates
- Home/away, division, rest day splits
- Weather/context factors