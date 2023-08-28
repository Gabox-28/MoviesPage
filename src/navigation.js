let maxPage
let page = 1
let infiniteScroll

searchFormBtn.addEventListener('click', () => {

    location.hash = '#search=' + searchFormInput.value
})
trendingBtn.addEventListener('click', () => location.hash = '#trends')
arrowBtn.addEventListener('click', () => {
    /*if (document.domain !== 'localhost'){
        location.hash = '#home'
    }else{
        history.back()
    }*/

    history.back()
})

window.addEventListener('load', navigator, false)
window.addEventListener('hashchange', navigator, false)
window.addEventListener('scroll', infiniteScroll, false)

function navigator(){

    if(infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll)
        infiniteScroll = undefined
    }

    if (location.hash.startsWith('#trends')){
        TrendsPage()
    }else if (location.hash.startsWith('#search=')){
        SearchPage()
    }else if (location.hash.startsWith('#movie=')){
        MoviePage()
    }else if (location.hash.startsWith('#category=')){
        CategoriesPage()
    }else{
        HomePage()
    }

    window.scrollTo(0, 0);

    if (infiniteScroll){
        window.addEventListener('scroll', infiniteScroll, {passive: false})
    }
}

function HomePage(){
    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.add('inactive')
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.remove('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.remove('inactive')

    likedMoviesSection.classList.remove('inactive')
    trendingPreviewSection.classList.remove('inactive')
    categoriesPreviewSection.classList.remove('inactive')
    genericSection.classList.add('inactive')
    movieDetailSection.classList.add('inactive')

    getTrendingMoviesPreview()
    getCategoriesPreview()
    GetLikedMovies()
}

function TrendsPage(){
    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive')
    searchForm.classList.add('inactive')

    likedMoviesSection.classList.add('inactive')
    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    headerCategoryTitle.innerHTML = 'Tendencias'
    GetTrendingMovies()

    infiniteScroll = GetPaginatedTrendingMovies
}

function SearchPage(){
    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.remove('inactive')

    likedMoviesSection.classList.add('inactive')
    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    const [_, query] = location.hash.split('=')
    GetMoviesBySearch(query)

    infiniteScroll = GetPaginatedMoviesBySearch(query)
}

function MoviePage(){
    headerSection.classList.add('header-container--long')
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.add('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.add('inactive')

    likedMoviesSection.classList.add('inactive')
    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.add('inactive')
    movieDetailSection.classList.remove('inactive')

    const [_, id] = location.hash.split('=')
    GetMovieById(id)
}

function CategoriesPage(){
    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive')
    searchForm.classList.add('inactive')

    likedMoviesSection.classList.add('inactive')
    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    const [_, categoryData] = location.hash.split('=')
    const [categoryId, categoryName] = categoryData.split('-')

    headerCategoryTitle.innerHTML = categoryName

    GetMoviesByCategory(categoryId)

    infiniteScroll = GetPaginatedMoviesByCategory(categoryId)
}