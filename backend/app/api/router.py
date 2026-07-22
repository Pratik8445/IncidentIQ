from fastapi import APIRouter
from app.api.incidents import router as incident_router
from app.api.health import router as health_router
from app.api.logs import router as logs_router
from app.api.auth import router as auth_router
from app.api import dashboard
api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(logs_router)
api_router.include_router(incident_router)
api_router.include_router(auth_router)
api_router.include_router(dashboard.router)