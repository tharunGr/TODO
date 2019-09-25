var millisec;
var currentListId;
var currentTaskId;
var currentStepId;
var totalList = [];
var taskList = {id: "", name: "", task: [], status: ""};
var task = {id: "", name: "", status: "", isFinished: "", step: []};
var step = {id: "", name: "", status: "", isFinished: ""};
var taskEntries = 0;

document.querySelector(".sideBarButton").addEventListener("click",function() {
	//console.log(document.querySelector(".sideBarButton").value);
	if (document.querySelector(".sideBarButton").value == "open") {
		//console.log("in open");
		document.querySelector(".sidePanel").style.width = "4%";
		document.querySelector(".sidePanalText").style.display = "none";
		document.querySelector(".newListInput").style.display = "none";
		document.querySelector(".stepsBarFooter").style.display = "none";
		var createdList = document.querySelectorAll(".listName");
		createdList.forEach(function(item) {
			item.style.display = "none";
		})
		document.querySelector(".taskDiv").style.width = "96%";
		document.querySelector(".sideBarButton").value = "close";
	} else {
		//console.log("in close");
		document.querySelector(".sidePanel").style.width = "23%";
		document.querySelector(".sidePanalText").style.display = "block";
		document.querySelector(".newListInput").style.display = "block";
		document.querySelector(".stepsBarFooter").style.display = "block";
		var createdList = document.querySelectorAll(".listName");
		createdList.forEach(function(item) {
			item.style.display = "block";
		})
		document.querySelector(".taskDiv").style.width = "77%";
		document.querySelector(".sideBarButton").value = "open";
	}
});

document.querySelector(".plusIcon").addEventListener("click", function(e) {
	if (document.querySelector(".sideBarButton").value == "close") {
		console.log("in close");
		document.querySelector(".sidePanel").style.width = "23%";
		document.querySelector(".sidePanalText").style.display = "block";
		document.querySelector(".newListInput").style.display = "block";
		var createdList = document.querySelectorAll(".listName");
		createdList.forEach(function(item) {
			item.style.display = "block";
		});
		document.querySelector(".taskDiv").style.width = "77%";
		document.querySelector(".sideBarButton").value = "open";
	}
});













var textBox = document.querySelector(".newListText");
textBox.addEventListener('keyup',function(e) {
	var listContent;
	if ((textBox.value.length != 0) && (e.keyCode === 13)) {
		listContent = textBox.value;
		saveListInTotalList(listContent);
		createNewList(listContent, "true");
		textBox.value = null;
	}
});

function saveListInTotalList(listContent) {
	let taskList = {};
    taskList.id = getDate();
	taskList.name = listContent;
	let status = "active";
	taskList.status = status;
    totalList.push(taskList);
}

function refreshList() {
	var refreshListBarIcon = document.querySelectorAll(".listCreated");
    refreshListBarIcon.forEach(function(list) {
    	document.querySelector(".newCreateList").removeChild(list);
	})
}

function createNewList(listContent, boolean) {
	refreshList();
	totalList.forEach(function(list) {
		if (list.status == "active") {
			var iconDiv = document.createElement("DIV");
			iconDiv.setAttribute('id', list.id);
			iconDiv.setAttribute('class', 'listCreated');
			var i = document.createElement("I");
			i.setAttribute('class', 'fa fa-list');
			iconDiv.appendChild(i);
			var textDiv = document.createElement("DIV");
			textDiv.setAttribute('class', 'listName');
			var span = document.createElement('span');
			span.textContent = list.name;
			textDiv.appendChild(span);
			var spanCount = document.createElement('span');
			spanCount.setAttribute("class", "spanCount");
			var count = 0;
			if (typeof list.task !== 'undefined') {
				list.task.forEach(function(task) {
					if (task.isFinished == "false") {
						count = count + 1;
					}
				});
			}
			spanCount.textContent = count;
			iconDiv.appendChild(spanCount);
			document.querySelector(".newCreateList").appendChild(iconDiv).appendChild(textDiv);
		}
	});
	if (boolean == "true") {
		document.querySelector(".titleName").value = listContent;
		currentListId = millisec;
		refreshTasks();
	}
}

document.querySelector(".deleteList").addEventListener("click",function() {
	const list = totalList.find(list => list.id == currentListId);
	let statusDelete = "inActive"
	list.status = statusDelete;
	createNewList("Task", "true");
});

document.querySelector(".newCreateList").addEventListener("click",function(e) {
	refreshTasks();
	currentListId = e.target.id;
	totalList.forEach(function(list) {
		if (list.id == e.target.id) {
		    document.querySelector(".titleName").value = list.name;
		    displayListTasks(list);
		}
	});
});

document.querySelector(".newListText").addEventListener("focus", function(e) {
	document.querySelector(".fa-plus").style.color = "#868077"; 
	document.querySelector(".fa-plus").style.opacity = "0.7"; 
});

document.querySelector(".newListText").addEventListener("focusout", function(e) {
	document.querySelector(".fa-plus").style.color = "#2078e5"; 
	document.querySelector(".fa-plus").style.opacity = "1"; 
});

var listNameEdit = document.querySelector(".titleName");
listNameEdit.addEventListener("keyup", function(e) {
	if ((listNameEdit.value.length != 0) && (e.keyCode === 13)) {
		const list = totalList.find(list => list.id == currentListId);
		list.name = listNameEdit.value;
		refreshList();
		createNewList(list.name, "false");
	}
});

















document.querySelector(".task").addEventListener("click",function(e) {
	currentTaskId = e.target.id;
	const lists = totalList.find(list => list.id == currentListId);
	const task = lists.task.find(task => task.id == currentTaskId);

	checkBoxInStepHeader = document.querySelector("#checkboxInStepHeader");
	taskInStepHeader = document.querySelector(".taskInStepHeader");
	if (task.isFinished == "true") {
		console.log("trueeeee" + task.name);
		checkBoxInStepHeader.checked = true;
		taskInStepHeader.setAttribute("value", task.name)
		taskInStepHeader.setAttribute("class", "taskInStepHeader taskInStepHeaderStriked")
	} else {
		console.log("fasleeee" + task.name);
		checkBoxInStepHeader.checked = false;
		taskInStepHeader.setAttribute("value", task.name)
		taskInStepHeader.setAttribute("class", "taskInStepHeader")
	}
	showStepsBar();
	refreshSteps();
	if (typeof task.step !== 'undefined') {
		displaySteps(task.step);
	}
});

document.querySelector(".addTask").addEventListener("click",function() {
	var child = document.querySelector("#plus");
	var parent = document.querySelector(".newTaskTextLabelClass");
	var newChild = document.createElement("I");
	newChild.setAttribute('class', 'far fa-circle');
	newChild.style.color = "black";
	newChild.style.opacity = "0.5";
	parent.removeChild(child);
	parent.appendChild(newChild);
	document.querySelector(".newTaskText").addEventListener("keyup",function(e) {
		if ((document.querySelector(".newTaskText").value != 0) && (e.keyCode === 13)) {
			var newTask = document.querySelector(".newTaskText").value;
			saveTaskInList(newTask);
			refreshTasks();
			const list = totalList.find(list => list.id == currentListId);
			addTask(list);
			document.querySelector(".newTaskText").value = null;
			refreshList();
			createNewList(list.name, "false");
		}
	});
});

function addTask(list) {
	list.task.forEach(function(task) {
		if (task.status == "active") {
			var addedTask = document.createElement("DIV");
			addedTask.setAttribute('class', 'addedTask');
			addedTask.setAttribute('id', task.id);
			var round = document.createElement("DIV");
			round.setAttribute('class', 'round');
			addedTask.appendChild(round);
			var checkbox = document.createElement("input");
			checkbox.type = "checkbox"; 
			checkbox.id = task.id + "checkBox";
			round.appendChild(checkbox);
			listenerForCheckBoxInAddTask(checkbox);
			var label = document.createElement('label'); 
			label.htmlFor = task.id + "checkBox"; 
			round.appendChild(label);
			var span = document.createElement('span');
			if (task.isFinished == "true") {
				span.setAttribute('class', "taskName strike");
				checkbox.checked = true;
		    } else {
				span.setAttribute('class', 'taskName');
			}
			span.textContent = task.name;
			addedTask.appendChild(span);
			document.querySelector(".task").appendChild(addedTask);
		}
	});
}

function saveTaskInList(newTask) {
	totalList.forEach(function(list) {
		if (list.id == currentListId) {
			let task = {};
			task.name = newTask;
			task.id = getDate();
			task.isFinished = "false";
			let statusActive = "active";
			task.status = statusActive;
			if (typeof list.task === 'undefined') {
				list.task = [];
				list.task.push(task);
			} else {
				list.task.push(task);
			}
		}
	});
}

function refreshTasks() {
    var refreshTaskBar = document.querySelectorAll(".addedTask");
    refreshTaskBar.forEach(function(task) {
    	document.querySelector(".task").removeChild(task);
    });
}

function displayListTasks(lists) {
	addTask(lists);
}

function listenerForCheckBoxInAddTask(element) {
	element.addEventListener("change", function(event) {
		var id = event.target.id;
		var taskId = id.replace("checkBox","");
		currentTaskId = taskId;
		const list = totalList.find(list => list.id == currentListId);
		list.task.forEach(function(task) {
			if(task.id == currentTaskId) {
				checkBoxInStepHeader = document.querySelector("#checkboxInStepHeader");
				taskInStepHeader = document.querySelector(".taskInStepHeader");
		        if (element.checked) {
					task.isFinished = "true";
					checkBoxInStepHeader.checked = true;
					taskInStepHeader.setAttribute("value", task.name)
					taskInStepHeader.setAttribute("class", "taskInStepHeader taskInStepHeaderStriked")
				} else {
					task.isFinished = "false";
					checkBoxInStepHeader.checked = false;
					taskInStepHeader.setAttribute("value", task.name)
					taskInStepHeader.setAttribute("class", "taskInStepHeader")
				}
				refreshTasks();
				addTask(list);
				refreshList();
				createNewList(list.name, "false");
			}
		});
	});
}

var taskNameEdit = document.querySelector(".taskInStepHeader");
taskNameEdit.addEventListener("keyup", function(e) {
	if ((taskNameEdit.value.length != 0) && (e.keyCode === 13)) {
		const list = totalList.find(list => list.id == currentListId);
		list.task.forEach(function(task) {
			if(task.id == currentTaskId) {
				task.name = taskNameEdit.value;
				taskNameEdit.value = task.name
				refreshTasks();
				displayListTasks(list);
			}
		});
	}
});


















document.querySelector(".addSteps").addEventListener("click",function() {
	var child = document.querySelector("#plusStep");
	var parent = document.querySelector(".newStepTextLabelClass");
	var newChild = document.createElement("I");
	newChild.setAttribute('class', 'far fa-circle');
	newChild.style.color = "black";
	newChild.style.opacity = "0.5";
	parent.removeChild(child);
	parent.appendChild(newChild);
	var newStepText = document.querySelector(".newStepText");
	newStepText.addEventListener("keyup",function(e) {
		if ((newStepText.value.length != 0) && (e.keyCode === 13)) {
			var newStep = newStepText.value;
			saveStepInTask(newStep);
			refreshSteps();
			const list = totalList.find(list => list.id == currentListId);
			const task = list.task.find(task => task.id == currentTaskId);
			displaySteps(task.step);
			document.querySelector(".newStepText").value = null;
		}
	});
});

function addStep(step) {
	step.forEach(function(newStep) {
		if (newStep.status == "active") {
			var addedStep = document.createElement("DIV");
			addedStep.setAttribute('class', 'addedStep');
			addedStep.setAttribute('id', newStep.id);
			var roundStepBarIcon = document.createElement("DIV");
			roundStepBarIcon.setAttribute('class', 'roundStepBarIcon');
			var checkboxStepBar = document.createElement("input");
			checkboxStepBar.type = "checkbox"; 
			checkboxStepBar.id = newStep.id + "checkBox";
			roundStepBarIcon.appendChild(checkboxStepBar);
			listenerForCheckBoxInAddStep(checkboxStepBar);
			var labelStepBar = document.createElement('label'); 
			labelStepBar.htmlFor = newStep.id + "checkBox"; 
			roundStepBarIcon.appendChild(labelStepBar);
			var spanBar = document.createElement('span');
			if (newStep.isFinished == "true") {
				spanBar.setAttribute('class', "stepTextBar stepTextBarStrike");
				checkboxStepBar.checked = true;
			} else {
				spanBar.setAttribute('class', 'stepTextBar');
				checkboxStepBar.checked = false;
			}
			spanBar.textContent = newStep.name;
			var closeIconInAddStep = document.createElement("I");
			closeIconInAddStep.setAttribute("class", "fa fa-times");
			closeIconInAddStep.setAttribute("id", newStep.id + "close");
			listenerForCloseIconInAddStep(closeIconInAddStep);
			addedStep.appendChild(roundStepBarIcon);
			addedStep.appendChild(spanBar);
			addedStep.appendChild(closeIconInAddStep);
			document.querySelector(".newSteps").appendChild(addedStep);
		}
	});
}


function saveStepInTask(newStep) {
	totalList.forEach(function(list) {
		if (list.id == currentListId) {
			list.task.forEach(function(task) {
				if(task.id == currentTaskId) {
					let step = {};
					step.id = getDate();
					step.name = newStep;
					step.status = "active"
					step.isFinished = "false";
					if (typeof task.step === 'undefined') {
						task.step = [];
						task.step.push(step);
					} else {
						task.step.push(step);
					}
				}
			});
		}
	});
}

function displaySteps(step) {
	addStep(step);
}

function refreshSteps() {
	var refreshStepBar = document.querySelectorAll(".addedStep");
    refreshStepBar.forEach(function(step) {
    	document.querySelector(".newSteps").removeChild(step);
    });
}

function showStepsBar() {
	var sideBarButton = document.querySelector(".sideBarButton");
	var taskBar = document.querySelector(".taskDiv");
	var stepBar = document.querySelector(".stepsBar");
	backButton.value = "open";
	if (sideBarButton.value == 'open') {
		taskBar.style.width = "50%";
		stepBar.style.width = "27%";
	} else {
        taskBar.style.width = "69%";
		stepBar.style.width = "27%";
	}	
}

function listenerForCheckBoxInAddStep(element) {
	element.addEventListener("change", function(event) {
		var id = event.target.id;
		var stepId = id.replace("checkBox","");
		currentStepId = stepId;
		const list = totalList.find(list => list.id == currentListId);
		list.task.forEach(function(task) {
			if(task.id == currentTaskId) {
				task.step.forEach(function(newStep) {
					if(newStep.id == currentStepId) {
						if (element.checked) {
							newStep.isFinished = "true";
						} else {
							newStep.isFinished = "false";
						}
						refreshSteps();
						addStep(task.step);
					}
				});
			}
		});
	});
}

function listenerForCloseIconInAddStep(element) {
	element.addEventListener("click", function(event) {
		console.log("in close");
		var id = event.target.id;
		var stepId = id.replace("close","");
		currentStepId = stepId;
		const list = totalList.find(list => list.id == currentListId);
		list.task.forEach(function(task) {
			if(task.id == currentTaskId) {
				task.step.forEach(function(newStep) {
					if(newStep.id == currentStepId) {
						newStep.status = "inActive";
						refreshSteps();
						addStep(task.step);
					}
				});
			}
		});
	});
}

document.querySelector("#checkboxInStepHeader").addEventListener("change", function() {
	const list = totalList.find(list => list.id == currentListId);
	list.task.forEach(function(task) {
		if(task.id == currentTaskId) {
		    var taskInStepHeader = document.querySelector(".taskInStepHeader");
			if (task.isFinished == "true") {
				task.isFinished = "false";
				taskInStepHeader.setAttribute("class", "taskInStepHeader")
				refreshTasks();
				addTask(list);
			} else {
				task.isFinished = "true";
				taskInStepHeader.setAttribute("class", "taskInStepHeader taskInStepHeaderStriked")
				refreshTasks();
				addTask(list);
			}
		}
	});
});




















var backButton = document.querySelector(".backIcon");
backButton.addEventListener("click",function(e) {
	var sideBarButton = document.querySelector(".sideBarButton");
	var sidePanal = document.querySelector(".sidePanel");
	var taskBar = document.querySelector(".taskDiv");
	var stepBar = document.querySelector(".stepsBar");
	backButton.value = "close";
	if (sideBarButton.value == 'open') {
		taskBar.style.width = "77%";
		sidePanal.style.width = "23%";
		stepBar.style.width = "0%";
	} else {
		taskBar.style.width = "96%";
		sidePanal.style.width = "4%";
		stepBar.style.width = "0%";
	}
});

document.querySelector(".trashIcon").addEventListener("click",function() {
	console.log("trash icon");
	const list = totalList.find(list => list.id == currentListId);
	const task = list.task.find(task => task.id == currentTaskId);
	let statusDelete = "inActive"
	task.status = statusDelete;
	refreshTasks();
	document.querySelector(".titleName").value = list.name;
	displayListTasks(list);
});

function getDate() {
	date = new Date();
	millisec = date.getTime();
	return millisec;
}



