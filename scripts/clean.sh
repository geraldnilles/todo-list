#!/usr/bin/env bash

# Change the Working directory to the scripts location
cd "$(dirname "$0")"

# Jump back to the root
cd ..

if [[ -d venv ]]
then
	. venv/bin/activate
fi

cd todos

python clean.py


