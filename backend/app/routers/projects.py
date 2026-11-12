from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from app.database import get_db
from app.models import Project
from app.schemas import ProjectCreate, ProjectUpdate, ProjectResponse

router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)

@router.post("/", status_code=201, response_model=ProjectResponse)
def create_project(projectpayload: ProjectCreate, db:Session = Depends(get_db)):
    new_project = Project(
        name = projectpayload.name,
        description = projectpayload.description   
    )

    try:
        db.add(new_project)
        db.commit()
        db.refresh(new_project)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to create project"
        )

    return new_project

@router.get("/",response_model=list[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    statement = select(Project).order_by(Project.project_id)
    projects = db.scalars(statement).all()
    return projects

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project_id(
    project_id: int, 
    db:Session = Depends(get_db)
):

    statement = select(Project).where(Project.project_id == project_id)
    project = db.scalars(statement).first()

    if project is None:
            raise HTTPException(status_code=404, detail="Project not found!")
    
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(project_id: int, payload: ProjectUpdate, db: Session = Depends(get_db)):
    try:
        project = db.get(Project, project_id)
        if project is None:
            raise HTTPException(status_code=404, detail="Project not found!")

        project.name = payload.name
        project.description = payload.description

        db.commit()
        db.refresh(project)

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to update Project"
        )
        
    return project

@router.delete("/{project_id}")
def delete_project(
    project_id: int, 
    db: Session = Depends(get_db)
):

    try: 
        project = db.get(Project, project_id)
        if project is None:
            raise HTTPException(status_code=404, detail= "Project is not found!")

        db.delete(project)
        db.commit()

    except IntegrityError as error:
        db.rollback()

        if getattr(error.orig, "sqlstate", None) == "23503":
            raise HTTPException(
                status_code=409,
                detail="Cannot delete project because it contains tasks"
            )

        raise HTTPException(
            status_code=500,
            detail="Unable to delete project"
        )

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to delete Project"
        )
    
    return {"message": f"Project {project_id} deleted successfully"}