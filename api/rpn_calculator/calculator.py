class CalculatorError(Exception):
    pass


class InvalidExpressionError(CalculatorError):
    def __init__(self, reason: str):
        super().__init__(f"Invalid expression: {reason}")


class TooManyOperandsError(InvalidExpressionError):
    def __init__(self):
        super().__init__("Too many operands")


class NotEnoughOperandsError(InvalidExpressionError):
    def __init__(self):
        super().__init__("Not enough operands")


class DivisionByZeroError(CalculatorError):
    def __init__(self):
        super().__init__("Division by zero")


class InvalidTokenError(CalculatorError):
    def __init__(self, token: str):
        super().__init__(f"Invalid token: {token}")


def calculate_rpn(expression: str) -> float:
    """
    Calculate the result of a Reverse Polish Notation expression.

    Args:
        expression (str): RPN expression (ex: "3 4 +")

    Returns:
        float: Calculation result

    Raises:
        InvalidExpressionError: If the expression is invalid
        TooManyOperandsError: If there are too many operands in the expression
        NotEnoughOperandsError: If there are not enough operands for an operation
        DivisionByZeroError: If division by zero is attempted
        InvalidTokenError: If an invalid token is encountered
    """
    stack = []
    tokens = expression.split()

    for token in tokens:
        if token in "+-*/":
            if len(stack) < 2:
                raise NotEnoughOperandsError()

            b = stack.pop()
            a = stack.pop()

            if token == "+":
                stack.append(a + b)
            elif token == "-":
                stack.append(a - b)
            elif token == "*":
                stack.append(a * b)
            elif token == "/":
                if b == 0:
                    raise DivisionByZeroError()
                stack.append(a / b)
        else:
            try:
                stack.append(float(token))
            except ValueError:
                raise InvalidTokenError(token)

    if len(stack) != 1:
        raise TooManyOperandsError()

    return stack[0]
