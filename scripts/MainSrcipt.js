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

load_nav();

function load_nav() {
    //load header
    const aside = document.querySelector('aside');
    aside.innerHTML = `<div class="nav-bar-out">
<ul>
    <li class="nav-bar-item selected-page">
        <div class="nav-bar-item-contents">
            <i class="fas fa-house"></i>
            <a href="./index.html" class="title">Home</a>
        </div>
    </li>
    <li class="nav-bar-item">
        <div class="nav-bar-item-contents">
            <i class="fas fa-heart"></i>
            <a href="./Favorites.html" class="title">
                Favourites
            </a>
        </div>
    </li>
    <li class="nav-bar-item" id="category-btn">
        <div class="nav-bar-item-contents">
            <i class="fas fa-bowl-food"></i>
            <a href="#" class="title">Category</a>
            <i class="fas fa-angle-right"></i>
        </div>
    </li>
    <ul class="sub-nav-container">
        <li class="sub-nav-item">
            <h3 class="sub-nav-item-title">Beef</h3>
            <i class="fas fa-bacon"></i>
        </li>
        <li class="sub-nav-item">
            <h3 class="sub-nav-item-title">Vegan</h3>
            <i class="fas fa-seedling"></i>
            <li class="sub-nav-item" id="chickenBtn">
                <h3 class="sub-nav-item-title">Any</h3>
                <i class="fas fa-angle-right"></i>
            </li>                            
            <ul class="second-level-nav-container">
                <li class="second-level-item">
                    <h4 class="second-level-title">
                        British
                    </h4>
                    <i class="fas fa-angles-right"></i>
                </li>
                <li class="second-level-item">
                    <h4 class="second-level-title">
                        Italian
                    </h4>
                    <i class="fas fa-angles-right"></i>
                </li class="second-level-item">
            </ul>
        </li>
        </ul> 
    </ul>
</ul>
</div>`

}
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
        break;
    case (BASE_URL + 'category.html'):
        load_category();
    case (BASE_URL + 'cook.html'):
        load_cooking_instructions();
        break;
    default:
        break;
}

document.getElementById('category-btn').addEventListener('click', () => {
    document.getElementsByClassName('fa-angle-right')[0].classList.toggle('open')
    document.querySelector('.sub-nav-container').classList.toggle('open-nav')

})

document.querySelector('#chickenBtn').addEventListener('click', () => {
    console.log('clicked');
    document.querySelector('#chickenBtn > i').classList.toggle('open')
    document.querySelector('.second-level-nav-container').classList.toggle('open-nav')
});

function load_home() {
    if (window.localStorage.getItem('Authentication') == false) {
        var icon = document.getElementsByClassName('SignInIcon')[0];
        icon.classList = 'SignInIcon fas fa-arrow-right-to-bracket';
    }
    if (window.localStorage.getItem('Authentication') == true) {
        var icon2 = document.getElementsByClassName('SignInIcon')[0];
        icon2.classList = 'SignInIcon fas fa-arrow-right-from-bracket';
    }
    var searchBtn = document.getElementsByClassName('search-btn')[0];
    searchBtn.addEventListener('click', () => {
        var searchInput = document.getElementsByClassName('Search-Bar')[0];
        searchInput.classList.toggle('expanded');
        searchInput.focus();
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
                    <img src="${data.meals[index].strMealThumb}" alt="${data.meals[index].strMeal}" class="card-img" id="${data.meals[index].idMeal}" onclick="view_meal(this)">
                    </div>
                        <div class="bottom-container">
                            <h4 class="title">
                                ${data.meals[index].strMeal}
                            </h4>
                            <div class="heart-container">
                            <i class="fas fa-heart" id="${data.meals[index].idMeal}" onclick="save_favorite(this)"></i>
                            </div>
                        </div>  
                    </div>`
                }

            }
        })
}

function load_favorites() {
    var container = document.querySelector('.results-container');
    if (!window.localStorage.getItem('favorites')) {
        container.innerHTML = `<h2 style="color: red">You have no favorites yet!</h2>`;
    }
    else {
        var favorites = JSON.parse(window.localStorage.getItem('favorites'));
        for (var i = 0; i < favorites.length; i++) {
            fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + favorites[i])
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok; status: ${response.status}`);
                    }
                    else
                        return response.json();
                }).then(data => {
                    container.innerHTML += `<div class="rw-item-container">
                <div class="top-container">
                <img src="${data.meals[0].strMealThumb}" alt="${data.meals[0].strMeal}" class="card-img" id="${data.meals[0].idMeal}" onclick="view_meal(this)">
                </div>
                    <div class="bottom-container">
                        <h4 class="title">
                            ${data.meals[0].strMeal}
                        </h4>
                        <div class="heart-container">
                        <i class="fas fa-heart red" id="${data.meals[0].idMeal}" onclick="save_favorite(this, 1)"></i>
                        </div>
                    </div>  
                </div>`
                });
        }
    }

}

function load_category() {
    var category = window.localStorage.getItem('category');
    var data_area, data_category = []
    var results_container = document.querySelector('.results-container');
    if (category == 'Beef' || category == 'Vegan') {
        fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=' + category)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok; status: ${response.status}`);
                }
                else
                    return response.json();
            }).then(data => {
                console.log(data);
                for (var i = 0; i < data.meals.length; i++) {
                    results_container.innerHTML += `<div class="rw-item-container" id="${data.meals[i].idMeal}">
                <div class="top-container">
                <img src="${data.meals[i].strMealThumb}" alt="${data.meals[i].strMeal}" class="card-img" id="${data.meals[i].idMeal}" onclick="view_meal(this)">
                </div>
                    <div class="bottom-container">
                        <h4 class="title">
                            ${data.meals[i].strMeal}
                        </h4>
                        <div class="heart-container">
                        <i class="fas fa-heart" id="${data.meals[i].idMeal}" onclick="save_favorite(this)"></i>
                        </div>
                    </div>  
                </div>`
                }
            });
    }
    else {
        fetch('https://www.themealdb.com/api/json/v1/1/filter.php?a=' + category)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok; status: ${response.status}`);
                }
                else
                    return response.json();
            }).then(data => {
                for (var i = 0; i < data.meals.length; i++) {
                    results_container.innerHTML += `<div class="rw-item-container">
                    <div class="top-container">
                    <img src="${data.meals[i].strMealThumb}" alt="${data.meals[i].strMeal}" class="card-img" id="${data.meals[i].idMeal}" onclick="view_meal(this)">
                    </div>
                        <div class="bottom-container">
                            <h4 class="title">
                                ${data.meals[i].strMeal}
                            </h4>
                            <div class="heart-container">
                                <i class="fas fa-heart" id="${data.meals[i].idMeal}" onclick="save_favorite(this)"></i>
                            </div>
                        </div>  
                    </div>`
                }
            });
    }
    //TODO: make cooking instructions page
}

function view_meal(clicked_item) {
    window.localStorage.setItem('meal_id', clicked_item.id);
    window.location.href = '../src/cook.html';
}

function save_favorite(clicked_item, flag) {
    clicked_item.classList.toggle('red');
    if (!window.localStorage.getItem('favorites')) {
        window.localStorage.setItem('favorites', JSON.stringify([]));
        var favorites = JSON.parse(window.localStorage.getItem('favorites'));
        favorites.push(clicked_item.id);
        window.localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    else {
        if (!window.localStorage.getItem('favorites').includes(clicked_item.id)) {
            var favorites = JSON.parse(window.localStorage.getItem('favorites'));
            favorites.push(clicked_item.id);
            window.localStorage.setItem('favorites', JSON.stringify(favorites));
        }
        else {
            if (flag) {
                var favorites = JSON.parse(window.localStorage.getItem('favorites'));
                var index = favorites.indexOf(clicked_item.id);
                favorites.splice(index, 1);
                window.localStorage.setItem('favorites', JSON.stringify(favorites));
                window.location.reload();
            }
            else {
                var favorites = JSON.parse(window.localStorage.getItem('favorites'));
                var index = favorites.indexOf(clicked_item.id);
                favorites.splice(index, 1);
                window.localStorage.setItem('favorites', JSON.stringify(favorites));
            }
        }
    }

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
                for_you.innerHTML += `<div class="fy-item-container"><img src="${data.meals[i].strMealThumb}" alt="${data.meals[i].strMeal}" class="card-img" id="${data.meals[i].idMeal}" onclick="view_meal(this)"></div>`;
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
            <img src="${data.meals[i].strMealThumb}" alt="${data.meals[i].strMeal}" class="card-img" id="${data.meals[i].idMeal}" onclick="view_meal(this)">
            </div>
                <div class="bottom-container">
                    <h4 class="title">
                        ${data.meals[i].strMeal}
                    </h4>
                    <div class="heart-container">
                    <i class="fas fa-heart" id="${data.meals[i].idMeal}" onclick="save_favorite(this)"></i>
                    </div>
                </div>  
            </div>`
            }
        });
}


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

for (var i = 0; i < 2; i++) {
    document.getElementsByClassName('sub-nav-item')[i].addEventListener('click', (event) => {
        window.localStorage.setItem('category', event.target.innerText);
        window.location.href = '../src/category.html';
    });
}

for (var i = 0; i < 2; i++) {
    document.getElementsByClassName('second-level-item')[i].addEventListener('click', (event) => {
        console.log(event);
        window.localStorage.setItem('category', event.target.innerText);
        window.location.href = '../src/category.html';
    });
}

function load_cooking_instructions() {
    var meal_id = window.localStorage.getItem('meal_id');
    var container = document.querySelector('#meal-body');

    fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + meal_id)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok; status: ${response.status}`);
            }
            else
                return response.json();
        }).then(data => {
            var strYoutube_modified = data.meals[0].strYoutube.replace('watch?v=', 'embed/');
            strYoutube_modified += '?autoplay=1&mute=1';
            var ingredients = [];
            var measurements = [];
            for (var i = 1; i < 21; i++) {
                if (data.meals[0]['strIngredient' + i] != null) {
                    ingredients.push(data.meals[0]['strIngredient' + i]);
                    measurements.push(data.meals[0]['strMeasure' + i]);
                }
            }
            container.innerHTML = `<div id="instructions-cover">
            <img id="meal-pic" src="${data.meals[0].strMealThumb}">
            <div class="add-to-fav-container">
                <h3>Add to Your Favorites</h3>
                <i class="fas fa-heart" id="${data.meals[0].idMeal}" onclick="save_favorite(this, 0)"></i>
            </div>
            <br><br><br>
        </div>
        <section class="ingredients-container">
            <h2>Ingredients</h2>
            <ul class="ingredients-list">

            </ul>
        </section>
        <section>
            <div class="instructions-container">
                <h2>Instructions</h2>
                <br>
                <p>
                    ${data.meals[0].strInstructions}
                </p>

        </section>
        <br><br>
        <section class="video-container">
            <h2>Video</h2>
            <br>
            <iframe width="560" height="315" src="${strYoutube_modified}"
                frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
        </section>
        <br><br><br>`
            var ingredients_list = document.querySelector('.ingredients-list');
            for (var i = 0; i < ingredients.length; i++) {
                if (ingredients[i])
                    ingredients_list.innerHTML += `<li>${ingredients[i]} - ${measurements[i]}</li>`
            }
        });

}