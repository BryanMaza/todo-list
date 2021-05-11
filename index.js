var itemsList = [];

function checkItemsSaved() {
  removeAllItems();
  let list = getListLocalStorage();
  itemsList = list;
  if (list) {
    for (let li of list) {
      create(li.text, li.completed, false);
    }
    let circles = document.querySelectorAll(".check-list");
    for (let i = 0; i < list.length; i++) {
      if (list[i].completed) {
        drawCheck(circles[i], list[i].completed);
      }
    }

    getNumItemsLeft();
  }
}

function showActive() {
  removeAllItems();
  let list = getListLocalStorage();
  for (let li of list) {
    if (!li.completed) {
      create(li.text, li.completed, false);
    }
  }
  getNumItemsLeft();
}

function showCompleted() {
  removeAllItems();
  let list = getListLocalStorage();
  for (let li of list) {
    if (li.completed) {
      create(li.text, li.completed, false);
    }
  }
  let circles = document.querySelectorAll(".check-list");
  for (let i = 0; i < circles.length; i++) {
    drawCheck(circles[i], list[i].completed);
  }
  getNumItemsLeft();
}
// Check if item exist in the list
function checkItemExists(lista, text) {
  let exists = false;
  try{
    for (let item of lista) {
      if (text === item.text) {
        return true;
      }
    }
  }
  catch(e){
    exists = false;
  }
  
  return exists;
}
// Remove all items from ul
function removeAllItems() {
  let divList = document.querySelector(".list-todo");
  let lista = divList.firstElementChild;
  if (lista) {
    while (lista.firstChild) {
      lista.removeChild(lista.firstChild);
    }
  }
  getNumItemsLeft();
}

// Create item and add li to list
function create(text, newElement = false, all = true) {
  let lista = document.querySelector(".list");
  let newList = document.createElement("li");
  let circle = document.createElement("div");
  newList.setAttribute("draggable", "true");
  circle.classList.add("check-list");
  circle.addEventListener("click", function () {
    drawCheck(this);
  });
  let textList = document.createElement("span");
  textList.classList.add("item-text");
  textList.append(text);
  let ex = document.createElement("img");
  ex.classList.add("ex");
  ex.src = "images/icon-cross.svg";
  ex.addEventListener("click", function () {
    removeItem(this);
  });
  newList.append(circle);
  newList.append(textList);
  newList.append(ex);
  lista.appendChild(newList);

  if (all) {
    let item = {
      completed: newElement,
      text,
    };
    itemsList.push(item);
    localStorage.setItem("list", JSON.stringify(itemsList));
  }
  getNumItemsLeft();
  addEventsItems();
}
// Draw check for item
function drawCheck(circle) {
  let value = circle.nextSibling.innerText;
  if (circle.classList.contains("checked")) {
    circle.classList.remove("checked");
    for (let img of circle.children) {
      circle.removeChild(img);
    }
    underlineText(circle, false);
    changeStateItem(value, false);
    getNumItemsLeft();
  } else if (!circle.classList.contains("checked")) {
    circle.classList.add("checked");
    let imgCheck = document.createElement("img");
    imgCheck.src = "images/icon-check.svg";
    circle.append(imgCheck);
    underlineText(circle, true);
    changeStateItem(value, true);
    getNumItemsLeft();
  }
}
// Change state complete or active item
function changeStateItem(value, state) {
  let list = JSON.parse(localStorage.getItem("list"));
  let newList = list.filter((li) => {
    if (li.text === value) {
      li.completed = state;
    }
    return li;
  });
  itemsList = newList;
  localStorage.setItem("list", JSON.stringify(newList));
}
// add style underline item
function underlineText(circle, underline) {
  let text = circle.nextSibling;
  if (underline) {
    text.classList.add("underlined");
  } else {
    text.classList.remove("underlined");
  }
}
//add remove item from ul
function removeItem(ex) {
  let li = ex.parentNode;
  let lista = li.parentNode;
  lista.removeChild(li);
  let text = ex.previousElementSibling.innerText;
  removeItemLocalStorage(text);
}

function removeItemLocalStorage(value, lista = "list") {
  let list = getListLocalStorage(lista);
  let result = list.filter((li) => li.text !== value);
  if (lista === "list") {
    itemsList = result;
  }
  localStorage.setItem(lista, JSON.stringify(result));
  getNumItemsLeft();
}

//add num items left
function getNumItemsLeft() {
  let itemsLeft = 0;
  let items = document.querySelectorAll(".check-list");
  let list = items.length;
  let writeItems = document.querySelector(".items-left");
  for (let item of items) {
    if (item.classList.contains("checked")) {
      itemsLeft++;
    }
  }
  writeItems.innerHTML = list - itemsLeft + " items left";
}
//return array saved in localstorage
function getListLocalStorage() {
  if (
    localStorage.getItem("list") !== null &&
    localStorage.getItem("list") !== undefined
  ) {
    let list = JSON.parse(localStorage.getItem("list"));
    return list;
  }
  return [];
}
// add evento keyboard to create new todo
function createNewTodo() {
  let todo = document.querySelector(".new-todo");
  todo.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      let itemExists = checkItemExists(itemsList, todo.value);
      if (todo.value !== "" && !itemExists) {
        create(todo.value);
        todo.value = "";
      }
    }
  });
}

function clearItemsCompleted() {
  let items = document.querySelectorAll(".check-list");
  for (let item of items) {
    if (item.classList.contains("checked")) {
      removeItem(item.nextElementSibling.nextElementSibling);
    }
  }
}
// add event links section
function checkLinkActive() {
  let sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    section.addEventListener("click", function () {
      addColorSection(sections, this);
      goToSection(this);
    });
  });
}
// Links to show information
function goToSection(section) {
  if (section.classList.contains("all")) {
    checkItemsSaved();
  } else if (section.classList.contains("active")) {
    showActive();
  } else if (section.classList.contains("completed")) {
    showCompleted();
  }
}
// Change color section
function addColorSection(array, section) {
  for (let item of array) {
    if (item === section) {
      section.classList.add("link-active");
    } else {
      item.classList.remove("link-active");
    }
  }
}

function changeDarkMode() {
  let body = document.querySelector("body");
  let img = document.querySelector(".img-mode");

  img.addEventListener("click", function () {
    body.classList.toggle("dark");
    if (!body.classList.contains("dark")) {
      img.src = "images/icon-moon.svg";
    } else {
      img.src = "images/icon-sun.svg";
    }
  });
}

// Add event drag and drop
function addEventsItems() {
  let lista = document.querySelector(".list");
  let items = lista.childNodes;

  if (items.length >= 2) {
    items.forEach((item) => {
      item.addEventListener("dragstart", dragStart);
      item.addEventListener("dragenter", dragEnter);
      item.addEventListener("dragover", dragOver);
      item.addEventListener("dragleave", dragLeave);
      item.addEventListener("drop", drop);
    });
  }
}
let itemDropped;
// events drag
function dragEnter(e) {
  addBorderItem(e);
}
function dragOver(e) {
  addBorderItem(e);
  e.preventDefault();
}
function dragStart(e) {
  addBorderItem(e);
  e.dataTransfer.setData("text/html", e.target.innerHTML);
  itemDropped = e.target;
}

function drop(e) {
  let lista = document.querySelector(".list");
  e.preventDefault();
  let itemText = e.dataTransfer.getData("text/html");
  let newItem = document.createElement("li");
  addAtributesItemDroped(newItem, itemText);
  let added = lista.insertBefore(newItem, e.target.nextSibling);
  if (added) {
    removeBorderItem(e);
    removeItemDropped();
    addEventsItems();
  }
}

function addAtributesItemDroped(item, content) {
  item.innerHTML = content;
  item.setAttribute("draggable", "true");
  item.firstElementChild.addEventListener("click", function () {
    drawCheck(this);
  });
  item.lastElementChild.addEventListener("click", function () {
    removeItem(this);
  });
}

function dragLeave(e) {
  removeBorderItem(e);
}

// add style to item drag
function addBorderItem(e) {
  if (e.target.nodeName === "LI") {
    e.target.classList.add("item-dragOver");
  }
}
function removeBorderItem(e) {
  if (e.target.nodeName === "LI") {
    e.target.classList.remove("item-dragOver");
  }
}

function removeItemDropped() {
  let lista = document.querySelector(".list");
  lista.removeChild(itemDropped);
}

// Main
document.addEventListener("readystatechange", function () {
  if (document.readyState === "complete") {
    let clear = document.querySelector(".clear");
    clear.addEventListener("click", clearItemsCompleted);
    checkItemsSaved();
    createNewTodo();
    checkLinkActive();
    changeDarkMode();
    addEventsItems();
  }
});
