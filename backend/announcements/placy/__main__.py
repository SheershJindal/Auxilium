"""Module contains entrypoint for announcement API."""

from fastapi import FastAPI
from dotenv import dotenv_values
from placy.config import Config
from placy.controller import AnnouncementController
from placy.placy import Placy
from placy.repo import AnnouncementRepo


if __name__ == "__main__":
    app = FastAPI()

    env = dotenv_values()
    config = Config(mongo_uri=env["MONGO_URI"] if "MONGO_URI" in env else "")
    repo = AnnouncementRepo(config)
    controller = AnnouncementController(repo)
    placy = Placy(app, repo, controller)

    placy.setup()
    placy.routes()
    placy.run()
