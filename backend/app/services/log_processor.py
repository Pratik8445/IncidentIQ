from app.schemas.log_schema import LogCreate
from app.core.logging import logger


class LogProcessor:
    """
    Processes incoming log entries before storage.
    """

    def process(self, log: LogCreate) -> LogCreate:

        logger.info("Starting log processing.")

        log.environment = log.environment.lower()

        log.level = log.level.upper()

        log.service_name = log.service_name.strip()

        log.source = log.source.strip()

        log.host = log.host.strip()

        log.message = log.message.strip()

        logger.info("Log processing completed.")

        return log


log_processor = LogProcessor()