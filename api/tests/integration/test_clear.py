import pytest
import pandas as pd
from io import StringIO

def test_clear_with_operations(api_client):
    operations = [
        {"expression": "2 3 +", "expected": 5},
        {"expression": "4 5 *", "expected": 20},
        {"expression": "10 2 /", "expected": 5}
    ]
    
    for op in operations:
        response = api_client(
            "POST",
            "/calculate",
            json={"expression": op["expression"]}
        )
        assert response.status_code == 200
    
    response = api_client("DELETE", "/clear")
    assert response.status_code == 200
    assert response.json()["message"] == "All operations have been cleared successfully"

    response = api_client("GET", "/export")
    assert response.status_code == 404
    assert "No operations found" == response.json()["detail"]
    