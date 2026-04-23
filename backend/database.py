from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./denovo_ai.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class GenerationHistory(Base):
    __tablename__ = "generation_history"

    id = Column(Integer, primary_key=True, index=True)
    feature = Column(String(100), nullable=False)
    input_summary = Column(String(500), nullable=False)
    output = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def save_history(feature: str, input_summary: str, output: str):
    db = SessionLocal()
    try:
        record = GenerationHistory(
            feature=feature,
            input_summary=input_summary[:500],
            output=output,
        )
        db.add(record)
        db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()
