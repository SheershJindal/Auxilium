"""Module contains entrypoint for announcement API."""

from fastapi import FastAPI
from placy.controller import AnnouncementController
from placy.placy import Placy
from placy.repo import AnnouncementRepo


if __name__ == "__main__":
    app = FastAPI()

    repo = AnnouncementRepo()
    controller = AnnouncementController(repo)
    placy = Placy(app, repo, controller)

    placy.setup()
    placy.routes()
    placy.run()
