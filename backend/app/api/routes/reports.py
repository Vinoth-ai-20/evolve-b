from fastapi import APIRouter

from app.analytics.report_generator import (
    generate_report,
)

router = APIRouter()


@router.get("/")
async def report():

    return generate_report()
