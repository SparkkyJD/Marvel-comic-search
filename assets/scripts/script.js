// ToDo: Get api keys and store them into variables

// ToDo: Use selectors to store the html elements into variables
// var searchInput = document.querySelector('#marvel-search');
// var searchButton = document.querySelector('#marvel-search-button');
var resultList = document.querySelector('#test-list');
var searchResultEl = document.querySelector('.is-flex-wrap-wrap');
const showModal = document.querySelector(".modal");
const modalBackground = document.querySelector(".modal-background");
const catSelect = document.querySelector("#search-category");
const modalTrigger = document.querySelectorAll(".modal-trigger");
const saveButton = document.querySelectorAll('.save-btn');


// modal logic
function modalLogic () {
    //duplicate query selector allows both static and dynamic elements to have event listener
    const modalTrigger = document.querySelectorAll(".modal-trigger");
    modalBackground.addEventListener('click', function () {
        showModal.classList.remove('is-active');
      });
      modalTrigger.forEach(function(trigger) {
        trigger.addEventListener('click', function () {
            showModal.classList.add('is-active');
            // insert modal function
          });
      });
};


function addToLocalStorage() {
    var storedCollection = JSON.parse(localStorage.getItem('userCollection')) || [];
    storedCollection.push(collectionEntry);
    localStorage.setItem('userCollection', JSON.stringify(storedCollection));
}

var collectionEntry = {
    writer: "",
    datePublished: "",
    title: "",
    penciller: "",
    coverArtist: "",
    coverUrl: ""
  };

  function addToCollection (event) {
    event.stopPropagation();
    const parent = event.target.parentNode.parentNode;
    collectionEntry.writer = parent.getAttribute("data-writer");
    collectionEntry.datePublished = parent.getAttribute("data-published");
    collectionEntry.title = parent.getAttribute("data-title");
    collectionEntry.penciler = parent.getAttribute("data-penciler");
    collectionEntry.coverArtist = parent.getAttribute("data-coverArtist");
    collectionEntry.coverUrl = parent.getAttribute("data-coverUrl");
    addToLocalStorage();
  }


// and call that function on submit button click


// ToDo: Write a function that takes the user search and makes an api call based on it

function getMarvelData(event) {
    event.preventDefault(); //ensures input is processed
    var searchInput = $('#marvel-search').val();

    getMarvelInputData(searchInput);
}

function getMarvelInputData(searchInput) {
    console.log("Marvel Output ", searchInput);
    const limit = 15;
    const publicMarvelAPIKey = "9aef7c40b03dcfc94acc975098998139";
    const privateMarvelAPIKey = "9633dc804c1e3db14e515eb767c997529eceeccc";
    var timestamp = Date.now();
    var marvelBaseURL = "https://gateway.marvel.com:443/v1/public/comics";
    var MD5Input = timestamp + privateMarvelAPIKey + publicMarvelAPIKey;
    var hash = CryptoJS.MD5(MD5Input).toString(CryptoJS.enc.Hex); //Marvel API's security measure
    var auth = `&ts=${timestamp}&apikey=${publicMarvelAPIKey}&hash=${hash}`;
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

    var marvelURL = `${marvelBaseURL}${marvelQuery}${auth}`;
    
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
                result.data.results[i].thumbnail.extension;
      
              var titleEl = result.data.results[i].title;
              var isoStringDate = result.data.results[i].dates[0].date;
              var date = new Date(isoStringDate);
              
              var formattedDate = `${date.getDate().toString().padStart(2,'0')}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getFullYear()}`;
      
              let searchResult = {
                cover: thumbnail,
                title: titleEl,
                publicationDate: formattedDate,
                writer: "",
                penciler: "",
                coverArtist: "",
              };
      
             
              searchResultsArray.push(searchResult); //completed array with cover, title, pub
      
              var creatorItems = result.data.results[i].creators.items;
      
              if (creatorItems) {
                for (var j = 0; j < creatorItems.length; j++) {
                  var desiredItem = creatorItems[j];
                  var name = desiredItem.name;
                  var role = desiredItem.role;
        
                  if (role === "writer") {
                    searchResult.writer = name;
                  } else if (role === "penciler" || "penciller") {
                      searchResult.penciler = name;
                  } else if (role === "penciler (cover)" || "penciller (cover)")
                      searchResult.coverArtist = name;
                }
              }
            }
      
          console.log("Search Results Array ", searchResultsArray);
       
          displayResults(result);
          console.log(searchResultsArray);
          });

      }

$('#marvel-search-button').on("click", getMarvelData);

// Function to dynamically add search result cards based on search result length
// All that is needed for this now is to add the result data in their corresponding spots
function displayResults(result) {
    console.log(result.data.results);
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
        itemCard.setAttribute('data-title', result.data.results[i].title);
        itemCard.setAttribute('data-penciler', '');
        itemCard.setAttribute('data-coverArtist', '');
        itemCard.setAttribute('data-published', result.data.results[i].dates[0].date);
        

        var resultCard = document.createElement('div');
        resultCard.classList.add('column', 'is-one-fifth');

        // Still need to finish generating content for the modal
        // But this is for the data on the result cards
        titleP.textContent = result.data.results[i].title;
        if (result.data.results[i].images.length < 1) {
            imgTag.src = './assets/images/sorry-cannot-be-found.png';
            itemCard.setAttribute('data-coverURL', imgTag.src);
        } else {
            imgTag.src = result.data.results[i].images[0].path + '.jpg';
            itemCard.setAttribute('data-coverURL', imgTag.src);
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

        modalLogic();
    }
}





//TODO wiki tooltips

function modalPopulate () {
// class of .title text content need to equal data-title.value
// class of .coverUrl src needs to equal data-coverUrl.value
//ect...

//insert a function that will run a fetch on the writer, penciler, cover artist and save the result into  multiple variables.
//on hover the content attribute of the tooltip should exuel the var that corresponds to the link being hovered over.
}

//TODO wiki tooltips

function modalPopulate () {
// class of .title text content need to equal data-title.value
// class of .coverUrl src needs to equal data-coverUrl.value
//ect...

//insert a function that will run a fetch on the writer, penciler, cover artist and save the result into  multiple variables.
//on hover the content attribute of the tooltip should exuel the var that corresponds to the link being hovered over.
}





