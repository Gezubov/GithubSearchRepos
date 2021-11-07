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

let sendRquest = () => {
  let inputValue = input.value.trim();
  console.log(inputValue);

  if (inputValue !== "") {
    let url = `https://api.github.com/search/repositories?q=${inputValue}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.items);
        clearSearchResults();
        addingNewSearchResult(data.items);
      });
  } else {
    clearSearchResults();
  }
};

const sendRquestDebounce = debounce(sendRquest, 400);

input.addEventListener("input", sendRquestDebounce);

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

function addSelectedList(item) {
  const newSelectItem = document.createElement("div");
  newSelectItem.innerHTML = `
  <div class="selected__item">
    <div class="selected__item-inner">
        <div class="selected__text selected__text--name">
            Name: <span>${item.name}</span>
        </div>
        <div class="selected__text selected__text--owner">
            Owner: <span>${item.owner.login}</span>
        </div>
        <div class="selected__text selected__text--stars">
            Stars: <span>${item.stargazers_count}</span>
        </div>
    </div>
    <div class="selected__delete">
        <img src="img/Vector 7.svg">
        <img src="img/Vector 8.svg">
    </div>
  </div>`;
  document.querySelector(".selected").append(newSelectItem);
 
  newSelectItem.addEventListener("click", deleteSelectedList);

  input.value = "";
}

function deleteSelectedList(e) {
  const wholeElement = e.target.closest(".selected__item");
  wholeElement.style.display = "none";
}
