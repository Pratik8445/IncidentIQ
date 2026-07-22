from sqlalchemy.orm import Session

from app.models.incident_model import Incident


class IncidentRepository:

    def save(
        self,
        db: Session,
        incident: Incident,
    ) -> Incident:

        db.add(incident)
        db.commit()
        db.refresh(incident)

        return incident

    def get_all(
        self,
        db: Session,
        limit: int = 20,
        offset: int = 0,
    ):

        return (
            db.query(Incident)
            .order_by(Incident.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )

    def get_by_id(
        self,
        db: Session,
        incident_id: int,
    ):

        return (
            db.query(Incident)
            .filter(Incident.id == incident_id)
            .first()
        )
    def assign_incident(
    self,
    db: Session,
    incident,
    assigned_to: str,
    ):
        incident.assigned_to = assigned_to

        db.commit()
        db.refresh(incident)

        return incident


    def update_status(
        self,
        db: Session,
        incident,
        status: str,
    ):
        incident.status = status

        db.commit()
        db.refresh(incident)

        return incident

incident_repository = IncidentRepository()