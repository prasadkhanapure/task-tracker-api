from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy import select
from app.schemas import TaskCreate, TaskUpdate, TaskPatch
from app.database import get_db
from app.models import Task
from sqlalchemy.orm import Session

app = FastAPI()

@app.get("/tasks/")
async def fetch_data(db: Session = Depends(get_db),offset: int = 0, limit: int = Query(default=10, ge=1, le=100)):
    
    statement = select(Task).order_by(Task.task_id).offset(offset).limit(limit) 
    tasks = db.scalars(statement).all()
    
    return tasks

@app.get("/tasks/{task_id}")
async def get_task_id(
    task_id: int, 
    db:Session=Depends(get_db)
):

    statement = select(Task).where(Task.task_id == task_id)
    task = db.scalars(statement).first()

    # task = db.get(Task, task_id)
    # This retrieves an object by its primary key and can use the session's identity map 
    # when the object is already loaded.

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found!")

    return task

@app.post("/tasks/", status_code=201)
async def create_task(
    taskPayload: TaskCreate, 
    db: Session = Depends(get_db)
):

    new_task = Task(
        title=taskPayload.title,
        completed=False
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

@app.put("/tasks/{task_id}")
async def update_task(
    task_id: int, 
    payload: TaskUpdate,
    db: Session = Depends(get_db)
):
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found!")

    task.title = payload.title
    task.completed = payload.completed

    db.commit()
    db.refresh(task)
    return task

@app.patch("/tasks/{task_id}")
async def update_task_using_patch(
    task_id: int,
    payload: TaskPatch,
    db: Session = Depends(get_db)
):
    
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail= "Task not found!")

    update = payload.model_dump(exclude_unset=True)

    for key, value in update.items():
        setattr(task, key , value)
    
    db.commit()
    db.refresh(task)
    return task

@app.delete("/tasks/{task_id}")
async def delete_task(
    task_id:int,
    db: Session = Depends(get_db)
):
   
    task = db.get(Task, task_id)
    
    if task is None:
        raise HTTPException(status_code=404, detail= "Task not found!")

    db.delete(task)
    db.commit()

    return {"message": f"Task {task_id} deleted successfully"}
