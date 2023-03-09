"""Module to run backend."""

from dotenv import load_dotenv
import os
from fastapi import FastAPI
from placy.controllers.auth import AuthController
from placy.services.config import Config
from placy.services.databases.auth_repository import AuthRepository
from placy.services.databases.otp_repository import OTPRepository
from placy.services.email import SendGridService
from placy.services.logging import DefaultLogger

from placy.placy import Placy

if __name__ == "__main__":
    app = FastAPI()
    # env = dotenv_values()
    load_dotenv()
    config = Config(
        mongo_uri=os.getenv("MONGO_URI", ""),
        sendgrid_api_key=os.getenv("SENDGRID_API_KEY", ""),
    )
    logger = DefaultLogger(config)
    auth_repo = AuthRepository(logger, config)
    otp_repo = OTPRepository(authRepo=auth_repo, logger=logger, config=config)
    email = SendGridService(config, logger)
    auth_controller = AuthController(
        otp_repo=otp_repo,
        auth_repo=auth_repo,
        config=config,
        emailService=email,
        logging=logger,
    )
    placy = Placy(
        authRepo=auth_repo,
        otpRepo=otp_repo,
        app=app,
        loggingService=logger,
        config=config,
        authController=auth_controller,
        emailService=email,
    )
    placy.setup()
    placy.routes()
    placy.run()
