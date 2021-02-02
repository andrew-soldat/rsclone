import '@fortawesome/fontawesome-free/js/all.js';
import '@fortawesome/fontawesome-free/css/all.css';
import shortid from 'shortid';

import './styles/index.scss';

const containerDate = document.getElementById('date'),
   todayDate = new Date(),
   options = { weekday: 'long', month: 'long', day: 'numeric' },
   body = document.querySelector('body'),
   btnMenu = document.querySelector('.main__menu'),
   wrapperWorkspace = document.querySelector('.workspace'),
   btnShowFormWorkspace = document.querySelector('.add-workspace__button'),
   formWorkspace = document.querySelector('.workspace-form'),
   inputWorkspace = document.querySelector('.workspace-form__workspace'),
   btnAddWorkspace = document.querySelector('.workspace-form__button-add'),
   btnCancelWorkspace = document.querySelector('.workspace-form__button-cancel'),
   containerListWorkspace = document.querySelector('.list-workspace'),
   containerTitleWorkspace = document.querySelector('.main__title'),
   btnShowFormTask = document.querySelector('.add-task__button'),
   formTask = document.querySelector('.task-form'),
   inputTask = document.querySelector('.task-form__task'),
   inputDate = document.querySelector('.task-form__date'),
   btnAddTask = document.querySelector('.task-form__button-add'),
   btnCancelTask = document.querySelector('.task-form__button-cancel'),
   containerTodoList = document.querySelector('.list-task');

let listworkspace = document.querySelectorAll('.list-workspace__item'),
   currentCategoryId;

containerDate.innerHTML = todayDate.toLocaleDateString('en-Us', options);

btnMenu.addEventListener('click', function () {
   btnMenu.classList.toggle('active');
   wrapperWorkspace.classList.toggle('active');
   body.classList.toggle('lock');
});

document.addEventListener('click', function (e) {
   if (
      !e.target.closest('.main__menu, .add-workspace__button, .workspace-form')
   ) {
      btnMenu.classList.remove('active');
      wrapperWorkspace.classList.remove('active');
      body.classList.remove('lock');
   }
});

btnShowFormWorkspace.addEventListener('click', function () {
   formWorkspace.classList.toggle('show');
});

btnCancelWorkspace.addEventListener('click', function () {
   formWorkspace.classList.remove('show');
   inputWorkspace.classList.remove("error");
   formWorkspace.value = '';
});

btnShowFormTask.addEventListener('click', function () {
   formTask.classList.toggle('show');
});

btnCancelTask.addEventListener('click', function () {
	formWorkspace.classList.remove('show');
   inputWorkspace.classList.remove("error");
   formTask.classList.remove('show');
   inputTask.value = '';
   inputDate.value = '';
});

const addCategory = (newItem) => {
   const workspace = {
      ...getWorkspace(),
      [shortid()]: newItem,
   };
   localStorage.setItem('workspace', JSON.stringify(workspace));
};

const removeCategory = (id) => {
   const workspace = getWorkspace();
   delete workspace[id];
   localStorage.setItem('workspace', JSON.stringify(workspace));
};

const addTask = (categoryId, newItem) => {
   const workspace = getWorkspace();
   const updatedWorkspace = {
      ...workspace,
      [categoryId]: {
         ...workspace[categoryId],
         todolist: [...(workspace[categoryId].todolist || []), newItem],
      },
   };
   localStorage.setItem('workspace', JSON.stringify(updatedWorkspace));
};

const removeTask = (categoryId, taskId) => {
   const workspace = getWorkspace();
   (workspace[categoryId].todolist).splice(taskId, 1);
   localStorage.setItem('workspace', JSON.stringify(workspace));
};

if (localStorage.getItem('workspace')) {
   displayworkspace();
}

formWorkspace.addEventListener('keydown', function (e) {
   if (e.keyCode == 13) renderWorkspace();
});

btnAddWorkspace.addEventListener('click', renderWorkspace);

function renderWorkspace() {
	if (!inputWorkspace.value) {
		inputWorkspace.classList.add("error");
	} else if (inputWorkspace.value) {
      const newWorkspace = {
         workspace: inputWorkspace.value,
         todolist: [],
      };
      addCategory(newWorkspace);
      displayworkspace();
      inputWorkspace.value = '';
      formWorkspace.classList.remove('show');
      inputWorkspace.classList.remove("error");
   }
}

function getWorkspace() {
   return JSON.parse(localStorage.getItem('workspace')) || {};
}

function displayworkspace() {
   let displayWorkspace = '';

   const workspace = getWorkspace();
   Object.entries(workspace).forEach(([key, item]) => {
      displayWorkspace += `
										<li data-id="${key}" data-workspace="${item.workspace}" class="list-workspace__item">
										${item.workspace}
											<button class="list-workspace__delete"></button>
										</li>
									`;
   });

   containerListWorkspace.innerHTML = displayWorkspace;
   listworkspace = document.querySelectorAll('.list-workspace__item');
}

containerListWorkspace.addEventListener('click', function (e) {
   let element = e.target;

   if (element.classList.contains('list-workspace__item')) {
      for (let i = 0; i < listworkspace.length; i++) {
         listworkspace[i].classList.remove('active');
      }
      element.classList.add('active');
      containerTitleWorkspace.innerHTML = `<div class="main__title_workspace">${element.dataset.workspace}</div>`;
      currentCategoryId = element.dataset.id;
      renderList(currentCategoryId);
   }
   if (element.classList.contains('list-workspace__delete')) {
      removeCategory(element.parentElement.dataset.id);
      if (element.parentElement.dataset.id == currentCategoryId) {
         containerTodoList.innerHTML = '';
         containerTitleWorkspace.innerHTML = '';
      }
      displayworkspace();
      addClassCurrentWorkspace();
   }
});

function addClassCurrentWorkspace() {
   for (let i = 0; i < listworkspace.length; i++) {
      if (listworkspace[i].dataset.id == currentCategoryId) {
         listworkspace[i].classList.add('active');
      }
   }
}

formTask.addEventListener('keydown', function (e) {
   if (e.keyCode == 13) displayTask();
});

btnAddTask.addEventListener('click', displayTask);

function displayTask() {
   const task = inputTask.value,
      dateTask = new Date(inputDate.value);

   if (!task) {
		inputTask.classList.add("error");
	} else if (!inputDate.value) {
		inputDate.classList.add("error");
	} else if (!currentCategoryId) {
      alert('Select workspace.');
   } else if (task && inputDate.value) {
      inputTask.value = '';
      inputDate.value = '';
      addTask(currentCategoryId, {
         message: task,
         term: dateTask.toLocaleDateString('en-Us', options),
         completed: false,
         id: shortid(),
      });
      formTask.classList.remove('show');
      renderList(currentCategoryId);
      inputTask.classList.remove("error");
      inputDate.classList.remove("error");
   }
}

function renderList(categoryId) {
   containerTodoList.innerHTML = '';
   const workspace = getWorkspace();
	const filteredListDate = sortByDate(workspace[categoryId].todolist);
	const filteredListСompleted = sortByСompleted(filteredListDate);
   filteredListСompleted.forEach((item) => {
      containerTodoList.innerHTML += addItem(item);
   });
};

function addItem(item) {
   return `
				<li class="list-task__item ${item.completed ? 'completed' : ''}" data-id="${item.id}">
					<span class="list-task__checkbox"></span>
					<span class="list-task__text">${item.message}</span>
					<span class="list-task__delete"></span>
					<div class="list-task__date">${item.term}</div>
				</li>
			`;
}

containerTodoList.addEventListener('click', function (e) {
   let element = e.target;

   const workspace = getWorkspace();
   (workspace[currentCategoryId].todolist).forEach(
      (item, index) => {
         if (element.classList.contains("list-task__delete") && element.parentElement.dataset.id == item.id) {
            removeTask(currentCategoryId, index);
            renderList(currentCategoryId);
         }
         if (element.classList.contains("list-task__checkbox") && element.parentElement.dataset.id == item.id) {
            item.completed = !item.completed;
            localStorage.setItem('workspace', JSON.stringify(workspace));
            renderList(currentCategoryId);
         }
      }
   );
});

function sortByDate(todolist) {
   return todolist.slice().sort((a, b) => {
		return new Date(a.term) - new Date(b.term);
	});
};

function sortByСompleted(todolist) {
   return todolist.slice().sort((a) => {
		if (a.completed) {
			return 1;
		} else {
			return -1;
		}
	});
};
