#!/usr/bin/env python

import json
import time
import http.client

t_now = time.time()

def load_db():

    with open("../instance/todos.json","r") as f:
        return json.load(f)

def load_history():

    try:
        with open("../instance/history.json","r") as f:
            return json.load(f)

    except FileNotFoundError:
        return {}

def save_history(hist):
    with open("../instance/history.json","w") as f:
        return json.dump(hist,f)


## {'name': 'Everspring dish soap', 'category': 'Supplies', 'list': 'Target', 'completed': False, 'time_created': 1592457286.8794255, 'time_modified': 1592457430.5244365}

db = load_db()

hist =  load_history()

for uuid, item in db.items():

    # If not complete, ignore
    if not item["completed"]:
        continue

    # If completed less than 24 hours ago, ignore
    if item["time_modified"] > ( t_now - (24*60*60) ):
        continue

    # Dete from the database
    conn = http.client.HTTPConnection("127.0.0.1",7060)
    conn.request("DELETE","/api/items/"+uuid)
    print ("Deleted Item",conn.getresponse().status)
    conn.close()

    # Do not save Movies and TV shows into the autocomplete history database
    if item["list"] == "WatchList" :
        continue


    # Add Item to History
    key = item["name"].lower().strip()

    if key not in hist:
        print ("Adding New Item to History:",item["name"])
        entry = {
            "name": item["name"],
            "category": item["category"],
            "count": 1
            }
        hist[key] = entry

    else:
        print ("Increasing Counter:",item["name"])
        hist[key]["count"] += 1
        # Overwrite latest changes to spelling or category
        hist[key]["name"] = item["name"]
        hist[key]["category"] = item["category"]


    

save_history(hist)


