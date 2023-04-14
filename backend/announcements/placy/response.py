"""Module defines models for repsonses."""

from pydantic import BaseModel


class Health(BaseModel):
    """Health model defines the server's health."""

    status: str
    version: float


class ErrorResponse(BaseModel):
    """Error Response defines default error response from server."""

    status: int
    success: bool
    errmsg: str


class AnnouncementJSON(BaseModel):
    """Defines the announcement schema for FastAPI."""

    title: str
    deadline: str

    subtitle: str
    link: str
    content: str
