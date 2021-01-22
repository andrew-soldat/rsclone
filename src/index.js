
import "@fortawesome/fontawesome-free/js/all.js";
import "@fortawesome/fontawesome-free/css/all.css";

import example from "./js/example";

import "./styles/index.scss";

const date = document.getElementById("date"),
   today = new Date(),
   options = { weekday: "long", month: "long", day: "numeric" };

date.innerHTML = today.toLocaleDateString("en-Us", options);

const btnShowInputWorkspaces = document.querySelector(".workspaces__button"),
   blockWorkspaces = document.querySelector(".add-item-workspaces");

btnShowInputWorkspaces.addEventListener("click", function (e) {
   blockWorkspaces.classList.toggle("show");
});

document.addEventListener("click", function (e) {
   if (!e.target.closest(".add-item-workspaces, .workspaces__button")) {
      blockWorkspaces.classList.remove("show");
	}
	if (e.target.closest(".task__btn")) {
		containerToDoList.innerHTML = "";
		
		for (let i = 0; i < arrayListWorkspaces.length; i++) {
			if (arrayListWorkspaces[i].classList.contains("active")) {
				arrayListWorkspaces[i].classList.remove("active");
			}
      }
   }
});

const inputWorkspaces = document.querySelector(".add-item-workspaces__input"),
   btnAddWorkspaces = document.querySelector(".add-item-workspaces__btn"),
   containerListWorkspaces = document.querySelector(".list-workspaces"),
	itemListWorkspaces = document.querySelectorAll(".list-workspaces__item"),
	containerSelect = document.querySelector(".task__select");

let workspacesList = [],
   id = 0;

const updateLocalStorage = () => {
   localStorage.setItem("workspaces", JSON.stringify(workspacesList));
};

if (localStorage.getItem("workspaces")) {
   workspacesList = JSON.parse(localStorage.getItem("workspaces"));
   displayWorkspaces();
}

btnAddWorkspaces.addEventListener("click", function () {
   let newWorkspacesList = {
      workspaces: inputWorkspaces.value,
      data: id,
      todolist: [],
   };
   id++;
   if (!inputWorkspaces.value) return;

   workspacesList.push(newWorkspacesList);
   displayWorkspaces();
   displaySelect();
   inputWorkspaces.value = "";
   updateLocalStorage();
   blockWorkspaces.classList.remove("show");
});

function displayWorkspaces() {
   let displayWorkspaces = "";

   workspacesList.forEach((item) => {
      displayWorkspaces += `
										<li data="${item.workspaces}" class="list-workspaces__item">
											${item.workspaces}
											<button data="${item.data}" class="list-workspaces__delete"></button>
										</li>
									`;
   });

   containerListWorkspaces.innerHTML = displayWorkspaces;
}

function displaySelect() {
	containerSelect.innerHTML = '';
   
   workspacesList.forEach((item) => {
      containerSelect.innerHTML += `
									<option value="${item.workspaces}">${item.workspaces}</option>
							  	`;
   });
}
displaySelect();

containerListWorkspaces.addEventListener("click", function (e) {
   let element = e.target;

   workspacesList.forEach(function (item, i) {
      if (element.attributes.data.value == item.data) {
         workspacesList.splice(i, 1);
         displayWorkspaces();
         displaySelect();
         containerToDoList.innerHTML = "";
         updateLocalStorage();
      } else if (element.attributes.data.value == item.workspaces) {
         addClassCurrentWorkspacesList(element);
         displayAllList(item.todolist);
		}
   });
});

let arrayListWorkspaces;

function addClassCurrentWorkspacesList(el) {
	arrayListWorkspaces = document.querySelectorAll(".list-workspaces__item");
   if (el.classList.contains("list-workspaces__item")) {
      for (let i = 0; i < arrayListWorkspaces.length; i++) {
         arrayListWorkspaces[i].classList.remove("active");
      }
      el.classList.add("active");
   }
}

const inputMessage = document.querySelector(".task__input"),
		inputDate = document.querySelector(".task__date"),
  	 	btnAddTodo = document.querySelector(".task__btn"),
   	containerToDoList = document.querySelector(".list-main");

let idList = 0;

btnAddTodo.addEventListener("click", function (e) {
	const task = inputMessage.value,
			dateTask = new Date(inputDate.value);

   if (task && dateTask) {
      workspacesList.forEach((item) => {
         if (item.workspaces === containerSelect.value) {
            item.todolist.push({
					message: task,
					term: dateTask.toLocaleDateString("en-Us", options),
               id: idList,
               completed: false
            });
         }
      });

      idList++;
		inputMessage.value = "";
		inputDate.value = "";
   } else {
      return;
   }

   updateLocalStorage();
});

let displayArrayList = [],
	listItem;

function displayAllList(array) {
   containerToDoList.innerHTML = "";
	displayArrayList = array;
	filterList();

   displayArrayList.forEach((item, index) => {
      containerToDoList.innerHTML += createList(item, index);
	});
	
	listItem = document.querySelectorAll(".list-main__item");
}

function createList(item, index) {
   return `
				<li class="list-main__item ${item.completed ? "completed" : ""}">
					<span data="${item.message}" class="list-main__checkbox"></span>
					<span class="list-main__text">${item.message}</span>
					<span data="${item.id}" class="list-main__delete"></span>
					<div class="list-main__date">${item.term}</div>
				</li>
	`;
}

containerToDoList.addEventListener("click", function (e) {
   let element = e.target;

   displayArrayList.forEach(function (item, index) {
      if (element.attributes.data.value == item.id) {
         deleteItemList(displayArrayList, index);
      } else if (element.attributes.data.value == item.message) {
         completedList(displayArrayList, index);
      }
   });
});

function completedList(array, index) {
   array[index].completed = !array[index].completed;
   if (array[index].completed) {
		listItem[index].classList.add('completed');
   } else {
		listItem[index].classList.remove('completed');
   }
   updateLocalStorage();
   displayAllList(array);
}

function deleteItemList(array, index) {
	array.splice(index, 1);
	updateLocalStorage();
	displayAllList(array);
}

function filterList() {
	const activeItemList = displayArrayList.filter(item => item.completed == false);
	const comletedItemList = displayArrayList.filter(item => item.completed == true);
	displayArrayList = [...activeItemList,...comletedItemList];
}
