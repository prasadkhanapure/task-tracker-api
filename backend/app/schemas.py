from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    # completed: bool

class TaskUpdate(BaseModel):
    title: str
    completed: bool

class TaskPatch(BaseModel):
    title: str | None = None
    completed: bool | None = None