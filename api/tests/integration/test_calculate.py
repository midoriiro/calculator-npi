from rpn_calculator.calculator import DivisionByZeroError, NotEnoughOperandsError, TooManyOperandsError
import pytest


def test_health_check(api_client):
    response = api_client("GET", "/health")
    assert response.status_code == 200
    assert response.json() == {"status": "OK"}


@pytest.mark.parametrize(
    "expression,expected",
    [
        ("2 3 +", 5),
        ("5 3 -", 2),
        ("4 2 *", 8),
        ("6 2 /", 3),
        ("2 3 4 + *", 14),  # (3 + 4) * 2
        ("3 4 2 * +", 11),  # 3 + (4 * 2)
    ],
)
def test_basic_operations(api_client, expression: str, expected: float):
    response = api_client("POST", "/calculate", json={"expression": expression})
    assert response.status_code == 200
    assert response.json()["result"] == expected


def test_invalid_expression(api_client):
    response = api_client(
        "POST", "/calculate", json={"expression": "2 + 3"}  # Expression non-RPN
    )
    assert response.status_code == 400
    assert str(NotEnoughOperandsError()) == response.json()["detail"]


def test_division_by_zero(api_client):
    response = api_client("POST", "/calculate", json={"expression": "2 0 /"})
    assert response.status_code == 400
    assert str(DivisionByZeroError()) == response.json()["detail"]


def test_empty_expression(api_client):
    response = api_client("POST", "/calculate", json={"expression": ""})
    assert response.status_code == 400
    assert str(TooManyOperandsError()) == response.json()["detail"]
