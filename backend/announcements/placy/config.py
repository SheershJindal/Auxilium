"""Module declaring a config class."""


class Config:
    """Config Service."""

    def __init__(self, mongo_uri: str):
        """Initialize the config class."""
        if mongo_uri == "":
            raise ValueError("MONGO URI empty")

        self.mongo_uri = mongo_uri
