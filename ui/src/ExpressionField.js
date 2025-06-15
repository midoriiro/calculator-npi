import { TextField } from "@mui/material";
import React, { forwardRef, useImperativeHandle, useState } from "react";

function isValueEmpty(value) {
    return value.endsWith(' ') || value === '';
}

function isValueOperator(value) {
    return ['+', '-', '*', '/'].includes(value);
}

function isValueNumber(value) {
    return '0123456789'.includes(value);
}

function isValueDot(value) {
    return value === '.';
}

function isLastItemEmpty(lastItem) {
    return lastItem.endsWith(' ') || lastItem === '';
}

function isLastItemOperator(lastItem) {
    return ['+', '-', '*', '/'].includes(lastItem.slice(-1));
}

function isLastItemNumber(lastItem) {
    return '0123456789'.includes(lastItem.slice(-1));
}

function isLastItemDot(lastItem) {
    return lastItem.endsWith('.');
}

function handleEmpty({ newStack, lastItem, value }) {
    console.log("handleEmpty", `'${lastItem}'`, `'${value}'`);
    if (isLastItemEmpty(lastItem)) {
        if (lastItem === '') {
            lastItem = ' '
        }
        lastItem += ' ';
        newStack[newStack.length - 1] = lastItem;
    } else {
        newStack.push(" ");
    }
    return newStack;
}

function handleOperator({ newStack, lastItem, value }) {
    if (isLastItemEmpty(lastItem)) {
        const trimmed = lastItem.trim();
        if (trimmed === '') newStack.pop();
        else newStack[newStack.length - 1] = trimmed;
        newStack.push(value);
    } else if (isLastItemOperator(lastItem) || isLastItemNumber(lastItem)) {
        newStack.push(value);
    }
    return newStack;
}

function handleNumber({ newStack, lastItem, value }) {
    if (isLastItemEmpty(lastItem)) {
        const trimmed = lastItem.trim();
        if (trimmed === '') newStack.pop();
        else newStack[newStack.length - 1] = trimmed;
        newStack.push(value);
    } else if (isLastItemOperator(lastItem)) {
        newStack.push(value);
    } else if (isLastItemNumber(lastItem) || isLastItemDot(lastItem)) {
        newStack[newStack.length - 1] = lastItem + value;
    }
    return newStack;
}

function handleDot({ newStack, lastItem }) {
    if (isLastItemEmpty(lastItem)) {
        return newStack;
    }
    if (isLastItemNumber(lastItem)) {
        newStack[newStack.length - 1] = lastItem + '.';
    } else if (isLastItemOperator(lastItem)) {
        return newStack;
    } else if (isLastItemDot(lastItem)) {
        lastItem = lastItem.slice(0, -1);
        newStack[newStack.length - 1] = lastItem;
        newStack.push(' ');
    }

    return newStack;
}

function parseStackExpression(prevStack, value) {
    const newStack = [...prevStack];
    const lastItem = newStack[newStack.length - 1] ?? '';

    console.log("parse", `'${lastItem}'`, `'${value}'`);

    const context = {
        newStack,
        lastItem,
        value,
    };

    if (isValueEmpty(value)) {
        return handleEmpty(context);
    }

    if (isValueOperator(value)) {
        return handleOperator(context);
    }

    if (isValueNumber(value)) {
        return handleNumber(context);
    }

    if (isValueDot(value)) {
        return handleDot(context);
    }

    return newStack;
}

function cleanStackIfLastItemIsSpaces(stack) {
    const newStack = [...stack];
    const lastItem = newStack[newStack.length - 1] ?? '';
    if (lastItem === ' ' || (newStack.length === 1)) {
        // we need this temporary token for further processing
        return newStack;
    }
    const trimmed = lastItem.trim();
    if (trimmed === '') newStack.pop();
    else newStack[newStack.length - 1] = trimmed;
    if (lastItem === '') {
        newStack.pop();
    }
    return newStack;
}

const ExpressionField = forwardRef((props, ref) => {
    const [stack, setStack] = useState(["1", "3", "+", "3", "+", "7", "+"]);
    const [color, setColor] = useState('secondary');

    const pop = () => {
        setStack(prev => prev.slice(0, -1));
    };

    const handleTextChange = (event) => {
        const value = stack.join(' ');
        const input = event.target.value.slice(value.length, event.target.value.length);
        let currentStack = [...stack];
        if (input === '') { // backspace
            pop();
            return;
        }
        else if (input === ' ' && currentStack.length === 0) {
            currentStack.push(' ');
        }
        for (let i = 0; i < input.length; i++) {
            const value = input[i];
            if (isValueEmpty(value) == false) {
                currentStack = cleanStackIfLastItemIsSpaces(currentStack);
            }
            currentStack = parseStackExpression(currentStack, value);
        }
        setStack(currentStack);
    };

    useImperativeHandle(ref, () => ({
        push: (input) => {
            let currentStack = [...stack];
            for (let i = 0; i < input.length; i++) {
                const value = input[i];
                if (isValueEmpty(value) == false) {
                    currentStack = cleanStackIfLastItemIsSpaces(currentStack);
                }
                currentStack = parseStackExpression(currentStack, value);
            }
            setStack(currentStack);
        },
        pop: () => {
            setStack(prev => prev.slice(0, -1));
        },
        clear: () => {
            setStack([]);
        },
        expression: () => {
            return stack.join(' ');
        },
        valid: () => {
            setColor('success');
        },
        invalid: () => {
            setColor('error');
        }
    }));

    return (
        <TextField
            fullWidth
            label="Expression"
            variant="standard"
            color={color}
            value={stack.join(' ')}
            onChange={handleTextChange}
        />
    );
});

export default ExpressionField;