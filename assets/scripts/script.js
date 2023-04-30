// ToDo: Get api keys and store them into variables

// ToDo: Use selectors to store the html elements into variables

// ToDo: Write a function to obtain the user search on submit
// and call that function on submit button click

// ToDo: Write a function that takes the user search and makes an api call based on it

// ToDo: Write a function to display the search results onto the page

// ToDo: Create a function to display a modal asking the user for location parameters
// then pass those parameters into the api call

// ToDo: Write a function to make the google maps api call
// using user inputted location parameters

// ToDo: Find some way to incorporate local storage into the application
// maybe by storing the user's location? Or maybe by storing their previous
// searches and displaying them to the page for shortcut links?

// ToDo: Add event listener to submit button

const galleryItem = document.querySelector(".gallery-item");
const showModal = document.querySelector(".modal");
const modalBackground = document.querySelector(".modal-background");

galleryItem.addEventListener('click', function () {
    showModal.classList.add('is-active');
    console.log('hello world');
  });
  modalBackground.addEventListener('click', function () {
    showModal.classList.remove('is-active');
  });