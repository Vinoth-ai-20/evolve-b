from pydantic import BaseModel, Field


class EnvironmentUpdateRequest(BaseModel):
    temperature: float = Field(
        ge=0.0,
        le=1.0,
    )

    humidity: float = Field(
        ge=0.0,
        le=1.0,
    )

    sunlight: float = Field(
        ge=0.0,
        le=1.0,
    )

    resource_regeneration_rate: float = Field(
        ge=0.001,
        le=1.0,
    )


class EnvironmentResponse(BaseModel):
    temperature: float
    humidity: float
    sunlight: float
    resource_regeneration_rate: float
