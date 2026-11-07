from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy import func, select
from app.schemas import TaskCreate, TaskListResponse, TaskResponse, TaskUpdate, TaskPatch
from app.database import get_db
from app.models import Task
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/tasks/", response_model=TaskListResponse)
def fetch_data(
        db: Session = Depends(get_db),
        offset: int = Query(default=0, ge=0), 
        limit: int = Query(default=10, ge=1, le=100),
        completed: bool | None = None
    ):
    
    statement = select(Task).order_by(Task.task_id)
    count_statement = select(func.count()).select_from(Task)

    if completed is not None:
        statement = statement.where(Task.completed == completed)
        count_statement = count_statement.where(
                Task.completed == completed
            )

    
    statement = statement.offset(offset).limit(limit)
    tasks = db.scalars(statement).all()
    total = db.scalar(count_statement)

    return {
        "items": tasks,
        "total": total,
        "limit": limit,
        "offset": offset
    }

@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task_id(
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

@app.post("/tasks/", status_code=201, response_model=TaskResponse)
def create_task(
    taskPayload: TaskCreate, 
    db: Session = Depends(get_db)
):

    new_task = Task(
        title=taskPayload.title,
        completed=False
    )

    try:
        db.add(new_task)
        db.commit()
        db.refresh(new_task)

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to Create Task"
        )

    return new_task

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int, 
    payload: TaskUpdate,
    db: Session = Depends(get_db)
):
    try:
        task = db.get(Task, task_id)
        if task is None:
            raise HTTPException(status_code=404, detail="Task not found!")
        
        task.title = payload.title
        task.completed = payload.completed

        db.commit()
        db.refresh(task)
    
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to update Task"
        )

    return task

@app.patch("/tasks/{task_id}", response_model=TaskResponse)
def update_task_using_patch(
    task_id: int,
    payload: TaskPatch,
    db: Session = Depends(get_db)
):
    
    try:
        task = db.get(Task, task_id)
        if task is None:
            raise HTTPException(status_code=404, detail= "Task not found!")

        update = payload.model_dump(exclude_unset=True)

        for key, value in update.items():
            setattr(task, key , value)

        db.commit()
        db.refresh(task)

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to update Task"
        )
    return task

@app.delete("/tasks/{task_id}")
def delete_task(
    task_id:int,
    db: Session = Depends(get_db)
):
   
    try:
        task = db.get(Task, task_id)
        if task is None:
            raise HTTPException(status_code=404, detail= "Task not found!")
        
        db.delete(task)
        db.commit()

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to delete Task"
        )

    return {"message": f"Task {task_id} deleted successfully"}
