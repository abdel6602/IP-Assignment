var searchBtn = document.getElementsByClassName('search-btn')[0];
searchBtn.addEventListener('click', expandSearch); 


function expandSearch() {
    var searchInput = document.getElementsByClassName('Search-Bar')[0];
    searchInput.classList.toggle('expanded');
  }