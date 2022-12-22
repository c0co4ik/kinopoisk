const search = document.querySelector(".header__search");
const form = document.querySelector(".header__form");

const apiKey = "acce2a38-b77e-4fe4-8142-91184e684a02";
const apiTop =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=1";
const apiSearch =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const apiId = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

window.addEventListener("click", (event) => {
  if (event.target === search) {
    search.classList.add("header__search--active");
  } 

  if (event.target !== search) {
    search.classList.remove("header__search--active");
  } 

  if(event.target === modalEl) {
    closeModal();
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
    movieCard.addEventListener('click', () => openModal(movie.filmId));
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

// Modal
const modalEl = document.querySelector('.modal');

async function openModal(id){
  const response = await fetch(apiId + id, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
  });
  const respData = await response.json();

  modalEl.classList.add('modal--show');
  document.body.classList.add('stop-scrolling');

  modalEl.innerHTML = `<div class="modal__card">
      <img class="modal__movie-backdrop" src='${respData.posterUrl}' alt="${
    respData.nameRu
  }">
      <h2>
        <span class="modal__movie-title">${respData.nameRu}</span>
        <span class="modal__movie-release-year"> - ${respData.year}</span>
      </h2>
      <ul class="modal__movie-info">
        <div class="loader"></div>
        <li class="modal__movie-genre">Жанр - ${respData.genres.map(
          (el) => ` ${el.genre}`)}
        </li>
        
        ${respData.filmLength ? `<li class="modal__movie-runtime">Время - ${
          respData.filmLength} минут</li>` : ''}
        
          <li>Сайт: <a class="modal__movie-site" href="${respData.webUrl}">${
    respData.webUrl
  }</a>
        </li>
        <li class="modal__movie-overview">${respData.description}</li>
      </ul>
      <button type="button" class="modal__button-close">Закрыть</button>
    </div>`;

    const btn = document.querySelector(".modal__button-close");
    btn.addEventListener('click', function(){
      closeModal();
    })
}

function closeModal() {
  modalEl.classList.remove("modal--show");
  document.body.classList.remove("stop-scrolling");
}

window.addEventListener('keydown', function(e){
  if(e.key == 'Escape'){
    closeModal();
  }
})


