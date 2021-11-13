let input = document.querySelector("input");

const debounce = (fn, ms) => {
  let timeout;
  return function () {
    const fnCall = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms);
  };
};

function clearSearchResults() {
  const searchResultsList = document.querySelectorAll(".results__item");
  searchResultsList.forEach((item) => {
    item.remove();
  });
}

let sendRequest = () => {
  let inputValue = input.value.trim();

  if (inputValue !== "") {
    let url = `https://api.github.com/search/repositories?q=${inputValue}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        clearSearchResults();
        addingNewSearchResult(data.items);
      });
  } else {
    clearSearchResults();
  }
};

const sendRequestDebounce = debounce(sendRequest, 400);

input.addEventListener("input", sendRequestDebounce);

function addingNewSearchResult(items) {
  for (let item of items) {
    let searchResultsList = document.querySelectorAll(".results__item");

    if (searchResultsList.length < 5) {
      const newSearchItem = document.createElement("li");
      newSearchItem.classList.add("results__item");
      newSearchItem.textContent = item.name;

      document.querySelector(".results").append(newSearchItem);

      newSearchItem.addEventListener("click", () => addSelectedList(item));
    }
  }
}

const createEl = (elTag, elClass, domName) => {
  let el = document.createElement(elTag);
  el.classList.add(...elClass);
  domName.append(el);
  return el;
};

function addSelectedList(item) {

  const selected = document.querySelector(".selected");
  const selectedItem = createEl("div", ["selected__item"], selected);
  
  const selectedItemInner = createEl("div",["selected__item-inner"],selectedItem);
  const selectedItemName = createEl("div",["selected__text", "selected__text--name"],selectedItemInner);
  const selectedItemNameText = createEl("div", [], selectedItemName);
  selectedItemNameText.textContent = `Name: ${item.name}`;
  
  const selectedItemOwner = createEl("div",["selected__text", "selected__text--owner"],selectedItemInner);
  const selectedItemOwnerText = createEl("div", [], selectedItemName);
  selectedItemOwnerText.textContent = `Owner: ${item.owner.login}`;
  
  const selectedItemStars = createEl("div",["selected__text", "selected__text--stars"],selectedItemInner);
  const selectedItemStarsText = createEl("div", [], selectedItemName);
  selectedItemStarsText.textContent = `Stars: ${item.stargazers_count}`;
  
  const selectedDelete = createEl("div", ["selected__delete"], selectedItem);
  const selectedDeleteImg1 = createEl("img", [], selectedDelete);
  const selectedDeleteImg2 = createEl("img", [], selectedDelete);
  selectedDeleteImg1.src = "img/Vector 7.svg";
  selectedDeleteImg2.src = "img/Vector 8.svg";

  selectedItem.addEventListener("click", deleteSelectedList);

  input.value = "";
}

function deleteSelectedList(e) {
  const wholeElement = e.target.closest(".selected__item");
  wholeElement.style.display = "none";
}
