import nfl_data_py as nfl
import pandas as pd

# Fetch 2024 schedule data (includes scores)
print("Fetching 2024 schedule data...")
schedule_2024 = nfl.import_schedules([2024])

# Save to CSV
print("Saving to CSV...")
schedule_2024.to_csv('2024_season_results.csv', index=False)

print(f"Data fetched and saved!")
print(f"Total games: {len(schedule_2024)}")
print(f"Columns available: {len(schedule_2024.columns)}")
print("\nFirst few columns:")
print(schedule_2024.columns[:10].tolist())

# Quick peek at the data
print("\nSample data (first 3 rows, key columns):")
key_columns = ['week', 'home_team', 'away_team', 'home_score', 'away_score']
available_key_columns = [col for col in key_columns if col in schedule_2024.columns]
print(schedule_2024[available_key_columns].head(3))