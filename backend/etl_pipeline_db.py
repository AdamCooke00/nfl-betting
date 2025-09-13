"""
Refactored ETL Pipeline - Database Version
Processes NFL data into normalized SQLite database following 3NF principles
"""

import pandas as pd
from datetime import datetime
from sqlalchemy.orm import Session
from database import (
    get_database_manager, Game, BettingLine, GameConditions,
    TeamPerformance, TeamStatsSnapshot
)

class DatabaseETL:
    """ETL Pipeline that writes to normalized SQLite database"""

    def __init__(self, db_path: str = "nfl_betting.db"):
        self.db_manager = get_database_manager(db_path)
        self.db_manager.create_tables()


    def process_games(self, raw_df: pd.DataFrame, session: Session):
        """Process and insert game records"""
        print("Processing games...")
        games_inserted = 0

        for _, row in raw_df.iterrows():
            game = Game(
                game_id=row['game_id'],
                season=int(row['season']),
                week=int(row['week']),
                game_date=pd.to_datetime(row['gameday']).date(),
                game_type=row['game_type'],
                home_team=row['home_team'],
                away_team=row['away_team'],
                home_score=int(row['home_score']) if pd.notna(row['home_score']) else None,
                away_score=int(row['away_score']) if pd.notna(row['away_score']) else None,
                overtime=bool(row['overtime']) if pd.notna(row['overtime']) else False,
                is_divisional=bool(row['div_game']) if pd.notna(row['div_game']) else False
            )

            try:
                merged_game = session.merge(game)  # Use merge for upsert behavior
                games_inserted += 1
            except Exception as e:
                if "UNIQUE constraint failed" not in str(e):
                    print(f"Error inserting game {row['game_id']}: {e}")

        print(f"Processed {games_inserted} games")
        return games_inserted

    def process_betting_lines(self, raw_df: pd.DataFrame, session: Session):
        """Process and insert betting lines"""
        print("Processing betting lines...")
        lines_inserted = 0

        for _, row in raw_df.iterrows():
            betting_line = BettingLine(
                game_id=row['game_id'],
                spread_line=float(row['spread_line']) if pd.notna(row['spread_line']) else None,
                home_spread_odds=int(row['home_spread_odds']) if pd.notna(row['home_spread_odds']) else None,
                away_spread_odds=int(row['away_spread_odds']) if pd.notna(row['away_spread_odds']) else None,
                total_line=float(row['total_line']) if pd.notna(row['total_line']) else None,
                over_odds=int(row['over_odds']) if pd.notna(row['over_odds']) else None,
                under_odds=int(row['under_odds']) if pd.notna(row['under_odds']) else None,
                home_moneyline=int(row['home_moneyline']) if pd.notna(row['home_moneyline']) else None,
                away_moneyline=int(row['away_moneyline']) if pd.notna(row['away_moneyline']) else None
            )

            try:
                session.merge(betting_line)
                lines_inserted += 1
            except Exception as e:
                print(f"Error inserting betting line {row['game_id']}: {e}")

        print(f"Processed {lines_inserted} betting lines")
        return lines_inserted

    def process_game_conditions(self, raw_df: pd.DataFrame, session: Session):
        """Process and insert game conditions"""
        print("Processing game conditions...")
        conditions_inserted = 0

        for _, row in raw_df.iterrows():
            # Skip if essential stadium data is missing
            if pd.isna(row.get('stadium')):
                continue

            conditions = GameConditions(
                game_id=row['game_id'],
                stadium_id=row.get('stadium_id'),
                stadium_name=row.get('stadium'),
                roof=row.get('roof'),
                surface=row.get('surface'),
                temperature=float(row['temp']) if pd.notna(row.get('temp')) else None,
                wind_speed=float(row['wind']) if pd.notna(row.get('wind')) else None,
                referee=row.get('referee')
            )

            try:
                session.merge(conditions)
                conditions_inserted += 1
            except Exception as e:
                print(f"Error inserting conditions {row['game_id']}: {e}")

        print(f"Processed {conditions_inserted} game conditions")
        return conditions_inserted

    def process_team_performances(self, raw_df: pd.DataFrame, session: Session):
        """Process team performances (2 records per game)"""
        print("Processing team performances...")
        performances_inserted = 0

        for _, row in raw_df.iterrows():
            # Skip games without scores
            if pd.isna(row['home_score']) or pd.isna(row['away_score']):
                continue

            home_score = int(row['home_score'])
            away_score = int(row['away_score'])
            spread_line = float(row['spread_line']) if pd.notna(row['spread_line']) else None
            total_line = float(row['total_line']) if pd.notna(row['total_line']) else None

            # Home team performance
            home_perf = TeamPerformance(
                game_id=row['game_id'],
                team=row['home_team'],
                is_home=True,
                points_scored=home_score,
                points_allowed=away_score,
                covered_spread=self._calculate_spread_cover(home_score - away_score, spread_line, is_home=True),
                total_went_over=self._calculate_over_under(home_score + away_score, total_line),
                moneyline_odds=int(row['home_moneyline']) if pd.notna(row['home_moneyline']) else None,
                spread_odds=int(row['home_spread_odds']) if pd.notna(row['home_spread_odds']) else None
            )

            # Away team performance
            away_perf = TeamPerformance(
                game_id=row['game_id'],
                team=row['away_team'],
                is_home=False,
                points_scored=away_score,
                points_allowed=home_score,
                covered_spread=self._calculate_spread_cover(away_score - home_score, spread_line, is_home=False),
                total_went_over=self._calculate_over_under(home_score + away_score, total_line),
                moneyline_odds=int(row['away_moneyline']) if pd.notna(row['away_moneyline']) else None,
                spread_odds=int(row['away_spread_odds']) if pd.notna(row['away_spread_odds']) else None
            )

            try:
                session.merge(home_perf)
                session.merge(away_perf)
                # Don't flush here - let the transaction handle it
                performances_inserted += 2
            except Exception as e:
                if "UNIQUE constraint failed" not in str(e):
                    print(f"Error inserting performances {row['game_id']}: {e}")

        print(f"Processed {performances_inserted} team performances")
        return performances_inserted

    def _calculate_spread_cover(self, point_diff: int, spread_line: float, is_home: bool) -> bool:
        """Calculate if team covered the spread"""
        if spread_line is None:
            return None

        if is_home:
            # Home team covers if they win by more than spread
            return point_diff > spread_line
        else:
            # Away team covers if they lose by less than spread (or win)
            return point_diff > -spread_line

    def _calculate_over_under(self, total_points: int, total_line: float) -> bool:
        """Calculate if total went over the line"""
        if total_line is None:
            return None
        return total_points > total_line

    def calculate_team_stats(self, session: Session):
        """Calculate rolling statistics for all teams"""
        print("Calculating team statistics...")

        # Get all team performances ordered by game date
        performances = session.query(TeamPerformance)\
            .join(Game)\
            .order_by(Game.season, Game.week, TeamPerformance.team)\
            .all()

        # Group by team and calculate rolling stats
        team_stats = {}
        stats_inserted = 0

        for perf in performances:
            team = perf.team
            if team not in team_stats:
                team_stats[team] = []
            team_stats[team].append(perf)

        # Calculate rolling averages for each team
        for team, team_perfs in team_stats.items():
            for i, perf in enumerate(team_perfs):
                game = perf.game

                # Get recent performances for rolling calculations
                recent_3 = team_perfs[max(0, i-2):i+1]
                recent_5 = team_perfs[max(0, i-4):i+1]

                # Calculate stats
                pts_for_3 = sum(p.points_scored for p in recent_3) / len(recent_3)
                pts_against_3 = sum(p.points_allowed for p in recent_3) / len(recent_3)

                pts_for_5 = sum(p.points_scored for p in recent_5) / len(recent_5)
                pts_against_5 = sum(p.points_allowed for p in recent_5) / len(recent_5)

                wins_5 = sum(1 for p in recent_5 if p.points_scored > p.points_allowed)
                ats_wins_5 = sum(1 for p in recent_5 if p.covered_spread)
                over_5 = sum(1 for p in recent_5 if p.total_went_over)

                # Season totals
                season_perfs = [p for p in team_perfs[:i+1] if p.game.season == game.season]
                season_wins = sum(1 for p in season_perfs if p.points_scored > p.points_allowed)
                season_ats_wins = sum(1 for p in season_perfs if p.covered_spread)

                stats = TeamStatsSnapshot(
                    team=team,
                    season=game.season,
                    week=game.week,
                    pts_for_avg_3=pts_for_3,
                    pts_against_avg_3=pts_against_3,
                    point_diff_avg_3=pts_for_3 - pts_against_3,
                    pts_for_avg_5=pts_for_5,
                    pts_against_avg_5=pts_against_5,
                    point_diff_avg_5=pts_for_5 - pts_against_5,
                    win_pct_5=wins_5 / len(recent_5),
                    ats_pct_5=ats_wins_5 / len(recent_5) if ats_wins_5 is not None else None,
                    over_pct_5=over_5 / len(recent_5) if over_5 is not None else None,
                    season_wins=season_wins,
                    season_losses=len(season_perfs) - season_wins,
                    season_ats_wins=season_ats_wins,
                    season_ats_losses=len(season_perfs) - season_ats_wins if season_ats_wins is not None else None
                )

                try:
                    session.merge(stats)
                    stats_inserted += 1
                except Exception as e:
                    print(f"Error inserting stats for {team} Week {game.week}: {e}")

        print(f"Calculated {stats_inserted} team stat snapshots")
        return stats_inserted

