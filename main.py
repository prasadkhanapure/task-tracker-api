from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()

tasks = [
            {"task_id": 1, "title": "Learn Python",  "completed": False},
            {"task_id": 2, "title": "Read a book", "completed": False},
            {"task_id": 3, "title": "Complete the workout", "completed": False}
        ]

@app.get("/")
async def fetch_data():
    return {"message": "GET call fetched"}

@app.get("/hello") 
async def say_hello():
    return {"message": "Hello World !!"}

@app.get("/tasks/{task_id}")
async def get_task_id(task_id: int):
    for task in tasks:
        if task["task_id"] == task_id:
            return task
    
    raise HTTPException(status_code=404, detail="Task not found!")

class TaskRequest(BaseModel):
    title: str = Field(min_length=1)
    
@app.post("/tasks/", status_code=201)
async def create_task(taskPayload: TaskRequest):

    new_id = max((task["task_id"] for task in tasks),default=0) + 1
       
    new_task = {
        "task_id": new_id,
        "title": taskPayload.title,
        "completed": False
    }

    tasks.append(new_task)
    return new_task


class TaskUpdate(BaseModel):
    title: str
    completed: bool

@app.put("/task/{task_id}")
async def update_task(task_id: int, payload: TaskUpdate):
    for task in tasks:
        if task["task_id"] == task_id:
            task["title"] = payload.title
            task["completed"] = payload.completed
            return task

    raise HTTPException(status_code=404, detail="Task not found!")

@app.delete("/tasks/{task_id}")
async def delete_task(task_id:int):
    # pass
    for task in tasks:
        if task["task_id"] == task_id:
            tasks.remove(task)
            return {"message": f"Task with task ID: {task_id} is removed successfully"}

    raise HTTPException(status_code=404, detail= "Task not found!")
