var millisec;
var currentListId;
var currentTaskId;
var currentStepId;
var totalList = [];
var taskList = {id: "", name: "", task: [], status: ""};
var task = {id: "", name: "", status: "", isFinished: "", step: []};
var step = {id: "", name: "", status: "", isFinished: ""};

init();

/**
 * Init for all event listener operations.
 */
function init() {
    document.querySelector(".sideBarButton").addEventListener("click", toggleSideBar);
    document.querySelector(".plusIcon").addEventListener("click", toggleSideBarPlusButton); 
    document.querySelector(".newListText").addEventListener('keyup', saveList); 
    document.querySelector(".deleteList").addEventListener("click",deleteList);
    document.querySelector(".newCreateList").addEventListener("click", displayList);
    document.querySelector(".newListText").addEventListener("focus", listBoxOnFocus);
    document.querySelector(".newListText").addEventListener("focusout", listBoxOnFocusOut);
    document.querySelector(".titleName").addEventListener("keyup", listNameEdit);
    document.querySelector(".task").addEventListener("click", displayTaskNameInStepBar);
    document.querySelector(".addTask").addEventListener("click", createTask); 
    document.querySelector(".newTaskText").addEventListener("keyup",createTaskBox);
    document.querySelector(".taskInStepHeader").addEventListener("keyup", editTaskName);
    document.querySelector(".addSteps").addEventListener("click", addSteps);
    document.querySelector(".newStepText").addEventListener("keyup", saveNewStep);
    document.querySelector("#checkboxInStepHeader").addEventListener("change", changeTaskCheckBox);
    document.querySelector(".backIcon").addEventListener("click",compressStepMenu);
    document.querySelector(".trashIcon").addEventListener("click",deleteTask);
}

/**
 * Creating the new element.
 * 
 * @param element - Element to be created.
 */
function createElement(element) {
    return document.createElement(element);
}

/**
 * Setting the attribute.
 * 
 * @param parentElement - Parent element to add. 
 * @param attributeName - Attribute to define.
 * @param attribute - Attribute to add.
 */
function setAttribute(parentElement, attributeName, attribute) {
    return parentElement.setAttribute(attributeName, attribute);
}

/**
 * Appending the child element in parent element.
 * 
 * @param parentElement - Parent element.
 * @param childElement - Child element to append in parent.
 */
function appendChild(parentElement, childElement) {
    parentElement.appendChild(childElement);
}

/**
 * Refresh the elements from parent element.
 */
function refresh(refreshElements, parentElement) {
    refreshElements.forEach(elements => {
        parentElement.removeChild(elements);
    });
}

/**
 * Getting the list by current list id.
 */
function getListByCurrentListId() {
    return totalList.find(list => list.id == currentListId);
}

/**
 * Getting the task by current task id.
 * 
 * @param list - Get task from the list by current task id.
 */
function getTaskByCurrentTaskId(list) {
    return list.task.find(task => task.id == currentTaskId);
}

/**
 * Getting the step by current step id.
 * 
 * @param task - Get step from the task by current step id.
 */
function getStepByCurrentStepId(task) {
    return task.step.find(step => step.id == currentStepId);
    
}

/** 
 * SideBar functions while clicking the side bar menu button.
 */
function toggleSideBar() {
    if (this.value == "open") {
        document.querySelector(".sidePanel").style.width = "4%";
        document.querySelector(".sidePanalText").style.display = "none";
        document.querySelector(".newListInput").style.display = "none";
        document.querySelector(".stepsBarFooter").style.display = "none";
        var createdList = document.querySelectorAll(".listName");
        createdList.forEach(item => {
            item.style.display = "none";
        });
        document.querySelector(".taskDiv").style.width = "96%";
        this.value = "close";
    } else {
        document.querySelector(".sidePanel").style.width = "23%";
        document.querySelector(".sidePanalText").style.display = "block";
        document.querySelector(".newListInput").style.display = "block";
        document.querySelector(".stepsBarFooter").style.display = "block";
        var createdList = document.querySelectorAll(".listName");
        createdList.forEach(item => {
            item.style.display = "block";
        });
        document.querySelector(".taskDiv").style.width = "77%";
        this.value = "open";
    };
};

/** 
 * Plus Icon in side bar for list creation and opens the side bar while
 * clicking the plus when its in closed state.
 */
function toggleSideBarPlusButton() {
    if (document.querySelector(".sideBarButton").value == "close") {
        document.querySelector(".sidePanel").style.width = "23%";
        document.querySelector(".sidePanalText").style.display = "block";
        document.querySelector(".newListInput").style.display = "block";
        var createdList = document.querySelectorAll(".listName");
        createdList.forEach(item => {
            item.style.display = "block";
        });
        document.querySelector(".taskDiv").style.width = "77%";
        document.querySelector(".sideBarButton").value = "open";
    };
};

/**
 * Creates new list when enters the list name in text box 
 * and press enter to save.
 */
function saveList(e) {
    if ((this.value.length != 0) && (e.keyCode === 13)) {
        saveListInTotalList(this.value);
        createNewList(this.value, "true");
        this.value = null;
    };
};

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
 * Creates the new list with required elements.
 * 
 * @param  listContent - Current list name to  display at task header. 
 * @param  boolean     - Based on requirement refreshing the task. 
 */
function createNewList(listContent, boolean) {
    refresh(document.querySelectorAll(".listCreated"), document.querySelector(".newCreateList"));
    let lists = totalList.filter(list => list.status === "active");
    lists.forEach(list => {
        var iconDiv = createElement("DIV");
        setAttribute(iconDiv, 'id', list.id);
        setAttribute(iconDiv, 'class', 'listCreated');
        var i = createElement("I");
        setAttribute(i, 'class', 'fa fa-list');
        appendChild(iconDiv, i);
        var textDiv = createElement("DIV");
        setAttribute(textDiv, 'class', 'listName');
        var span = createElement('span');
        span.textContent = list.name;
        appendChild(textDiv, span);
        var spanCount = createElement('span');
        setAttribute(spanCount, "class", "spanCount");
        var count = 0;
        if (list.task != null) {
            let lists = list.task.filter(task => task.isFinished === "false");
            count = lists.length;	
        };
        spanCount.textContent = count;
        appendChild(iconDiv, spanCount);
        document.querySelector(".newCreateList").appendChild(iconDiv).appendChild(textDiv);
    });
    if (boolean == "true") {
        document.querySelector(".titleName").value = listContent;
        currentListId = millisec;
        refresh(document.querySelectorAll(".addedTask"), document.querySelector(".task"));
    };
};

/**
 * Deleting the current list by switching its status to inactive state.
 */
function deleteList() {
    let list = getListByCurrentListId();
    list.status = "inActive";
    createNewList("Task", "true");
};

/**
 * Displaying the list's name and its task that it holds in task bar.
 */
function displayList(e) {
    refresh(document.querySelectorAll(".addedTask"), document.querySelector(".task"));
    currentListId = e.target.id;
    let list = getListByCurrentListId();
    document.querySelector(".titleName").value = list.name;
    addTask(list);
}
    

/**
 * Changes the style of the input box in list creaation while on focus.
 */
function listBoxOnFocus() {
    document.querySelector(".fa-plus").style.color = "#868077"; 
    document.querySelector(".fa-plus").style.opacity = "0.7"; 
};

/**
 * Changes the style of the input box in list creaation while on focusout.
 */
function listBoxOnFocusOut() {    
    document.querySelector(".fa-plus").style.color = "#2078e5"; 
    document.querySelector(".fa-plus").style.opacity = "1"; 
};

/**
 * Edits the list name in task header.
 */
function listNameEdit(e) {
    if ((this.value.length != 0) && (e.keyCode === 13)) {
        let list = getListByCurrentListId();
        list.name = this.value;
        refresh(document.querySelectorAll(".listCreated"), document.querySelector(".newCreateList"));
        createNewList(list.name, "false");
    };
};

/**
 * Displays the task details in steps menu.
 */
function displayTaskNameInStepBar(e) {
    currentTaskId = e.target.id;
    let list = getListByCurrentListId();
    let task = getTaskByCurrentTaskId(list);
    let checkBoxInStepHeader = document.querySelector("#checkboxInStepHeader");
    let taskInStepHeader = document.querySelector(".taskInStepHeader");
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
    refresh(document.querySelectorAll(".addedStep"), document.querySelector(".newSteps"));
    if (task.step != null) {
        addStep(task.step);
    }
};

/**
 * Creates new task by entering new task name in task bar and press enter.
 */
function createTask() {
    var child = document.querySelector("#plus");
    var parent = document.querySelector(".newTaskTextLabelClass");
    var newChild = document.createElement("I");
    newChild.setAttribute('class', 'far fa-circle');
    newChild.style.color = "black";
    newChild.style.opacity = "0.5";
    parent.removeChild(child);
    parent.appendChild(newChild);
};

/**
 * Creating the new task. 
 */
function createTaskBox(e) {
    if ((this.value != 0) && (e.keyCode === 13)) {
        saveTaskInList(this.value);
        refresh(document.querySelectorAll(".addedTask"), document.querySelector(".task"));
        let list = getListByCurrentListId();
        addTask(list);
        this.value = null;
        refresh(document.querySelectorAll(".listCreated"), document.querySelector(".newCreateList"));
        createNewList(list.name, "false");
    }
}

/**
 * Display the overall task in a list in task bar.
 * 
 * @param list - List to be shown in task bar as created lists. 
 */
function addTask(list) {
    if (list.task != null) {
        let tasks = list.task.filter(task => task.status == "active");
        tasks.forEach(task => {
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
        })
    }
}

/**
 * New task to be saved in the current list.
 * 
 * @param newTask - New task to be saved in a list. 
 */
function saveTaskInList(newTask) {
    let list = getListByCurrentListId();
    let task = {};
    task.name = newTask;
    task.id = getDate();
    task.isFinished = "false";
    task.status = "active";
    if (list.task == null) {
        list.task = [];
        list.task.push(task);
    } else {
        list.task.push(task);
    }
}

/**
 * Event listener for check box in task bar.
 * 
 * @param element - Checkbox to be listened for state change. 
 */
function listenerForCheckBoxInAddTask(element) {
    element.addEventListener("change", function(event) {
        let id = event.target.id;
        currentTaskId = getIdByReplaceText(id, "checkBox");
        let list = getListByCurrentListId();
        let task = getTaskByCurrentTaskId(list);
        let checkBoxInStepHeader = document.querySelector("#checkboxInStepHeader");
        let taskInStepHeader = document.querySelector(".taskInStepHeader");
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
        refresh(document.querySelectorAll(".addedTask"), document.querySelector(".task"));
        addTask(list);
        refresh(document.querySelectorAll(".listCreated"), document.querySelector(".newCreateList"));
        createNewList(list.name, "false");
    })
}


/**
 * Editing the task name in step bar Header.
 */
function editTaskName(e) {
    if ((this.value.length != 0) && (e.keyCode === 13)) {
        let list = getListByCurrentListId();
        let task = getTaskByCurrentTaskId(list);
        task.name = this.value;
        refresh(document.querySelectorAll(".addedTask"), document.querySelector(".task"));
        addTask(list);
    }
}

/**
 * Adding the steps in current task by typing the step name and presses enter to save.
 */
function addSteps() {
    var child = document.querySelector("#plusStep");
    var parent = document.querySelector(".newStepTextLabelClass");
    var newChild = document.createElement("I");
    newChild.setAttribute('class', 'far fa-circle');
    newChild.style.color = "black";
    newChild.style.opacity = "0.5";
    parent.removeChild(child);
    parent.appendChild(newChild);
}

/**
 * Save new step from step add input box.
 */
function saveNewStep(e) {
    if ((this.value.length != 0) && (e.keyCode === 13)) {
        saveStepInTask(this.value);
        refresh(document.querySelectorAll(".addedStep"), document.querySelector(".newSteps"));
        const list = getListByCurrentListId();
        const task = getTaskByCurrentTaskId(list);
        addStep(task.step);
        this.value = null;
    }
}


/**
 * Adds the steps of current task in created steps bar.
 * 
 * @param step - Steps to be displayed as created steps. 
 */
function addStep(step) {
    let steps = step.filter(step => step.status == "active");
    steps.forEach(newStep => {
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
    })
}
 

/**
 * Saves the step in current task.
 * 
 * @param newStep - Steps to be saved as new step in current task. 
 */
function saveStepInTask(newStep) {
    let list = getListByCurrentListId();
    let task = getTaskByCurrentTaskId(list);
    let step = {};
    step.id = getDate();
    step.name = newStep;
    step.status = "active"
    step.isFinished = "false";
    if (task.step == null) {
        task.step = [];
        task.step.push(step);
    } else {
        task.step.push(step);
    }
}

/**
 * Showing the steps bar.
 */
function showStepsBar() {
    var sideBarButton = document.querySelector(".sideBarButton");
    var taskBar = document.querySelector(".taskDiv");
    var stepBar = document.querySelector(".stepsBar");
    document.querySelector(".backIcon").value = "open";
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
        let id = event.target.id;
        currentStepId = getIdByReplaceText(id, "checkBox");
        let list = getListByCurrentListId();
        let task = getTaskByCurrentTaskId(list);
        let newStep = getStepByCurrentStepId(task); 
        if (element.checked) {
            newStep.isFinished = "true";
        } else {
            newStep.isFinished = "false";
        }
        refresh(document.querySelectorAll(".addedStep"), document.querySelector(".newSteps"));
        addStep(task.step);
    })
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
        var stepId = getIdByReplaceText(id, "close");
        currentStepId = stepId;
        let list = getListByCurrentListId();
        let task = getTaskByCurrentTaskId(list);
        let newStep = getStepByCurrentStepId(task);
        newStep.status = "inActive";
        refresh(document.querySelectorAll(".addedStep"), document.querySelector(".newSteps"));
        addStep(task.step);
    })
}

/**
 * Check box in the step header for task to be finished task or as unfinished task.
 */
function changeTaskCheckBox() {
    let list = getListByCurrentListId();
    let task = getTaskByCurrentTaskId(list);
    let taskInStepHeader = document.querySelector(".taskInStepHeader");
    if (task.isFinished == "true") {
        task.isFinished = "false";
        taskInStepHeader.setAttribute("class", "taskInStepHeader")
        refresh(document.querySelectorAll(".addedTask"), document.querySelector(".task"));
        addTask(list);
    } else {
        task.isFinished = "true";
        taskInStepHeader.setAttribute("class", "taskInStepHeader taskInStepHeaderStriked")
        refresh(document.querySelectorAll(".addedTask"), document.querySelector(".task"));
        addTask(list);
    }
}

/**
 * Back Icon in the step bar footer to close the step bar.
 */
function compressStepMenu() {
    let sideBarButton = document.querySelector(".sideBarButton");
    let sidePanal = document.querySelector(".sidePanel");
    let taskBar = document.querySelector(".taskDiv");
    let stepBar = document.querySelector(".stepsBar");
    this.value = "close";
    if (sideBarButton.value == 'open') {
        taskBar.style.width = "77%";
        sidePanal.style.width = "23%";
        stepBar.style.width = "0%";
    } else {
        taskBar.style.width = "96%";
        sidePanal.style.width = "4%";
        stepBar.style.width = "0%";
    }
}

/**
 * Trash icon in the step bar to delete the current task. 
 */
function deleteTask() {
    let list = getListByCurrentListId();
    let task = getTaskByCurrentTaskId(list);
    task.status = "inActive";
    refresh(document.querySelectorAll(".addedTask"), document.querySelector(".task"));
    document.querySelector(".titleName").value = list.name;
    addTask(list);
}

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

/**
 * 
 * @param  id     - Id to be refined by removing text.
 * @param  string - String to be replaced.
 */
function getIdByReplaceText(id, string) {
    return id.replace(string, "");
}



