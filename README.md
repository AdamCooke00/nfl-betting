# NFL Betting Helper

Predict upcoming week's NFL games and player performance using historical data.

## What We're Building

**Game Predictions:**
- Moneyline (who wins)
- Point spread 
- Over/under totals

**Player Predictions (all offensive skill positions):**
- Rushing yards, receiving yards, touchdowns
- QB passing stats

## Technical Approach

- **Models**: Test both statistical and ML approaches
- **Data**: All historical NFL data (handled on separate branch)
- **Generation**: Manual runs using most current data available
- **Storage**: SQLite database
- **API**: FastAPI with prediction endpoints

## System Components

### Core Engine
- Multiple model implementations (statistical + ML)
- Model comparison and selection framework
- Prediction confidence scoring

### API Endpoints
- `/predict/game/{team1}/{team2}` - game-level predictions
- `/predict/players/{game_id}` - all offensive players for a game
- `/predict/week` - full week predictions

### Database Schema
- Games (historical + upcoming)
- Player stats (all offensive positions)
- Team performance metrics
- Prediction results for backtesting

## Success Metric

Build multiple model approaches and determine which performs best through backtesting.