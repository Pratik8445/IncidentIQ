from sqlalchemy import DateTime, Integer, String

from app.database.base import Base
from sqlalchemy.orm import Mapped, mapped_column


class Log(Base):
    __tablename__ = "logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    service_name: Mapped[str] = mapped_column(String(100))

    environment: Mapped[str] = mapped_column(String(30))

    source: Mapped[str] = mapped_column(String(100))

    host: Mapped[str] = mapped_column(String(100))

    level: Mapped[str] = mapped_column(String(20))

    message: Mapped[str] = mapped_column(String)

    timestamp: Mapped[DateTime] = mapped_column(DateTime)