from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.incident_service import incident_service
from app.auth.dependencies import get_current_user

from app.auth.permissions import require_roles
from app.database.session import get_db
from app.schemas.incident_schema import (
    IncidentAssign,
    IncidentStatusUpdate,
)
from app.services.incident_service import incident_service
router = APIRouter(
    prefix="/api/v1/incidents",
    tags=["Incidents"],
)


@router.get("/")
def get_all_incidents(
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return incident_service.get_all_incidents(
        db,
        limit,
        offset,
    )


@router.get("/{incident_id}")
def get_incident(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return incident_service.get_incident(
        db,
        incident_id,
    )
@router.patch("/{incident_id}/assign")
def assign_incident(
    incident_id: int,
    request: IncidentAssign,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(["ADMIN", "ENGINEER"])),
):
    return incident_service.assign_incident(
        db=db,
        incident_id=incident_id,
        assigned_to=request.assigned_to,
    )
@router.patch("/{incident_id}/status")
def update_status(
    incident_id: int,
    request: IncidentStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(["ADMIN", "ENGINEER"])),
):
    return incident_service.update_status(
        db=db,
        incident_id=incident_id,
        status=request.status,
    )