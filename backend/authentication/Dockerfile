FROM python:3.10-slim-buster

MAINTAINER pspiagicw

RUN apt update && apt install -y git

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN pip install poetry poethepoet && poe init-simple

CMD ["poe","run"]
