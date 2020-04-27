

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

function bind_form(){
    var f = document.querySelector("form");
    f.onsubmit = function(e){
        alert("Submit!");
    }
}


bind_form();
bind_checkboxes();


