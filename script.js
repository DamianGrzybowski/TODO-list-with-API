const apikey = 'ca83489d-78f2-402a-98a2-c671fb3454c7';
const apihost = 'https://todo-api.coderslab.pl';

// Convert minutes to hours/minutes
const spentTime = timeSpent => {
	let hours = Math.floor(timeSpent / 60);
	let minutes = timeSpent - hours * 60;
	if (hours > 0) {
		return `${hours} h ${minutes} min`;
	} else {
		return `${timeSpent} min`;
	}
};

//Get all tasks

function apiListTasks() {
	return fetch(apihost + '/api/tasks', {
		headers: { Authorization: apikey },
	}).then(function (resp) {
		if (!resp.ok) {
			alert('ERROR! Open devTools section network and look for a reason');
		}
		return resp.json();
	});
}

//Get all operations of task by ID

function apiListOperationsForTask(id) {
	return fetch(`${apihost}/api/tasks/${id}/operations`, {
		headers: { Authorization: apikey },
	}).then(function (resp) {
		if (!resp.ok) {
			alert('ERROR! Open devTools section network and look for a reason');
		}
		return resp.json();
	});
}

//Adding new task function

function apiCreateTask(title, description) {
	return fetch(apihost + '/api/tasks', {
		headers: { Authorization: apikey, 'Content-Type': 'application/json' },
		body: JSON.stringify({ title: title, description: description, status: 'open' }),
		method: 'POST',
	}).then(function (resp) {
		if (!resp.ok) {
			alert('ERROR! Open devTools section network and look for a reason');
		}
		return resp.json();
	});
}

//Delete task by id function

function apiDeleteTask(id) {
	return fetch(apihost + `/api/tasks/${id}`, {
		headers: { Authorization: apikey },
		method: 'DELETE',
	}).then(function (resp) {
		if (resp.ok) {
			return resp.json();
		} else {
			alert('ERROR! Open devTools section network and look for a reason');
		}
	});
}

//Add operation to task function

function apiCreateOperationForTask(id, description) {
	return fetch(apihost + `/api/tasks/${id}/operations`, {
		headers: { Authorization: apikey, 'Content-Type': 'application/json' },
		body: JSON.stringify({ description: description, timeSpent: 0 }),
		method: 'POST',
	}).then(function (resp) {
		if (!resp.ok) {
			alert('ERROR! Open devTools section network and look for a reason');
		}
		return resp.json();
	});
}

//Adding time to operation

function apiUpdateOperation(operationId, description, timeSpent) {
	return fetch(apihost + `/api/operations/${operationId}`, {
		headers: { Authorization: apikey, 'Content-Type': 'application/json' },
		body: JSON.stringify({ description: description, timeSpent: timeSpent }),
		method: 'PUT',
	}).then(function (resp) {
		if (!resp.ok) {
			alert('ERROR! Open devTools section network and look for a reason');
		}
		return resp.json();
	});
}

//Delete operation function

function apiDeleteOperation(operationId) {
	return fetch(apihost + `/api/operations/${operationId}`, {
		headers: { Authorization: apikey },
		method: 'DELETE',
	}).then(function (resp) {
		if (!resp.ok) {
			alert('ERROR! Open devTools section network and look for a reason');
		}
		return resp.json();
	});
}

// Render all tasks to HTML code

function renderTask(id, title, description, status) {
	const section = document.createElement('section');
	section.className = 'card mt-5 shadow-sm';

	const headerDiv = document.createElement('div');
	headerDiv.className = 'card-header d-flex justify-content-between align-items-center';

	// creating title and description
	const headerLeftdiv = document.createElement('div');
	const h5 = document.createElement('h5');
	const h6 = document.createElement('h6');
	h5.innerText = title;
	h6.className = 'card-subtitle text-muted';
	h6.innerText = description;
	headerLeftdiv.appendChild(h5);
	headerLeftdiv.appendChild(h6);

	// Creating finish button
	const headerButtonDiv = document.createElement('div');
	if (status == 'open') {
		const finishBtn = document.createElement('button');
		finishBtn.className = 'btn btn-dark btn-sm';
		finishBtn.innerText = 'Finish';
		headerButtonDiv.appendChild(finishBtn);
	}

	//Creating delete button
	const deleteBtn = document.createElement('button');
	deleteBtn.className = 'btn btn-outline-danger btn-sm ml-2';
	deleteBtn.innerHTML = 'Delete';
	headerButtonDiv.appendChild(deleteBtn);

	deleteBtn.addEventListener('click', function () {
		apiDeleteTask(id).then(section.remove());
	});

	//Creating ul
	const ul = document.createElement('ul');
	ul.className = 'list-group list-group-flush';

	apiListOperationsForTask(id).then(function (response) {
		response.data.forEach(function (operation) {
			renderOperation(ul, status, operation.id, operation.description, operation.timeSpent);
		});
	});

	//Creating form to add new subtasks
	if (status == 'open') {
		const mainFormDiv = document.createElement('div');
		mainFormDiv.className = 'card-body';
		const form = document.createElement('form');
		form.className = 'operations-form';
		mainFormDiv.appendChild(form);
		const formDiv = document.createElement('div');
		formDiv.className = 'input-group';
		form.appendChild(formDiv);
		const formInput = document.createElement('input');
		formInput.name = 'description';
		formInput.type = 'text';
		formInput.placeholder = 'Operations description';
		formInput.className = 'form-control';
		formInput.minLength = '5';
		const formBtnDiv = document.createElement('div');
		formBtnDiv.className = 'input-group-append';
		const formAddBtn = document.createElement('button');
		formAddBtn.className = 'btn btn-info';
		formAddBtn.innerText = 'Add';

		formBtnDiv.appendChild(formAddBtn);
		formDiv.appendChild(formInput);
		formDiv.appendChild(formBtnDiv);

		//Add new operation
		form.addEventListener('submit', function (event) {
			event.preventDefault();
			apiCreateOperationForTask(id, formInput.value).then(function (response) {
				renderOperation(ul, status, response.data.id, response.data.description, response.data.timeSpent);
			});
			formInput.value = '';
		});

		//Appends elements
		headerDiv.appendChild(headerLeftdiv);
		headerDiv.appendChild(headerButtonDiv);
		section.appendChild(headerDiv);
		section.appendChild(ul);
		section.appendChild(mainFormDiv);
		document.querySelector('main').appendChild(section);
	}
}

//Render all operations to HTML

function renderOperation(operationsList, status, operationId, operationDescription, timeSpent) {
	const li = document.createElement('li');
	li.className = 'list-group-item d-flex justify-content-between align-items-center';
	operationsList.appendChild(li);
	const listDiv = document.createElement('div');
	listDiv.innerText = operationDescription;
	li.appendChild(listDiv);

	const time = document.createElement('span');
	time.className = 'badge badge-success badge-pill ml-2';
	time.innerText = spentTime(timeSpent);
	listDiv.appendChild(time);

	if (status == 'open') {
		const timeBtnDiv = document.createElement('div');
		li.appendChild(timeBtnDiv);
		const btn15 = document.createElement('button');
		const btn1h = document.createElement('button');
		const btnDelete = document.createElement('button');
		btn15.className = 'btn btn-outline-success btn-sm mr-2';
		btn15.innerText = '+15m';
		btn1h.className = 'btn btn-outline-success btn-sm mr-2';
		btn1h.innerText = '+1h';
		btnDelete.className = 'btn btn-outline-danger btn-sm';
		btnDelete.innerText = 'Delete';
		timeBtnDiv.appendChild(btn15);
		timeBtnDiv.appendChild(btn1h);
		timeBtnDiv.appendChild(btnDelete);

		btn15.addEventListener('click', function () {
			apiUpdateOperation(operationId, operationDescription, timeSpent + 15).then(function (resp) {
				time.innerText = spentTime(resp.data.timeSpent);
				timeSpent = resp.data.timeSpent;
			});
		});
		btn1h.addEventListener('click', function () {
			apiUpdateOperation(operationId, operationDescription, timeSpent + 60).then(function (resp) {
				time.innerText = spentTime(resp.data.timeSpent);
				timeSpent = resp.data.timeSpent;
			});
		});

		btnDelete.addEventListener('click', function () {
			apiDeleteOperation(operationId).then(li.remove());
		});
	}
}

//Loading Page

document.addEventListener('DOMContentLoaded', function () {
	//Load all tasks
	apiListTasks().then(function (resp) {
		resp.data.forEach(element => {
			renderTask(element.id, element.title, element.description, element.status);
		});
	});
	const addFormTask = document.querySelector('.js-task-adding-form');

	//Adding new tasks
	addFormTask.addEventListener('submit', function (event) {
		event.preventDefault();
		apiCreateTask(event.target.elements.title.value, event.target.elements.description.value).then(function (response) {
			renderTask(response.data.id, response.data.title, response.data.description, response.data.status);
		});
		event.target.elements.title.value = '';
		event.target.elements.description.value = '';
	});
});
