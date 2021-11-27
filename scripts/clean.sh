#!/usr/bin/env bash

# Change the Working directory to the scripts location
cd "$(dirname "$0")"

# Jump back to the root
cd ..

. venv/bin/activate

cd ../todos

while true
do
    sleep 3600
    python clean.py

done

