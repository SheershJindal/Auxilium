"""Module defines a application for defining dependencies."""

from placy.controller import AnnouncementController
from placy.repo import AnnouncementRepo
from placy.response import Health
from placy.router import setupAnnouncementRoutes
from fastapi import FastAPI
import uvicorn


class Placy:
    """Application initlizes the backend."""

    def __init__(
        self,
        app: FastAPI,
        announcmentRepo: AnnouncementRepo,
        announcementController: AnnouncementController,
    ) -> None:
        """Initialize the application."""
        self.controller = announcementController
        self.repo = announcmentRepo
        self.app = app

    def setup(self) -> None:
        """Configure the backend application."""
        self.repo.setup()

    def routes(self) -> None:
        """Route all requests."""

        @self.app.get(
            "/health",
            response_model=Health,
            response_description="Check the health of the server",
        )
        def health():
            """Router handles request for health."""
            response = self.controller.health()
            return response

        setupAnnouncementRoutes(app=self.app, controller=self.controller)

    def run(self) -> None:
        """Run the application with given settings."""
        uvicorn.run(self.app, port=5000, log_level="info", host="0.0.0.0")
