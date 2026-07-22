from sqlalchemy.orm import Session

from app.models.log_model import Log


class LogRepository:

    def save(
        self,
        db: Session,
        log: Log,
    ) -> Log:

        db.add(log)

        db.commit()

        db.refresh(log)

        return log
    def get_logs(
        self,
        db: Session,
        service_name: str | None = None,
        environment: str | None = None,
        level: str | None = None,
        limit: int = 20,
        offset: int = 0,
    ):
        query = db.query(Log)

        if service_name:
            query = query.filter(Log.service_name == service_name)

        if environment:
            query = query.filter(Log.environment == environment)

        if level:
            query = query.filter(Log.level == level)

        return query.offset(offset).limit(limit).all()
    def get_recent_logs(
        self,
        db: Session,
        limit: int = 100,
    ):

        return (
            db.query(Log)
            .order_by(Log.timestamp.desc())
            .limit(limit)
            .all()
        )
    
    def get_recent_logs(
    self,
    db: Session,
    limit: int = 100,
    ):
        return (
            db.query(Log)
            .order_by(Log.timestamp.desc())
            .limit(limit)
            .all()
        )

log_repository = LogRepository()