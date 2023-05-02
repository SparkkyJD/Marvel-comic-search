// ToDo: Get api keys and store them into variables

// ToDo: Use selectors to store the html elements into variables
var searchInput = document.querySelector('#marvel-search');
var searchButton = document.querySelector('#marvel-search-button');
var resultList = document.querySelector('#test-list');

// ToDo: Write a function to obtain the user search on submit


// and call that function on submit button click


// ToDo: Write a function that takes the user search and makes an api call based on it

function getMarvelData(event) {
    event.preventDefault(); //ensures input is processed
    searchInput = $('#marvel-search').val();

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
    var marvelURL = `${marvelBaseURL}${marvelQuery}${auth}`;

    //allows multiple paramaters in one search input field
    if(title) {
        marvelQuery += `&titleStartsWith=${title}`;
    }

    if(characters) {
        marvelQuery += `&characters=${characters}`;
    }

    if(year) {
        marvelQuery += `&startYear=${year}`;
    }
//TODO: replace with a modal 
    if(!year & !title & !characters) {
        return console.log("Error: You need to search a character, title, and/or year of issue");
    }
    
    console.log("Query ", marvelURL);

    fetch(marvelURL)
        .then((response) => response.json())
        .then(result => {
            console.log("Marvel Data ", result);
        })
}




// ToDo: Write a function to display the search results onto the page

$('#marvel-search-button').on("click", getMarvelData);

// ToDo: Create a function to display a modal asking the user for location parameters
// then pass those parameters into the api call

// ToDo: Write a function to make the google maps api call
// using user inputted location parameters

// ToDo: Find some way to incorporate local storage into the application
// maybe by storing the user's location? Or maybe by storing their previous
// searches and displaying them to the page for shortcut links?

// ToDo: Add event listener to submit button


const modalTrigger = document.querySelectorAll(".modal-trigger");
const showModal = document.querySelector(".modal");
const modalBackground = document.querySelector(".modal-background");


// modalTrigger.addEventListener('click', function () {
//     showModal.classList.add('is-active');
//     console.log('hello world');
//   });
  modalBackground.addEventListener('click', function () {
    showModal.classList.remove('is-active');
  });

  modalTrigger.forEach(function(trigger) {
    trigger.addEventListener('click', function () {
        showModal.classList.add('is-active');
        console.log('hello world');
      });
  });


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
let searchResults = [

];

// TODO pulling from the marvel api should save the following Object into the above array

let searchResult = {
    cover:  "",
    title: "",
    publicationDate: "",
    writer: "",
    penciler: "",
    coverArtist: "",
}

//TODO loop over api response data

//save each response in the above object format
//example: 
    // searchResult.title = data.title;
    // searchResult.title = data.publicationDate;
    // ect.
// Then Push() the object to the search results array
// remember at the beginning of the funtion you'll want to set searchResults = [] so it clears the array every time you run a search.

