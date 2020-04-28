
import uuid
import json
import hashlib
import time
import threading
import time

from flask import current_app

class storage:

    def __init__(self,path):
        self.filename=path
        self.db = {}
        self._read()
        self.last_write = time.time()
        self._write()
        self.lock = threading.Lock()

    def _write(self):
        pass
        # Not writing to disk during developement
        #with open(self.filename,"w") as fp:
        #    json.dump(self.db,fp)

    def _read(self):
        try:
            with open(self.filename,"r") as fp:
                self.db = json.load(fp)
        except FileNotFoundError:
            self.db = {}

    def __str__(self):
        return json.dumps(self.db)
    
    def add(self,name, category):
        self.lock.acquire()
        item_id = str(uuid.uuid4())
        self.db[item_id] = {}
        self.db[item_id]["name"] = name
        self.db[item_id]["category"] = category
        self.db[item_id]["completed"] = False
        self.db[item_id]["time_created"] = time.time()
        self._write()
        self.lock.release()
        return item_id

    def hash(self):
        m = hashlib.sha1()
        m.update(json.dumps(self.db).encode("utf-8"))
        return m.hexdigest()

    def modify(self,item_id,name,category,completed):
        self.lock.acquire()
        try:
            self.db[item_id]["name"] = name
            self.db[item_id]["category"] = category
            self.db[item_id]["completed"] = completed
            self.db[item_id]["time_modified"] = time.time()
        except KeyError:
            self.lock.release()
            return False

        self._write()
        self.lock.release()
        return True

    def delete(self,item_id):
        self.lock.acquire()
        try:
            del self.db[item_id]
        except KeyError:
            self.lock.release()
            return False
        self._write()
        self.lock.release()
        return True

db = storage(current_app.config["DATABASE"])

