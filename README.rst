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

WebSocket
---------

The WebSocket will connect to the server.  The server will periodically send
the database hash to the connected clients (every 30s or so).  Whenever there
is an update, the hash will also be shared asyncronously to notify all other
clients that a change occured and that they should update thier database

Autocomplete
------------

AUtocomplete database will be maintained on the serverside periodically.  Items
that were created and deleted veery quickly (within 5 minutes) will not be
added since they were likely a mistake.  Items that were created and placed in
a category and were not deleted for more than 5 minutes, they will be added
tothe list.  

If an item alreayd exists in the list, the counter will increase.  This coutner will be used to prioritize selections. 

Small words (to, the, a, an) will be ignored in the lookup

If a catagory changes but the item name is the same, the auto-complete database
will be updated with the most recenlty used catagory. 

User Interface
--------------

Text box at the top.  Type in an item and hit enter when done.   

A drop down will be used to show suggestions.  Clicking the suggestion will
select the item.  Pressing the tab key will selec the first item.  Enter still
needs to be entered after selectiong an auto-comeplte item

By default, all new items (that were not auto-selected) will be "uncategorized".

Below the text box will be the list of TODOs.  THe left box of TODOs will be
the Check box that makes an item as complete.  The middle will be the item.
The right will be be a 3-dot menu that lets you categorize and directly delete
items.  

