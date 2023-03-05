"""Module defines routes for announcement API."""

from placy.controller import AnnouncementController
from fastapi import FastAPI
from fastapi import Response


from placy.response import AnnouncementJSON, ErrorResponse


def setupAnnouncementRoutes(app: FastAPI, controller: AnnouncementController) -> None:
    """Configure announcement routes."""

    @app.post(
        "/announcement/create",
        response_model=ErrorResponse,
        response_model_exclude_none=True,
        response_description="Post announcement",
    )
    def create(announcement: AnnouncementJSON, temp: Response):
        """Handle announcement creation."""
        response = controller.create(announcement)
        temp.status_code = response.status
        return response
