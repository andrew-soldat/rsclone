// Import of a JavaScript module
import "@fortawesome/fontawesome-free/js/all.js";
import "@fortawesome/fontawesome-free/css/all.css";
// Импорт модуля JavaScript
import example from './js/example'

// Import of styles
import './styles/index.scss'

const date = document.getElementById("date"),
		today = new Date(),
		options = {weekday: 'long', month: 'long', day: 'numeric'};

date.innerHTML = today.toLocaleDateString('en-Us', options);

// ================================================================================
const btnShowWorkspaces = document.querySelector(".workspaces__button");

btnShowWorkspaces.addEventListener("click", function (e) {
	blockWorkspaces.classList.toggle("show");
});

document.addEventListener("click", function(e) {
	if (!e.target.closest(".add-item-workspaces, .workspaces__button")) {
		blockWorkspaces.classList.remove("show");
	}
});

const blockWorkspaces = document.querySelector(".add-item-workspaces"),
		inputWorkspaces = document.querySelector(".add-item-workspaces__input"),
		btnAddWorkspaces = document.querySelector(".add-item-workspaces__btn"),
		containerListWorkspaces = document.querySelector(".workspaces__list");
		

let workspacesList = [],
	id = 0;

if (localStorage.getItem("workspaces")) {
	workspacesList = JSON.parse(localStorage.getItem("workspaces"));
	displayWorkspaces();
}

btnAddWorkspaces.addEventListener("click", function() {
	let newWorkspacesList = {
		workspaces: inputWorkspaces.value,
		id: id
	}
	id++;
	if (!inputWorkspaces.value) return;

	workspacesList.push(newWorkspacesList);
	displayWorkspaces();
	inputWorkspaces.value = '';
	localStorage.setItem("workspaces", JSON.stringify(workspacesList));
	blockWorkspaces.classList.remove("show");
});

function displayWorkspaces() {
	let displayWorkspaces = '';

	workspacesList.forEach((item) => {
		displayWorkspaces += `
										<li class="workspaces__item">
											<i class="fas fa-folder"></i>
											<span class="workspaces__item_text">${item.workspaces}</span>
											<span id="${item.id}" class="workspaces__item_remove"></span>
										</li>
									`;
	})
	
	containerListWorkspaces.innerHTML = displayWorkspaces;
};

containerListWorkspaces.addEventListener("click", function(e) {
	let element = e.target;
	const elementActive = element.attributes.id.value;

	workspacesList.forEach(function(item, i) {
		if (elementActive == item.id) {
			workspacesList.splice(i, 1);
			displayWorkspaces();
			localStorage.setItem("workspaces", JSON.stringify(workspacesList));
		}
	})

})

const inputMessage = document.querySelector(".message__input"),
		btnAddTodo = document.querySelector(".message__btn"),
		containerToDoList = document.querySelector(".list-main__list");

let todoList = [],
		idList = 0;

if (localStorage.getItem("todo")) {
	todoList = JSON.parse(localStorage.getItem("todo"));
	displayMessage();
}

btnAddTodo.addEventListener("click", function(e) {
	let newTodoList = {
		message: inputMessage.value,
		id: idList
	}
	idList++;

	if (!inputMessage.value) return;

	todoList.push(newTodoList);
	displayMessage();
	inputMessage.value = '';

	localStorage.setItem("todo", JSON.stringify(todoList));
});

function displayMessage() {
	let displayMessage = '';
	todoList.forEach((item) => {
		displayMessage += `
									<li class="list-main__item">
										${item.message}
										<span id="${item.id}" class="list-main__item_remove"></span>
									</li>
								`;
	});
	
	containerToDoList.innerHTML = displayMessage;
};

containerToDoList.addEventListener("click", function(e) {
	let element = e.target;
	const elementActive = element.attributes.id.value;

	todoList.forEach(function(item, i) {
		if (elementActive == item.id) {
			todoList.splice(i, 1);
			displayMessage ();
			localStorage.setItem("todo", JSON.stringify(todoList));
		}
	})
	
})

