const API = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
        /*language: 'es'*/
    }
})

/*Utils*/

function RenderMovies(movies, container){
    container.innerHTML = ''

    movies.forEach(movie => {
        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container')
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id
        })

        const movieImage = document.createElement('img')
        movieImage.classList.add('movie-img')
        movieImage.setAttribute('alt', movie.title)
        movieImage.src = 'https://image.tmdb.org/t/p/w300/' + movie.poster_path

        movieContainer.appendChild(movieImage)
        container.appendChild(movieContainer)
    })
}

function RenderCategories(categories, container){
    container.innerHTML = ''

    categories.forEach(category => {
        const categoryContainer = document.createElement('div')
        categoryContainer.classList.add('category-container')

        const categoryTitle = document.createElement('h3')
        categoryTitle.classList.add('category-title')
        categoryTitle.setAttribute('id', 'id' + category.id)
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`
        })
        const categoryTitleText = document.createTextNode(category.name)

        categoryTitle.appendChild(categoryTitleText)
        categoryContainer.appendChild(categoryTitle)
        container.appendChild(categoryContainer)
    })
}

/*Llamados a la API*/

async function getTrendingMoviesPreview(){
    const {data} = await API('trending/movie/day')

    RenderMovies(data.results, trendingMoviesPreviewList)
}

async function getCategoriesPreview(){
    const {data} = await API('genre/movie/list')

    RenderCategories(data.genres, categoriesPreviewList)
}

async function GetMoviesByCategory(id){
    const {data} = await API('discover/movie', {
        params: {
            with_genres: id,
        }
    })

    RenderMovies(data.results, genericSection)
}

async function GetMoviesBySearch(query){
    const {data} = await API('search/movie', {
        params: {
            query: query,
        }
    })

    RenderMovies(data.results, genericSection)
}

async function GetTrendingMovies(){
    const {data} = await API('trending/movie/day')

    RenderMovies(data.results, genericSection)
}

async function GetMovieById(id){
    const {data: movie} = await API('movie/' + id)

    const movieImgUrl = 'https://image.tmdb.org/t/p/w500/' + movie.poster_path
    headerSection.style.background = `
    linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
    url(${movieImgUrl})`

    movieDetailTitle.textContent = movie.title
    movieDetailDescription.textContent = movie.overview
    movieDetailScore.textContent = movie.vote_average

    RenderCategories(movie.genres, movieDetailCategoriesList)

    GetRelatedMoviesById(id)
}

async function GetRelatedMoviesById(id){
    const {data} = await API(`movie/${id}/similar`)

    RenderMovies(data.results, relatedMoviesContainer)
}

