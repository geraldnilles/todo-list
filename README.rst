###########
 ToDo List
###########

A mobile-optimized website for collaberating on a todo list and grocery list.

Features
========

RESTful API - This will make it easy to integrate with other systems like The
Amazon Echo

WebSocket - 

Offline Mode - The TODO list will fully function when offline.  As soon as the
device returns online, it will syncronize the data.

Ephemeral - CHecked items will auto delete after a week.

Categories - Items can be catagorized (Frozen, Produce, Butcher, Refrigerated,
International, etc...)

Autocomplete - A database of commonly used items will be maintained (allong
with their category).  When new items are typed in, a drop-down suggestion will
be made based on history.

Auto-Capitalize - Items will be auto-capitalized to make it pretty!

Implementation
==============

Database
--------

The TODO Database will simply be a JSON text file stored on the disk.  

The database will rate-limit the number of disk-writes to once every 10 minutes
to keep the response time fast

The auto-correct database will be a separate file. that is also a JSON file.  

REST
----

All the REST commands will be semt to the /api/items URL

GET for downloading the entire TODO Database.

POST for adding a new item on the list.  The body will contain a JSON of the new item to be added

PUT for modifying an item (like making it as complete, or changing the category)

DELETE for deleting an item 

When GET is used, the JSON file will be returned in addition to a SHA1 Hash of
the JSON string.  The hash and the JSON should be stored in variable in the web
client

When POST, PUT, or DELETE are used, it will return the previous database hash
as well as the updated database hash.  If the previous database hash matches,
the local variable, it is known that the local client was the one that made the
change and the client app can simply replace the hash with the new hash.  If
the previous hash does not match, that means a separate client updated the TODO
list and the local client should re-download the entire database

