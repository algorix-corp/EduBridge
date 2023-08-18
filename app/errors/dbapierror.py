from starlette.responses import JSONResponse


def database_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected database error occurred. Please try again later.",
        },
    )
