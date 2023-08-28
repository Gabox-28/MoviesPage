//Data

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

function LikedMoviesList(){
    const item = JSON.parse(localStorage.getItem('liked_movies'))

    let movies

    if (item){
        movies = item
    }else{
        movies = {}
    }
    return movies
}

function LikeMovie(movie){
    const likedMovies = LikedMoviesList()

    if(likedMovies[movie.id]){
        likedMovies[movie.id] = undefined
    }else{
        likedMovies[movie.id] = movie
    }

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies))
}

/*Utils*/

const LazyLoader = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting === true){
            const url = entry.target.getAttribute('data-src')
            entry.target.setAttribute('src', url)
        }
    })
})

function RenderMovies(movies, container, {lazyLoad = false, clean = true} = {}){
    if (clean){
        container.innerHTML = ''
    }

    movies.forEach(movie => {
        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container')

        const movieImage = document.createElement('img')
        movieImage.classList.add('movie-img')
        movieImage.setAttribute('alt', movie.title)
        movieImage.setAttribute(lazyLoad ? 'data-src' : 'src', 'https://image.tmdb.org/t/p/w300/' + movie.poster_path)
        movieImage.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id
        })

        const movieBtn = document.createElement('button')
        movieBtn.classList.add('movie-btn')
        LikedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked')
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked')
            LikeMovie(movie)
        })

        if (lazyLoad){
            LazyLoader.observe(movieImage)
        }
        movieImage.addEventListener('error', () => {
            movieImage.src = 'https://t4.ftcdn.net/jpg/02/97/01/65/360_F_297016511_NWrJG1s3mpyjqD3hwdKidfYsvhEnrPm4.jpg'
        })

        movieContainer.appendChild(movieImage)
        movieContainer.appendChild(movieBtn)
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

    RenderMovies(data.results, trendingMoviesPreviewList, {lazyLoad: true, clean: true})
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
    maxPage = data.total_pages

    RenderMovies(data.results, genericSection, {lazyLoad: true, clean: true})
}

function GetPaginatedMoviesByCategory(id){
    return async function (){
        const {scrollTop, scrollHeight, clientHeight} = document.documentElement

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
        const pageIsNotMax = page < maxPage

        if (scrollIsBottom && pageIsNotMax) {
            page++
            const {data} = await API('discover/movie', {
                params: {
                    with_genres: id,
                    page: page
                }
            })

            RenderMovies(data.results, genericSection, {lazyLoad: true, clean: false})
        }
    }
}

async function GetMoviesBySearch(query){
    const {data} = await API('search/movie', {
        params: {
            query: query,
        }
    })
    maxPage = data.total_pages

    RenderMovies(data.results, genericSection, {lazyLoad: true, clean: true})
}

function GetPaginatedMoviesBySearch(query){
    return async function (){
        const {scrollTop, scrollHeight, clientHeight} = document.documentElement

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
        const pageIsNotMax = page < maxPage

        if (scrollIsBottom && pageIsNotMax) {
            page++
            const {data} = await API('search/movie', {
                params: {
                    query: query,
                    page: page
                }
            })

            RenderMovies(data.results, genericSection, {lazyLoad: true, clean: false})
        }
    }
}

async function GetTrendingMovies(){
    const {data} = await API('trending/movie/day')
    maxPage = data.total_pages

    RenderMovies(data.results, genericSection, {lazyLoad: true, clean: true})
}

async function GetPaginatedTrendingMovies(){

    const {scrollTop, scrollHeight, clientHeight} = document.documentElement

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
    const pageIsNotMax = page < maxPage

    if (scrollIsBottom && pageIsNotMax) {
        page++
        const {data} = await API('trending/movie/day', {
            params: {
                page: page
            }
        })

        RenderMovies(data.results, genericSection, {lazyLoad: true, clean: false})
    }
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

    RenderMovies(data.results, relatedMoviesContainer, true)
}

function GetLikedMovies(){
    const likedMovies = LikedMoviesList()

    const moviesArray = Object.values(likedMovies)
    console.log(likedMovies)
    console.log(moviesArray)

    RenderMovies(moviesArray, likedMoviesListArticle, {lazyLoad: true, clean: true})
}

