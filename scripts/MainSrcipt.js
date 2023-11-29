// checking if the user is online because of the api calls needed
async function isOnline() {
  if (navigator.onLine) {
    return fetch('https://www.google.com', { mode: 'no-cors' })
      .then(response => {
        // If the response is successful, it means the request was sent
        // Note: You can't access the response body or headers in no-cors mode
        return true;
      })
      .catch(error => {
        // An error occurred, which may indicate no internet connection
        return false;
      });
  } else
    return false;

}

isOnline().then(result => {
  if (result) {
    console.log('Device is connected to the internet.');
  } else {
    window.location.href = '../src/disconnected.html';
  }
});

// populating the for you section using data from an api
function get_for_you_items() {
  // URL for the meal lookup
  const apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?f=p';
  var API_data;
  // Make a GET request using the fetch API
  fetch(apiUrl)
    .then(response => {
      // Check if the request was successful (status code 200-299)
      if (!response.ok) {
        throw new Error(`Network response was not ok; status: ${response.status}`);
      }
      if (response.code == 404)
        console.log('Not found');
      // Parse the JSON in the response
      return response.json();
    })
    .then(data => {
      // Handle the data
      var for_you = document.getElementsByClassName('fy-container')[0];
      for (var i = 0; i < 8; i++) {
        for_you.innerHTML += `<div class="fy-item-container"><img class="${data.meals[i].idMeal}" id="${i}" src="${data.meals[i].strMealThumb}"></div>`;
      }
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
    });
}
get_for_you_items();

// animating the search bar
var searchBtn = document.getElementsByClassName('search-btn')[0];
searchBtn.addEventListener('click', () => {
  var searchInput = document.getElementsByClassName('Search-Bar')[0];
  searchInput.classList.toggle('expanded');
})

// animating the sidebar using vanilla javascript
document.getElementsByClassName('fa-bars')[0].addEventListener('click', () => {
  var navBar = document.getElementsByClassName('nav-bar-out')[0];
  var main_body = document.getElementsByTagName('main')[0];
  var home_body = document.querySelector('.home-body');
  var aside = document.querySelector('aside');
  aside.classList.toggle('out')
  navBar.classList.toggle('out')
  home_body.classList.toggle('out')
  main_body.classList.toggle('out')
})
// populating the recently viewed section 
function load_recently_viewed() {
  fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=b')
  .then(response => {
    // Check if the request was successful (status code 200-299)
    if (!response.ok) {
      throw new Error(`Network response was not ok; status: ${response.status}`);
    }
    if (response.code == 404)
      console.log('Not found');
    // Parse the JSON in the response
    return response.json();
  })
  .then(data => {
    var recently_viewed_body = document.querySelector('.recently-viewed');
    for (var i = 0; i < 10; i++){
      recently_viewed_body.innerHTML += `<div class="rw-item-container">
      <div class="top-container">
          <img src="${data.meals[i].strMealThumb}" alt="meal thumbnail">
      </div>
      <div class="bottom-container">
          <h4 class="title">
              ${data.meals[i].strMeal}
          </h4>
          <div class="heart-container">
              <i class="fab fa-gratipay"></i>
          </div>
      </div>  
  </div>`
    }
  })
}
load_recently_viewed();

//handling search
var search_form = document.getElementById('search-form');
var search_bar = document.querySelector('.Search-Bar')
search_form.addEventListener('submit', (event) => {
  event.preventDefault();  
  // saving value so it can be carried over to a different page in local storage
  window.localStorage.setItem('search-value', search_bar.value);
  //redirecting to the search results
  window.location.href = '../src/search.html'
});

//TODO: implement the toggling of hearts in the history section and save to favs "database"
