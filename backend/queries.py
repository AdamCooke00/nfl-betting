"""
NFL Betting Database Query Layer
Provides high-level interface for common betting analysis queries
"""

from typing import List, Dict, Optional
from sqlalchemy import func, and_, or_, desc, Float
from sqlalchemy.orm import Session
from database import (
    get_database_manager, Game, BettingLine, GameConditions,
    TeamPerformance, TeamStatsSnapshot
)
import pandas as pd

class NFLQueries:
    """High-level query interface for NFL betting analysis"""

    def __init__(self, db_path: str = "nfl_betting.db"):
        self.db_manager = get_database_manager(db_path)

    def get_session(self):
        """Get database session"""
        return self.db_manager.get_session()

    # ==================== GAME QUERIES ====================

    def get_games_by_week(self, season: int, week: int) -> List[Dict]:
        """Get all games for a specific week"""
        with self.get_session() as session:
            games = session.query(Game)\
                .filter(Game.season == season, Game.week == week)\
                .order_by(Game.game_date)\
                .all()

            return [self._game_to_dict(game, session) for game in games]

    def get_team_games(self, team: str, season: int = None, limit: int = None) -> List[Dict]:
        """Get games for a specific team"""
        with self.get_session() as session:
            query = session.query(Game)\
                .filter(or_(Game.home_team == team, Game.away_team == team))

            if season:
                query = query.filter(Game.season == season)

            query = query.order_by(desc(Game.game_date))

            if limit:
                query = query.limit(limit)

            games = query.all()
            return [self._game_to_dict(game, session) for game in games]

    # ==================== BETTING ANALYSIS ====================

    def get_team_ats_performance(self, team: str, season: int = None) -> Dict:
        """Get team's against-the-spread performance"""
        with self.get_session() as session:
            query = session.query(TeamPerformance)\
                .join(Game)\
                .filter(TeamPerformance.team == team)

            if season:
                query = query.filter(Game.season == season)

            performances = query.all()

            total_games = len(performances)
            ats_wins = sum(1 for p in performances if p.covered_spread)
            ats_losses = sum(1 for p in performances if p.covered_spread == False)

            return {
                'team': team,
                'season': season,
                'total_games': total_games,
                'ats_wins': ats_wins,
                'ats_losses': ats_losses,
                'ats_pushes': total_games - ats_wins - ats_losses,
                'ats_win_rate': ats_wins / total_games if total_games > 0 else 0,
                'performances': [self._performance_to_dict(p) for p in performances]
            }

    def get_over_under_trends(self, season: int = None, min_games: int = 5) -> List[Dict]:
        """Get over/under trends for all teams"""
        with self.get_session() as session:
            query = session.query(TeamPerformance.team,
                                func.count().label('total_games'),
                                func.sum(TeamPerformance.total_went_over).label('overs'),
                                func.avg(TeamPerformance.total_went_over.cast(Float)).label('over_rate'))\
                .join(Game)\
                .filter(TeamPerformance.total_went_over.isnot(None))

            if season:
                query = query.filter(Game.season == season)

            trends = query.group_by(TeamPerformance.team)\
                .having(func.count() >= min_games)\
                .order_by(desc('over_rate'))\
                .all()

            return [{
                'team': trend.team,
                'total_games': trend.total_games,
                'overs': trend.overs,
                'unders': trend.total_games - trend.overs,
                'over_rate': round(trend.over_rate, 3)
            } for trend in trends]

    # ==================== TEAM STATISTICS ====================

    def get_team_current_stats(self, team: str, season: int, week: int) -> Optional[Dict]:
        """Get team's current rolling statistics"""
        with self.get_session() as session:
            stats = session.query(TeamStatsSnapshot)\
                .filter(
                    TeamStatsSnapshot.team == team,
                    TeamStatsSnapshot.season == season,
                    TeamStatsSnapshot.week == week
                ).first()

            return self._stats_to_dict(stats) if stats else None

    def get_power_rankings(self, season: int, week: int) -> List[Dict]:
        """Get teams ranked by point differential"""
        with self.get_session() as session:
            rankings = session.query(TeamStatsSnapshot)\
                .filter(
                    TeamStatsSnapshot.season == season,
                    TeamStatsSnapshot.week == week
                )\
                .order_by(desc(TeamStatsSnapshot.point_diff_avg_5))\
                .all()

            return [self._stats_to_dict(stats) for stats in rankings]

    # ==================== BETTING LINES ====================

    def get_line_movements(self, game_id: str) -> Dict:
        """Get betting line information for a game"""
        with self.get_session() as session:
            game = session.query(Game).filter(Game.game_id == game_id).first()
            betting_line = session.query(BettingLine).filter(BettingLine.game_id == game_id).first()

            if not game or not betting_line:
                return None

            return {
                'game_id': game_id,
                'game': self._game_to_dict(game, session),
                'spread_line': betting_line.spread_line,
                'total_line': betting_line.total_line,
                'home_moneyline': betting_line.home_moneyline,
                'away_moneyline': betting_line.away_moneyline,
                'spread_odds': {
                    'home': betting_line.home_spread_odds,
                    'away': betting_line.away_spread_odds
                },
                'total_odds': {
                    'over': betting_line.over_odds,
                    'under': betting_line.under_odds
                }
            }

    # ==================== MATCHUP ANALYSIS ====================

    def get_head_to_head(self, team1: str, team2: str, last_n: int = 10) -> List[Dict]:
        """Get head-to-head matchups between two teams"""
        with self.get_session() as session:
            games = session.query(Game)\
                .filter(
                    or_(
                        and_(Game.home_team == team1, Game.away_team == team2),
                        and_(Game.home_team == team2, Game.away_team == team1)
                    )
                )\
                .order_by(desc(Game.game_date))\
                .limit(last_n)\
                .all()

            return [self._game_to_dict(game, session) for game in games]

    def get_upcoming_games(self, week: int, season: int = 2024) -> List[Dict]:
        """Get games for a specific week (for betting prep)"""
        return self.get_games_by_week(season, week)

    # ==================== EXPORT FUNCTIONS ====================

    def export_to_dataframe(self, query_result: List[Dict]) -> pd.DataFrame:
        """Convert query results to pandas DataFrame"""
        return pd.DataFrame(query_result)

    def get_team_season_summary(self, team: str, season: int) -> Dict:
        """Get comprehensive season summary for a team"""
        with self.get_session() as session:
            # Get all performances
            performances = session.query(TeamPerformance)\
                .join(Game)\
                .filter(TeamPerformance.team == team, Game.season == season)\
                .order_by(Game.week)\
                .all()

            # Get latest stats
            latest_stats = session.query(TeamStatsSnapshot)\
                .filter(
                    TeamStatsSnapshot.team == team,
                    TeamStatsSnapshot.season == season
                )\
                .order_by(desc(TeamStatsSnapshot.week))\
                .first()

            wins = sum(1 for p in performances if p.points_scored > p.points_allowed)
            losses = len(performances) - wins
            ats_wins = sum(1 for p in performances if p.covered_spread)
            overs = sum(1 for p in performances if p.total_went_over)

            return {
                'team': team,
                'season': season,
                'record': f"{wins}-{losses}",
                'win_percentage': wins / len(performances) if performances else 0,
                'ats_record': f"{ats_wins}-{len(performances) - ats_wins}",
                'ats_percentage': ats_wins / len(performances) if performances else 0,
                'over_record': f"{overs}-{len(performances) - overs}",
                'over_percentage': overs / len(performances) if performances else 0,
                'avg_points_for': sum(p.points_scored for p in performances) / len(performances) if performances else 0,
                'avg_points_against': sum(p.points_allowed for p in performances) / len(performances) if performances else 0,
                'latest_stats': self._stats_to_dict(latest_stats) if latest_stats else None,
                'total_games': len(performances)
            }

    # ==================== HELPER METHODS ====================

    def _game_to_dict(self, game: Game, session: Session) -> Dict:
        """Convert Game object to dictionary with related data"""
        betting_line = session.query(BettingLine).filter(BettingLine.game_id == game.game_id).first()

        result = {
            'game_id': game.game_id,
            'season': game.season,
            'week': game.week,
            'game_date': game.game_date.isoformat() if game.game_date else None,
            'game_type': game.game_type,
            'home_team': game.home_team,
            'away_team': game.away_team,
            'home_score': game.home_score,
            'away_score': game.away_score,
            'final_margin': game.home_score - game.away_score if game.home_score and game.away_score else None,
            'overtime': game.overtime,
            'is_divisional': game.is_divisional
        }

        if betting_line:
            result.update({
                'spread_line': betting_line.spread_line,
                'total_line': betting_line.total_line,
                'home_moneyline': betting_line.home_moneyline,
                'away_moneyline': betting_line.away_moneyline
            })

        return result

    def _performance_to_dict(self, perf: TeamPerformance) -> Dict:
        """Convert TeamPerformance to dictionary"""
        return {
            'team': perf.team,
            'is_home': perf.is_home,
            'points_scored': perf.points_scored,
            'points_allowed': perf.points_allowed,
            'covered_spread': perf.covered_spread,
            'total_went_over': perf.total_went_over,
            'moneyline_odds': perf.moneyline_odds
        }

    def _stats_to_dict(self, stats: TeamStatsSnapshot) -> Dict:
        """Convert TeamStatsSnapshot to dictionary"""
        if not stats:
            return None

        return {
            'team': stats.team,
            'season': stats.season,
            'week': stats.week,
            'pts_for_avg_3': round(stats.pts_for_avg_3, 1) if stats.pts_for_avg_3 else None,
            'pts_against_avg_3': round(stats.pts_against_avg_3, 1) if stats.pts_against_avg_3 else None,
            'point_diff_avg_3': round(stats.point_diff_avg_3, 1) if stats.point_diff_avg_3 else None,
            'pts_for_avg_5': round(stats.pts_for_avg_5, 1) if stats.pts_for_avg_5 else None,
            'pts_against_avg_5': round(stats.pts_against_avg_5, 1) if stats.pts_against_avg_5 else None,
            'point_diff_avg_5': round(stats.point_diff_avg_5, 1) if stats.point_diff_avg_5 else None,
            'win_pct_5': round(stats.win_pct_5, 3) if stats.win_pct_5 else None,
            'ats_pct_5': round(stats.ats_pct_5, 3) if stats.ats_pct_5 else None,
            'over_pct_5': round(stats.over_pct_5, 3) if stats.over_pct_5 else None,
            'season_wins': stats.season_wins,
            'season_losses': stats.season_losses,
            'season_ats_wins': stats.season_ats_wins,
            'season_ats_losses': stats.season_ats_losses
        }

# Example usage
if __name__ == "__main__":
    queries = NFLQueries()

    # Example: Get Chiefs season summary
    chiefs_summary = queries.get_team_season_summary("KC", 2024)
    print("Chiefs 2024 Summary:", chiefs_summary)

    # Example: Get power rankings for Week 10
    power_rankings = queries.get_power_rankings(2024, 10)
    print("\nTop 5 Teams by Point Differential:")
    for i, team in enumerate(power_rankings[:5]):
        print(f"{i+1}. {team['team']}: +{team['point_diff_avg_5']:.1f}")

    # Example: Get over/under trends
    over_trends = queries.get_over_under_trends(2024)
    print("\nTop 'Over' Teams:")
    for team in over_trends[:5]:
        print(f"{team['team']}: {team['over_rate']:.1%} ({team['overs']}-{team['unders']})")