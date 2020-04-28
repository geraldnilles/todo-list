#!/usr/bin/env python

import json
import uuid

from flask import Blueprint
from flask import request
from flask import make_response

from . import db

bp = Blueprint("api", __name__, url_prefix="/api")

@bp.route('/')
def docs():
    return "Todo List API page.  See the API documentation for details on how to use it"

@bp.route('/items',methods=['GET'])
def get_items():
    resp = make_response(str(db.db))
    resp.headers["Content-Type"] = "text/json"
    return resp

@bp.route('/items',methods=['POST'])
def add_new_item():
    try:
        name = request.form["name"]
    except KeyError:
        return "Error - No Name Provided"

    try: 
        category = request.form["category"]
    except KeyError:
        category = "other"

    ret = db.db.add(name,category)

    return db.db.hash()

@bp.route('/items/<uuid:item_id>',methods=['PUT'])
def modify_item(item_id):
    db.db.modify(str(item_id),request.form["name"], request.form["category"], request.form["completed"])
    return db.db.hash()


@bp.route('/items/<uuid:item_id>',methods=['DELETE'])
def delete_item(item_id):
    db.db.delete(str(item_id))
    return db.db.hash()


