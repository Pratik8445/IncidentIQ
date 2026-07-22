from sqlalchemy.orm import Session

from app.core.responses import success_response
from app.models.incident_model import Incident
from app.repositories.incident_repository import incident_repository
from datetime import datetime
from fastapi import HTTPException


class IncidentService:

    def create_incident(
        self,
        db: Session,
        severity: str,
        summary: str,
        ai_report: str,
    ):

        incident = Incident(
            severity=severity,
            summary=summary,
            ai_report=ai_report,
        )

        saved_incident = incident_repository.save(
            db,
            incident,
        )

        return saved_incident

    def get_all_incidents(
        self,
        db: Session,
        limit: int = 20,
        offset: int = 0,
    ):

        incidents = incident_repository.get_all(
            db,
            limit,
            offset,
        )

        return success_response(
            message="Incidents fetched successfully.",
            data=incidents,
        )

    def get_incident(
        self,
        db: Session,
        incident_id: int,
    ):

        incident = incident_repository.get_by_id(
            db,
            incident_id,
        )

        if incident is None:
            return success_response(
                message="Incident not found.",
                data=None,
            )

        return success_response(
            message="Incident fetched successfully.",
            data=incident,
        )

    def assign_incident(
        self,
        db: Session,
        incident_id: int,
        assigned_to: str,
    ):
        incident = incident_repository.get_by_id(
            db,
            incident_id,
        )

        if incident is None:
            raise HTTPException(
                status_code=404,
                detail="Incident not found.",
            )

        return incident_repository.assign_incident(
            db,
            incident,
            assigned_to,
        )

    def update_status(
        self,
        db: Session,
        incident_id: int,
        status: str,
    ):
        incident = incident_repository.get_by_id(
            db,
            incident_id,
        )

        if incident is None:
            raise HTTPException(
                status_code=404,
                detail="Incident not found.",
            )

        if status == "RESOLVED":
            incident.resolved_at = datetime.utcnow()

        return incident_repository.update_status(
            db,
            incident,
            status,
        )


incident_service = IncidentService()