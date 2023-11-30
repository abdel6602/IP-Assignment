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
    if (result)
        console.log('Device is connected to the internet.');
    else
        window.location.href = '../src/disconnected.html';
});

//loading the appropriate script for each page
const BASE_URL = 'http://127.0.0.1:5500/src/';
switch (window.location.href) {
    case (BASE_URL + `index.html`):
        load_home();
        break;
    case (BASE_URL + `search.html`):
        load_search_results();
        break;

    case (BASE_URL + 'Favorites.html'):
        load_favorites();
        break
    default:
        break;
}

document.getElementById('category-btn').addEventListener('click', () => {
    console.log('clicked');
    document.getElementsByClassName('fa-angle-right')[0].classList.toggle('open')
    document.querySelector('.sub-nav-container').classList.toggle('open-nav')
    
})


function load_home() {
    if(window.localStorage.getItem('Authentication') == false){
        var icon = document.getElementsByClassName('SignInIcon')[0];
        icon.classList = 'SignInIcon fas fa-arrow-right-to-bracket';
    }
    if(window.localStorage.getItem('Authentication') == true){
        var icon2 = document.getElementsByClassName('SignInIcon')[0];
        icon2.classList = 'SignInIcon fas fa-arrow-right-from-bracket';
    }
    var searchBtn = document.getElementsByClassName('search-btn')[0];
    searchBtn.addEventListener('click', () => {
        var searchInput = document.getElementsByClassName('Search-Bar')[0];
        searchInput.classList.toggle('expanded');
    })


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
    get_for_you_items();

    load_recently_viewed();
    // animating the search bar
}


function load_search_results() {

    var searchBtn = document.getElementsByClassName('search-btn')[0];
    searchBtn.addEventListener('click', () => {
        var searchInput = document.getElementsByClassName('Search-Bar')[0];
        searchInput.classList.toggle('expanded');
    })


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
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + window.localStorage.getItem('search-value'))
        .then(response => {
            // Check if the request was successful (status code 200-299)
            if (!response.ok) {
                throw new Error(`Network response was not ok; status: ${response.status}`);
            }
            if (response.code == 404)
                console.log('Not found');
            // Parse the JSON in the response
            return response.json();
        }).then(data => {
            if (!data.meals)
                load_no_results();

            else {
                var search_result_container = document.querySelector('.search-results');
                for (let index = 0; index < data.meals.length; index++) {
                    search_result_container.innerHTML += `<div class="rw-item-container">
                    <div class="top-container">
                    <img src="${data.meals[index].strMealThumb}" alt="meal thumbnail">
                    </div>
                        <div class="bottom-container">
                            <h4 class="title">
                                ${data.meals[index].strMeal}
                            </h4>
                            <div class="heart-container">
                                <i class="fab fa-gratipay"></i>
                            </div>
                        </div>  
                    </div>`
                }

            }
        })
}

function load_favorites() {
    
}

function load_no_results() {

    var no_results = document.querySelector('.no-search-results');
    no_results.style.display = 'block'

}
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

// animating the sidebar using vanilla javascript
document.getElementsByClassName('fa-bars')[0].addEventListener('click', () => {
    var navBar = document.getElementsByClassName('nav-bar-out')[0];
    navBar.classList.toggle('out')
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
            for (var i = 0; i < 10; i++) {
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


//TODO: implement the toggling of hearts in the history section and save to favs "database"

function toggleForm() {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');

    if (signInForm.style.display === 'none') {
        signInForm.style.display = 'block';
        signUpForm.style.display = 'none';
    } else {
        signInForm.style.display = 'none';
        signUpForm.style.display = 'block';
    }
}