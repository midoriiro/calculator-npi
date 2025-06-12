import pytest

from src.calculator import calculate_rpn


def test_addition():
    assert calculate_rpn("3 4 +") == 7
    assert calculate_rpn("1 2 + 3 +") == 6


def test_subtraction():
    assert calculate_rpn("5 3 -") == 2
    assert calculate_rpn("10 4 3 - -") == 9


def test_multiplication():
    assert calculate_rpn("4 5 *") == 20
    assert calculate_rpn("2 3 4 * *") == 24


def test_division():
    assert calculate_rpn("10 2 /") == 5
    assert calculate_rpn("24 4 2 / /") == 12


def test_complex_expressions():
    assert calculate_rpn("3 4 5 * +") == 23
    assert calculate_rpn("3 4 + 5 *") == 35


def test_invalid_expressions():
    with pytest.raises(ValueError):
        calculate_rpn("3 +")  # Not enough operands

    with pytest.raises(ValueError):
        calculate_rpn("3 4 5 +")  # Too many operands

    with pytest.raises(ValueError):
        calculate_rpn("3 0 /")  # Division by zero

    with pytest.raises(ValueError):
        calculate_rpn("3 abc +")  # Invalid token
