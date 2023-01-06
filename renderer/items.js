const { shell } = require("electron");
const fs = require("fs");

// DOM nodes
let items = document.getElementById("items");

// Get readerJS content
let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString();
});

// Track items in storage
exports.storage = JSON.parse(localStorage.getItem("readit-items")) || [];

// Listen for 'done' message from reader window
window.addEventListener("message", (e) => {
  console.log(e.data);

  // Check for correct mesage
  if (e.data.action === "delete-reader-item") {
    // Delete item at give index
    this.delete(e.data.itemIndex);

    // Close the reader window
    console.log(e.source);
    e.source.close(0);
  }
});

// Delete item
exports.delete = (itemIndex) => {
  // Remove item from DOM
  items.removeChild(items.childNodes[itemIndex]);

  // Remove item from storage
  this.storage.splice(itemIndex, 1);

  // Persis storage
  this.save();

  // Select previous item or new top item
  if (this.storage.length) {
    console.log({ itemIndex });
    // Get new selected item index
    let = newSelectedItemIndex = itemIndex === 0 ? 0 : itemIndex - 1;

    // Select item at new index
    document
      .getElementsByClassName("read-item")
      [newSelectedItemIndex].classList.add("selected");
  }
};

// Get selected item index
exports.getSelectedItem = () => {
  // Get selected node
  console.log(document.getElementsByClassName("read-item selected"));
  let currentItem = document.getElementsByClassName("read-item selected")[0];

  // Get item index
  let itemIndex = 0;
  let child = currentItem;
  while ((child = child.previousElementSibling) != null) itemIndex++;

  // Return selected item and index
  return { node: currentItem, index: itemIndex };
};

// Persis storage
exports.save = () => {
  localStorage.setItem("readit-items", JSON.stringify(this.storage));
};

exports.select = (e) => {
  //Remove currently selected item class
  this.getSelectedItem().node.classList.remove("selected");

  // Add to clicked item
  e.currentTarget.classList.add("selected");
};

// Move to newly selected item
exports.changeSelection = (direction) => {
  // Get selected item
  let currentItem = this.getSelectedItem();

  console.log(currentItem.previousElementSibling);
  console.log(currentItem.nextElementSibling);
  // JHandle up/down
  if (direction === "ArrowUp" && currentItem.node.previousElementSibling) {
    currentItem.node.classList.remove("selected");
    currentItem.node.previousElementSibling.classList.add("selected");
  } else if (direction === "ArrowDown" && currentItem.node.nextElementSibling) {
    currentItem.node.classList.remove("selected");
    currentItem.node.nextElementSibling.classList.add("selected");
  }
};

// Open selected item in native browser
exports.openNative = () => {
  // Only if we have items (in case of menu open)
  if (!this.storage.length) return;

  // Get selected item
  let selectedItem = this.getSelectedItem();

  // Get item's url
  let contentURL = selectedItem.node.dataset.url;

  // Open in user's default system browser
  shell.openExternal(contentURL);
};

// Open selected item
exports.open = () => {
  // Only if we have items (in case of menu open)
  if (!this.storage.length) return;

  // Get selected item
  let selectedItem = this.getSelectedItem();

  // Get item's url
  let contentURL = selectedItem.node.dataset.url;

  console.log("Opening item: ", contentURL);

  // Open item in proxy BrowserWindow
  let readerWin = window.open(
    contentURL,
    "",
    `
    maxWidth=2000,maxHeight=2000,width=1200,height=800,backgroundColor=#DEDEDE,contextIsolation=0,
    nodeIntegration=1,`
  );

  // Inject Javascript with specific item index (selectedItem.index)
  readerWin.eval(readerJS.replace("{{index}}", selectedItem.index));
};

// Add new item
exports.addItem = (item, isNew = false) => {
  // Create a new DOM node
  let itemNode = document.createElement("div");

  // Assign "read-item" class
  itemNode.setAttribute("class", "read-item");

  // Set item url as data attribute
  itemNode.setAttribute("data-url", item.url);

  // Add inner HTML
  itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`;

  // Append new node to "items"
  items.appendChild(itemNode);

  // Attach click handle to select
  itemNode.addEventListener("click", this.select);

  // Attach doubleclick handle to open
  itemNode.addEventListener("dblclick", this.open);

  // If this is the first item, select it
  if (document.getElementsByClassName("read-item").length === 1) {
    itemNode.classList.add("selected");
  }

  // Add item to storage and persist
  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

// Add items from storage when app loads

this.storage.forEach((item) => {
  this.addItem(item, false);
});
