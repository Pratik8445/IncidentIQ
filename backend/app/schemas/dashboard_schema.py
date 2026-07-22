from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_incidents: int
    open: int
    in_progress: int
    resolved: int
    closed: int


class SeveritySummary(BaseModel):
    critical: int
    high: int
    medium: int
    low: int