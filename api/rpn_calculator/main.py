from datetime import datetime
from io import StringIO

import os
import json
import pandas as pd
from fastapi import FastAPI, status
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from .calculator import CalculatorError, calculate_rpn
from .database import Operation, get_db
from .models import (
    CalculationError,
    CalculationRequest,
    CalculationResponse,
    ClearError,
    ClearResponse,
    ExportError,
    HealthCheck,
)

app = FastAPI(title="RPN Calculator API")

ORIGINS = os.getenv("ORIGINS")
if not ORIGINS:
    raise EnvironmentError("ORIGINS environment variable is not set")

origins = json.loads(ORIGINS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)


@app.get(
    "/health",
    response_model=HealthCheck,
    status_code=status.HTTP_200_OK,
)
async def health_check() -> HealthCheck:
    """Endpoint to check the health of the API."""
    return HealthCheck(status="OK")


@app.post(
    "/calculate",
    response_model=CalculationResponse,
    responses={
        200: {"description": "Successful calculation", "model": CalculationResponse},
        400: {"description": "Calculation error", "model": CalculationError},
    },
)
async def calculate(
    request: CalculationRequest,
):
    """Calculate the result of a Reverse Polish Notation (RPN) expression.

    Args:
        request (CalculationRequest): The RPN expression to calculate

    Returns:
        Union[CalculationResponse, CalculationError]: The calculation result with original expression and timestamp,
        or an error response if calculation fails
    """
    try:
        result = calculate_rpn(request.expression)
        db = next(get_db())
        operation = Operation(
            expression=request.expression, result=result, timestamp=datetime.now()
        )
        db.add(operation)
        db.commit()
        return CalculationResponse(
            result=result, expression=request.expression, timestamp=operation.timestamp
        )
    except CalculatorError as e:
        return JSONResponse(
            status_code=400,
            content=CalculationError(detail=str(e)).model_dump(),
        )


@app.get(
    "/export",
    response_class = StreamingResponse,
    responses={
        200: {"description": "Successful export of operations to CSV"},
        500: {"description": "Internal server error during export", "model": ExportError},
    }
)
async def export_operations():
    """Endpoint to export all operations to a CSV file."""
    try:
        db = next(get_db())
        operations = db.query(Operation).all()

        df = pd.DataFrame(
            [
                {
                    "expression": op.expression,
                    "result": op.result,
                    "timestamp": op.timestamp,
                }
                for op in operations
            ]
        )

        buffer = StringIO()
        df.to_csv(buffer, index=False)
        response = StreamingResponse(
            iter([buffer.getvalue()]),
            media_type='text/csv',
            headers={
                'Content-Disposition': 'attachment;filename=operations.csv',
                'Access-Control-Expose-Headers': 'Content-Disposition'
            }
        )
        return response
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content=ExportError(detail=str(e)).model_dump(),
        )


@app.delete(
    "/clear",
    responses={
        200: {"description": "Successfully cleared all operations from database", "model": ClearResponse},
        500: {"description": "Internal server error during database clearing", "model": ClearError},
    }
)
async def clear_operations():
    """Endpoint to clear all operations from the database."""
    try:
        db = next(get_db())
        db.query(Operation).delete()
        db.commit()
        return ClearResponse(message="All operations have been cleared successfully")
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content=ClearError(detail=str(e)).model_dump(),
        )
