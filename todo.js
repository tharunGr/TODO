var millisec;
var currentListId;
var currentTaskId;
var currentStepId;
var totalList = [];
var taskList = {id: "", name: "", task: [], status: ""};
var task = {id: "", name: "", status: "", isFinished: "", step: []};
var step = {id: "", name: "", status: "", isFinished: ""};

/** 
 * SideBar functions while clicking the side bar menu button.
 */
document.querySelector(".sideBarButton").addEventListener("click",function() {
	if (document.querySelector(".sideBarButton").value == "open") {
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

/** 
 * Plus Icon in side bar for list creation and opens the side bar while
 * clicking the plus when its in closed state.
 */
document.querySelector(".plusIcon").addEventListener("click", function(e) {
	if (document.querySelector(".sideBarButton").value == "close") {
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

/**
 * Creates new list when enters the list name in text box 
 * and press enter to save.
 */
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

/**
 * Saves the list details in list and pushes that list in total list.
 * 
 * @param listContent - It contains the list name to save a list in 
 *                      total list. 
 */
function saveListInTotalList(listContent) {
	let taskList = {};
    taskList.id = getDate();
	taskList.name = listContent;
	let status = "active";
	taskList.status = status;
    totalList.push(taskList);
}

/**
 * Refresh the previous list created in list creation by removing it.
 */
function refreshList() {
	var refreshListBarIcon = document.querySelectorAll(".listCreated");
    refreshListBarIcon.forEach(function(list) {
    	document.querySelector(".newCreateList").removeChild(list);
	})
}

/**
 * Creates the new list with required elements.
 * 
 * @param  listContent - Current list name to  display at task header. 
 * @param  boolean     - Based on requirement refreshing the task. 
 */
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

/**
 * Deleting the current list by switching its status to inactive state.
 */
document.querySelector(".deleteList").addEventListener("click",function() {
	const list = totalList.find(list => list.id == currentListId);
	let statusDelete = "inActive"
	list.status = statusDelete;
	createNewList("Task", "true");
});

/**
 * Displaying the list's name and its task that it holds in task bar.
 */
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

/**
 * Changes the style of the input box in list creaation while on focus.
 */
document.querySelector(".newListText").addEventListener("focus", function(e) {
	document.querySelector(".fa-plus").style.color = "#868077"; 
	document.querySelector(".fa-plus").style.opacity = "0.7"; 
});

/**
 * Changes the style of the input box in list creaation while on focusout.
 */
document.querySelector(".newListText").addEventListener("focusout", function(e) {
	document.querySelector(".fa-plus").style.color = "#2078e5"; 
	document.querySelector(".fa-plus").style.opacity = "1"; 
});

/**
 * Edits the list name in task header.
 */
var listNameEdit = document.querySelector(".titleName");
listNameEdit.addEventListener("keyup", function(e) {
	if ((listNameEdit.value.length != 0) && (e.keyCode === 13)) {
		const list = totalList.find(list => list.id == currentListId);
		list.name = listNameEdit.value;
		refreshList();
		createNewList(list.name, "false");
	}
});

/**
 * Displays the task details in steps menu.
 */
document.querySelector(".task").addEventListener("click",function(e) {
	currentTaskId = e.target.id;
	const lists = totalList.find(list => list.id == currentListId);
	const task = lists.task.find(task => task.id == currentTaskId);

	checkBoxInStepHeader = document.querySelector("#checkboxInStepHeader");
	taskInStepHeader = document.querySelector(".taskInStepHeader");
	if (task.isFinished == "true") {
		checkBoxInStepHeader.checked = true;
		taskInStepHeader.setAttribute("value", task.name)
		taskInStepHeader.setAttribute("class", "taskInStepHeader taskInStepHeaderStriked")
	} else {
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

/**
 * Creates new task by entering new task name in task bar and press enter.
 */
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

/**
 * Display the overall task in a list in task bar.
 * 
 * @param list - List to be shown in task bar as created lists. 
 */
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

/**
 * New task to be saved in the current list.
 * 
 * @param newTask - New task to be saved in a list. 
 */
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

/**
 * Refreshes the previous tasks with its new task details.
 */
function refreshTasks() {
    var refreshTaskBar = document.querySelectorAll(".addedTask");
    refreshTaskBar.forEach(function(task) {
    	document.querySelector(".task").removeChild(task);
    });
}

/**
 * Display the current list tasks.
 * 
 * @param lists - Displays the lists.
 */
function displayListTasks(lists) {
	addTask(lists);
}

/**
 * Event listener for check box in task bar.
 * 
 * @param element - Checkbox to be listened for state change. 
 */
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

/**
 * Editing the task name in step bar Header.
 */
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

/**
 * Adding the steps in current task by typing the step name and presses enter to save.
 */
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

/**
 * Adds the steps of current task in created steps bar.
 * 
 * @param step - Steps to be displayed as created steps. 
 */
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

/**
 * Saves the step in current task.
 * 
 * @param newStep - Steps to be saved as new step in current task. 
 */
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

/**
 * Displays the current task steps.
 * 
 * @param step - Steps to be displayed in steps bar. 
 */
function displaySteps(step) {
	addStep(step);
}

/**
 * Refreshes the steps in steps bar.
 */
function refreshSteps() {
	var refreshStepBar = document.querySelectorAll(".addedStep");
    refreshStepBar.forEach(function(step) {
    	document.querySelector(".newSteps").removeChild(step);
    });
}

/**
 * Showing the steps bar.
 */
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

/**
 * Event Listener for the check box in steps.
 * 
 * @param element - Listens the check box of the step to changes its state.
 */
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

/**
 * Event listener for the close icon in the step to delete a particular 
 * step from its task.
 * 
 * @param element - Close icon in steps to delete the step. 
 */
function listenerForCloseIconInAddStep(element) {
	element.addEventListener("click", function(event) {
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

/**
 * Check box in the step header for task to be finished task or as unfinished task.
 */
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

/**
 * Back Icon in the step bar footer to close the step bar.
 */
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

/**
 * Trash icon in the step bar to delete the current task. 
 */
document.querySelector(".trashIcon").addEventListener("click",function() {
	const list = totalList.find(list => list.id == currentListId);
	const task = list.task.find(task => task.id == currentTaskId);
	let statusDelete = "inActive"
	task.status = statusDelete;
	refreshTasks();
	document.querySelector(".titleName").value = list.name;
	displayListTasks(list);
});

/**
 * Date operation to get milli second for id.
 * 
 * @returns - It returns the millic second for id.
 */
function getDate() {
	date = new Date();
	millisec = date.getTime();
	return millisec;
}



