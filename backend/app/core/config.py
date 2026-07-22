from pathlib import Path

from dotenv import dotenv_values
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BASE_DIR / ".env"

print("ENV FILE:", ENV_FILE)
print("ENV VALUES:", dotenv_values(ENV_FILE))


class Settings(BaseSettings):
    APP_NAME: str
    APP_VERSION: str
    APP_DESCRIPTION: str

    SECRET_KEY: str

    DEBUG: bool
    ENVIRONMENT: str

    GROQ_API_KEY: str
    GROQ_MODEL: str

    API_PREFIX: str
    DATABASE_URL: str

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        case_sensitive=True,
    )


settings = Settings()