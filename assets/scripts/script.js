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






// ToDo: Write a function to display the search results onto the page

$('#marvel-search-button').on("click", getMarvelData);




// $("#search-history-container").on("click", function (event) { //needs div container containing search history (i.e. list of buttons with search term)
//     event.preventDefault();
//     var clickedButton = event.target
//     //saved data is repopulated on click of button in search history
//     if ($(clickedButton).hasClass("button")) {
//         searchInput = $(clickedButton).data("searchInput");
//         getMarvelInputData(searchInput);
//     }
// });


// TODo: Protect our APIKeys. Making our Github project private apparently isn't enough (although it could reduce the risk)

//   marvel api object


// This array should store any objects created byt the api search results

// TODO pulling from the marvel api should save the following Object into the above array

let searchResult = {
    cover:  "",
    title: "",
    publicationDate: "",
    writer: "",
    penciler: "",
    coverArtist: "",
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

        // Need to figure out how to differentiate the generated save buttons
        // so that each button will save only its corresponding content
        // cardSaveButton.addEventListener('click', addToLocalStorage);
        modalLogic();
    }
}

// Just temporary, this query selector will be replaced by the dynamically generated
// cardSaveButtons
var saveButton = document.querySelector('.save-btn');

var collectionEntry = {
    writer: "",
    datePublished: "",
    title: "",
    penciller: "",
    coverArtist: ""
  };

function addToLocalStorage() {
    var storedCollection = JSON.parse(localStorage.getItem('userCollection')) || [];
    collectionEntry.index++; 
    storedCollection.push(collectionEntry);
    localStorage.setItem('userCollection', JSON.stringify(storedCollection));
}

// Just temporary, the dynamically generated buttons will have event listeners to take this
// placeholder's place
saveButton.addEventListener('click', addToLocalStorage);

//TODO wiki tooltips

function modalPopulate () {
// class of .title text content need to equal data-title.value
// class of .coverUrl src needs to equal data-coverUrl.value
//ect...

//insert a function that will run a fetch on the writer, penciler, cover artist and save the result into  multiple variables.
//on hover the content attribute of the tooltip should exuel the var that corresponds to the link being hovered over.
}

// Just temporary, the dynamically generated buttons will have event listeners to take this
// placeholder's place
saveButton.addEventListener('click', addToLocalStorage);

//TODO wiki tooltips

function modalPopulate () {
// class of .title text content need to equal data-title.value
// class of .coverUrl src needs to equal data-coverUrl.value
//ect...

//insert a function that will run a fetch on the writer, penciler, cover artist and save the result into  multiple variables.
//on hover the content attribute of the tooltip should exuel the var that corresponds to the link being hovered over.
}





