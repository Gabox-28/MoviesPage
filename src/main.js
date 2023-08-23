const API = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
        language: 'es'
    }
})

async function getTrendingMoviesPreview(){
    const trendingPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList')
    const {data} = await API('trending/movie/day')

    const movies = data.results
    movies.forEach(movie => {
        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container')

        const movieImage = document.createElement('img')
        movieImage.classList.add('movie-img')
        movieImage.setAttribute('alt', movie.title)
        movieImage.src = 'https://image.tmdb.org/t/p/w300/' + movie.poster_path

        movieContainer.appendChild(movieImage)
        trendingPreviewMoviesContainer.appendChild(movieContainer)
    })
}

async function getCategoriesPreview(){
    const previewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list')
    const {data} = await API('genre/movie/list')

    const categories = data.genres
    categories.forEach(category => {
        const categoryContainer = document.createElement('div')
        categoryContainer.classList.add('category-container')

        const categoryTitle = document.createElement('h3')
        categoryTitle.classList.add('category-title')
        categoryTitle.setAttribute('id', 'id' + category.id)
        const categoryTitleText = document.createTextNode(category.name)

        categoryTitle.appendChild(categoryTitleText)
        categoryContainer.appendChild(categoryTitle)
        previewCategoriesContainer.appendChild(categoryContainer)
    })
}



getTrendingMoviesPreview()
getCategoriesPreview()