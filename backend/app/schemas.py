from pydantic import BaseModel, ConfigDict, Field, model_validator
from typing import Literal
from datetime import datetime

TaskPriority = Literal["none", "low", "medium", "high"]


class TaskBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)


class TaskCreate(TaskBase):
    title: str = Field(min_length=1)
    project_id: int = Field(gt=0)
    priority: TaskPriority = "none"
    due_at: datetime | None = None
    # completed: bool


class TaskUpdate(TaskBase):
    title: str = Field(min_length=1)
    completed: bool
    project_id: int = Field(gt=0)
    priority: TaskPriority = "none"
    due_at: datetime | None = None


class TaskPatch(TaskBase):
    @model_validator(mode="after")
    def validate_patch(self):
        if not self.model_fields_set:
            raise ValueError("At least one field must be provided")

        if "title" in self.model_fields_set and self.title is None:
            raise ValueError("Title cannot be null")

        if "completed" in self.model_fields_set and self.completed is None:
            raise ValueError("completed cannot be null")

        if "priority" in self.model_fields_set and self.priority is None:
            raise ValueError("Priority cannot be null")

        return self

    title: str | None = Field(default=None, min_length=1)
    completed: bool | None = None
    priority: TaskPriority | None = None
    due_at: datetime | None = None


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    task_id: int
    title: str
    completed: bool
    project_id: int
    priority: TaskPriority
    due_at: datetime | None


class TaskListResponse(BaseModel):
    items: list[TaskResponse]
    total: int
    offset: int
    limit: int


class ProjectBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)


class ProjectCreate(ProjectBase):
    name: str = Field(min_length=1)
    description: str | None = None


class ProjectUpdate(ProjectBase):
    name: str = Field(min_length=1)
    description: str | None = None


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    project_id: int
    name: str
    description: str | None


class ProjectStatsResponse(BaseModel):
    project_id: int
    name: str
    total_tasks: int
    completed_tasks: int
    pending_tasks: int


class DashboardResponse(BaseModel):
    total_projects: int
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
