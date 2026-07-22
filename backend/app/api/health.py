from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def home():
    return {
        "status": "success",
        "message": "Welcome to AI Operations Center 🚀",
        "version": "1.0.0"
    }


@router.get("/health")
def health_check():
    return {
        "status": "healthy"
    }