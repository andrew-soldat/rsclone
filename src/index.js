import "@fortawesome/fontawesome-free/js/all.js";
import "@fortawesome/fontawesome-free/css/all.css";
import shortid from "shortid";

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
   // if (e.target.closest(".task__btn")) {
   // 	containerTodoList.innerHTML = "";
   // 	console.log(arrayListWorkspaces);

   //    for (let i = 0; i < arrayListWorkspaces.length; i++) {
   //       if (arrayListWorkspaces[i].classList.contains("active")) {
   //          arrayListWorkspaces[i].classList.remove("active");
   //       }
   //    }
   // }
});

const inputWorkspace = document.querySelector(".add-item-workspaces__input"),
   btnAddWorkspaces = document.querySelector(".add-item-workspaces__btn"),
   containerListWorkspace = document.querySelector(".list-workspaces"),
	containerSelect = document.querySelector(".task__select");

const removeCategory = (id) => {
   const workspace = getWorkspace();
   delete workspace[id];
   localStorage.setItem("workspace", JSON.stringify(workspace));
};
const addCategory = (newItem) => {
   const workspace = {
      ...getWorkspace(),
      [shortid()]: newItem,
   };
   localStorage.setItem("workspace", JSON.stringify(workspace));
};
const addTask = (categoryId, newItem) => {
   const workspace = getWorkspace();
   const updatedWorkspace = {
      ...workspace,
      [categoryId]: {
         ...workspace[categoryId],
         todolist: { ...workspace[categoryId].todolist, [shortid()]: newItem }
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
   displayWorkspaces();
}

btnAddWorkspaces.addEventListener("click", function () {
   const newWorkspace = {
      workspace: inputWorkspace.value,
      todolist: {}
   };
   addCategory(newWorkspace);
   if (!inputWorkspace.value) return;

   displayWorkspaces();
   // displaySelect();
   inputWorkspace.value = "";

   blockWorkspaces.classList.remove("show");
});

function getWorkspace() {
   return JSON.parse(localStorage.getItem("workspace")) || {};
}

function displayWorkspaces() {
   let displayWorkspace = "";

	const workspace = getWorkspace();
   Object.entries(workspace).forEach(([key, item]) => {
      displayWorkspace += `
										<li data-id="${key}" class="list-workspaces__item">
											${item.workspace}
											<button data-id="${key}" class="list-workspaces__delete"></button>
										</li>
									`;
   });

	containerListWorkspace.innerHTML = displayWorkspace;
}
const listWorkspaces = document.querySelectorAll(".list-workspaces__item"),
		btnDeleteWorkspaces = document.querySelectorAll(".list-workspaces__delete");

// function displaySelect() {
//    containerSelect.innerHTML = "";

//    const workspace = getWorkspace();
//    Object.entries(workspace).forEach(([key, item]) => {
//       containerSelect.innerHTML += `
// 									<option value="${key}">${item.workspace}</option>
// 							  	`;
//    });
// }
// displaySelect();

let currentCategoryId;

listWorkspaces.forEach((item, i, itemListWorkspaces) => {
	item.addEventListener("click", function() {
		console.log('ffffffffffffff');
		for (let i = 0; i < itemListWorkspaces.length; i++) {
			itemListWorkspaces[i].classList.remove("active");
		}
		item.classList.add("active");
		currentCategoryId = item.dataset.id;
		renderList(currentCategoryId);
	});
});

btnDeleteWorkspaces.forEach((item) => {
	item.addEventListener("click", function() {
		removeCategory(item.dataset.id);
		displayWorkspaces();
		// displaySelect();
	})
})

// itemListWorkspaces.addEventListener("click", function (e) {
// 	let element = e.target;

//    const workspace = getWorkspace();
//    Object.entries(workspace).forEach(function ([key, item]) {
//          addClassCurrentWorkspace(element);
//          renderList(item.todolist);
//    });
// });

// containerListWorkspace.addEventListener("click", function (e) {
//    let element = e.target;
   // const workspace = getWorkspace();
   // Object.entries(workspace).forEach(function ([key, item]) {
	// 	removeCategory()
	// 	displayWorkspaces();
	// 	displaySelect();
	// 	containerTodoList.innerHTML = "";
	// 	updateLocalStorage();
   // });
// });

const inputMessage = document.querySelector(".task__input"),
   inputDate = document.querySelector(".task__date"),
   btnAddTodo = document.querySelector(".task__btn"),
   containerTodoList = document.querySelector(".list-main");

btnAddTodo.addEventListener("click", function (e) {
   e.preventDefault();
   const todo = inputMessage.value,
      dateTodo = new Date(inputDate.value);

   if (!inputDate.value) {
      inputDate.classList.add("date");
      setTimeout(() => {
         inputDate.classList.remove("date");
      }, 3000);
   } else if (todo && inputDate.value) {
      inputMessage.value = "";
		inputDate.value = "";

      addTask(currentCategoryId, {
         message: todo,
         term: dateTodo.toLocaleDateString("en-Us", options),
         completed: false,
		});
		renderList(currentCategoryId);
   } else {
      return;
   }
});

// let workspaceListArray = [],
//    listItem;

function renderList(categoryId) {
   containerTodoList.innerHTML = "";
   // workspaceListArray = array;
	const workspace = getWorkspace();
	Object.entries(workspace[categoryId].todolist).forEach(([key, item]) => {
		containerTodoList.innerHTML += addItem(key, item);
	});
   // sortList();
   // filterList();

   // workspaceListArray.forEach((item, index) => {
   //    containerTodoList.innerHTML += addItem(item, index);
   // });

   // listItem = document.querySelectorAll(".list-main__item");
}

function addItem(key, item) {
   return `
				<li class="list-main__item ${item.completed ? "completed" : ""}">
					<span data-message="${item.message}" class="list-main__checkbox"></span>
					<span class="list-main__text">${item.message}</span>
					<span data-id="${key}" class="list-main__delete"></span>
					<div class="list-main__date">${item.term}</div>
				</li>
	`;
}

containerTodoList.addEventListener("click", function (e) {
   let element = e.target;

	const workspace = getWorkspace();
	Object.entries(workspace[currentCategoryId].todolist).forEach(([key, item]) => {
		if (element.dataset.id == key) {
			removeTask(currentCategoryId, key)
		}
		if (element.dataset.message == item.message) {
			item.completed = !item.completed;
			localStorage.setItem("workspace", JSON.stringify(workspace));
			renderList(currentCategoryId);
		}
		
	})
	// removeTask(workspaceListArray, element.dataset.id);

   // workspaceListArray.forEach(function (item, index) {
   //    if (element.dataset.id == item.id) {
   //    } else if (element.dataset.message == item.message) {
   //       console.log("ssssssssss");
   //       completeItem(workspaceListArray, index);
   //    }
   // });
});

// function completeItem(array, index) {
//    array[index].completed = !array[index].completed;
//    if (array[index].completed) {
//       listItem[index].classList.add("completed");
//    } else {
//       listItem[index].classList.remove("completed");
//    }
//    localStorage.setItem("workspace", JSON.stringify(workspace));
		// renderList(currentCategoryId);
// }

function sortList() {
   workspaceListArray.sort(function (a, b) {
      return new Date(a.term) - new Date(b.term);
   });
}

function filterList() {
   const activeItemList = workspaceListArray.filter(
      (item) => item.completed == false
   );
   const comletedItemList = workspaceListArray.filter(
      (item) => item.completed == true
   );
   workspaceListArray = [...activeItemList, ...comletedItemList];
}
