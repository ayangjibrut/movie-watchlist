// https://www.omdbapi.com/?i=tt3896198&apikey=3a5aaa7b

watchListMainSection = document.getElementById('watchlist-main-section')

const container = document.getElementById("container")
const watchListJSON = localStorage.getItem('watchList');
const watchListArr = JSON.parse(watchListJSON);

container.addEventListener("click", (e) => {
    if (e.target.dataset) {
        removeFromWatchlist(e)
    }
})

async function getMovieList(arr) {
    const movieIdArray = arr
    const moviePromises = movieIdArray.map(async (item) => {
        const response = await fetch(`https://www.omdbapi.com/?i=${item}&type=movie&apikey=3a5aaa7b`)
        const data = await response.json()
        return [data.Title, data.Poster, data.Plot, data.Runtime, data.Genre, data.Ratings[0], data.imdbID]
    })
    const movieArr = await Promise.all(moviePromises);
    renderMovies(movieArr)    
}

function renderMovies(arr) {
    if (container && container.length > 0){
        watchListMainSection.innerHTML = "" 
        watchListMainSection.classList.add('add-margin-top')
    }

    let htmlArr = []
    for (let item of arr) {
        const ratings = item[5]?.Value
        const id = item[6]
        htmlArr.push(`
            <div class="film">
                <img class="poster" src="${item[1]}">
                <div class="title-div">
                    <h3 class='title'>${item[0]}</h3>
                    <h3 class="rating"><span class="star">★ </span>${ratings}</h3>
                    <p class='runtime'>${item[3]} - <span>${item[4]}</span></p>
                    <p class='plot'>${item[2]}</p>
                    <div data-btnid="${id}">
                        <p class="remove" data-btnid="${id}"><i class="fa-solid fa-trash"></i> Remove</p>
                    </div>
                </div>
            </div>
            <hr>
            `
        )
    }
    container.innerHTML = htmlArr.join('')
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