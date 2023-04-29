// JavaScript Document
let resultsitem = document.getElementById('resultsItem');
let searchForm = document.getElementById('searchForm');
let searchInput = document.getElementById('searchInput');

searchForm.addEventListener('submit', (event)=> {
  event.preventDefault();
  displaySearchResults(searchInput.value);
})

function displaySearchResults(x){
  let url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=1&srsearch=${x}`;
  fetch(url)
    .then(function(response) {
      console.log(response)
      return (response.json());
    })
    .then(function(data){
      let resultsArray = data.query.search;
      resultsOnPage(resultsArray);
      console.log(data)
    })
    .catch(function () {
      console.log('An error occurred');
    });
}

function resultsOnPage(myArray){
  resultsitem.innerHTML = '';
  let item = myArray[0];
  let itemTitle = item.title;
  let itemSnippet = item.snippet;
  let itemUrl = encodeURI(`https://en.wikipedia.org/wiki/${item.title}`);
  resultsitem.insertAdjacentHTML('beforeend',
    `<div class="resultItem">
      <h2 class="resultTitle">
        <a href="${itemUrl}" target="_blank" rel="noopener">${itemTitle}</a>
      </h2>
      <p class="resultSnippet"><a href="${itemUrl}"  target="_blank" rel="noopener">
      ${itemSnippet}</a></p>
    </div>`
  );
}
