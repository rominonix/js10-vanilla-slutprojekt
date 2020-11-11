//// HÄMTA INFO AV RANDOM BEER ////

const randomBeerUrl = "https://api.punkapi.com/v2/beers/random"

async function getRandomBeer(url){
    const response = await fetch(url)
    const data = await response.json()
    return data[0]
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

/* const moreInfoButton = document.querySelector(".more-info-button")
const homePage = document.querySelector(".home")
const beerInfoPage = document.querySelector(".info")
moreInfoButton.addEventListener("click", function(){
    homePage.classList.remove("active")
    beerInfoPage.classList.add("active")
}) */

const randomBeerButton = document.querySelector(".random-button")
randomBeerButton.addEventListener("click", loadBeer)

async function loadBeer(){
    const beerData = await getRandomBeer(randomBeerUrl)
    renderRandomBeer(beerData)   
}

//// KÖR DENNA FÖR ATT FÅ UPP EN RANDOM ÖL NÄR MAN ÖPPNAR SIDAN ////
loadBeer()

//// MORE INFO KNAPPEN OCH LESS INFO KNAPPEN ////
    // går att göra med en loop som med nav-knapparna //

const moreInfoButton = document.querySelector(".more-info-button")
const homeCard = document.querySelector(".home-card")
const infoCard = document.querySelector(".info-card")
moreInfoButton.addEventListener("click", function(){
    homeCard.classList.remove("active")
    infoCard.classList.add("active")
})

const lessInfoButton = document.querySelector(".less-info-button")
lessInfoButton.addEventListener("click", function(){
    infoCard.classList.remove("active")
    homeCard.classList.add("active")
})

//// ASYNC FUNCTIONS ////

async function renderListInfo(beerData){
    let sortBeerData = []
    sortBeerData.push(beerData.abv)
    sortBeerData.push(beerData.volume)
    sortBeerData.push(beerData.ingredients)
    return sortBeerData
}

async function renderRandomInfo(beerData){

    const descriptionDiv = document.querySelector(".description-text")
    descriptionDiv.innerHTML = ""
    const descriptionItem = document.createElement("p")
    descriptionItem.innerHTML = beerData.description
    descriptionDiv.append(descriptionItem)

    const brewersTipsDiv = document.querySelector(".brewers-tips-text")
    brewersTipsDiv.innerHTML = ""
    const brewersItem = document.createElement("p")
    brewersItem.innerHTML = beerData.brewers_tips
    brewersTipsDiv.append(brewersItem)
    
    const foodPairingList = document.querySelector(".food-pairing-list")
    foodPairingList.innerHTML = ""
    const foodArray = beerData.food_pairing
    foodArray.forEach(foodItem => {
        const newListItem = document.createElement("li")
        newListItem.innerHTML = foodItem
        foodPairingList.append(newListItem)
    });
    
    document.querySelector(".info-list").innerHTML = ""
    const sortBeerData = await renderListInfo(beerData)
        console.log(sortBeerData);

    for(let i = 0; i < sortBeerData.length; i++){
        const newListItem = document.createElement("li")
        if(i == 0){
            newListItem.innerHTML = `Alcohol by volume: ${sortBeerData[i]}` 
        }else if(i == 1){
            newListItem.innerHTML = `Volume: ${sortBeerData[i].value} ${sortBeerData[i].unit}` 
        }else if(i == 2){
            newListItem.innerHTML = "Ingredients: "
            const ingredients = sortBeerData[i]
            console.log(ingredients);

            for (const property in ingredients) {
                if(typeof(ingredients[property]) == "object") {
                    const newUnorderedList = document.createElement("ul")
                    newUnorderedList.innerHTML = `${property}: `

                    const ingredientArray = ingredients[property]
                    
                    ingredientArray.forEach(element => {
                        const newListItem = document.createElement("li")
                        newListItem.innerHTML = element.name
                        newUnorderedList.append(newListItem)
                    });
                    newListItem.append(newUnorderedList)

                }else{
                    const anotherListItem = document.createElement("li")
                    anotherListItem.innerHTML = `${property}: ${ingredients[property]}`
                    newListItem.append(anotherListItem) 
                }
            }
        }          
        document.querySelector(".info-list").append(newListItem)
    }
}

async function renderRandomBeer(beerData){
    renderRandomInfo(beerData)

    const beerImages = document.querySelectorAll(".beer-img")
    for (const image of beerImages) {
        if(beerData.image_url == null){
            image.src = "/assets/missing.png"
        } else{
            image.src = beerData.image_url
        }
    }

    const beerNames = document.querySelectorAll(".beer-name")
    for (const beerName of beerNames) {
        beerName.innerHTML = beerData.name
    }

    const tagline = document.querySelector(".tagline")
    tagline.innerHTML = beerData.tagline
}

//// HÄMTA INFO FOR SEARCH PAGE / SEARCH FIELD ////

let userInputBeer = ""
let pages = 1

async function searchBeers(beer){
    const searchUrl = `https://api.punkapi.com/v2/beers?beer_name=${beer}&page=${pages}&per_page=10`
    const searchInfo = await fetch(searchUrl)
    const data = await searchInfo.json()
    return data
}

function userInput(){
    const inputBeerName = document.querySelector("#beer_name")
    const inputButton = document.querySelector(".search-button")
    const nextPrev = document.querySelector(".pagination")
    nextPrev.classList.add("hidden")
    inputButton.addEventListener("click", async () =>{
        userInputBeer = inputBeerName.value
        const resBeers = await searchBeers(userInputBeer)
        renderSearchBeers(resBeers)
        inputBeerName.value = ""
        nextPrev.classList.remove("hidden")
    })
    // renderSearchBeers(newList)
    // hideBeerList()
}

function renderSearchBeers(newBeers){
    const renderBeers = document.querySelector(".search-card-left")
    for (let beer of newBeers){
        const newList = document.createElement("li")
        newList.classList.add("beer-list", "clear") // relaterad till hideBeerList()
        newList.innerHTML = beer.name
        renderBeers.append(newList)
    }    
}

function nextPrevButtons(){
    const nextPreviousBeers = userInput()
    const prev = document.querySelector(".prev")
    prev.addEventListener("click", async () => {
        hideBeerList()
        if(pages > 1){
            pages--;  
        }
        const resBeers = await searchBeers(userInputBeer)
        renderSearchBeers(resBeers)
    })  
    
    const next = document.querySelector(".next")
    const nextPage = document.querySelector(".pages")
    next.addEventListener("click",async () => {
        hideBeerList()
        // if(pages < 9){ // här skriva nån villkor för att next button vissas inte när arrayen har mindre 9 elementet
            pages++; 
        // } 
        const resBeers = await searchBeers(userInputBeer)
        renderSearchBeers(resBeers)
    })         
}
nextPrevButtons()

function hideBeerList(){
    const details = document.querySelectorAll(".clear")
    for(let currentInfo of details){
        currentInfo.classList.add("hidden")
    }
}
