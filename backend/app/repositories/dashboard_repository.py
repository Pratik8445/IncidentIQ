from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.incident_model import Incident


class DashboardRepository:

    def get_summary(self, db: Session):
        return {
            "total_incidents": db.query(func.count(Incident.id)).scalar(),

            "open": db.query(func.count(Incident.id))
            .filter(Incident.status == "OPEN")
            .scalar(),

            "in_progress": db.query(func.count(Incident.id))
            .filter(Incident.status == "IN_PROGRESS")
            .scalar(),

            "resolved": db.query(func.count(Incident.id))
            .filter(Incident.status == "RESOLVED")
            .scalar(),

            "closed": db.query(func.count(Incident.id))
            .filter(Incident.status == "CLOSED")
            .scalar(),
        }

    def get_severity_summary(self, db: Session):
        return {
            "critical": db.query(func.count(Incident.id))
            .filter(Incident.severity == "CRITICAL")
            .scalar(),

            "high": db.query(func.count(Incident.id))
            .filter(Incident.severity == "HIGH")
            .scalar(),

            "medium": db.query(func.count(Incident.id))
            .filter(Incident.severity == "MEDIUM")
            .scalar(),

            "low": db.query(func.count(Incident.id))
            .filter(Incident.severity == "LOW")
            .scalar(),
        }


dashboard_repository = DashboardRepository()