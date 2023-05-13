from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DBConnection(BaseModel):
    serverName: str
    admin: str
    password: str

class Todo(BaseModel):
    todo: str
    is_done: Optional[int] = 0
    created: datetime