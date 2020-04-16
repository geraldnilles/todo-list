
import uuid
import json
import hashlib
import time

class storage:

    def __init__(self,path):
        self.filename=path
        self.db = {}
        self._read()
        self.last_write = time.time()

    def _write(self):
        with open(self.filename,"w") as fp:
            json.dump(self.db,fp)

    def _read(self):
        try:
            with open(self.filename,"r") as fp:
                self.db = json.load(fp)
        except FileNotFoundError:
            self.db = {}

    def add(self,item):
        item_id = str(uuid.uuid4())
        self.db[item_id] = item
        self._write()
        return item_id

    def hash(self):
        m = hashlib.sha1()
        m.update(json.dumps(self.db).encode("utf-8"))
        return m.hexdigest()

    def modify(self,item_id,item):
        self.db[item_id] = item
        self._write()

    def delete(self,item_id):
        try:
            del self.db[item_id]
        except KeyError:
            return    
        self._write()
        return True


if __name__ == "__main__":

    x = storage("test.json")

    #x.add({"name":"Milk"})
    print (x.hash())
    x.delete("4756a6c3-7d7f-4fb1-82a4-cc290742c6eb")
    print (x.hash())

