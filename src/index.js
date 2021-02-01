import "@fortawesome/fontawesome-free/js/all.js";
import "@fortawesome/fontawesome-free/css/all.css";
import shortid from "shortid";

import example from "./js/example";

import "./styles/index.scss";

const containerDate = document.getElementById("date"),
   todayDate = new Date(),
	options = { weekday: "long", month: "long", day: "numeric" },
	btnShowFormWorkspace = document.querySelector(".add-workspace__button"),
   formWorkspace = document.querySelector(".workspace-form"),
	inputWorkspace = document.querySelector(".workspace-form__input"),
	btnAddWorkspace = document.querySelector(".workspace-form__button-add"),
	btnCancelWorkspace = document.querySelector(".workspace-form__button-cancel"),
	containerListWorkspace = document.querySelector(".list-workspace"),
	containerTitleWorkspace = document.querySelector(".main__title"),
	btnShowFormTask = document.querySelector(".add-task__button"),
	formTask = document.querySelector(".task-form"),
	inputTask = document.querySelector(".task-form__input"),
	inputDate = document.querySelector(".task-form__date"),
	btnAddTask = document.querySelector(".task-form__button-add"),
	btnCancelTask = document.querySelector(".task-form__button-cancel"),
	containerTodoList = document.querySelector(".list-task"),
	formRequired = document.querySelectorAll(".required"),
	formInput = document.querySelectorAll(".input");
	
let listworkspace = document.querySelectorAll(".list-workspace__item"),
	btnDeleteWorkspace = document.querySelectorAll(".list-workspace__delete"),
	currentCategoryId;

containerDate.innerHTML = todayDate.toLocaleDateString("en-Us", options);

btnShowFormWorkspace.addEventListener("click", function () {
	formWorkspace.classList.toggle("show");
});

btnCancelWorkspace.addEventListener("click", function () {
	formWorkspace.classList.remove("show");
	for (let i = 0; i < formRequired.length; i++) {
		const input = formRequired[i];
		formRemoveError(input);
	}
	formWorkspace.value = "";
});

btnShowFormTask.addEventListener("click", function () {
	formTask.classList.toggle("show");
});

btnCancelTask.addEventListener("click", function () {
	formTask.classList.remove("show");
	for (let i = 0; i < formRequired.length; i++) {
		const input = formRequired[i];
		formRemoveError(input);
	}
	inputTask.value = "";
   inputDate.value = "";
});

function formValidate() {
	for (let i = 0; i < formRequired.length; i++) {
		const input = formRequired[i];
		formRemoveError(input);

		if (!input.value) {
			formAddError(input);
		}
	}
}

function formAddError(input) {
	input.classList.add("error");
}

function formRemoveError(input) {
	input.classList.remove("error");
}

const addCategory = (newItem) => {
   const workspace = {
      ...getWorkspace(),
      [shortid()]: newItem,
   };
   localStorage.setItem("workspace", JSON.stringify(workspace));
};

const removeCategory = (id) => {
   const workspace = getWorkspace();
   delete workspace[id];
   localStorage.setItem("workspace", JSON.stringify(workspace));
};

const addTask = (categoryId, newItem) => {
   const workspace = getWorkspace();
   const updatedWorkspace = {
      ...workspace,
      [categoryId]: {
         ...workspace[categoryId],
         todolist: { ...workspace[categoryId].todolist, [shortid()]: newItem },
      },
   };
   localStorage.setItem("workspace", JSON.stringify(updatedWorkspace));
};

const removeTask = (categoryId, taskId) => {
   const workspace = getWorkspace();
   delete workspace[categoryId].todolist[taskId];
   localStorage.setItem("workspace", JSON.stringify(workspace));
};

if (localStorage.getItem("workspace")) {
   displayworkspace();
}

formWorkspace.addEventListener("keydown", function(e) {
	if (e.code == 'Enter') renderWorkspace();
 });

btnAddWorkspace.addEventListener("click", renderWorkspace);

function renderWorkspace() {
	formValidate();
	if (inputWorkspace.value) {
      const newWorkspace = {
         workspace: inputWorkspace.value,
         todolist: {},
      };
      addCategory(newWorkspace);
      displayworkspace();
		inputWorkspace.value = "";
		formWorkspace.classList.remove("show");
		addClassCurrentWorkspace();
	}
}
	
function getWorkspace() {
	return JSON.parse(localStorage.getItem("workspace")) || {};
}

function displayworkspace() {
   let displayWorkspace = "";

	const workspace = getWorkspace();	
   Object.entries(workspace).forEach(([key, item]) => {
      displayWorkspace += `
										<li data-id="${key}" data-workspace="${item.workspace}" class="list-workspace__item">
											${item.workspace}
											<button data-id="${key}" class="list-workspace__delete"></button>
										</li>
									`;
   });

	containerListWorkspace.innerHTML = displayWorkspace;
	listworkspace = document.querySelectorAll(".list-workspace__item");
}

containerListWorkspace.addEventListener("click", function (e) {
   let element = e.target;

   if (element.classList.contains("list-workspace__item")) {
      for (let i = 0; i < listworkspace.length; i++) {
      	listworkspace[i].classList.remove("active");
		}
		element.classList.add("active");
		containerTitleWorkspace.innerHTML = `<div class="main__title_workspace">${element.dataset.workspace}</div>`;
		currentCategoryId = element.dataset.id;
      renderList(currentCategoryId);
   } else if (element.classList.contains("list-workspace__delete")) {
		removeCategory(element.dataset.id);
		if (element.dataset.id == currentCategoryId) {
			containerTodoList.innerHTML = "";
			containerTitleWorkspace.innerHTML = '';
		}
		displayworkspace();
		addClassCurrentWorkspace();
   }
});

function addClassCurrentWorkspace() {
	for (let i = 0; i < listworkspace.length; i++) {
		if (listworkspace[i].dataset.id == currentCategoryId) {
			listworkspace[i].classList.add("active");
		}
	}
}

formTask.addEventListener("keydown", function(e){
	if (e.code == 'Enter') {
		displayTask();
	}
})

btnAddTask.addEventListener("click", displayTask);

function displayTask() {
   const task = inputTask.value,
		dateTask = new Date(inputDate.value);
	
	formValidate();

	if (!currentCategoryId) {
		alert("Select workspace.")
	} else if (task && inputDate.value) {
      inputTask.value = "";
      inputDate.value = "";
      addTask(currentCategoryId, {
         message: task,
         term: dateTask.toLocaleDateString("en-Us", options),
         completed: false,
		});
		formTask.classList.remove("show");
      renderList(currentCategoryId);
   }
};

function renderList(categoryId) {
   containerTodoList.innerHTML = "";
	const workspace = getWorkspace();
	console.log(workspace);
	console.log(workspace[categoryId].todolist);
	console.log(Object.entries(workspace));
	
   const filteredList = sortByDate(workspace[categoryId].todolist);
	console.log(filteredList);
	
   filteredList.forEach(([key, item]) => {		
      containerTodoList.innerHTML += addItem(key, item);
   });
};

function addItem(key, item) {
   return `
				<li class="list-task__item ${item.completed ? "completed" : ""}">
					<span data-message="${item.message}" class="list-task__checkbox"></span>
					<span class="list-task__text">${item.message}</span>
					<span data-id="${key}" class="list-task__delete"></span>
					<div class="list-task__date">${item.term}</div>
				</li>
	`;
};

containerTodoList.addEventListener("click", function (e) {
   let element = e.target;

   const workspace = getWorkspace();
   Object.entries(workspace[currentCategoryId].todolist).forEach(
      ([key, item]) => {
         if (element.dataset.id == key) {
            removeTask(currentCategoryId, key);
            renderList(currentCategoryId);
         }
         if (element.dataset.message == item.message) {
            item.completed = !item.completed;
				localStorage.setItem("workspace", JSON.stringify(workspace));
				renderList(currentCategoryId);
         }
      }
   );
});

function sortByDate(todolist) {
	console.log(Object.entries(todolist));
	
   let sortTodolist = Object.entries(todolist)
      .slice()
      .sort(function (a, b) {
         return new Date(a.term) - new Date(b.term);
		});
	console.log(sortTodolist)
	return sortTodolist;
};

function sortByСompleted(todolist) {
   return Object.entries(todolist)
      .slice()
      .sort((a) => {
         if (a.completed) {
            return 1;
         } else {
            return -1;
         }
		});
};
