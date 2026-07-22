from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.permissions import require_roles
from app.database.session import get_db
from app.services.dashboard_service import dashboard_service

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(["ADMIN", "ENGINEER", "VIEWER"])
    ),
):
    return dashboard_service.get_summary(db)


@router.get("/severity")
def get_severity_summary(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles(["ADMIN", "ENGINEER", "VIEWER"])
    ),
):
    return dashboard_service.get_severity_summary(db)