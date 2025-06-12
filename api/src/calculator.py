def calculate_rpn(expression: str) -> float:
    """
    Calculate the result of a Reverse Polish Notation expression.

    Args:
        expression (str): RPN expression (ex: "3 4 +")

    Returns:
        float: Calculation result

    Raises:
        ValueError: If the expression is invalid
    """
    stack = []
    tokens = expression.split()

    for token in tokens:
        if token in "+-*/":
            if len(stack) < 2:
                raise ValueError("Invalid expression: not enough operands")

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
                    raise ValueError("Division by zero")
                stack.append(a / b)
        else:
            try:
                stack.append(float(token))
            except ValueError:
                raise ValueError(f"Invalid token: {token}")

    if len(stack) != 1:
        raise ValueError("Invalid expression: too many operands")

    return stack[0]
