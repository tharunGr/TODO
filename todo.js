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
    addEventListener(".sideBarButton", "click", toggleSideBar);
    addEventListener(".plusIcon", "click", toggleSideBarPlusButton); 
    addEventListener(".newListText", 'keyup', saveList); 
    addEventListener(".deleteList", "click",deleteList);
    addEventListener(".newCreateList", "click", displayList);
    addEventListener(".titleName", "keyup", listNameEdit);
    addEventListener(".task", "click", displayTaskNameInStepBar);
    addEventListener(".addTask", "click", createTask); 
    addEventListener(".newTaskText", "keyup",createTaskBox);
    addEventListener(".taskInStepHeader", "keyup", editTaskName);
    addEventListener(".addSteps", "click", addSteps);
    addEventListener(".newStepText", "keyup", saveNewStep);
    addEventListener("#checkboxInStepHeader", "change", changeTaskCheckBox);
    addEventListener(".backIcon", "click",compressStepMenu);
    addEventListener(".trashIcon", "click",deleteTask);
}

function addEventListener(element, attribute, action) {
    querySelector(element).addEventListener(attribute, action);
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
 * Removing the child element from parent element.
 * 
 * @param parentElement - Parent element.
 * @param childElement - Child element to remove from parent.
 */
function removeChild(parentElement, childElement) {
    parentElement.removeChild(childElement);
}

/**
 * Adding the text content to a span element.
 * 
 * @param parentElement - Parent element to add text content. 
 * @param childElement - Content to be added in parent element.
 */
function textContent(parentElement, childElement) {
    parentElement.textContent = childElement;
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
 * Event enter key check.
 * 
 * @param textLength - Length of the text in input.
 * @param event - Event which detect whether enter key is pressed or not.
 */
function enterKeyCheck(textLength, event) {
    if ((textLength.length != 0) && (event.keyCode === 13)) {
        return true;
    }
    return false;
}

/**
 * Query selector function.
 * 
 * @param element - Element of query Selector. 
 */
function querySelector(element) {
    return document.querySelector(element);
}

/**
 * Query selector function.
 * 
 * @param element - Element of query Selector. 
 */
function querySelectorAll(element) {
    return document.querySelectorAll(element);
}

/** 
 * SideBar functions while clicking the side bar menu button.
 */
function toggleSideBar() {
    console.log("Side button" + this.value);
    if (this.value == "open") {
        setAttribute(querySelector(".sidePanel"), "class", "sidePanel sidePanelClose");
        setAttribute(querySelector(".newListInput"), "class", "newListInput newListInputClose");
        setAttribute(querySelector(".taskDiv"), "class", "taskDiv taskDivFull");
        this.value = "close";
    } else {
        setAttribute(querySelector(".sidePanel"), "class", "sidePanel");
        setAttribute(querySelector(".newListInput"), "class", "newListInput");
        setAttribute(querySelector(".taskDiv"), "class", "taskDiv");
        this.value = "open";
    };
};

/** 
 * Plus Icon in side bar for list creation and opens the side bar while
 * clicking the plus when its in closed state.
 */
function toggleSideBarPlusButton() {
    console.log("Side plus button" + this.value);
    if (querySelector(".sideBarButton").value == "close") {
        setAttribute(querySelector(".sidePanel"), "class", "sidePanel");
        setAttribute(querySelector(".newListInput"), "class", "newListInput");
        if (querySelector(".backIcon").value == "close") { 
            setAttribute(querySelector(".taskDiv"), "class", "taskDiv");
        } else {
            setAttribute(querySelector(".taskDiv"), "class", "taskDiv taskDivClose");
        }
        querySelector(".sideBarButton").value = "open";
    };
};

/**
 * Creates new list when enters the list name in text box 
 * and press enter to save.
 */
function saveList(e) {
    if (enterKeyCheck(this.value, e)) {
        saveListInTotalList(this.value);
        createNewList(this.value, "true");
        this.value = null;
    };
};

function checkNameUnique(name, lists) {
    let count = lists.filter(list => name.includes(list.name)).length;
    if (count == 0) {
        return name;
    } 
    let newName = name + "(" + count + ")";
    return newName; 
}

/**
 * Saves the list details in list and pushes that list in total list.
 * 
 * @param listContent - It contains the list name to save a list in 
 *                      total list. 
 */
function saveListInTotalList(listContent) {
    let taskList = {};
    taskList.id = getDate();
    taskList.name = checkNameUnique(listContent, totalList);
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
    refresh(querySelectorAll(".listCreated"), querySelector(".newCreateList"));
    let lists = totalList.filter(list => list.status == "active");
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
        textContent(span, list.name);
        appendChild(textDiv, span);
        var spanCount = createElement('span');
        setAttribute(spanCount, "class", "spanCount");
        var count = 0;
        if (list.task != null) {
            let lists = list.task.filter(task => (task.isFinished == "false") && (task.status == "active"));
            count = lists.length;	
        };
        textContent(spanCount, count);
        appendChild(iconDiv, spanCount);
        appendChild(document.querySelector(".newCreateList"), iconDiv);
        appendChild(iconDiv, textDiv);
    });
    if (boolean == "true") {
        querySelector(".titleName").value = listContent;
        currentListId = millisec;
        refresh(querySelectorAll(".addedTask"), querySelector(".task"));
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
    refresh(querySelectorAll(".addedTask"), querySelector(".task"));
    currentListId = e.target.id;
    let list = getListByCurrentListId();
    querySelector(".titleName").value = list.name;
    addTask(list);
}

/**
 * Edits the list name in task header.
 */
function listNameEdit(e) {
    if (enterKeyCheck(this.value, e)) {
        let list = getListByCurrentListId();
        list.name = this.value;
        refresh(querySelectorAll(".listCreated"), querySelector(".newCreateList"));
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
    let checkBoxInStepHeader = querySelector("#checkboxInStepHeader");
    let taskInStepHeader = querySelector(".taskInStepHeader");
    if (task.isFinished == "true") {
        checkBoxInStepHeader.checked = true;
        textContent(taskInStepHeader, task.name);
        //setAttribute(, "value", );
        setAttribute(taskInStepHeader, "class", "taskInStepHeader taskInStepHeaderStriked");
    } else {
        checkBoxInStepHeader.checked = false;
        textContent(taskInStepHeader, task.name);
        //setAttribute(taskInStepHeader, "value", task.name);
        setAttribute(taskInStepHeader, "class", "taskInStepHeader");
    }
    showStepsBar();
    refresh(querySelectorAll(".addedStep"), querySelector(".newSteps"));
    if (task.step != null) {
        addStep(task.step);
    }
};

/**
 * Creates new task by entering new task name in task bar and press enter.
 */
function createTask() {
    var child = querySelector("#plus");
    var parent = querySelector(".newTaskTextLabelClass");
    var newChild = createElement("I");
    setAttribute(newChild, 'class', 'far fa-circle');
    newChild.style.color = "black";
    newChild.style.opacity = "0.5";
    removeChild(parent, child);
    appendChild(parent, newChild);
};

/**
 * Creating the new task. 
 */
function createTaskBox(e) {
    if (enterKeyCheck(this.value, e)) {
        saveTaskInList(this.value);
        refresh(querySelectorAll(".addedTask"), querySelector(".task"));
        let list = getListByCurrentListId();
        addTask(list);
        this.value = null;
        refresh(querySelectorAll(".listCreated"), querySelector(".newCreateList"));
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
            var addedTask = createElement("DIV");
            setAttribute(addedTask, 'class', 'addedTask');
            setAttribute(addedTask, 'id', task.id);
            var round = createElement("DIV");
            setAttribute(round, 'class', 'round');
            appendChild(addedTask, round);
            var checkbox = createElement("input");
            checkbox.type = "checkbox"; 
            checkbox.id = task.id + "checkBox";
            appendChild(round, checkbox);
            listenerForCheckBoxInAddTask(checkbox);
            var label = createElement('label'); 
            label.htmlFor = task.id + "checkBox"; 
            appendChild(round, label);
            var span = createElement('span');
            if (task.isFinished == "true") {
                setAttribute(span, 'class', "taskName strike");
                checkbox.checked = true;
            } else {
                setAttribute(span, 'class', 'taskName');
            }
            textContent(span, task.name);
            appendChild(addedTask, span);
            appendChild(querySelector(".task"), addedTask);
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
        let checkBoxInStepHeader = querySelector("#checkboxInStepHeader");
        let taskInStepHeader = querySelector(".taskInStepHeader");
        if (element.checked) {
            task.isFinished = "true";
            checkBoxInStepHeader.checked = true;
            setAttribute(taskInStepHeader, "value", task.name)
            setAttribute(taskInStepHeader, "class", "taskInStepHeader taskInStepHeaderStriked")
        } else {
            task.isFinished = "false";
            checkBoxInStepHeader.checked = false;
            setAttribute(taskInStepHeader, "value", task.name)
            setAttribute(taskInStepHeader, "class", "taskInStepHeader")
        }
        refresh(querySelectorAll(".addedTask"), querySelector(".task"));
        addTask(list);
        refresh(querySelectorAll(".listCreated"), querySelector(".newCreateList"));
        createNewList(list.name, "false");
    })
}


/**
 * Editing the task name in step bar Header.
 */
function editTaskName(e) {
    if (enterKeyCheck(this.textContent, e)) {
        let list = getListByCurrentListId();
        let task = getTaskByCurrentTaskId(list);
        task.name = this.textContent;
        refresh(querySelectorAll(".addedTask"), querySelector(".task"));
        addTask(list);
    }
}

/**
 * Adding the steps in current task by typing the step name and presses enter to save.
 */
function addSteps() {
    var child = querySelector("#plusStep");
    var parent = querySelector(".newStepTextLabelClass");
    var newChild = createElement("I");
    setAttribute(newChild, 'class', 'far fa-circle');
    newChild.style.color = "black";
    newChild.style.opacity = "0.5";
    removeChild(parent, child);
    appendChild(parent, newChild);
}

/**
 * Save new step from step add input box.
 */
function saveNewStep(e) {
    if (enterKeyCheck(this.value, e)) {
        saveStepInTask(this.value);
        refresh(querySelectorAll(".addedStep"), querySelector(".newSteps"));
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
        var addedStep = createElement("DIV");
        setAttribute(addedStep, 'class', 'addedStep');
        setAttribute(addedStep, 'id', newStep.id);
        var roundStepBarIcon = createElement("DIV");
        setAttribute(roundStepBarIcon, 'class', 'roundStepBarIcon');
        var checkboxStepBar = createElement("input");
        checkboxStepBar.type = "checkbox"; 
        checkboxStepBar.id = newStep.id + "checkBox";
        appendChild(roundStepBarIcon, checkboxStepBar);
        listenerForCheckBoxInAddStep(checkboxStepBar);
        var labelStepBar = createElement('label'); 
        labelStepBar.htmlFor = newStep.id + "checkBox"; 
        appendChild(roundStepBarIcon, labelStepBar);
        var spanBar = createElement('span');
        setAttribute(spanBar, "contenteditable", true);
        if (newStep.isFinished == "true") {
            setAttribute(spanBar, 'class', "stepTextBar stepTextBarStrike");
            checkboxStepBar.checked = true;
        } else {
            setAttribute(spanBar, 'class', 'stepTextBar');
            checkboxStepBar.checked = false;
        }
        textContent(spanBar, newStep.name);
        var closeIconInAddStep = createElement("I");
        setAttribute(closeIconInAddStep, "class", "fa fa-times");
        setAttribute(closeIconInAddStep, "id", newStep.id + "close");
        listenerForCloseIconInAddStep(closeIconInAddStep);
        appendChild(addedStep, roundStepBarIcon);
        appendChild(addedStep, spanBar);
        appendChild(addedStep, closeIconInAddStep);
        appendChild(querySelector(".newSteps"), addedStep);
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
    console.log("show step bar");
    var sideBarButton = querySelector(".sideBarButton");
    var taskBar = querySelector(".taskDiv");
    var stepBar = querySelector(".stepsBar");
    querySelector(".backIcon").value = "open";
    if (sideBarButton.value == 'open') {
        setAttribute(querySelector(".taskDiv"), "class", "taskDiv taskDivClose");
        setAttribute(querySelector(".stepsBar"), "class", "stepsBar stepsBarOpen");
    } else {
        setAttribute(querySelector(".taskDiv"), "class", "taskDiv taskDivPartialFull");
        setAttribute(querySelector(".stepsBar"), "class", "stepsBar stepsBarOpen");
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
        refresh(querySelectorAll(".addedStep"), querySelector(".newSteps"));
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
        refresh(querySelectorAll(".addedStep"), querySelector(".newSteps"));
        addStep(task.step);
    })
}

/**
 * Check box in the step header for task to be finished task or as unfinished task.
 */
function changeTaskCheckBox() {
    let list = getListByCurrentListId();
    let task = getTaskByCurrentTaskId(list);
    let taskInStepHeader = querySelector(".taskInStepHeader");
    if (task.isFinished == "true") {
        task.isFinished = "false";
        setAttribute(taskInStepHeader, "class", "taskInStepHeader")
        refresh(querySelectorAll(".addedTask"), querySelector(".task"));
        addTask(list);
    } else {
        task.isFinished = "true";
        setAttribute(taskInStepHeader, "class", "taskInStepHeader taskInStepHeaderStriked")
        refresh(querySelectorAll(".addedTask"), querySelector(".task"));
        addTask(list);
    }
}

/**
 * Back Icon in the step bar footer to close the step bar.
 */
function compressStepMenu() {
    console.log("Side back button" + this.value);
    let sideBarButton = querySelector(".sideBarButton");
    let sidePanal = querySelector(".sidePanel");
    let taskBar = querySelector(".taskDiv");
    let stepBar = querySelector(".stepsBar");
    this.value = "close";
    if (sideBarButton.value == 'open') {
        setAttribute(querySelector(".taskDiv"), "class", "taskDiv");
        setAttribute(querySelector(".stepsBar"), "class", "stepsBar");
    } else {
        setAttribute(querySelector(".taskDiv"), "class", "taskDiv taskDivFull");
        setAttribute(querySelector(".stepsBar"), "class", "stepsBar");
    }
}

/**
 * Trash icon in the step bar to delete the current task. 
 */
function deleteTask() {
    let list = getListByCurrentListId();
    let task = getTaskByCurrentTaskId(list);
    task.status = "inActive";
    refresh(querySelectorAll(".addedTask"), querySelector(".task"));
    querySelector(".titleName").value = list.name;
    addTask(list);
    createNewList(list.name, "false");
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



