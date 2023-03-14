"""Module  contains the controller for announcement API."""

from placy.repo import AnnouncementRepo
from placy.response import AnnouncementJSON, ErrorResponse
from placy.response import Health
from placy.models import Announcement
from http import HTTPStatus
from datetime import datetime


class AnnouncementController:
    """Controller handles all incoming operations."""

    def __init__(self, announcement_repo: AnnouncementRepo):
        """Construct the Auth Controller."""
        self.repo = announcement_repo

    def health(self) -> Health:
        """Responds with health of the server."""
        return Health(status="OK", version=0.1)

    def create(self, announcement: AnnouncementJSON) -> ErrorResponse:
        """Create a announcement after validation."""
        json = announcement.dict()
        json["created_at"] = datetime.now()
        json["updated_at"] = datetime.now()

        db_response = self.repo.add_announcement(Announcement(**json))

        if (
            db_response.status != HTTPStatus.OK
            and db_response.status != HTTPStatus.CREATED
        ):
            return ErrorResponse(
                status=db_response.status,
                success=False,
                errmsg=db_response.errmsg,
            )

        return ErrorResponse(status=200, success=False, errmsg="")

    def list(self) -> list[Announcement] | ErrorResponse:
        """List all announcements."""
        db_response = self.repo.get_announcements()

        # if db_response.status != HTTPStatus.OK:
        #     return ErrorResponse(
        #         status=db_response.status,
        #         success=False,
        #         errmsg=db_response.errmsg,
        #     )

        return db_response
