from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Evolve-B"
    DEBUG: bool = True

    WORLD_WIDTH: int = 2000
    WORLD_HEIGHT: int = 2000

    INITIAL_POPULATION: int = 250

    SIMULATION_TICK_RATE: int = 30

    RESOURCE_REGEN_RATE: float = 0.05

    class Config:
        env_file = ".env"


settings = Settings()
