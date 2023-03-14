"""Module defines all database models."""

from mongoengine import DateTimeField, Document
from mongoengine import StringField


class Announcement(Document):
    """Model for an announcement."""

    title = StringField(required=True, unique=False)
    deadline = DateTimeField(required=True)

    created_at = DateTimeField(required=True)
    updated_at = DateTimeField(required=True)

    subtitle = StringField(required=True)
    link = StringField(required=True)
    content = StringField(required=True)
