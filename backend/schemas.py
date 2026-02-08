
from pydantic import BaseModel, Json
from typing import List, Optional, Any
from datetime import datetime

class AnalysisBase(BaseModel):
    summary: str
    laws: str
    analysis_content: str
    web_research: str
    web_sources: Json  # Automatically parses JSON string from DB

class AnalysisCreate(AnalysisBase):
    pass

class Analysis(AnalysisBase):
    id: int
    judgment_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class JudgmentBase(BaseModel):
    filename: str

class JudgmentCreate(JudgmentBase):
    pass

class Judgment(JudgmentBase):
    id: int
    upload_date: datetime
    analyses: List[Analysis] = []

    class Config:
        orm_mode = True

class JudgmentHistory(BaseModel):
    id: int
    filename: str
    upload_date: datetime
    summary_snippet: Optional[str] = None
