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
            const infoCard = document.querySelector(".info-card")
            infoCard.classList.remove("active")
            document.querySelectorAll("main > section").forEach(
                section => section.classList.remove("active")
            )
            const section = document.querySelector("." + link.id)
            section.classList.add("active")
            const homeCard = document.querySelector(".home-card")
            homeCard.classList.add("active")
        })
    }
}
navLinks()

//// BUTTONS HOME SIDA ////

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

//// ASYNC FUNCTIONS RANDOM BEER ////

async function renderListInfo(beerData){
    let sortBeerData = []
    sortBeerData.push(beerData.abv)
    sortBeerData.push(beerData.volume)
    sortBeerData.push(beerData.ingredients)
    return sortBeerData
}

async function renderRandomInfo(beerData){
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
    const beerName = document.querySelector(".beer-name")
    beerName.innerHTML = beerData.name

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
    const tagline = document.querySelector(".tagline")
    tagline.innerHTML = beerData.tagline

}

//// HÄMTA INFO FOR SEARCH PAGE / SEARCH FIELD ////

let userInputBeer = ""
let pages = 1
let currentlySelectedBeer = {}

async function searchBeers(beer){
    const searchUrl = `https://api.punkapi.com/v2/beers?beer_name=${beer}&page=${pages}&per_page=10`
    const searchInfo = await fetch(searchUrl)
    const data = await searchInfo.json()
    return data
}

function userInput(){
    // const beer_name = searchBeers(beer)
    const inputBeerName = document.querySelector("#beer_name")
    const inputButton = document.querySelector(".search-button")
    const nextPrev = document.querySelector(".pagination")
    const errorMsn = document.querySelector(".form-message")
    const errorMsn1 = document.querySelector(".form-message-1")
    nextPrev.classList.add("hidden")
    inputButton.addEventListener("click", async () =>{
        hideBeerList()
        userInputBeer = inputBeerName.value
        if(userInputBeer.length < 3 || userInputBeer.length == "" ){
            errorMsn.classList.remove("hidden")
            errorMsn1.classList.add("hidden")
            // renderBeersList(newBeers)
        }else if(userInputBeer.length > 10){
            errorMsn1.classList.remove("hidden")
            errorMsn.classList.add("hidden")
            // renderBeersList(newBeers)
        }
        // else if(userInputBeer != beer.name){
        //     console.log("holi");
        // }
        
        else{
            errorMsn.classList.add("hidden")
        }
        const resBeers = await searchBeers(userInputBeer)
        renderBeersList(resBeers)
        inputBeerName.value = "" // har finns el problema poner un if 
        nextPrev.classList.remove("hidden")
    })
}

function renderBeersList(newBeers){
    const renderBeers = document.querySelector(".search-beer-list")
    for (let beer of newBeers){
        const newList = document.createElement("li")
        const moreInfoButton = document.querySelector(".info-button")
        newList.classList.add("beer-list", "clear")
        newList.addEventListener("click", () => {
            moreInfoButton.classList.remove("hidden")
            const resultImg = document.querySelector(".img-info")
            const resultName = document.querySelector(".name-info")
            if(beer.image_url == null){
                resultImg.src = "/assets/missing.png"
            } else {
                resultImg.src = beer.image_url
            }
            resultName.innerText = beer.name
            const resultDes = document.querySelector(".description-info")
            resultDes.innerText = beer.description
            currentlySelectedBeer = beer
        })
        newList.innerHTML = beer.name
        renderBeers.append(newList)   
    }    
}

function moreInfoSearchSection(){
    const moreInfoBeer = document.querySelector(".info-button")
    const searchPage = document.querySelector(".search")
    const infoCardSearch = document.querySelector(".info-card")
    moreInfoBeer.addEventListener("click", function(){
        renderRandomInfo(currentlySelectedBeer)
        const homeSec = document.querySelector(".home")
        homeSec.classList.add("active")
        const searchSec = document.querySelector(".search")
        searchSec.classList.remove("active")
        homeCard.classList.remove("active")
        infoCard.classList.add("active") 
    })
}
moreInfoSearchSection()

function nextPrevButtons(){
    const nextPreviousBeers = userInput()
    const prev = document.querySelector(".prev")
    prev.addEventListener("click", async () => {
        hideBeerList()
        if(pages > 1){
            pages--;  
        }
        const resBeers = await searchBeers(userInputBeer)
        renderBeersList(resBeers)
        const felMess = document.querySelector(".fel-mess")
        felMess.classList.add("hidden")
    })  
    
    const next = document.querySelector(".next")
    const nextPage = document.querySelector(".pages")
    next.addEventListener("click",async () => {
        hideBeerList()
        pages++;
        const resBeers = await searchBeers(userInputBeer)
        renderBeersList(resBeers)
        if(resBeers.length === 0){
            const felMess = document.querySelector(".fel-mess")
            felMess.classList.remove("hidden")
            felMess.innerText = "No more results"
            hideBeerList()
            pages--;
        } 

    })           
}
nextPrevButtons()

function hideBeerList(){
    const details = document.querySelectorAll(".clear")
    for(let currentInfo of details){
        currentInfo.classList.add("hidden")
    }
}

