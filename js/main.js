//// HÄMTA INFO AV RANDOM BEER ////

const randomBeerUrl = "https://api.punkapi.com/v2/beers/random"

async function getRandomBeer(url){
    const response = await fetch(url)
    const data = await response.json()
    return data
}
//// NAVIGATION ////

function navLinks(){
    const links = document.querySelectorAll("nav > a")
    for (let link of links){
        link.addEventListener("click",()=>{
            document.querySelectorAll("main > section").forEach(
                section => section.classList.remove("active")
            )
            const section = document.querySelector("." + link.id)
            section.classList.add("active")
        })
    }  
}
navLinks()

//// BUTTONS HOME SIDA ////

const moreInfoButton = document.querySelector(".more-info-button")
const homePage = document.querySelector(".home")
const beerInfoPage = document.querySelector(".info")
moreInfoButton.addEventListener("click", function(){
    homePage.classList.remove("active")
    beerInfoPage.classList.add("active")
})

const randomBeerButton = document.querySelector(".random-button")
randomBeerButton.addEventListener("click", async function(){
    const beerData = await getRandomBeer(randomBeerUrl)
    renderRandomBeer(beerData)   
})

//// ASYNC FUNCTIONS RANDOM BEER ////

async function renderListInfo(beerData){
    let sortBeerData = []
    sortBeerData.push(beerData[0].abv)
    sortBeerData.push(beerData[0].volume)
    sortBeerData.push(beerData[0].ingredients)
    sortBeerData.push(beerData[0].food_pairing)
    sortBeerData.push(beerData[0].brewers_tips)
    return sortBeerData
}

async function renderRandomInfo(beerData){
    const beerName = document.querySelector(".beer-name-info")
    beerName.innerHTML = beerData[0].name
    const beerImage = document.querySelector(".beer-image-info")
    if(beerData[0].image_url == null){
        beerImage.src = "/assets/missing.png"
    } else{
        beerImage.src = beerData[0].image_url
    }
    const descriptionItem = document.createElement("p")
    descriptionItem.innerHTML = beerData[0].description
    document.querySelector(".description").append(descriptionItem)
    const sortBeerData = await renderListInfo(beerData)

    for(let i = 0; i < sortBeerData.length; i++){
        const newListItem = document.createElement("li")
        if(i == 0){
            newListItem.innerHTML = `Alcohol by volume: ${sortBeerData[i]}` 
        }else if(i == 1){
            newListItem.innerHTML = `Volume: ${sortBeerData[i].value} ${sortBeerData[i].unit}` 
        }else if(i == 2){
            const newUnorderedList = document.createElement("ul")
            newUnorderedList.innerHTML = "Ingredients: "
            const newingredientsItem = document.createElement("li")
            newingredientsItem.innerHTML = "Hops: "
            newUnorderedList.append(newingredientsItem)
            const hopsArray = sortBeerData[i].hops
            hopsArray.forEach(hops => {
                const newHopsItem = document.createElement("li")
                newHopsItem.innerHTML = hops.name
                newUnorderedList.append(newHopsItem)
            });
            newListItem.append(newUnorderedList)
        }        
        document.querySelector(".beer-info").append(newListItem)
    }
}

async function renderRandomBeer(beerData){
    renderRandomInfo(beerData)
    renderListInfo(beerData)
    const beerImage = document.querySelector(".beer-image")
    if(beerData[0].image_url == null){
        beerImage.src = "/assets/missing.png"
    } else{
        beerImage.src = beerData[0].image_url
    }
    const beerName = document.querySelector(".beer-name")
    beerName.innerHTML = beerData[0].name
}

//// HÄMTA INFO FOR SEARCH PAGE / SEARCH FIELD ////
async function searchBeers(beer){
    const searchUrl = `https://api.punkapi.com/v2/beers?beer_name=${beer}`
    const searchInfo = await fetch(searchUrl)
    const data = await searchInfo.json()
    return data
}

let userInputBeer = ""

function userInput(){
    const inputBeerName = document.querySelector("#beer_name")
    const inputButton = document.querySelector(".search-button")
    inputButton.addEventListener("click", async () =>{
        userInputBeer = inputBeerName.value
        const resBeers = await searchBeers(userInputBeer)
        renderSearchBeers(resBeers)
    })
}

function renderSearchBeers(newBeers){
    const renderBeers = document.querySelector(".search-card-left")
    // console.log(newBeers);
    for (let beer of newBeers){
        const newList = document.createElement("li")
        newList.innerHTML = beer.name
        renderBeers.append(newList)
    }
}
userInput()
