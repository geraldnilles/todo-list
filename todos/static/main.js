

// Mark and Item as complete when 
function bind_checkboxes(){
    var checkboxes = document.querySelectorAll("input[type='checkbox']");
	for (var i = 0; i < checkboxes.length; i++){
		var c = checkboxes[i];
		c.onchange = function(e){
            var li = e.target.closest("li");
            if (e.target.checked){
                li.classList.add("list-group-item-dark");
            } else {
                li.classList.remove("list-group-item-dark");
            }
		}
	}
}

function add_task(e){
    var formData = new FormData(e.target);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // TODO CHeck if hash changed noticablly. If not, then return
            // Otherwise pull down the latest DB
            download_db();
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
        var new_item = template.content.cloneNode(true);
        new_item.querySelector(".task_name").textContent = list[key]["name"]; 
        new_item.querySelector(".task_category").textContent = list[key]["category"]; 
        dom_list.appendChild(new_item);
    }
    bind_checkboxes();
}

bind_form();
bind_checkboxes();

download_db();

