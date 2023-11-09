// https://www.omdbapi.com/?i=tt3896198&apikey=3a5aaa7b

const baseURL = "http://www.omdbapi.com"
const key = "3a5aaa7b"
const container = document.getElementById("container")
const watchListJSON = localStorage.getItem('watchList');
const watchListArr = JSON.parse(watchListJSON);

container.addEventListener("click", function(e) {
    if (e.target.dataset) {
        removeFromWatchlist(e)
    }
})

async function getMovieList(arr) {
    const movieIdArray = arr
    const moviePromises = movieIdArray.map(async (item) => {
        const response = await fetch(`${baseURL}/?i=${item}&type=movie&apikey=${key}`)
        const data = await response.json()
        return [data.Title, data.Poster, data.Plot, data.Runtime, data.Genre, data.Ratings[0], data.imdbID]
    })
    const movieArr = await Promise.all(moviePromises);
    renderMovies(movieArr)    
}

function renderMovies(arr) {
    let htmlArr = []
    for (let item of arr) {
        const ratings = item[5].Value
        const id = item[6]
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
            <div class="add">
                <p data-btnid="${id}">
                    <img data-btnid="${id}" class="add-btn" src="./assets/remove-icon2.png" >
                    Watchlist
                </p>
            </div>
        </div>
        <hr>
        `)
    }
    container.innerHTML = htmlArr
}

function removeFromWatchlist(e) {
    const targetToRemove = e.target.dataset.btnid
    const indexToRemove = watchListArr.findIndex(movie => movie === targetToRemove)

    if (indexToRemove !== -1) {
    watchListArr.splice(indexToRemove, 1)
    localStorage.setItem("watchList", JSON.stringify(watchListArr))
    getMovieList(watchListArr)
    }
}

getMovieList(watchListArr)