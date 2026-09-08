"""Pytest configuration: run the suite against an isolated temporary SQLite file."""

import os
import tempfile
from pathlib import Path

TEST_DB = Path(tempfile.gettempdir()) / f"heriguide-pytest-{os.getpid()}.db"
TEST_DB.unlink(missing_ok=True)
os.environ["HERIGUIDE_DATABASE_URL"] = f"sqlite:///{TEST_DB.as_posix()}"
os.environ["HERIGUIDE_SEED_DEMO"] = "true"
os.environ["HERIGUIDE_CORS_ORIGINS"] = "*"


def pytest_sessionfinish(session, exitstatus):
    try:
        TEST_DB.unlink(missing_ok=True)
    except PermissionError:
        pass
