import os
from datetime import datetime
from typing import List

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

from .calculator import calculate_rpn
from .database import Operation, get_db

app = FastAPI(title="RPN Calculator API")


class CalculationRequest(BaseModel):
    expression: str


@app.post("/calculate")
async def calculate(request: CalculationRequest):
    try:
        result = calculate_rpn(request.expression)
        db = next(get_db())
        operation = Operation(
            expression=request.expression, result=result, timestamp=datetime.now()
        )
        db.add(operation)
        db.commit()
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/export")
async def export_operations():
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

        csv_path = "operations.csv"
        df.to_csv(csv_path, index=False)

        return FileResponse(csv_path, media_type="text/csv", filename="operations.csv")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
