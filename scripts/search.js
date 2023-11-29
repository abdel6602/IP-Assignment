var search_value = window.localStorage.getItem('search-value')


function load_results(value) {
    const API_URL = `www.themealdb.com/api/json/v1/1/search.php?s=${value}`;
    fetch(API_URL)
        .then(response => {
            if (!response.ok)
                throw new Error(`Network response was not ok; response: ${response.code}`);
            else
                return response.json();
        })
    //TODO: handle the data (load the results)
}