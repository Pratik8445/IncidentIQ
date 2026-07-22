from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from app.core.config import settings


SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


class JWTHandler:

    @staticmethod
    def create_access_token(data: dict):

        to_encode = data.copy()

        expire = datetime.now(timezone.utc) + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

        to_encode.update(
            {
                "exp": expire,
            }
        )

        return jwt.encode(
            to_encode,
            SECRET_KEY,
            algorithm=ALGORITHM,
        )

    @staticmethod
    def verify_token(token: str):

        try:
            payload = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=[ALGORITHM],
            )

            return payload

        except JWTError:
            return None


jwt_handler = JWTHandler()