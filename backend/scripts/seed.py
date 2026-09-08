"""Seed a fresh HeriGuide database from the demo dataset."""

import argparse

from app.database import SessionLocal, engine, init_db
from app import models  # noqa: F401


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed the HeriGuide database.")
    parser.add_argument("--reset", action="store_true", help="Drop all tables before seeding.")
    args = parser.parse_args()
    if args.reset:
        models.Base.metadata.drop_all(bind=engine)
    init_db(seed=True)
    print("Seed completed.")


if __name__ == "__main__":
    main()
