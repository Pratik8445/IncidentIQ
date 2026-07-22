from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from app.database.base import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)

    severity = Column(String, nullable=False)

    summary = Column(Text, nullable=False)

    status = Column(
        String,
        nullable=False,
        default="OPEN",
    )

    assigned_to = Column(
        String,
        nullable=True,
    )

    ai_report = Column(
        Text,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    resolved_at = Column(
        DateTime,
        nullable=True,
    )