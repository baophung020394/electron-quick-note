const { ipcRenderer } = require("electron");
const items = require("./items");

// Dom Nodes
let showModal = document.getElementById("show-modal"),
  closeModal = document.getElementById("close-modal"),
  modal = document.getElementById("modal"),
  addItem = document.getElementById("add-item"),
  itemUrl = document.getElementById("url"),
  search = document.getElementById("search");

// Open modal from menu
ipcRenderer.on("menu-show-modal", () => {
  showModal.click();
});

// Open selected item from menu
ipcRenderer.on("menu-open-item", () => {
  items.open();
});

// Delete selected item from menu
ipcRenderer.on("menu-delete-item", () => {
  let selectedItem = items.getSelectedItem();
  items.delete(selectedItem.index);
});

// Open item natvie from menu
ipcRenderer.on("menu-open-item-native", () => {
  items.openNative()
});

// Open item natvie from menu
ipcRenderer.on("menu-focus-search", () => {
  search.focus();
});

// Filter items with "search"
search.addEventListener("keyup", (e) => {
  // Loop items
  Array.from(document.getElementsByClassName("read-item")).forEach((item) => {
    // Hide items that dont' match search value
    let hasMatch = item.innerText.toLowerCase().includes(search.value);
    item.style.display = hasMatch ? "flex" : "none";
  });
});

// Navigate item selection with up/down arrows
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    items.changeSelection(e.key);
  }
});

// Disable & enable modal buttons
const toggleModalButtons = () => {
  // Check state of buttons
  if (addItem.disabled === true) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = "Add Item";
    closeModal.style.display = "inline";
  } else {
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = "Adding...";
    closeModal.style.display = "none";
  }
};

// Show modal
showModal.addEventListener("click", (e) => {
  modal.style.display = "flex";
  itemUrl.focus();
});

// Show modal
closeModal.addEventListener("click", (e) => {
  modal.style.display = "none";
});

addItem.addEventListener("click", (e) => {
  if (itemUrl.value) {
    // console.log(itemUrl.value);
    ipcRenderer.send("new-item", itemUrl.value);

    // Disable buttons
    toggleModalButtons();
  }
});

// Listen for new item from main process
ipcRenderer.on("new-item-success", (e, newItem) => {
  console.log({ newItem });

  // Add new item to "items" node
  items.addItem(newItem, true);
  // Enable buttons
  toggleModalButtons();

  // Hide modal and clear value
  modal.style.display = "none";
  itemUrl.value = "";
});

// Listen for keyboard submit
itemUrl.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addItem.click();
});
