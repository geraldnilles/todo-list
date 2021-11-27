#!/usr/bin/env bash

cd "$(dirname "$0")"

. venv/bin/activate

export FLASK_APP=todos
export FLASK_ENV=development
flask run -p 7060


