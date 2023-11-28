var searchBtn = document.getElementsByClassName('search-btn')[0];
searchBtn.addEventListener('click', expandSearch); 


function expandSearch() {
    var searchInput = document.getElementsByClassName('Search-Bar')[0];
    searchInput.classList.toggle('expanded');
  }


function get_for_you_items(){
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
          // Parse the JSON in the response
          return response.json();
      })
      .then(data => {
          // Handle the data
          var for_you = document.getElementsByClassName('fy-container')[0];
          for(var i = 0; i < 8; i++){
            for_you.innerHTML += `<div class="fy-item-container"><img class="${data.meals[i].idMeal}" id="${i}" src="${data.meals[i].strMealThumb}"></div>`;
          }
      })
      .catch(error => {
          // Handle errors
          console.error('Error fetching data:', error);
      });
}



get_for_you_items();
// var for_you = document.getElementsByClassName('fy-container')[0];
// for(var i = 0; i < 8; i++){
//     for_you.innerHTML += '<div class="fy-item-container"></div>';
// }

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
