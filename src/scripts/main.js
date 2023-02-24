const tmdbKey = 'ef742077c7a81c3e422ec8a2e95c272a';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const searchBtn = document.getElementById('searchBtn');
const playBtn = document.getElementById('playBtn');
const searchButton = document.getElementById('movieSearchButton');
const gameButton = document.getElementById('movieGameButton');
const searchOption = document.getElementById('movieSearch');
const gameOption = document.getElementById('movieGame');
const resultsDiv = document.getElementById('results');
const resultsButtons = document.querySelectorAll('#results a');
// Set up counters
let likesCounter = 0;
let dislikesCounter = 0;

const showSearch = () => {
  gameOption.style.display = 'none';
  clearCurrentMovie();
  searchOption.style.display = 'block';
}

const showGame = () => {
  searchOption.style.display = 'none';
  clearCurrentMovie();
  gameOption.style.display = 'block';
}

const showEnteredMovie = async () => {
  const movieRequest = getEnteredMovie();
  const movieSearchEndpoint = '/search/movie'
  const requestParams = `?api_key=${tmdbKey}&query=${movieRequest}`;
  const urlToFetch = tmdbBaseUrl + movieSearchEndpoint + requestParams;

  try {
    const response = await fetch(urlToFetch)
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    }
  } catch (error) {
    console.log(error);
  }
}

const listMovies = (moviesArray) => {
  const listArr = ['<p>Please select one of the following options:</p>'];

  moviesArray.forEach(movie => {
    let title = movie.title;
    let idNum = listArr.length - 1

    listArr.push(`<a id="${idNum}">${title}</a><br>`);
  })

  return listArr.join('');
}

const clearResults = () => {
  checkAndClearMovie();
  resultsDiv.innerHTML = '';
}

const addMovieLinks = (moviesArr) => {
  for (let i = 0; i < 10; i++) {
    let node = document.getElementById(i);

    node.onclick = () => {
      clearResults();
      displayMovie(moviesArr[i]);
    }
  }
}

const searchForMovie = async () => {
  checkAndClearMovie();
  const searchResults = await showEnteredMovie();

  if (searchResults.results.length === 0) {
    return resultsDiv.innerHTML = "No movies found with that title. Please search again.";
  } else if (searchResults.results.length === 1) {
    return displayMovie(searchResults.results[0]);
  } else {
    const moviesArr = [];

    for(i = 0; i < 10; i++) {
      moviesArr.push(searchResults.results[i]);
    }
    resultsDiv.innerHTML = listMovies(moviesArr);
    addMovieLinks(moviesArr);
  }
}

const getGenres = async () => {
  const genreRequestEndpoint = '/genre/movie/list';
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = tmdbBaseUrl + genreRequestEndpoint + requestParams;

  try {
    const response = await fetch(urlToFetch)
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse.genres;
    }
  } catch (error) {
    console.log(error);
  }
}

const getMovies = async () => {
  const selectedGenre = getSelectedGenre();
  const discoverMovieEndpoint = '/discover/movie';
  const maxPages = 500; // tmdb maxes out at 500 pages of results
  const getRandPage = Math.ceil(Math.random() * maxPages)

  const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}&page=${getRandPage}`;
  const urlToFetch = tmdbBaseUrl + discoverMovieEndpoint + requestParams;

  try {
    const response = await fetch(urlToFetch)
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse.results;
    }
  } catch (error) {
    console.log(error);
  }
};

const getMovieInfo = async (movie) => {
  const movieId = movie.id;
  const movieEndpoint = `/movie/${movieId}`;
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = tmdbBaseUrl + movieEndpoint + requestParams;

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    }
  } catch(error) {
    console.log(error);
  }
};

const checkAndClearMovie = () => {
  const movieInfo = document.getElementById('movieInfo');

  if (movieInfo.childNodes.length > 0) {
    clearCurrentMovie();
  };
}

// Gets a list of movies and ultimately displays the info of a random movie from the list
const showRandomMovie = async () => {
  checkAndClearMovie();

  const movies = await getMovies();
  const randomMovie = getRandomMovie(movies);
  const info = await getMovieInfo(randomMovie);

  displayMovie(info);
};

getGenres().then(populateGenreDropdown);
searchBtn.onclick = searchForMovie;
playBtn.onclick = showRandomMovie;
searchButton.onclick = showSearch;
gameButton.onclick = showGame;
