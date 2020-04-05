#!/usr/bin/env python

from flask import Flask
app = Flask(__name__)

@app.route('/')
def main():
    return "Main Index"

@app.route('/api/')
def api_docs():
    return "Todo List API page.  See the API documentation for details on how to use it"

@app.route('/api/items',methods=['GET'])
def get_items():
    return "All Items Listed"

@app.route('/api/items',methods=['POST'])
def add_new_item():
    return "Add a new item"

@app.route('/api/items',methods=['PUT'])
def modify_item():
    return "Modify an item"

@app.route('/api/items',methods=['DELETE'])
def delete_item():
    return "Delete an Item"


