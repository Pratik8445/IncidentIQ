from sqlalchemy.orm import Session

from app.auth.hashing import hashing
from app.auth.jwt import jwt_handler
from app.core.responses import success_response, error_response
from app.models.user_model import User
from app.repositories.user_repository import user_repository
from app.schemas.auth_schema import UserCreate, LoginRequest


class AuthService:

    def register(
        self,
        db: Session,
        request: UserCreate,
    ):

        existing_user = user_repository.get_by_username(
            db,
            request.username,
        )

        if existing_user:
            return error_response(
                message="Username already exists."
            )

        existing_email = user_repository.get_by_email(
            db,
            request.email,
        )

        if existing_email:
            return error_response(
                message="Email already exists."
            )

        user = User(
            username=request.username,
            email=request.email,
            hashed_password=hashing.hash_password(
                request.password
            ),
            role=request.role,
        )

        saved_user = user_repository.create(
            db,
            user,
        )

        return success_response(
            message="User registered successfully.",
            data={
                "id": saved_user.id,
                "username": saved_user.username,
                "email": saved_user.email,
                "role": saved_user.role,
            },
        )

    def login(
        self,
        db: Session,
        request: LoginRequest,
    ):

        print("=" * 60)
        print("LOGIN DEBUG")
        print("Input:", request.username)

        if "@" in request.username:
            print("Searching using EMAIL")
            user = user_repository.get_by_email(
                db,
                request.username,
            )
        else:
            print("Searching using USERNAME")
            user = user_repository.get_by_username(
                db,
                request.username,
            )

        print("User:", user)

        if user is None:
            print("❌ USER NOT FOUND")
            return error_response(
                message="Invalid username/email or password."
            )

        print("Database Username :", user.username)
        print("Database Email    :", user.email)
        print("Stored Hash       :", user.hashed_password)

        password_ok = hashing.verify_password(
            request.password,
            user.hashed_password,
        )

        print("Password Match :", password_ok)

        if not password_ok:
            print("❌ PASSWORD INCORRECT")
            return error_response(
                message="Invalid username/email or password."
            )

        print("✅ LOGIN SUCCESS")

        token = jwt_handler.create_access_token(
            {
                "sub": user.username,
                "role": user.role,
            }
        )

        return success_response(
            message="Login successful.",
            data={
                "access_token": token,
                "token_type": "Bearer",
            },
        )


auth_service = AuthService()