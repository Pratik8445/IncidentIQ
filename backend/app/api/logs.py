from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.permissions import require_roles
from app.database.session import get_db
from app.schemas.log_schema import LogCreate
from app.services.log_service import log_service

router = APIRouter(
    prefix="/api/v1/logs",
    tags=["Logs"],
)


@router.post("/")
def create_log(
    log: LogCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(["ADMIN", "ENGINEER"])),
):
    return log_service.create_log(db, log)


@router.get("/")
def get_logs(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(["ADMIN", "ENGINEER", "VIEWER"])
    ),
):
    return log_service.get_logs(db)


@router.post("/analyze")
def analyze_incident(
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(["ADMIN", "ENGINEER"])),
):
    return log_service.analyze_incident(db)