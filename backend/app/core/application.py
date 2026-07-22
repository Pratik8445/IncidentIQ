from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import settings
from app.core.logging import logger

from app.database.base import Base
from app.database.database import engine
from app.models import log_model
from app.models import incident_model
from app.models import user_model
def create_app():

    logger.info("Creating AI Operations Center application...")

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description=settings.APP_DESCRIPTION,
    )

    # Create database tables
    Base.metadata.create_all(bind=engine)

    app.include_router(api_router)

    logger.info("Application initialized successfully.")

    return app