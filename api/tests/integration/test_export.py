import pytest
import pandas as pd
from io import StringIO

def test_export_empty_operations(api_client):
    response = api_client("GET", "/export")
    assert response.status_code == 200
    assert "\n" == response.text

def test_export_with_operations(api_client):
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
    
    response = api_client("GET", "/export")
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert response.headers["content-disposition"] == 'attachment;filename=operations.csv'
    
    df = pd.read_csv(StringIO(response.text))
    assert len(df) == len(operations)
    
    for op in operations:
        assert any(
            (df["expression"] == op["expression"]) & 
            (df["result"] == op["expected"])
        )
    