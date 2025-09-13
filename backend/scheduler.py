"""
NFL Pipeline Scheduler
Runs the autonomous pipeline on a schedule during NFL season
"""

import time
import schedule
from datetime import datetime, date
from autonomous_pipeline import AutonomousNFLPipeline

def run_pipeline():
    """Execute the pipeline and log results"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n[{timestamp}] Starting scheduled pipeline run...")

    try:
        pipeline = AutonomousNFLPipeline()
        result = pipeline.run()

        if result['games_updated'] > 0:
            print(f"[{timestamp}] ✅ Updated {result['games_updated']} games")
        else:
            print(f"[{timestamp}] ✅ Database current, no updates needed")

    except Exception as e:
        print(f"[{timestamp}] ❌ Pipeline failed: {e}")

def is_nfl_season():
    """Check if we're currently in NFL season (September-February)"""
    today = date.today()
    month = today.month
    return month >= 9 or month <= 2

def main():
    """Set up scheduling based on NFL season context"""
    print("🏈 NFL Pipeline Scheduler Starting...")

    if is_nfl_season():
        # During season: run every 4 hours
        schedule.every(4).hours.do(run_pipeline)
        print("📅 NFL Season detected - Running every 4 hours")
    else:
        # Off-season: run daily at 6 AM
        schedule.every().day.at("06:00").do(run_pipeline)
        print("📅 Off-season detected - Running daily at 6 AM")

    # Run once immediately
    run_pipeline()

    # Keep running scheduled jobs
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    main()