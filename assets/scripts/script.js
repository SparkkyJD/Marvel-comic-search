let searchResults = document.getElementById('searchResults');
let searchBar = document.getElementById('searchBar');
let searchInquiry = document.getElementById('searchInquiry');
searchBar.addEventListener('submit', (event)=> {
  event.preventDefault();
  fetchData(searchInquiry.value);
})
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
function displayResults(Array){
  let item = Array[0];
  let itemTitle = item.title;
  let itemSnippet = item.snippet;
  let itemTimeStamp = new Date(item.timestamp).toLocaleString();
  let itemUrl = encodeURI(`https://en.wikipedia.org/wiki/${item.title}`);
  searchResults.insertAdjacentHTML('beforeend',
    `<aside class="resultItem">
	  <h1 class="itemTimeStamp">${itemTimeStamp}</a></h1>
      <h2 class="itemTitle"><a href="${itemUrl}" target="_blank" rel="noopener">${itemTitle}</a></h2>
      <p class="itemSnippet"><a href="${itemUrl}"  target="_blank" rel="noopener">${itemSnippet}</a></p>
    </aside>`);
}
