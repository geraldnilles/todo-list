#!/usr/bin/env bash

cd "$(dirname "$0")"

if [[ -d venv ]]
then
	. venv/bin/activate
fi

export FLASK_APP=todos
export FLASK_ENV=development
flask run -p 8081 --host=0.0.0.0


