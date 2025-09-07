import pandas as pd

# Read the data
df = pd.read_csv('2024_season_results.csv')

print("=== 2024 NFL SEASON DATA OVERVIEW ===")
print(f"Total games: {len(df)}")
print(f"Weeks covered: {df['week'].min()} to {df['week'].max()}")
print(f"Game types: {df['game_type'].unique()}")
print()

# Check for missing scores (incomplete games)
incomplete = df[(df['home_score'].isna()) | (df['away_score'].isna())]
print(f"Incomplete games (no scores): {len(incomplete)}")

if len(incomplete) > 0:
    print("Incomplete games by week:")
    print(incomplete.groupby('week').size())
print()

# Look at betting data availability
print("=== BETTING DATA AVAILABILITY ===")
betting_columns = ['spread_line', 'away_moneyline', 'home_moneyline', 'total_line']
for col in betting_columns:
    missing = df[col].isna().sum()
    print(f"{col}: {len(df) - missing}/{len(df)} games have data")
print()

# Sample games with betting data
print("=== SAMPLE GAMES WITH BETTING LINES ===")
sample = df[df['spread_line'].notna()].head(5)
key_cols = ['week', 'away_team', 'home_team', 'away_score', 'home_score', 
           'spread_line', 'total_line', 'result']
print(sample[key_cols])
print()

# Quick analysis: Teams that beat the spread most
print("=== QUICK SPREAD ANALYSIS ===")
completed_games = df[df['home_score'].notna() & df['spread_line'].notna()].copy()
print(f"Games with scores and spreads: {len(completed_games)}")

if len(completed_games) > 0:
    # Calculate if home team covered spread
    # spread_line positive = home team favored
    completed_games['home_covered'] = completed_games['result'] > completed_games['spread_line']
    
    home_cover_rate = completed_games['home_covered'].mean()
    print(f"Home teams covered spread: {home_cover_rate:.1%} of games")
    
    # Show a few examples
    print("\nExample games (result vs spread):")
    examples = completed_games[['week', 'away_team', 'home_team', 'result', 'spread_line', 'home_covered']].head(5)
    print(examples)