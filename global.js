//TODO: check if module exists and implement it

class GlobalController{
    isOnline(){
        if (navigator.onLine) {
            return fetch('https://www.google.com', { mode: 'no-cors' })
              .then(response => {
                // If the response is successful, it means the request was sent
                return true;
              })
              .catch(error => {
                // An error occurred, which may indicate no internet connection
                return false;
              });
          } else
            return false;
    }
}

