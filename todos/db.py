
import uuid
import json
import hashlib
import time
import threading

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
        with open(self.filename,"w") as fp:
            json.dump(self.db,fp)

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
        self._write()
        self.lock.release()
        return item_id

    def hash(self):
        m = hashlib.sha1()
        m.update(json.dumps(self.db).encode("utf-8"))
        return m.hexdigest()

    def modify(self,item_id,name,category):
        self.lock.acquire()
        try:
            self.db[item_id]["name"] = name
            self.db[item_id]["category"] = category
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



if __name__ == "__main__":

    x = storage("test.json")

    #x.add({"name":"Milk"})
    print (x.hash())
    x.delete("4756a6c3-7d7f-4fb1-82a4-cc290742c6eb")
    print (x.hash())

