"""Module contains database operations related to announcement API."""

from placy.config import Config
from placy.models import Announcement
from http import HTTPStatus
from collections import namedtuple
from mongoengine import connect


DatabaseResponse = namedtuple("DatabaseResponse", ["status", "errmsg", "data"])


class AnnouncementRepo:
    """Repository for announcements."""

    def __init__(self, config: Config):
        """Initialize the announcement repository."""
        self.config = config

    def setup(self):
        """Configure the announcement repository."""
        connection_url = self.config.mongo_uri + "/placy"
        connect(db="placy")

    def get_announcements(self):
        """List all announcements."""
        return DatabaseResponse(status=200, errmsg="", data=Announcement.objects)

    def add_announcement(self, announcement: Announcement) -> DatabaseResponse:
        """Add the announcement to the database."""
        response = None

        try:
            response = announcement.save(force_insert=True)

        except Exception as e:
            return DatabaseResponse(
                data="", errmsg=str(e), status=HTTPStatus.INTERNAL_SERVER_ERROR
            )
        if response.id:
            return DatabaseResponse(data=id, errmsg="", status=HTTPStatus.CREATED)
        else:
            return DatabaseResponse(
                data="",
                errmsg="Error saving announcement to database",
                status=HTTPStatus.INTERNAL_SERVER_ERROR,
            )
