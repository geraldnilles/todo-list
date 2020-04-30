

// Mark and Item as complete when 
function bind_checkboxes(){
    var checkboxes = document.querySelectorAll("input[type='checkbox']");
	for (var i = 0; i < checkboxes.length; i++){
		var c = checkboxes[i];
		c.onchange = function(e){
            var li = e.target.closest("li");
            set_task_color(li);

            // TODO Set PUT command to edit this UUID
            modify_task(li);

		}
	}
}

function set_task_color(li){
    
    if (li.querySelector("input[type='checkbox']").checked) {
        li.classList.add("list-group-item-dark");
    } else {
        li.classList.remove("list-group-item-dark");
    }

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
    var f = document.querySelector("form");
    f.onsubmit = function(e){
        // Do not submit the form and refresh the page
        // We will use XHR instead
        e.preventDefault();
        add_task(e);
    }
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

function render_list(list){
    var dom_list = document.querySelector("ul");
    dom_list.innerHTML='';
    var template = document.querySelector("template");
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
    bind_checkboxes();
}

bind_form();
bind_checkboxes();

download_db();

