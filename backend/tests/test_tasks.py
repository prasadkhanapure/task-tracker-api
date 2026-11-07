from unittest.mock import MagicMock
from fastapi.testclient import TestClient
import pytest
from app.main import app
from app.database import get_db
from app.models import Task

@pytest.fixture
def mock_db():
    db_mock = MagicMock()

    def override_get_db():
        yield db_mock

    app.dependency_overrides[get_db] = override_get_db

    try:
        yield db_mock
    finally:
        app.dependency_overrides.pop(get_db, None)

def test_get_task_success(mock_db):
    
    fake_task = Task(
        task_id=1,
        title="Learn fast API",
        completed= False
    )

    mock_db.scalars.return_value.first.return_value = fake_task

    client = TestClient(app)
    response = client.get("/tasks/1")

    assert response.status_code == 200
    assert isinstance(response.json(), dict)
    assert response.json()["title"] == "Learn fast API"

def test_get_task_not_found(mock_db):

    mock_db.scalars.return_value.first.return_value = None

    client = TestClient(app)
    response = client.get("/tasks/1")

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found!"
