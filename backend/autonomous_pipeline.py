"""
Autonomous NFL Data Pipeline - 2025
Just run it. It knows what to do.
"""

import nfl_data_py as nfl
import pandas as pd
from datetime import datetime, date, timedelta
from typing import Dict, List, Set, Optional
import logging
import time
from pathlib import Path

from database import get_database_manager, Game, BettingLine, TeamPerformance
from etl_pipeline_db import DatabaseETL
from queries import NFLQueries


class AutonomousNFLPipeline:
    """A pipeline that just knows what to do"""

    def __init__(self, db_path: str = "nfl_autonomous.db"):
        self.db_path = db_path
        self.db_manager = get_database_manager(db_path)
        self.db_manager.create_tables()
        self.etl = DatabaseETL(db_path)
        self.queries = NFLQueries(db_path)

        # Setup logging to both console and file
        # Create logs directory if it doesn't exist
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)

        # Create log filename with current month
        log_file = log_dir / f"autonomous_pipeline_{datetime.now().strftime('%Y%m')}.log"

        # Configure logging with both console and file handlers
        self.logger = logging.getLogger('nfl_autonomous')
        self.logger.setLevel(logging.INFO)

        # Remove existing handlers
        self.logger.handlers.clear()

        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        console_formatter = logging.Formatter('%(asctime)s | %(message)s', datefmt='%H:%M:%S')
        console_handler.setFormatter(console_formatter)

        # File handler with UTF-8 encoding
        file_handler = logging.FileHandler(log_file, mode='a', encoding='utf-8')
        file_handler.setLevel(logging.INFO)
        file_formatter = logging.Formatter('%(asctime)s | %(levelname)s | %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
        file_handler.setFormatter(file_formatter)

        # Add handlers
        self.logger.addHandler(console_handler)
        self.logger.addHandler(file_handler)

    def get_current_nfl_context(self) -> Dict:
        """Understand where we are in the NFL universe"""
        today = date.today()
        current_season = today.year if today.month >= 9 else today.year - 1

        # Calculate current week
        season_starts = {
            2024: date(2024, 9, 5),
            2025: date(2025, 9, 4),
        }

        if current_season in season_starts:
            season_start = season_starts[current_season]
        else:
            sep_first = date(current_season, 9, 1)
            days_to_thursday = (3 - sep_first.weekday()) % 7
            season_start = sep_first + timedelta(days=days_to_thursday)

        if today < season_start:
            current_week = None
            phase = "offseason"
        else:
            days_since_start = (today - season_start).days
            week = (days_since_start // 7) + 1
            current_week = min(week, 22) if week > 0 else None

            if current_week is None:
                phase = "offseason"
            elif current_week <= 18:
                phase = "regular_season"
            else:
                phase = "playoffs"

        return {
            'current_season': current_season,
            'current_week': current_week,
            'phase': phase,
            'today': today
        }

    def assess_situation(self) -> Dict:
        """Look around and understand what needs to be done"""
        context = self.get_current_nfl_context()

        # Check what we have vs what's actually available from API
        seasons_to_check = list(range(2020, context['current_season'] + 1))
        database_status = {}
        total_missing = 0

        with self.db_manager.get_session() as session:
            for season in seasons_to_check:
                completed_count = session.query(Game)\
                    .filter(Game.season == season, Game.home_score.isnot(None)).count()

                # For current season, check what's actually available from API
                if season == context['current_season']:
                    # Try to fetch current season data to see what's available
                    try:
                        api_data = nfl.import_schedules([season])
                        available_completed = api_data.dropna(subset=['home_score', 'away_score'])
                        api_completed_count = len(available_completed)

                        # Add revision window games
                        revision_ids = self.get_recent_games_for_revision(season)
                        needs_revision = len(revision_ids)

                        missing = max(0, api_completed_count - completed_count)
                        needs_attention = missing > 0 or needs_revision > 0

                        database_status[season] = {
                            'have': completed_count,
                            'api_available': api_completed_count,
                            'missing': missing,
                            'needs_revision': needs_revision,
                            'needs_attention': needs_attention
                        }
                        total_missing += missing

                    except Exception as e:
                        self.logger.error(f"Failed to check API for {season}: {e}")
                        database_status[season] = {
                            'have': completed_count,
                            'api_available': 'unknown',
                            'missing': 0,
                            'needs_revision': 0,
                            'needs_attention': False
                        }
                else:
                    # For historical seasons, assume they're complete if we have reasonable data
                    # Only mark as needing attention if we have very few games
                    reasonable_threshold = 250  # Most NFL seasons have 256-285 games
                    needs_attention = completed_count < reasonable_threshold

                    database_status[season] = {
                        'have': completed_count,
                        'api_available': 'historical',
                        'missing': 0,
                        'needs_revision': 0,
                        'needs_attention': needs_attention
                    }

        # Determine what action to take
        seasons_needing_attention = sum(1 for status in database_status.values() if status['needs_attention'])

        if total_missing == 0 and seasons_needing_attention == 0:
            action_needed = "monitor"
        elif total_missing < 10 and seasons_needing_attention <= 1:
            action_needed = "light_update"
        else:
            action_needed = "full_update"

        return {
            'context': context,
            'database_status': database_status,
            'total_missing': total_missing,
            'seasons_needing_attention': seasons_needing_attention,
            'action_needed': action_needed
        }

    def get_recent_games_for_revision(self, season: int) -> Set[str]:
        """Get games that might need revision (2 week window)"""
        if season != self.get_current_nfl_context()['current_season']:
            return set()

        cutoff = datetime.now() - timedelta(weeks=2)

        with self.db_manager.get_session() as session:
            recent = session.query(Game.game_id)\
                .filter(
                    Game.season == season,
                    Game.game_date >= cutoff.date(),
                    Game.home_score.isnot(None)
                ).all()

            return set(game_id for (game_id,) in recent)

    def smart_fetch_for_season(self, season: int, needed: int) -> Optional[pd.DataFrame]:
        """Intelligently fetch just what we need for a season"""
        try:
            # Get all available data
            all_data = nfl.import_schedules([season])

            # For current season, filter to completed only
            context = self.get_current_nfl_context()
            if season == context['current_season']:
                all_data = all_data.dropna(subset=['home_score', 'away_score'])

            if len(all_data) == 0:
                return None

            # Get what we already have
            with self.db_manager.get_session() as session:
                existing = set(
                    game_id for (game_id,) in
                    session.query(Game.game_id).filter(Game.season == season).all()
                )

            # Determine what to include
            available_ids = set(all_data['game_id'].tolist())
            missing_ids = available_ids - existing

            # Add revision candidates for current season
            revision_ids = set()
            if season == context['current_season']:
                revision_ids = self.get_recent_games_for_revision(season)

            # Combine what we need
            ids_to_include = missing_ids.union(revision_ids)

            if len(ids_to_include) == 0:
                return None

            # Return filtered data
            filtered = all_data[all_data['game_id'].isin(ids_to_include)]

            self.logger.info(f"{season}: Fetching {len(filtered)} games ({len(missing_ids)} new, {len(revision_ids)} revisions)")

            return filtered

        except Exception as e:
            self.logger.error(f"{season}: Fetch failed - {str(e)}")
            return None

    def process_season_data(self, season: int, data: pd.DataFrame) -> bool:
        """Process season data directly through ETL without temporary files"""
        try:
            # Process each entity type in separate transactions for better error handling
            with self.db_manager.get_session() as session:
                try:
                    # Process core game data first
                    games_count = self.etl.process_games(data, session)
                    session.commit()

                    # Process betting lines
                    betting_count = self.etl.process_betting_lines(data, session)
                    session.commit()

                    # Process conditions
                    conditions_count = self.etl.process_game_conditions(data, session)
                    session.commit()

                    # Process team performances
                    performance_count = self.etl.process_team_performances(data, session)
                    session.commit()

                    # Calculate derived statistics
                    stats_count = self.etl.calculate_team_stats(session)
                    session.commit()

                    self.logger.info(f"{season}: Processed {games_count} games successfully")
                    return True

                except Exception as e:
                    if "UNIQUE constraint failed" in str(e):
                        self.logger.info(f"{season}: Already current")
                        return True
                    else:
                        session.rollback()
                        raise

        except Exception as e:
            self.logger.error(f"{season}: Processing failed - {str(e)}")
            return False

    def execute_action(self, assessment: Dict) -> Dict:
        """Execute whatever action is needed"""
        action = assessment['action_needed']
        context = assessment['context']

        if action == "monitor":
            self.logger.info(f"All good! Database current for {context['phase']} (Week {context['current_week']})")
            return {
                'action_taken': 'monitoring',
                'games_updated': 0,
                'success': True
            }

        # Determine seasons that need work
        seasons_to_update = [
            season for season, status in assessment['database_status'].items()
            if status['needs_attention']
        ]

        if not seasons_to_update:
            self.logger.info("Database analysis shows no updates needed")
            return {
                'action_taken': 'no_action_needed',
                'games_updated': 0,
                'success': True
            }

        self.logger.info(f"Updating {len(seasons_to_update)} seasons: {seasons_to_update}")

        # Process each season
        total_updated = 0
        successful_seasons = 0

        for season in seasons_to_update:
            status = assessment['database_status'][season]

            # Fetch data for this season
            season_data = self.smart_fetch_for_season(season, status['missing'])

            if season_data is None:
                self.logger.info(f"{season}: No processable data available")
                continue

            # Process it
            if self.process_season_data(season, season_data):
                successful_seasons += 1
                total_updated += len(season_data)

        return {
            'action_taken': action,
            'seasons_attempted': len(seasons_to_update),
            'seasons_successful': successful_seasons,
            'games_updated': total_updated,
            'success': successful_seasons > 0
        }

    def run(self) -> Dict:
        """Just run. Figure out what to do and do it."""
        start_time = time.time()

        self.logger.info("NFL Pipeline starting...")

        # Understand the situation
        assessment = self.assess_situation()
        context = assessment['context']

        self.logger.info(f"Current: {context['current_season']} season, Week {context['current_week']} ({context['phase']})")

        # Log database status summary
        if assessment['total_missing'] > 0 or assessment['seasons_needing_attention'] > 0:
            self.logger.info(f"Assessment: {assessment['total_missing']} games missing, {assessment['seasons_needing_attention']} seasons need attention")
        else:
            self.logger.info("Assessment: Database is current")

        # Do what needs to be done
        result = self.execute_action(assessment)

        # Report results
        duration = time.time() - start_time

        if result['games_updated'] > 0:
            self.logger.info(f"✅ Updated {result['games_updated']} games in {duration:.1f}s")
        else:
            self.logger.info(f"✅ Database current in {duration:.1f}s")

        return {
            **result,
            'duration': duration,
            'context': context,
            'total_missing_before': assessment['total_missing']
        }


def main():
    """Just run the pipeline"""
    pipeline = AutonomousNFLPipeline()
    result = pipeline.run()

    # Simple output
    if result['games_updated'] > 0:
        print(f"Updated {result['games_updated']} games ({result['duration']:.1f}s)")
    else:
        print(f"Database current ({result['duration']:.1f}s)")


if __name__ == "__main__":
    main()