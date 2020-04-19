#!/usr/bin/env python

import json
import uuid

from flask import Flask
from flask import request
from flask import make_response
app = Flask(__name__)

import storage
db = storage.storage("todolist.json")

@app.route('/')
def main():
    return "Main Index Template"

@app.route('/api/')
def api_docs():
    return "Todo List API page.  See the API documentation for details on how to use it"

@app.route('/api/items',methods=['GET'])
def get_items():
    resp = make_response(str(db))
    resp.headers["Content-Type"] = "text/json"
    return resp

@app.route('/api/items',methods=['POST'])
def add_new_item():
    try:
        name = request.form["name"]
    except KeyError:
        return "Error - No Name Provided"

    try: 
        category = request.form["category"]
    except KeyError:
        category = "uncategorized"

    ret = db.add(name,category)

    return db.hash()

@app.route('/api/items/<uuid:item_id>',methods=['PUT'])
def modify_item(item_id):
    return "Modify an item"
    db.modify(item_id,request.form["name"], request.form["category"])
    return db.hash()

@app.route('/api/items/<uuid:item_id>',methods=['DELETE'])
def delete_item(item_id):
    return "Delete an Item"
    ret = db.delete(item_id)



