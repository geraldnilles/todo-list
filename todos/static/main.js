

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

function bind_form(){
    var f = document.querySelector("form.main");
    f.onsubmit = function(e){
        // Do not submit the form and refresh the page
        // We will use XHR instead
        e.preventDefault();
        add_task(e);
    }
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

            var f = document.querySelector("form.main");
            f.querySelector("input[name='list']").value = e.target.textContent;
        }
    });
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
        d = raw_list[a]["completed"]-raw_list[b]["completed"];
        if (d != 0 ){
            return d;
        }
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
    var dom_list = document.querySelector("ul");
    dom_list.innerHTML='';
    var template = document.querySelector("#task_tmpl");
    for (var key in list){
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

function bind_list(){
    bind_checkboxes();
    bind_task_edit();
    bind_category_dropdowns();
}

function bind_all(){
    bind_list();
    bind_form();
    bind_toggle();
}

bind_all();

download_db();

