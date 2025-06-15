from datetime import datetime, timezone

from pydantic import BaseModel, Field


class CalculationRequest(BaseModel):
    """Request model for RPN calculation endpoint.

    This model represents the input data required for performing an RPN calculation.
    """

    expression: str = Field(
        ..., 
        description="The RPN expression to evaluate", 
        example="2 3 +"
    )


class CalculationResponse(BaseModel):
    """Response model for RPN calculation results.

    This model represents the output data returned after a successful RPN calculation,
    including the result, original expression, and timestamp of the calculation.
    """

    result: float = Field(
        ...,
        description="The calculated result of the RPN expression",
        example=5.0
    )
    expression: str = Field(
        ...,
        description="The original RPN expression that was evaluated",
        example="2 3 +",
    )
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="The UTC timestamp when the calculation was performed",
    )


class CalculationError(BaseModel):
    """Model for error responses when calculation fails."""

    detail: str = Field(
        ...,
        description="Error message describing what went wrong",
    )


class ExportError(BaseModel):
    """Model for error responses when export fails."""

    detail: str = Field(
        ...,
        description="Error message describing what went wrong",
    )


class ClearResponse(BaseModel):
    """Model for successful database clearing operations."""
    
    message: str = Field(
        ...,
        description="Success message confirming the operation(s) was cleared",
        example="All operations have been cleared successfully"
    )


class ClearError(BaseModel):
    """Model for error responses when clearing operations fails."""
    
    detail: str = Field(
        ...,
        description="Error message describing what went wrong during operations clearing",
    )


class HealthCheck(BaseModel):
    """Response model to validate and return when performing a health check."""

    status: str = "OK"
