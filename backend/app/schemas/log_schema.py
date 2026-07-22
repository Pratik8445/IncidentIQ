from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class LogCreate(BaseModel):
    service_name: str = Field(..., min_length=2, max_length=100)

    environment: Literal[
        "development",
        "testing",
        "staging",
        "production",
    ]

    source: str = Field(..., min_length=2, max_length=100)

    host: str = Field(..., min_length=2, max_length=100)

    level: Literal[
        "DEBUG",
        "INFO",
        "WARNING",
        "ERROR",
        "CRITICAL",
    ]

    message: str = Field(..., min_length=5)

    timestamp: datetime