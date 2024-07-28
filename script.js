const newTaskInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
let deleteTasks, editTasks, tasks;
let updateNote = "";
let count;

// Function on window load
window.onload = () => {
    updateNote = "";
    count = Object.keys(localStorage).length;
    displayTasks();
};

// Function to display the tasks
const displayTasks = () => {
    if (Object.keys(localStorage).length > 0) {
        tasksDiv.style.display = "inline-block";
    } else {
        tasksDiv.style.display = "none";
    }

    // Clear the tasks
    tasksDiv.innerHTML = "";

    // Fetch all the keys in local storage
    let tasks = Object.keys(localStorage);
    tasks = tasks.sort();

    // Get all values and create task elements
    for (let key of tasks) {
        let value = localStorage.getItem(key);
        let taskInnerDiv = document.createElement("div");
        taskInnerDiv.classList.add("task");
        taskInnerDiv.setAttribute("id", key);
        taskInnerDiv.innerHTML = `<span id="taskname">${key.split("_")[1]}</span>`;

        let editButton = document.createElement("button");
        editButton.classList.add("edit");
        editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;

        if (!JSON.parse(value)) {
            editButton.style.visibility = "visible";
        } else {
            editButton.style.visibility = "hidden";
            taskInnerDiv.classList.add("completed");
        }

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        
        deleteButton.onclick = () => {
            removeTask(key);
        };

        taskInnerDiv.appendChild(editButton);
        taskInnerDiv.appendChild(deleteButton);

        tasksDiv.appendChild(taskInnerDiv);
    }

    tasks = document.querySelectorAll(".task");

    tasks.forEach((element, index) => {
        element.onclick = () => {
            const taskId = element.id.split("_")[0];
            const taskValue = element.querySelector("#taskname").innerText;
            if (element.classList.contains("completed")) {
                updateStorage(taskId, taskValue, false);
            } else {
                updateStorage(taskId, taskValue, true);
            }
        };
    });

    // Edit tasks
    editTasks = document.getElementsByClassName("edit");
    Array.from(editTasks).forEach((element, index) => {
        element.addEventListener("click", (e) => {
            e.stopPropagation();

            disableButtons(true);

            let parent = element.parentElement;
            newTaskInput.value = parent.querySelector("#taskname").innerText;

            updateNote = parent.id;

            parent.remove();
        });
    });

    // Delete tasks
    deleteTasks = document.getElementsByClassName("delete");
    Array.from(deleteTasks).forEach((element, index) => {
        element.addEventListener("click", (e) => {
            e.stopPropagation();

            let parent = element.parentElement;
            removeTask(parent.id);
            parent.remove();
            count -= 1;
        });
    });
};

// Disable edit buttons
const disableButtons = (bool) => {
    let editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach((element) => {
        element.disabled = bool;
    });
};

// Remove task from local storage
const removeTask = (taskValue) => {
    localStorage.removeItem(taskValue);
    displayTasks();
};

// Add or update task in local storage
const updateStorage = (index, taskValue, completed) => {
    localStorage.setItem(`${index}_${taskValue}`, completed);
    displayTasks();
};

// Function to add new task
document.querySelector("#push").addEventListener("click", () => {
    disableButtons(false);
    if (newTaskInput.value.length == 0) {
        alert("Please Enter A Task");
    } else {
        if (updateNote === "") {
            updateStorage(count, newTaskInput.value, false);
        } else {
            let existingCount = updateNote.split("_")[0];
            removeTask(updateNote);
            updateStorage(existingCount, newTaskInput.value, false);
            updateNote = "";
        }
        count += 1;
        newTaskInput.value = "";
    }
});
