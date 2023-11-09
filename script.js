// https://www.omdbapi.com/?i=tt3896198&apikey=3a5aaa7b

const input = document.getElementById("search-movie")
const btn = document.getElementById("search-btn")
const container = document.getElementById("container")
const presearch = document.getElementById("presearch-state")
const films = document.getElementsByClassName("add")
const baseURL = "https://www.omdbapi.com"
const key = "3a5aaa7b"
const watchListJSON = localStorage.getItem('watchList')
const watchListMaster = JSON.parse(watchListJSON)
const watchList = []

btn.addEventListener("pointerdown", getMovies)

container.addEventListener("pointerdown", function(e) {
    if (e.target.dataset) {
        for (film of films) {
            if (film.dataset.btnid === e.target.dataset.btnid) {
                addToWatchlist(e)
                film.innerHTML =`
                <p class='added'>✅ Added!</p>
                `
            }   
        }
    }   
})

async function getMovies() {
    try {
        if (input.value !== "") { 
            const response = await fetch(`${baseURL}/?s=${input.value}&type=movie&apikey=${key}`)
            console.log(response.ok)
            if (!response.ok) {
                throw Error("Uh oh, something went wrong!")
            }
            
            const data = await response.json()
            if (data.Response == 'True') {
                getMovieList(data)
            }
            else {
                container.innerHTML = `
                <div id="presearch-state">
                    <h2>Unable to find what you're looking for. Please try another search</h2>
                </div>` 
            }
        }
        else {
            container.innerHTML = `
                <div id="presearch-state">
                    <h2>Unable to find what you're looking for. Please try another search</h2>
                </div>`
        }
    }
    catch (error) {
        console.error(error.message, error);
    }
}

async function getMovieList(arr) {
    let movies = arr.Search
    input.value = ''
    const movieIdArray = movies.map((movie) => {
        return movie.imdbID
    })
    const moviePromises = movieIdArray.map(async (item) => {
        const response = await fetch(`${baseURL}/?i=${item}&type=movie&apikey=${key}`)
        const data = await response.json()
        return [data.Title, data.Poster, data.Plot, data.Runtime, data.Genre, data.Ratings[0], data.imdbID]
    })
    const movieArr = await Promise.all(moviePromises);
    renderMovies(movieArr)
}

function renderMovies(arr) {
    const htmlArr = []
    for (let item of arr) {
        /* this assigns item[5] if it exists */
        const ratings = item[5]?.Value
        const id = item[6]
        if (localStorage.watchList && localStorage.watchList.length > 0 && localStorage.watchList.includes(id)) {
            htmlArr.push(`
                <div class="film">
                    <div class="title-div">
                        <h3 class='title'>${item[0]}</h3>
                        <p class='rating'><span class="gold-star">★</span>${ratings}</p>
                    </div>
                    <img src="${item[1]}" alt="poster for ${item[0]}">
                    <p class='plot'>${item[2]}</p>
                    <p class='runtime'>${item[3]}</p>
                    <p class='genre'>${item[4]}</p>
                    <div data-btnid="${id}" class="add added">
                        <p class='added' data-btnid="${id}">✅ Added!</p>
                    </div>
                </div>
                <hr>
                `)
        }
        else {
            htmlArr.push(`
                <div class="film">
                    <div class="title-div">
                        <h3 class='title'>${item[0]}</h3>
                        <p class='rating'><span class="gold-star">★</span>${ratings}</p>
                    </div>
                    <img src="${item[1]}" alt="poster for ${item[0]}">
                    <p class='plot'>${item[2]}</p>
                    <p class='runtime'>${item[3]}</p>
                    <p class='genre'>${item[4]}</p>
                    <div data-btnid="${id}" class="add">
                        <p data-btnid="${id}" class="plus">+</p> 
                        <p data-btnid="${id}">Watchlist</p>
                    </div>
                </div>
                <hr>
                `)
        }
    }
    container.innerHTML = htmlArr.join('')
}

function addToWatchlist(e) {
    console.log(e.target.dataset.btnid)
    watchList.push(e.target.dataset.btnid)
    saveToLocalStorage(watchList)
}

function saveToLocalStorage(arr) {
    console.log(watchListMaster)
    const updateList = []
    if (watchListMaster) {
        watchListMaster.forEach(item => updateList.push(item))
    }
    arr.forEach(item => updateList.push(item))
    
    console.log(updateList)
    const arrJSON = JSON.stringify(updateList)
    localStorage.setItem("watchList", arrJSON)
}