from sqlalchemy.orm import Session
from app.services.incident_service import incident_service
from app.agents.incident_analyzer import incident_analyzer
from app.core.logging import logger
from app.core.responses import success_response
from app.models.log_model import Log
from app.repositories.log_repository import log_repository
from app.schemas.log_schema import LogCreate
from app.services.log_processor import log_processor
from app.ai.groq_service import groq_service

class LogService:

    def create_log(
        self,
        db: Session,
        log: LogCreate,
    ):

        logger.info(
            f"Received log from {log.service_name}"
        )

        processed_log = log_processor.process(log)

        log_model = Log(
            service_name=processed_log.service_name,
            environment=processed_log.environment,
            source=processed_log.source,
            host=processed_log.host,
            level=processed_log.level,
            message=processed_log.message,
            timestamp=processed_log.timestamp,
        )

        saved_log = log_repository.save(
            db=db,
            log=log_model,
        )

        return success_response(
            message="Log saved successfully.",
            data={
                "id": saved_log.id,
                "service_name": saved_log.service_name,
                "environment": saved_log.environment,
                "source": saved_log.source,
                "host": saved_log.host,
                "level": saved_log.level,
                "message": saved_log.message,
                "timestamp": saved_log.timestamp,
            },
        )

    def get_logs(
        self,
        db: Session,
        service_name: str | None = None,
        environment: str | None = None,
        level: str | None = None,
        limit: int = 20,
        offset: int = 0,
    ):

        logs = log_repository.get_logs(
            db=db,
            service_name=service_name,
            environment=environment,
            level=level,
            limit=limit,
            offset=offset,
        )

        result = []

        for log in logs:
            result.append(
                {
                    "id": log.id,
                    "service_name": log.service_name,
                    "environment": log.environment,
                    "source": log.source,
                    "host": log.host,
                    "level": log.level,
                    "message": log.message,
                    "timestamp": log.timestamp,
                }
            )

        return success_response(
            message="Logs fetched successfully.",
            data=result,
        )

    def analyze_incident(
        self,
        db: Session,
    ):

        logs = log_repository.get_recent_logs(db)

        analysis = incident_analyzer.analyze(logs)

        report = groq_service.generate_incident_report(
            analysis
        )

        saved_incident = incident_service.create_incident(
            db=db,
            severity=analysis["severity"],
            summary=analysis["summary"],
            ai_report=report,
        )

        return success_response(
            message="Incident analyzed successfully.",
            data={
                "incident_id": saved_incident.id,
                "analysis": analysis,
                "ai_report": report,
            },
        )
log_service = LogService()