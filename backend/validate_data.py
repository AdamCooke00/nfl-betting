import pandas as pd

# Load processed data
team_games = pd.read_csv('processed/team_games.csv')
derived_features = pd.read_csv('processed/derived_features.csv')
betting_lines = pd.read_csv('processed/betting_lines.csv')

print("=== DATA TRANSFORMATION VALIDATION ===")
print(f"Original games: 285")
print(f"Team game records: {len(team_games)}")
print(f"Teams: {team_games['team'].nunique()}")
print(f"Expected: 285 games × 2 teams = 570 records")
print()

print("=== DERIVED FEATURES SAMPLE ===")
# Show sample team progression
sample_team = 'KC'
kc_data = derived_features[derived_features['team'] == sample_team].head(5)

key_cols = ['week', 'team', 'opponent', 'score', 'spread_faced', 'covered_spread', 
           'score_avg_3', 'ats_pct_5']
print(f"Kansas City first 5 games:")
print(kc_data[key_cols])
print()

print("=== FEATURE COMPLETENESS ===")
rolling_features = [col for col in derived_features.columns if 'avg_' in col or '_pct_' in col]
print(f"Rolling features calculated: {len(rolling_features)}")
print(rolling_features)
print()

print("=== BETTING PERFORMANCE SUMMARY ===")
# Overall ATS performance by team
ats_summary = derived_features.groupby('team').agg({
    'covered_spread': ['count', 'sum', 'mean']
}).round(3)
ats_summary.columns = ['games_played', 'spreads_covered', 'ats_pct']
ats_summary = ats_summary.sort_values('ats_pct', ascending=False)

print("Top 5 ATS performers:")
print(ats_summary.head())
print()
print("Bottom 5 ATS performers:")
print(ats_summary.tail())

# Validation checks
print("\n=== VALIDATION CHECKS ===")
print(f"✓ Data transformation: {len(team_games) == 570}")
print(f"✓ All teams present: {team_games['team'].nunique() == 32}")
print(f"✓ Features calculated: {len(rolling_features) > 0}")
print(f"✓ No missing scores: {team_games['score'].isna().sum() == 0}")