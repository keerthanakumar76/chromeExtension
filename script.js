let inputUrlEle = document.getElementById("input-url");
let addUrlEle = document.getElementById("addUrl");
let deleteEle = document.getElementById("deleteUrl");
let displayUrlId = document.getElementById("displayUrl-id");
let alertDisplayEle = document.getElementById("alertDisplay");
let searchEle = document.getElementById("search");
let sortOptionsEle = document.getElementById("sortOptions");

let bookmark = [];
const localBookMark = JSON.parse(localStorage.getItem('bookmark'));

if (localBookMark) {
  bookmark = localBookMark;
}

addUrlEle.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let tab = tabs[0];
    let bookmarkEntry = {
      url: tab.url,
      title: tab.title || tab.url,
      date: new Date().toISOString()
    };

    if (bookmark.some(bm => bm.url === tab.url)) {
      alertDisplayEle.textContent = "Already available!!";
      alertDisplayEle.style.color = "red";
      alertDisplayEle.style.fontSize = '15px';
    } else {
      bookmark.unshift(bookmarkEntry);
      alertDisplayEle.style.color = "green";
      alertDisplayEle.style.fontSize = '15px';
      alertDisplayEle.textContent = "Successfully added the link!";
      localStorage.setItem('bookmark', JSON.stringify(bookmark));
      render();
    }
  });
  inputUrlEle.value = "";
});

function url() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let tab = tabs[0];
    inputUrlEle.value = tab.url;
  });
}
url();

deleteEle.addEventListener("click", () => {
  bookmark = [];
  localStorage.clear();
  render();
});

searchEle.addEventListener("input", () => {
  render();
});

sortOptionsEle.addEventListener("change", () => {
  render();
});

function render() {
  let renderHtml = "";
  let filteredBookmarks = bookmark.filter(bm =>
    bm.url.includes(searchEle.value)
  );

  let sortedBookmarks = filteredBookmarks.sort((a, b) => {
    if (sortOptionsEle.value === "name") {
      return a.title.localeCompare(b.title);
    } else {
      return new Date(b.date) - new Date(a.date);
    }
  });

  sortedBookmarks.forEach((bm, index) => {
    renderHtml += `
      <div class="contentUrl">
        <div>
          <i class="fa-solid fa-link"></i>
          <a href="${bm.url}" target="_blank" title="${bm.title}">${bm.title}</a>
        </div>
        <span class="trash-icon" data-index="${index}">
          <i class="fa-solid fa-trash"></i>
        </span>
      </div>`;
  });

  displayUrlId.innerHTML = renderHtml;

  document.querySelectorAll('.trash-icon').forEach(icon => {
    icon.addEventListener('click', (event) => {
      const index = event.currentTarget.dataset.index;
      deleteBookmark(index);
    });
  });
}

function deleteBookmark(index) {
  bookmark.splice(index, 1);
  localStorage.setItem('bookmark', JSON.stringify(bookmark));
  render();
}

render();
