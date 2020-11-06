
const randomBeerUrl = "https://api.punkapi.com/v2/beers/random"

async function getRandomBeer(url){
    const response = await fetch(url)
    const data = await response.json()
    return data
}

async function renderRandomBeer(beerData){
    renderRandomInfo(beerData)
    const beerImage = document.querySelector(".beer-image")
    beerImage.src = beerData[0].image_url
    const beerName = document.querySelector(".beer-name")
    beerName.innerHTML = beerData[0].name
}

// async function renderListInfo(beerData){
//     let sortBeerData = []
//     sortBeerData.push(beerData[0].name)
//     sortBeerData.push(beerData[0].image_url)   
//     sortBeerData.push(beerData[0].description)
//     sortBeerData.push(beerData[0].abv)

// }

async function renderRandomInfo(beerData){
    const beerName = document.querySelector(".beer-name-info")
    beerName.innerHTML = beerData[0].name

    const beerImage = document.querySelector(".beer-image-info")
    beerImage.src = beerData[0].image_url

    document.querySelector(".beer-info").innerHTML = ""
    document.querySelector(".description").innerHTML = ""
    const descriptionItem = document.createElement("p")
    descriptionItem.innerHTML = beerData[0].description

    document.querySelector(".description").append(descriptionItem)

    for (let i = 6; i < 12; i++){
        const newListItem = document.createElement("li")
        newListItem.innerHTML = beerData[0][i]
        console.log(beerData[0][i]);
        document.querySelector(".beer-info").append(newListItem)
    }
}

const moreInfoButton = document.querySelector(".more-info-button")
const beerInfoPage = document.querySelector(".beer-info-page")
moreInfoButton.addEventListener("click", function(){
    hidSection()
    beerInfoPage.classList.add("visible")

})

const randomBeerButton = document.querySelector(".random-button")
randomBeerButton.addEventListener("click", async function(){
    const beerData = await getRandomBeer(randomBeerUrl)
    renderRandomBeer(beerData)
   
})

const homePage = document.querySelector(".landing-page")
const homeButton = document.querySelector(".home-button")
homeButton.addEventListener("click", function(){
    hidSection()
    homePage.classList.add("visible")
})


function hidSection(){
    const allSections = document.querySelectorAll("section")
    for (let section of allSections) {
        section.classList.add("hidden")
        section.classList.remove("visible")
    }
}
