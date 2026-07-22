from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class IncidentCreate(BaseModel):
    severity: str
    summary: str
    ai_report: str


class IncidentResponse(BaseModel):
    id: int
    severity: str
    summary: str
    status: str
    assigned_to: str | None
    ai_report: str
    created_at: datetime
    updated_at: datetime
    resolved_at: datetime | None

    class Config:
        from_attributes = True


class IncidentStatusUpdate(BaseModel):
    status: Literal[
        "OPEN",
        "IN_PROGRESS",
        "RESOLVED",
        "CLOSED",
    ]


class IncidentAssign(BaseModel):
    assigned_to: str