#!/usr/bin/env bash

. venv/bin/activate

export FLASK_APP=todos
export FLASK_ENV=development
flask run -h 0.0.0.0

