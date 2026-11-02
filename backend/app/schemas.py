from pydantic import BaseModel, Field, ConfigDict, model_validator

class TaskBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
class TaskCreate(TaskBase):
    title: str = Field(min_length=1)
    # completed: bool

class TaskUpdate(TaskBase):
    title: str = Field(min_length=1)
    completed: bool

class TaskPatch(TaskBase):
    @model_validator(mode="after")

    def validate_patch(self):
        if not self.model_fields_set:
            raise ValueError("At least one field must be provided")

        if "title" in self.model_fields_set and self.title is None:
            raise ValueError("Title cannot be null")
        
        if "completed" in self.model_fields_set and self.completed is None:
            raise ValueError("completed cannot be null")
        
        return self
    
    title: str | None = Field(default=None, min_length=1)
    completed: bool | None = None