

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


function render_list(list){
    var dom_list = document.querySelector("ul");
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


render_list({
        "200":{
            "name":"Wine",
            "category":"Other",
            "completed": false
        },
        "100":{
            "name":"Meat",
            "category":"Other",
            "completed": false
        }
    });
