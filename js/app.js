const search = document.querySelector(".header__search");
const form = document.querySelector(".header__form");
const apiKey = "acce2a38-b77e-4fe4-8142-91184e684a02";
const apiTop =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=1";
const apiSearch =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

window.addEventListener("click", (event) => {
  if (event.target === search) {
    search.classList.add("header__search--active");
  } else {
    search.classList.remove("header__search--active");
  }
});


getMovies(apiTop);

async function getMovies(url) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
  });
  const respData = await response.json();
  showMovies(respData);
}

function getClassRate(rating){
  if (rating >= 9){
    return 'green'
  }

  else if (rating > 8.5){
    return 'orange'
  }

  else if (rating == 'null'){
    return 'null'
  }

  else{
    return 'red'
  }
}

function showMovies(data){
  const moviesEL = document.querySelector('.movies');
  moviesEL.innerHTML= ``;
  
  data.films.forEach((movie) => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
    <div class="movie-card__img">
      <img src=${movie.posterUrl} alt="${movie.nameRu}" class="card__img">
      <div class="movie-card__img--darkened"></div>
    </div>
    <span class="movie-card__average movie-card__average--${getClassRate(movie.rating)}">${movie.rating}</span>
    <div class="movie-card__info">
      <h2 class="movie-card__title">${movie.nameRu}</h2>
      <p class="movie-card__descr">${movie.genres.map(
        (genre) => ` ${genre.genre}`
      )}</p>
    </div>`;
    moviesEL.appendChild(movieCard);
  })
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchCurrent = `${apiSearch}${search.value}`;
  
  if (search.value) {
    getMovies(searchCurrent);
  }
  search.value = '';
});