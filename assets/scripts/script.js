let searchResults = document.getElementById('searchResults');
let searchBar = document.getElementById('searchBar');
let searchInquiry = document.getElementById('searchInquiry');

// create clear button element
let clearButton = document.createElement('button');
  clearButton.textContent = 'Clear History';

// add click event listener to clear button
clearButton.addEventListener('click', function() {
  localStorage.clear();

// remove history list from HTML
  document.getElementById('history').innerHTML = ''; 
});
// append clear button to HTML
  document.getElementById('searchBar').appendChild(clearButton);

// call getLocalStorage() once on page load
getLocalStorage();
function getLocalStorage() {
  let historyList = document.createElement('ul');
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = localStorage.getItem(key);
      let listItem = document.createElement('li');
      listItem.textContent = `${key}: ${value}`;
      historyList.appendChild(listItem);
    }
  document.getElementById('history').appendChild(historyList);
}

  searchBar.addEventListener('submit', (event)=> {
  event.preventDefault();
  fetchData(searchInquiry.value);
})
// fetch data from wiki api 
function fetchData(x){
  let url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=1&srsearch=${x}`;
  fetch(url)
    .then(function(response) {
      return (response.json());
    })
    .then(function(data){
      let resultsData = data.query.search;
      displayResults(resultsData);
	  console.log(data);
    })
}
// pull data from array and append to html
function displayResults(Array){
  let item = Array[0];
  let itemTitle = item.title;
  let itemSnippet = item.snippet;
  let itemTimeStamp = new Date(item.timestamp).toLocaleString();
  localStorage.setItem(itemTitle, "");
  let itemUrl = encodeURI(`https://en.wikipedia.org/wiki/${item.title}`);
  searchResults.insertAdjacentHTML('beforeend',
    `<article class="resultItem">
	    <h1 class="itemTimeStamp">${itemTimeStamp}</h1>
      <h2 class="itemTitle"><a href="${itemUrl}" target="_blank" rel="noopener">${itemTitle}</a></h2>
      <p class="itemSnippet">${itemSnippet}</p>
    </article>`);
}
