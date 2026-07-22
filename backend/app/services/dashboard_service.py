from sqlalchemy.orm import Session

from app.repositories.dashboard_repository import dashboard_repository


class DashboardService:

    def get_summary(self, db: Session):
        return dashboard_repository.get_summary(db)

    def get_severity_summary(self, db: Session):
        return dashboard_repository.get_severity_summary(db)


dashboard_service = DashboardService()