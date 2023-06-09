var marvelSearchButton = document.querySelector('#marvel-search-button');
var resultList = document.querySelector('#test-list');
var searchResultEl = document.querySelector('.is-flex-wrap-wrap');
const showModal = document.querySelector(".modal");
const modalBackground = document.querySelector(".modal-background");
const catSelect = document.querySelector("#search-category");
const modalClose = document.querySelector(".close-button");
const saveButton = document.querySelectorAll('.save-btn');

function openModal() {
  showModal.classList.add('is-active');
}





//mobile menu
const burgerIcon = document.querySelector('#burger');
const navbarMenu = document.querySelector('#nav-links');

burgerIcon.addEventListener('click', function () {
  navbarMenu.classList.toggle('is-active');
});

const wikiInput = document.querySelector(".wiki-search");
const wikiForm = document.querySelector(".wiki-search-form");


function wikiSearchLogic () {
    wikiForm.addEventListener('submit', function(event) {
        event.preventDefault();
        fetchData(wikiInput.value);
      });
      // fetch data from wiki api
      function fetchData(x){
        
        let url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=1&srsearch=${x}`;
        fetch(url)
          .then(function(response) {
            return (response.json());
          })
          .then(function(data){
            let resultsData = data.query.search;
            displayWikiResults(resultsData);
            console.log(data);
          })
      }
      // take user to the wiki page of the search result
      function goToPage(url) {
        window.open(url, '_blank');
      }
      // pull data from array and append to html
      function displayWikiResults(Array){
        let item = Array[0];
        let itemUrl = encodeURI(`https://en.wikipedia.org/wiki/${item.title}`);
        goToPage(itemUrl); // automatically go to the first search result
      }
}

if (window.location.href.includes("index.html")) {
    modalClose.addEventListener('click', function(){
      showModal.classList.remove('is-active');
    });
    wikiSearchLogic();
  }


var collectionEntry = {
    writer: "",
    datePublished: "",
    title: "",
    penciler: "",
    coverArtist: "",
    coverUrl: ""
  };

// save button logic
function addToLocalStorage() {
    var storedCollection = JSON.parse(localStorage.getItem('userCollection')) || [];
    for (i = 0 ; i < storedCollection.length; i++) {
        if (JSON.stringify(collectionEntry) === JSON.stringify(storedCollection[i])) {
            openModal();
            return;
        }
    }
    storedCollection.push(collectionEntry);
    localStorage.setItem('userCollection', JSON.stringify(storedCollection));
}



  function addToCollection (event) {
    event.stopPropagation();
    const parent = event.target.parentNode.parentNode;
    collectionEntry.writer = parent.getAttribute("data-writer");
    collectionEntry.datePublished = parent.getAttribute("data-datePublished");
    collectionEntry.title = parent.getAttribute("data-title");
    collectionEntry.penciler = parent.getAttribute("data-penciler");
    collectionEntry.coverArtist = parent.getAttribute("data-coverArtist");
    collectionEntry.coverUrl = parent.getAttribute("data-coverUrl");
    addToLocalStorage();
  }

  //trash button logic
  function removeFromLocalStorage(collectionEntry) {
    var storedCollection = JSON.parse(localStorage.getItem('userCollection')) || [];
    storedCollection = storedCollection.filter(function(i) {
      return JSON.stringify(i) !== JSON.stringify(collectionEntry);
    });
    return storedCollection;
  }
  
  function removeFromCollection(event) {
    event.stopPropagation();
      
    const parent = event.target.parentNode.parentNode;
    const collectionEntry = {
      writer: parent.getAttribute("data-writer"),
      datePublished: parent.getAttribute("data-datePublished"),
      title: parent.getAttribute("data-title"),
      penciler: parent.getAttribute("data-penciler"),
      coverArtist: parent.getAttribute("data-coverArtist"),
      coverUrl: parent.getAttribute("data-coverUrl")
    };
    const storedCollection = removeFromLocalStorage(collectionEntry);
    localStorage.setItem('userCollection', JSON.stringify(storedCollection));
    parent.parentNode.remove();
  }

// marvel api logic
function getMarvelData(event) {
    event.preventDefault(); //ensures input is processed
    var searchInput = $('#marvel-search').val();

    getMarvelInputData(searchInput);
}

function getMarvelInputData(searchInput) {
    console.log("Marvel Output ", searchInput);
    const limit = 15; //limits results to the latest 15
    const publicMarvelAPIKey = "9aef7c40b03dcfc94acc975098998139";
    const privateMarvelAPIKey = "9633dc804c1e3db14e515eb767c997529eceeccc";
    var timestamp = Date.now();
    var marvelBaseURL = "https://gateway.marvel.com:443/v1/public/comics";
    var MD5Input = timestamp + privateMarvelAPIKey + publicMarvelAPIKey; // essential parameters to successfully call API
    var hash = CryptoJS.MD5(MD5Input).toString(CryptoJS.enc.Hex); //Marvel API's security measure 
    var auth = `&ts=${timestamp}&apikey=${publicMarvelAPIKey}&hash=${hash}`; //
    var title = $("#marvel-search").val();
    var characters = $("#marvel-search").val();
    var year = $("#marvel-search").val();
    var marvelQuery = `?limit=${limit}`;


    //allows multiple paramaters in one search input field

    //****NEW SEARCH PARAM LOGIC
    var searchParameter = catSelect.value
    if(searchParameter === "Title") {
        marvelQuery += `&titleStartsWith=${title}`;
    } else if (searchParameter === "Character") {
        marvelQuery += `&characters=${characters}`;
    } else if (searchParameter === "Year") {
        marvelQuery += `&startYear=${year}`;
    } else {
        //replace with modal
        return console.log("Error: You need to search a character, title, and/or year of issue");
    }

    var marvelURL = `${marvelBaseURL}${marvelQuery}${auth}`; // url concatenation + auth parameters in this position ensure different search results each time
    
    console.log("Query ", marvelURL);

    fetch(marvelURL)
        .then((response) => response.json())
        .then(result => {
            console.log("Marvel Data ", result);
            let searchResultsArray = [];
     

            for (var i = 0; i < result.data.results.length; i++) {
              var thumbnail =
                result.data.results[i].thumbnail.path +
                "." +
                result.data.results[i].thumbnail.extension; // concatenates image url with extension into one path, producing an image
      
              var titleEl = result.data.results[i].title;
              var isoStringDate = result.data.results[i].dates[0].date;
              var date = new Date(isoStringDate);
              
              var formattedDate = `${date.getDate().toString().padStart(2,'0')}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getFullYear()}`; // converts ISO string to human readable format
      
              // stores custom parameters for future code logic use to populate page with results
              let searchResult = {
                coverUrl: thumbnail,
                title: titleEl,
                datePublished: formattedDate,
                writer: "", // empty strings account for highly variable information in these sections
                penciler: "",
                coverArtist: "",
                description: ""
              };
      
             
              searchResultsArray.push(searchResult); //completed array with cover, title, pub
      
              var creatorItems = result.data.results[i].creators.items;
              //accesses object array with key-value pairs, first by designating the items property with an index
              if (creatorItems) {
                for (var j = 0; j < creatorItems.length; j++) {
                  var desiredItem = creatorItems[j]; //further code logic allows easy access to any key-value pair
                  var name = desiredItem.name; 
                  var role = desiredItem.role;
                  //pinpoints desired roles for inclusion in search results, then includes them if available
                  if (role === "writer") {
                    searchResult.writer = name;
                  } else if (role === "penciler" || "penciller") {
                      searchResult.penciler = name;
                  } else if (role === "penciler (cover)" || "penciller (cover)")
                      searchResult.coverArtist = name;
                }
              }
            }
          //critical reference for subsequent code logic, when deciding how to populate the page
          console.log("Search Results Array ", searchResultsArray);
       
          displayResults(result, searchResultsArray);
          console.log(searchResultsArray);
          });

      }
//runs above logic on click 
$('#marvel-search-button').on("click", getMarvelData);

// search gallery logic
function displayResults(result, searchResultsArray) {
  //clear previous search results before making a new search
  searchResultEl.innerHTML = '';
  // looping through and creating cards based on the result length
  for (var i = 0; i < result.data.results.length; i++) {
        var subTitleP = document.createElement('p');
        subTitleP.classList.add('subtitle', 'is-6');

        var titleP = document.createElement('p');
        titleP.classList.add('title', 'is-5', 'pb-2');

        var contentDiv = document.createElement('div');
        contentDiv.classList.add('content');

        var cardContent = document.createElement('div');
        cardContent.classList.add('card-content', 'pt-3');

        var imgTag = document.createElement('img');
        imgTag.src = ''; 

        var cardFigure = document.createElement('figure');
        cardFigure.classList.add('image', 'is-is-2by3');

        var cardImage = document.createElement('div');
        cardImage.classList.add('card-image', 'px-5', 'pt-5');

        var iTagEl = document.createElement('i');
        iTagEl.classList.add('fa-sharp', 'fa-solid', 'fa-bookmark');

        var cardSaveButton = document.createElement('button');

        cardSaveButton.addEventListener('click', function(event) {
            event.stopPropagation();
            addToCollection(event);
          });

        cardSaveButton.classList.add('save-btn', 'c-btn');

        var itemCard = document.createElement('div');
        itemCard.classList.add('card', 'search-item', 'modal-trigger');
        itemCard.setAttribute('data-title', searchResultsArray[i].title);
        itemCard.setAttribute('data-penciler', searchResultsArray[i].penciler);
        itemCard.setAttribute('data-coverArtist', searchResultsArray[i].coverArtist);
        itemCard.setAttribute('data-description', searchResultsArray[i].description);
        itemCard.setAttribute('data-datePublished', searchResultsArray[i].datePublished);
        itemCard.setAttribute('data-writer', searchResultsArray[i].writer);

  

        var resultCard = document.createElement('div');
        resultCard.classList.add('column', 'is-one-fifth');

        // Still need to finish generating content for the modal
        // But this is for the data on the result cards
        titleP.textContent = result.data.results[i].title;
        if (result.data.results[i].images.length < 1) {
            imgTag.src = './assets/images/sorry-cannot-be-found.png';
            itemCard.setAttribute('data-coverUrl', imgTag.src);
        } else {
            imgTag.src = result.data.results[i].images[0].path + '.jpg';
            itemCard.setAttribute('data-coverUrl', imgTag.src);
        }

        if (result.data.results[i].creators.available < 1) {
            subTitleP.textContent = 'Creator not credited';
            itemCard.setAttribute('data-writer', 'Creator not credited');
        } else {
            subTitleP.textContent = result.data.results[i].creators.items[0].name;
            itemCard.setAttribute('data-writer', subTitleP.textContent);
        }

        // Appending to match the demo card structure
        contentDiv.appendChild(titleP);
        contentDiv.appendChild(subTitleP);
        cardContent.appendChild(contentDiv);

        cardFigure.appendChild(imgTag);
        cardImage.appendChild(cardFigure);

        cardSaveButton.appendChild(iTagEl);

        itemCard.appendChild(cardSaveButton);

        itemCard.appendChild(cardImage);
        itemCard.appendChild(cardContent);

        resultCard.appendChild(itemCard);
        searchResultEl.appendChild(resultCard);
    }
}

// my collection logic
if (window.location.href.includes("gallery.html")) {
    displayGallery();
  }

  function displayGallery(result) {
    var storedCollection = JSON.parse(localStorage.getItem('userCollection')) || [];
    // looping through and creating cards based on the result length
    for (var i = 0; i < storedCollection.length; i++) {
        var subTitleP = document.createElement('p');
        subTitleP.classList.add('subtitle', 'is-6');

        var titleP = document.createElement('p');
        titleP.classList.add('title', 'is-5', 'pb-2');

        var contentDiv = document.createElement('div');
        contentDiv.classList.add('content');

        var cardContent = document.createElement('div');
        cardContent.classList.add('card-content', 'pt-3');

        var imgTag = document.createElement('img');
        imgTag.src = ''; 

        var cardFigure = document.createElement('figure');
        cardFigure.classList.add('image', 'is-is-2by3');

        var cardImage = document.createElement('div');
        cardImage.classList.add('card-image', 'px-5', 'pt-5');

        var iTagEl = document.createElement('i');
        iTagEl.classList.add('fa-solid', 'fa-trash');

        var cardTrashButton = document.createElement('button');

        cardTrashButton.addEventListener('click', function(event) {
            event.stopPropagation();
            removeFromCollection(event);
          });

        cardTrashButton.classList.add('save-btn', 'c-btn');

        var itemCard = document.createElement('div');
        itemCard.classList.add('card', 'gallery-item', 'modal-trigger');
        itemCard.setAttribute('data-title', storedCollection[i].title);
        itemCard.setAttribute('data-penciler', storedCollection[i].penciler);
        itemCard.setAttribute('data-coverArtist', storedCollection[i].coverArtist);
        itemCard.setAttribute('data-description', storedCollection[i].description);
        itemCard.setAttribute('data-datePublished', storedCollection[i].datePublished);
        
        itemCard.addEventListener('click', function(event) {
                modalPopulate(event);
                showModal.classList.add('is-active');
        });

        var resultCard = document.createElement('div');
        resultCard.classList.add('column', 'is-one-fifth');

        //result card data
        titleP.textContent = storedCollection[i].title;
        if (storedCollection[i].coverUrl.length < 1) {
            imgTag.src = './assets/images/sorry-cannot-be-found.png';
            itemCard.setAttribute('data-coverUrl', storedCollection[i].coverUrl);
        } else {
            imgTag.src = storedCollection[i].coverUrl;
            itemCard.setAttribute('data-coverUrl', imgTag.src);
        }

        if (storedCollection[i].writer.available < 1) {
            subTitleP.textContent = 'Creator not credited';
            itemCard.setAttribute('data-writer', 'Creator not credited');
        } else {
            subTitleP.textContent = storedCollection[i].writer;
            itemCard.setAttribute('data-writer', subTitleP.textContent);
        }

        // Appending to match the demo card structure
        contentDiv.appendChild(titleP);
        contentDiv.appendChild(subTitleP);
        cardContent.appendChild(contentDiv);

        cardFigure.appendChild(imgTag);
        cardImage.appendChild(cardFigure);

        cardTrashButton.appendChild(iTagEl);

        itemCard.appendChild(cardTrashButton);

        itemCard.appendChild(cardImage);
        itemCard.appendChild(cardContent);

        resultCard.appendChild(itemCard);
        searchResultEl.appendChild(resultCard);
    }
}









