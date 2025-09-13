"""
NFL Betting Database Models and Schema
Normalized 3NF design following atomic principles and A+ storage practices
"""

from datetime import datetime
from typing import Optional, List
from sqlalchemy import (
    create_engine, Column, Integer, String, Float, Boolean, Date, Text,
    ForeignKey, UniqueConstraint, Index, CheckConstraint, DateTime
)
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import func

Base = declarative_base()

class Game(Base):
    """Core game facts - immutable, atomic data"""
    __tablename__ = 'games'

    game_id = Column(String(20), primary_key=True)  # '2024_01_BAL_KC'
    season = Column(Integer, nullable=False)
    week = Column(Integer, nullable=False)
    game_date = Column(Date, nullable=False)
    game_type = Column(String(3), nullable=False)  # REG, WC, DIV, CON, SB
    home_team = Column(String(3), nullable=False)
    away_team = Column(String(3), nullable=False)
    home_score = Column(Integer)
    away_score = Column(Integer)
    overtime = Column(Boolean, default=False)
    is_divisional = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    betting_line = relationship("BettingLine", back_populates="game", uselist=False)
    game_conditions = relationship("GameConditions", back_populates="game", uselist=False)
    team_performances = relationship("TeamPerformance", back_populates="game")

    # Constraints
    __table_args__ = (
        UniqueConstraint('season', 'week', 'home_team', 'away_team'),
        CheckConstraint('game_type IN ("REG", "WC", "DIV", "CON", "SB")'),
        CheckConstraint('week BETWEEN 1 AND 22'),
        CheckConstraint('season >= 2000'),
        Index('idx_games_date', 'game_date'),
        Index('idx_games_teams', 'home_team', 'away_team'),
        Index('idx_games_week', 'season', 'week'),
    )

    def __repr__(self):
        return f"<Game({self.game_id}: {self.away_team}@{self.home_team} W{self.week})>"

class BettingLine(Base):
    """Betting market data - separate concern from game facts"""
    __tablename__ = 'betting_lines'

    game_id = Column(String(20), ForeignKey('games.game_id'), primary_key=True)
    spread_line = Column(Float)  # Positive = home team favored
    home_spread_odds = Column(Integer)
    away_spread_odds = Column(Integer)
    total_line = Column(Float)
    over_odds = Column(Integer)
    under_odds = Column(Integer)
    home_moneyline = Column(Integer)
    away_moneyline = Column(Integer)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    game = relationship("Game", back_populates="betting_line")

    def __repr__(self):
        return f"<BettingLine({self.game_id}: {self.spread_line} / {self.total_line})>"

class GameConditions(Base):
    """Game environment metadata - optional contextual data"""
    __tablename__ = 'game_conditions'

    game_id = Column(String(20), ForeignKey('games.game_id'), primary_key=True)
    stadium_id = Column(String(10))
    stadium_name = Column(Text)
    roof = Column(String(15))  # closed, outdoors, open, retractable
    surface = Column(String(15))  # grass, a_turf, fieldturf
    temperature = Column(Float)
    wind_speed = Column(Float)
    referee = Column(String(50))

    # Relationships
    game = relationship("Game", back_populates="game_conditions")

    # Note: Removed overly restrictive CHECK constraints to allow all surface/roof types from data

    def __repr__(self):
        return f"<GameConditions({self.game_id}: {self.stadium_name})>"

class TeamPerformance(Base):
    """Team performance per game - atomic unit of team stats"""
    __tablename__ = 'team_performances'

    performance_id = Column(Integer, primary_key=True, autoincrement=True)
    game_id = Column(String(20), ForeignKey('games.game_id'), nullable=False)
    team = Column(String(3), nullable=False)
    is_home = Column(Boolean, nullable=False)
    points_scored = Column(Integer)
    points_allowed = Column(Integer)
    covered_spread = Column(Boolean)
    total_went_over = Column(Boolean)
    moneyline_odds = Column(Integer)
    spread_odds = Column(Integer)

    # Relationships
    game = relationship("Game", back_populates="team_performances")

    __table_args__ = (
        UniqueConstraint('game_id', 'team'),
        Index('idx_performances_team', 'team', 'game_id'),
    )

    def __repr__(self):
        location = "vs" if self.is_home else "@"
        return f"<TeamPerformance({self.team} {self.points_scored} W{self.game.week})>"

class TeamStatsSnapshot(Base):
    """Rolling statistics snapshot - computed time-series data"""
    __tablename__ = 'team_stats_snapshot'

    snapshot_id = Column(Integer, primary_key=True, autoincrement=True)
    team = Column(String(3), nullable=False)
    season = Column(Integer, nullable=False)
    week = Column(Integer, nullable=False)

    # 3-game rolling averages
    pts_for_avg_3 = Column(Float)
    pts_against_avg_3 = Column(Float)
    point_diff_avg_3 = Column(Float)

    # 5-game rolling averages
    pts_for_avg_5 = Column(Float)
    pts_against_avg_5 = Column(Float)
    point_diff_avg_5 = Column(Float)

    # Performance percentages (5-game)
    win_pct_5 = Column(Float)
    ats_pct_5 = Column(Float)  # Against the spread
    over_pct_5 = Column(Float)  # Over/under

    # Season cumulative
    season_wins = Column(Integer)
    season_losses = Column(Integer)
    season_ats_wins = Column(Integer)
    season_ats_losses = Column(Integer)

    # Metadata
    computed_at = Column(DateTime, default=func.now())

    __table_args__ = (
        UniqueConstraint('team', 'season', 'week'),
        Index('idx_stats_team_week', 'team', 'season', 'week'),
        CheckConstraint('week BETWEEN 1 AND 22'),
        CheckConstraint('season >= 2000'),
    )

    def __repr__(self):
        return f"<TeamStats({self.team} {self.season} W{self.week})>"

# Database utilities
class DatabaseManager:
    """Database connection and session management"""

    def __init__(self, db_path: str = "nfl_betting.db"):
        self.db_path = db_path
        self.engine = create_engine(f"sqlite:///{db_path}", echo=False)
        self.SessionLocal = sessionmaker(bind=self.engine)

    def create_tables(self):
        """Create all tables and indexes"""
        Base.metadata.create_all(bind=self.engine)

    def get_session(self):
        """Get database session with automatic cleanup"""
        return self.SessionLocal()

    def execute_raw_sql(self, sql: str):
        """Execute raw SQL for custom operations"""
        with self.engine.connect() as conn:
            return conn.execute(sql)

    def vacuum(self):
        """Optimize database size and performance"""
        with self.engine.connect() as conn:
            conn.execute("VACUUM")
            conn.execute("ANALYZE")

# Initialize database instance
def get_database_manager(db_path: str = "nfl_betting.db") -> DatabaseManager:
    """Get configured database manager instance"""
    return DatabaseManager(db_path)

if __name__ == "__main__":
    # Create database and tables for testing
    db = get_database_manager()
    db.create_tables()
    print("Database schema created successfully!")