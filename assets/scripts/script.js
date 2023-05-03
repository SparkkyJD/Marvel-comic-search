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
    //   modalTrigger.forEach(function(trigger) {
    //     trigger.addEventListener('click', function (event) {
    //         modalPopulate(event);
    //         showModal.classList.add('is-active');
    //       });
    //   });
};

//TODO wiki tooltips


function modalPopulate (event) {
    mCover = document.querySelector(".modal-cover");
    mTitle = document.querySelector(".modal-title");
    mWriter = document.querySelector(".modal-writer");
    mPenciler = document.querySelector(".modal-penciler");
    mDescription = document.querySelector(".modal-description");
    mCoverArtist = document.querySelector(".modal-cover-artist");
    mDate = document.querySelector(".modal-published");
    
    mWriter.textContent = event.target.getAttribute("data-writer");
    mDate.textContent = event.target.getAttribute("data-published");
    mTitle.textContent = event.target.getAttribute("data-title");
    mPenciler.textContent = event.target.getAttribute("data-penciler");
    mCoverArtist.textContent = event.target.getAttribute("data-coverartist");
    mCover.src = event.target.getAttribute("data-coverurl");
    //insert a function that will run a fetch on the writer, penciler, cover artist and save the result into  multiple variables.
    //on hover the content attribute of the tooltip should exuel the var that corresponds to the link being hovered over.
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
            console.log("you already saved this item");
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
    parent.remove();
  }

// marvel api logic
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
                coverUrl: thumbnail,
                title: titleEl,
                datePublished: formattedDate,
                writer: "",
                penciler: "",
                coverArtist: "",
                description: ""
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
       
          displayResults(result, searchResultsArray);
          console.log(searchResultsArray);
          });

      }

$('#marvel-search-button').on("click", getMarvelData);

// search gallery logic
function displayResults(result, searchResultsArray) {
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
        itemCard.setAttribute('data-title', searchResultsArray[i].title);
        itemCard.setAttribute('data-penciler', searchResultsArray[i].penciler);
        itemCard.setAttribute('data-coverArtist', searchResultsArray[i].coverArtist);
        itemCard.setAttribute('data-description', searchResultsArray[i].description);
        itemCard.setAttribute('data-datePublished', searchResultsArray[i].datePublished);
        itemCard.setAttribute('data-writer', searchResultsArray[i].writer);

        itemCard.addEventListener('click', function(event) {
                modalPopulate(event);
                showModal.classList.add('is-active');
        })
        

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

        modalLogic();
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

        // Still need to finish generating content for the modal
        // But this is for the data on the result cards
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

        modalLogic();
    }
}









