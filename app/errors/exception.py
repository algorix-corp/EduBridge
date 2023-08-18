from starlette.responses import JSONResponse


def other_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected error occurred. Please try again later.",
        },
    )
