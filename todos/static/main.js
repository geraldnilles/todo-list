var sug_db = {};

// Mark and Item as complete when 
function bind_checkboxes(){
    var checkboxes = document.querySelectorAll("input[type='checkbox']");
	for (var i = 0; i < checkboxes.length; i++){
		var c = checkboxes[i];
		c.onchange = function(e){
            var li = e.target.closest("li");
            set_task_color(li);

            modify_task(li);

		}
	}
}

function bind_category_dropdowns(){
    var dropdowns = document.querySelectorAll("a.dropdown-item");
	for (var i = 0; i < dropdowns.length; i++){
		dropdowns[i].onclick = function(e){
            var li = e.target.closest("li");
            // Update the button Label
            li.querySelector(".task_category").textContent = e.target.textContent; 
            // Send the change to the server
            set_task_color(li);
            modify_task(li);
		}
	}
}

function bind_task_edit(){
    var task_names = document.querySelectorAll(".task_name");
	for (var i = 0; i < task_names.length; i++){
        var t = task_names[i];
        t.onclick = function(e){
            // Remove the on-click for now so that we cant add more buttons
            var li = e.target.closest("li");
            render_task_edit(li);
            li.querySelector("input[name='name']").focus();
        }
    }
}

function set_task_color(li){
    
    if (li.querySelector("input[type='checkbox']").checked) {
        li.classList.add("list-group-item-dark");
    } else {
        li.classList.remove("list-group-item-dark");
    }
   
    // Set the catagory Button Color
    var b = li.querySelector(".task_category");
    let color_code = {
        "Other": "btn-outline-secondary",
        "Toiletries": "btn-outline-secondary",
        "Packaged": "btn-outline-dark",
        "Supplies": "btn-outline-warning",
        "Dairy": "btn-outline-primary",
        "Produce": "btn-outline-success",
        "Freezer": "btn-outline-info",
        "Meat": "btn-outline-danger"
    }

    // Wipe out previous color data
    for (var key in color_code){
       b.classList.remove(color_code[key]); 
    }

    b.classList.add(color_code[b.textContent]);
    
}

function modify_task(li) {
    var formData = new FormData();
    formData.append("name",li.querySelector(".task_name").textContent);
    formData.append("category",li.querySelector(".task_category").textContent);
    formData.append("completed",li.querySelector("input[type='checkbox']").checked);

    var uuid = li.getAttribute("uuid");

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // TODO CHeck if hash changed noticablly. If not, then return
            // Otherwise pull down the latest DB
            download_db();
        }
    };
    request.open("PUT", "api/items/"+uuid);
    request.send(formData);
}

function delete_task(li) {

    var uuid = li.getAttribute("uuid");
    // TODO Delete DOM element

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // TODO CHeck if hash changed noticablly. If not, then return
            // Otherwise pull down the latest DB
            download_db();
        }
    };
    request.open("DELETE", "api/items/"+uuid);
    request.send();
}

function add_task(e){
    if (e.target.querySelector("input").value == "" ){
        return;
    }
    var formData = new FormData(e.target);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // TODO CHeck if hash changed noticablly. If not, then return
            // Otherwise pull down the latest DB
            download_db();
            e.target.querySelector("input").value="";
        }
    };
    request.open("POST", "api/items");
    request.send(formData);
}

function add_suggestion(t){
    
    var formData = new FormData();
    formData.append("name",t["name"]);
    formData.append("category",t["category"]);
    formData.append("list",get_list_name());

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // TODO CHeck if hash changed noticablly. If not, then return
            // Otherwise pull down the latest DB
            download_db();
            // Clear Input Txt Box
            document.querySelector("form.main div input[type='text']").value="";
            // CLear SUggestions
            document.querySelector("ul.suggest").innerHTML="";
        }
    }
    request.open("POST", "api/items");
    request.send(formData);
}

function bind_form(){
    var f = document.querySelector("form.main");
    f.onsubmit = function(e){
        // Do not submit the form and refresh the page
        // We will use XHR instead
        e.preventDefault();
        add_task(e);
    }
}

function bind_autocomplete(){
    var i = document.querySelector("form.main div input[type='text']");
    i.onkeyup = function(e){
        render_suggestions(e.target.value);
    }
}

function get_list_name(){
    var f = document.querySelector("form.main");
    return f.querySelector("input[name='list']").value;
}

function set_list_name(list_name){
    var f = document.querySelector("form.main");
    f.querySelector("input[name='list']").value = list_name;
}

function bind_toggle(){
    var bg = document.querySelector("div.btn-group");
    var buttons = bg.querySelectorAll("button");
    buttons.forEach(function(b){
        b.onclick = function(e){
            buttons.forEach(function(a){
                a.classList.remove("active"); 
            });
            e.target.classList.add("active");

            set_list_name(e.target.textContent);
            download_db();
        }
    });
}

function download_history(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Load the history file into a variable
            var db = JSON.parse(request.responseText);
            // Sort the sug_db by number of hits in history counter
            sug_db = sorted_suggestions(db);
        }
    };
    request.open("GET", "api/history");
    request.send();
    
}

function download_db(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Conver the database to JSON and render
            render_list(JSON.parse(request.responseText));
        }
    };
    request.open("GET", "api/items");
    request.send();
    
}

function render_task_edit(li){
    // If an item is already being edited, then ignore any further edit
    // requests
    var numForms = document.querySelectorAll("form").length;
    if (numForms > 1) {
        return
    }

    var template = document.querySelector("#task_edit_tmpl");
    var new_item = template.content.cloneNode(true);
    // Embed the existing data into the redndering element
    new_item.querySelector("input[name='name']").value = li.querySelector(".task_name").textContent;
    new_item.querySelector("input[name='category']").value = li.querySelector(".task_category").textContent;
    li.innerHTML= "";
    li.appendChild(new_item);

    // Called when the new form is submitted
    li.querySelector("form").onsubmit = function(e){
        e.preventDefault();
        let li = e.target.closest("li");
        // Re-render this list item back to its original state (Check will be unchecked)
        var name = e.target.querySelector("input[name='name']").value;
        var category = e.target.querySelector("input[name='category']").value;
        // Do this with objects instead of text
        li.innerHTML = render_task("notused",name,category,false).innerHTML;
        // Call the modify_task(li) with the re-rendered li elementk
        modify_task(li);

    };
    li.querySelector("button.task_delete").onclick = function(e){
        // THis lookup might be unncesary since there shoudl only be 1 delete
        // button at a time, but just in case:
        delete_task(e.target.closest("li"));

    };
    // If the undo button is pressed, redownload the list from the server database
    li.querySelector("button.task_undo").onclick = function(e){
        download_db();
    };
}

// This creates a sorted copy of the database list
function sorted_list(raw_list){
    var keys = Object.keys(raw_list);
    keys.sort(function(a,b){
        var d = 0;
        // Complete Items always at the bottom of the list
        d = raw_list[a]["completed"]-raw_list[b]["completed"];
        if (d != 0 ){
            return d;
        }
        // If an item is completed, always sort in reverse chronological from
        // modification date.  Makes it easier to see when you do accidental
        // clicks
        if (raw_list[a]["completed"]){
            return raw_list[b]["time_modified"]-raw_list[a]["time_modified"];

        }
        // For incomlpete items, sort by category and then by name
        d = raw_list[a]["category"].localeCompare(raw_list[b]["category"]);
        if (d != 0 ){
            return d;
        }
        d = raw_list[a]["name"].localeCompare(raw_list[b]["name"]);
        return d;
    });

    new_list = {};
    for(var i=0; i<keys.length; i++){
        new_list[keys[i]] = raw_list[keys[i]];
    }
    return new_list;
}

// This creates a sorted copy of the database list
function sorted_suggestions(db){
    var keys = Object.keys(db);
    keys.sort(function(a,b){
        var d = 0;
        d = db[b]["count"]-db[a]["count"];
        if (d != 0 ){
            return d;
        }
        d = db[a]["name"].localeCompare(db[b]["name"]);
        return d;
    });

    new_db = {};
    for(var i=0; i<keys.length; i++){
        new_db[keys[i]] = db[keys[i]];
    }
    return new_db;
}

function render_suggestions(query){
    // Switch to Lower Case for searchability
    var low_q = query.toLowerCase();

    // Get the Suggestion DOM DIV
    var dom_list = document.querySelector("ul.suggest");

    // Get a copy of the template
    var template = document.querySelector("#suggestion_tmpl");
    // CLear the suggestions
    dom_list.innerHTML = "" ;
    // TODO Strip whitespace from query
    // If the query is empty, skip
    if (query == ""){
        return;
    }
    // Keep track of the number of suggestions
    max_sug = 5 ;
    i_sug = 0 ;
    for (var key in sug_db){
        // If you exceeded the number of suggestions, exit
        if (i_sug >= max_sug){
            break;
        }
        // If the query matches, render it
        if (key.includes(low_q) ){ 

            // Make a copy of the template element
            var new_item = template.content.firstElementChild.cloneNode(true);
            // Embed the key
            new_item.setAttribute("key",key);
            // Modify name and category
            var txt = sug_db[key]["name"] + " - ["+sug_db[key]["category"]+"]"; 
            new_item.querySelector(".name").textContent = txt; 
            
            dom_list.appendChild(new_item);

            i_sug++;
        }
    }
    bind_suggestions();
}

function render_task(key,name,category,completed){
    var template = document.querySelector("#task_tmpl");
    var new_item = template.content.firstElementChild.cloneNode(true);
    // Embed UUID into li node
    new_item.setAttribute("uuid",key);
    // Modify name and category
    new_item.querySelector(".task_name").textContent = name; 
    new_item.querySelector(".task_category").textContent = category; 
    new_item.querySelector("input[type='checkbox']").checked = completed;

    set_task_color(new_item);
    return new_item;
}

function render_list(raw_list){
    var list = sorted_list(raw_list);
    var dom_list = document.querySelector("ul.main");
    dom_list.innerHTML='';
    var template = document.querySelector("#task_tmpl");
    var list_name = get_list_name();
    for (var key in list){
        // Filter out items that are not part of this list
        if (list[key]["list"] != list_name){
            continue;
        }
        // Make a copy of the template element
        var new_item = template.content.firstElementChild.cloneNode(true);
        // Embed UUID into li node
        new_item.setAttribute("uuid",key);
        // Modify name and category
        new_item.querySelector(".task_name").textContent = list[key]["name"]; 
        new_item.querySelector(".task_category").textContent = list[key]["category"]; 
        new_item.querySelector("input[type='checkbox']").checked = list[key]["completed"];
        
        set_task_color(new_item);
        dom_list.appendChild(new_item);
    }
    bind_list();
}

function bind_suggestions(){
    var task_names = document.querySelectorAll(".suggest li a.name");
	for (var i = 0; i < task_names.length; i++){
        var t = task_names[i];
        t.onclick = function(e){
            var key = e.target.closest("li").getAttribute("key");
            add_suggestion(sug_db[key]);
        }
    }
}

function bind_list(){
    bind_checkboxes();
    bind_task_edit();
    bind_category_dropdowns();
}

function bind_all(){
    bind_list();
    bind_form();
    bind_toggle();
    bind_autocomplete();
}

bind_all();

download_db();
download_history();

