#!/usr/bin/env bash

curl -X POST -F 'name=steak' -F 'category=meats' http://10.0.0.200:5000/api/items

