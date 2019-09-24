var millisec;
var currentListId;
var currentTaskId;
var totalList = [];
var taskList = {id: "", name: "", task: [], status: ""};
var task = {id: "", name: "", status: "", step: []};
var step = {name: ""};

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
		createNewList(listContent);
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

function createNewList(listContent) {
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
			document.querySelector(".newCreateList").appendChild(iconDiv).appendChild(textDiv);
		}
	});
	document.querySelector(".titleName").textContent = listContent;
	currentListId = millisec;
	refreshTasks();
}

document.querySelector(".deleteList").addEventListener("click",function() {
	const list = totalList.find(list => list.id == currentListId);
	let statusDelete = "inActive"
	list.status = statusDelete;
	createNewList("Task");
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
		}
	});
});

function addTask(list) {
	console.log("add task");
	list.task.forEach(function(task) {
		if (task.status == "active") {
			var addedTask = document.createElement("DIV");
			addedTask.setAttribute('class', 'addedTask');
			addedTask.setAttribute('id', task.id);
			var button = document.createElement("DIV");
			button.setAttribute('class', 'plusAddedTaskIcon');
			addedTask.appendChild(button);
			var i = document.createElement("I");
			i.setAttribute('class', 'far fa-circle');
			button.appendChild(i);
			var span = document.createElement('span');
			span.setAttribute('class', 'taskName');
			span.textContent = task.name;
			addedTask.appendChild(span);
			document.querySelector(".task").appendChild(addedTask);
		}
	});
}

document.querySelector(".trashIcon").addEventListener("click",function() {
	console.log("trash icon");
	const list = totalList.find(list => list.id == currentListId);
	const task = list.task.find(task => task.id == currentTaskId);
	let statusDelete = "inActive"
	task.status = statusDelete;
	refreshTasks();
	document.querySelector(".titleName").textContent = list.name;
	displayListTasks(list);
});


function saveTaskInList(newTask) {
	totalList.forEach(function(list) {
		if (list.id == currentListId) {
			let task = {};
			task.name = newTask;
			task.id = getDate();
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

document.querySelector(".newCreateList").addEventListener("click",function(e) {
	refreshTasks();
	currentListId = e.target.id;
	totalList.forEach(function(list) {
		if (list.id == e.target.id) {
		    document.querySelector(".titleName").textContent = list.name;
		    displayListTasks(list);
		}
	});
});

function getDate() {
	date = new Date();
	millisec = date.getTime();
	return millisec;
}

function refreshTasks() {
	console.log("refresh task");
    var refreshTaskBar = document.querySelectorAll(".addedTask");
    refreshTaskBar.forEach(function(task) {
    	document.querySelector(".task").removeChild(task);
    });
}

function displayListTasks(lists) {
	console.log("display task");
	addTask(lists);
}

document.querySelector(".newListText").addEventListener("focus", function(e) {
	console.log("in");
	document.querySelector(".fa-plus").style.color = "#868077"; 
	document.querySelector(".fa-plus").style.opacity = "0.7"; 
});

document.querySelector(".newListText").addEventListener("focusout", function(e) {
	console.log("in");
	document.querySelector(".fa-plus").style.color = "#2078e5"; 
	document.querySelector(".fa-plus").style.opacity = "1"; 
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
			addStep(newStep);
			saveStepInTask(newStep);
			document.querySelector(".newStepText").value = null;
		}
	});
});

function addStep(newStep) {
	  var addedStep = document.createElement("DIV");
	  addedStep.setAttribute('class', 'addedStep');
	  addedStep.setAttribute('id', getDate());
	  var button = document.createElement("BUTTON");
	  button.setAttribute('class', 'plusAddedStepIcon');
	  addedStep.appendChild(button);
	  var i = document.createElement("I");
	  i.setAttribute('class', 'far fa-circle');
	  button.appendChild(i);
	  var span = document.createElement('span');
	  span.setAttribute('class', 'stepName');
	  span.textContent = newStep;
	  addedStep.appendChild(span);
	  document.querySelector(".newSteps").appendChild(addedStep);
}

function saveStepInTask(newStep) {
	totalList.forEach(function(list) {
		if (list.id == currentListId) {
			list.task.forEach(function(task) {
				if(task.id == currentTaskId) {
					let step = {};
					step.name = newStep;
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

document.querySelector(".task").addEventListener("click",function(e) {
	currentTaskId = e.target.id;
	const lists = totalList.find(list => list.id == currentListId);
	const task = lists.task.find(task => task.id == e.target.id);
	document.querySelector(".stepText").value = task.name
	showStepsBar();
	refreshSteps();
	displaySteps(task.step);
});

function displaySteps(step) {
	step.forEach(function(step) {
    	addStep(step.name);
    });
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

document.querySelector(".deleteList").addEventListener("click",function(e) {
    
});
