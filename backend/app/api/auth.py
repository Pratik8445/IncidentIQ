from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth_schema import LoginRequest, UserCreate
from app.services.auth_service import auth_service

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register(
    request: UserCreate,
    db: Session = Depends(get_db),
):
    return auth_service.register(
        db=db,
        request=request,
    )


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    request = LoginRequest(
        username=form_data.username,
        password=form_data.password,
    )

    return auth_service.login(
        db=db,
        request=request,
    )