document.addEventListener('DOMContentLoaded', () => {
    const checkBoxes = document.getElementsByClassName("finish-checkbox");
    addEventToCheckBoxes(checkBoxes);

    let newTaskButton = document.querySelector("#new-task");
    let insertModal = new BulmaModal("#insertTaskModal");

    newTaskButton.addEventListener("click", function () {
        insertModal.show();
    });

    const saveChangedButton = document.querySelector('#save-new-task');
    saveChangedButton.addEventListener("click", function (event) {
       event.preventDefault();
       let taskName = document.getElementById("task-name").value;
       let dueDate = document.getElementById("due-date").value;

       let dict_data = makeDict(taskName, dueDate);

       sendAjax(dict_data);
    });

    let editBtnList = document.getElementsByClassName("edit-button");
    addEventToEditBtn(editBtnList);

    const updateChangeButton = document.querySelector("#edit-new-task");
    updateChangeButton.addEventListener("click", function (event) {
        event.preventDefault();

        let updateTaskId = document.querySelector("#update-task-id").textContent;
        let updateTaskName = document.querySelector("#update-task-name").value;
        let updateTaskDueDate = document.querySelector("#update-due-date").value;

        let return_dict = makeUpdateDict(updateTaskId, updateTaskName, updateTaskDueDate);
        sendUpdateAjax(return_dict);
    });
});

function makeUpdateDict(id, name, due) {
    return {"item_id": id,
            "item_name": name,
            "item_deadline": due};
}

function sendUpdateAjax(dict_data) {
    const url = "/update";

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dict_data),
        mode: 'cors',
        credentials: 'same-origin',
        cache: 'no-cache'
    };

    fetch(url ,requestOptions)
        .then(response => response.json())
        .then(data => {
            redisplay(data);
            closeEditModal();
        })
        .catch((error) => {
            retryUpdateFetch(url, requestOptions)
        })
}

function retryUpdateFetch(url, requestOptions) {
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            redisplay(data);
            closeEditModal();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function addEventToEditBtn(btnList) {
    for (let i = 0; i < btnList.length; i++) {
        let editModal = new BulmaModal("#editTaskModal");
        btnList[i].addEventListener("click", function (event) {
            editModal.show();
            let row_id = event.target.id.substring(event.target.id.indexOf('-')+1);

            let name_id = "name-" + row_id;
            let ddl_id = "deadline-" + row_id;

            document.querySelector("#update-task-id").textContent = row_id;
            document.querySelector("#update-task-name").value = document.querySelector("#" + name_id).textContent;
            document.querySelector("#update-due-date").value = document.querySelector("#" + ddl_id).textContent;
        });
    }
}

function makeDict(taskName, dueDate) {
    return {"item_name": taskName, "item_deadline": dueDate};
}

function sendAjax(dict_data) {
    const url = "/save";

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dict_data),
        mode: 'cors',
        credentials: 'same-origin',
        cache: 'no-cache'
    };

    fetch(url ,requestOptions)
        .then(response => response.json())
        .then(data => {
            redisplay(data);
            closeModalFunction();
        })
        .catch((error) => {
            retryFetch(url, requestOptions)
        })
}

function retryFetch(url, requestOptions) {
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            redisplay(data);
            closeModalFunction();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function redisplay(data) {
    let tbody = document.querySelector("#tbody-empty");
    tbody.innerHTML = "";

    for (const[key, value] of Object.entries(data)) {
        let tr = document.createElement('tr');

        let td_edit = document.createElement('td');
        let td_edit_btn = document.createElement('button');
        td_edit_btn.classList.add("button");
        td_edit_btn.classList.add("is-warning");
        td_edit_btn.classList.add("is-small");
        td_edit_btn.classList.add("edit-button");
        let edit_composed = "edit-" + value["id"];
        td_edit_btn.setAttribute("id", edit_composed);
        td_edit_btn.textContent = "Edit";
        td_edit.appendChild(td_edit_btn);
        tr.appendChild(td_edit);

        let td_name = document.createElement('td');
        td_name.textContent = value["name"];
        td_name.setAttribute("id", "name-" + value["id"]);
        tr.appendChild(td_name);

        let td_ddl = document.createElement('td');
        td_ddl.textContent = value["deadline"];
        td_ddl.setAttribute("id", "deadline-" + value["id"]);
        tr.appendChild(td_ddl);

        let td_check = document.createElement('td');
        let td_check_label = document.createElement('label');
        td_check_label.classList.add("checkbox");
        let td_check_box = document.createElement('input');
        td_check_box.setAttribute('type', 'checkbox');
        td_check_box.classList.add("finish-checkbox");

        let composedId = "finish-" + value["id"];
        td_check_box.setAttribute('id', composedId);

        td_check_label.appendChild(td_check_box);
        td_check.appendChild(td_check_label);

        tr.appendChild(td_check);

        tbody.appendChild(tr);
    }

    const checkBoxes = document.getElementsByClassName("finish-checkbox");
    addEventToCheckBoxes(checkBoxes);

    let editBtnList = document.getElementsByClassName("edit-button");
    addEventToEditBtn(editBtnList);
}

function closeModalFunction() {
    let name_empty = document.querySelector("#task-name");
    let due_date_empty = document.querySelector("#due-date");

    name_empty.value = "";
    due_date_empty.value = "";

    let insertModal = new BulmaModal("#insertTaskModal");
    insertModal.close();
}

function closeEditModal() {
    let editModal = new BulmaModal("#editTaskModal");
    editModal.close();

    document.querySelector("#update-task-name").value = "";
    document.querySelector("#update-due-date").value = "";
}

function addEventToCheckBoxes(checkBoxes) {
    for (let i = 0; i < checkBoxes.length; i++) {
        checkBoxes[i].checked = false;

        checkBoxes[i].addEventListener('change', (event) => {
            if (event.currentTarget.checked) {
                let dict_data = makeDeleteDict(event.target.id);
                sendDeleteAjax(dict_data);
            } else {
                alert('Error!');
            }
        })
    }
}

function makeDeleteDict(id) {
    return {"item_id": id};
}

function sendDeleteAjax(dict_data) {
    const url = "/delete";

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dict_data),
        mode: 'cors',
        credentials: 'same-origin',
        cache: 'no-cache'
    };

    fetch(url ,requestOptions)
        .then(response => response.json())
        .then(data => {
            redisplay(data);
        })
        .catch((error) => {
            retryDeleteFetch(url, requestOptions)
        })
}

function retryDeleteFetch(url, requestOptions) {
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            redisplay(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

class BulmaModal {
	constructor(selector) {
		this.elem = document.querySelector(selector);
		this.close_data();
	}

	show() {
		this.elem.classList.toggle('is-active');
		this.on_show();
	}

	close() {
		this.elem.classList.toggle('is-active');
		this.on_close();
	}

	close_data() {
		let modalClose = this.elem.querySelectorAll("[data-bulma-modal='close'], .modal-background");
		let that = this;
		modalClose.forEach(function(e) {
			e.addEventListener("click", function() {

				that.elem.classList.toggle('is-active');

				let event = new Event('modal:close');

				that.elem.dispatchEvent(event);
			})
		})
	}

	on_show() {
		let event = new Event('modal:show');

		this.elem.dispatchEvent(event);
	}

	on_close() {
		let event = new Event('modal:close');

		this.elem.dispatchEvent(event);
	}

	addEventListener(event, callback) {
		this.elem.addEventListener(event, callback);
	}
}