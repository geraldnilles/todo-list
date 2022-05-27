#!/usr/bin/env python3

import json
import uuid

from flask import Blueprint
from flask import request
from flask import make_response

from flask import current_app

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

@bp.route('/history',methods=['GET'])
def get_history():
    fn = current_app.config["HISTORY"]
    with open(fn) as f:
        hist = f.read()

    resp = make_response(str(hist))
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
        category = "Other"

    try: 
        list_name = request.form["list"]
    except KeyError:
        category = "Groceries"

    ret = db.db.add(name,category,list_name)

    return db.db.hash()

@bp.route('/items/<uuid:item_id>',methods=['PUT'])
def modify_item(item_id):
    db.db.modify(str(item_id),request.form["name"], request.form["category"], request.form["completed"])
    return db.db.hash()


@bp.route('/items/<uuid:item_id>',methods=['DELETE'])
def delete_item(item_id):
    db.db.delete(str(item_id))
    return db.db.hash()


