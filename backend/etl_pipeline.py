import pandas as pd
import numpy as np

def load_raw_data():
    """Load raw 2024 season data"""
    df = pd.read_csv('2024_season_results.csv')
    return df

def create_team_centric_data(df):
    """Transform game-centric to team-centric (540 rows)"""
    
    # Home team records
    home = df.copy()
    home['team'] = home['home_team']
    home['opponent'] = home['away_team'] 
    home['is_home'] = True
    home['score'] = home['home_score']
    home['opponent_score'] = home['away_score']
    home['spread_faced'] = home['spread_line']  # positive = favored
    home['moneyline'] = home['home_moneyline']
    
    # Away team records  
    away = df.copy()
    away['team'] = away['away_team']
    away['opponent'] = away['home_team']
    away['is_home'] = False
    away['score'] = away['away_score'] 
    away['opponent_score'] = away['home_score']
    away['spread_faced'] = -away['spread_line']  # flip spread for away team
    away['moneyline'] = away['away_moneyline']
    
    # Combine
    team_games = pd.concat([home, away], ignore_index=True)
    
    # Sort by team and week for time series
    team_games = team_games.sort_values(['team', 'week'])
    
    return team_games

def create_game_metadata(df):
    """Extract game context data"""
    metadata_cols = ['game_id', 'season', 'week', 'gameday', 'weekday', 'gametime',
                    'location', 'roof', 'surface', 'temp', 'wind', 'stadium']
    
    return df[metadata_cols].copy()

def create_betting_lines(df):
    """Extract all betting data"""
    betting_cols = ['game_id', 'week', 'home_team', 'away_team',
                   'spread_line', 'away_spread_odds', 'home_spread_odds',
                   'total_line', 'over_odds', 'under_odds',
                   'away_moneyline', 'home_moneyline']
    
    return df[betting_cols].copy()

def calculate_rolling_features(team_games):
    """Calculate rolling averages and trends"""
    
    features = []
    
    for team in team_games['team'].unique():
        team_data = team_games[team_games['team'] == team].copy()
        
        # Rolling averages for different windows
        for window in [3, 5, 10]:
            team_data[f'score_avg_{window}'] = team_data['score'].rolling(window, min_periods=1).mean()
            team_data[f'opp_score_avg_{window}'] = team_data['opponent_score'].rolling(window, min_periods=1).mean()
            team_data[f'point_diff_avg_{window}'] = (team_data['score'] - team_data['opponent_score']).rolling(window, min_periods=1).mean()
        
        # Win/loss streaks and percentages
        team_data['win'] = team_data['score'] > team_data['opponent_score']
        team_data['win_pct_5'] = team_data['win'].rolling(5, min_periods=1).mean()
        
        # Against the spread performance
        team_data['covered_spread'] = (team_data['score'] - team_data['opponent_score']) > team_data['spread_faced']
        team_data['ats_pct_5'] = team_data['covered_spread'].rolling(5, min_periods=1).mean()
        
        # Over/under performance (total points vs line)
        team_data['total_points'] = team_data['score'] + team_data['opponent_score']
        if 'total_line' in team_data.columns:
            team_data['game_went_over'] = team_data['total_points'] > team_data['total_line']
            team_data['over_pct_5'] = team_data['game_went_over'].rolling(5, min_periods=1).mean()
        
        features.append(team_data)
    
    return pd.concat(features, ignore_index=True)

def run_etl_pipeline():
    """Execute complete ETL pipeline"""
    
    print("Loading raw data...")
    raw_df = load_raw_data()
    
    print("Creating team-centric data...")
    team_games = create_team_centric_data(raw_df)
    
    print("Extracting game metadata...")
    game_metadata = create_game_metadata(raw_df)
    
    print("Extracting betting lines...")
    betting_lines = create_betting_lines(raw_df)
    
    print("Calculating derived features...")
    derived_features = calculate_rolling_features(team_games)
    
    # Save processed data
    print("Saving processed data...")
    team_games.to_csv('processed/team_games.csv', index=False)
    game_metadata.to_csv('processed/game_metadata.csv', index=False)
    betting_lines.to_csv('processed/betting_lines.csv', index=False)
    derived_features.to_csv('processed/derived_features.csv', index=False)
    
    print("ETL pipeline complete!")
    print(f"Team games: {len(team_games)} rows")
    print(f"Derived features: {len(derived_features)} rows")
    print(f"Available features: {derived_features.columns.tolist()}")
    
    return team_games, game_metadata, betting_lines, derived_features

if __name__ == "__main__":
    run_etl_pipeline()