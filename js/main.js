
const randomBeerUrl = "https://api.punkapi.com/v2/beers/random"

async function getRandomBeer(url){
    const response = await fetch(url)
    const data = await response.json()

    return data
}

async function renderRandomBeer(beerData){
    const beerImage = document.querySelector(".beer-image")
    beerImage.src = beerData[0].image_url

    const beerName = document.querySelector(".beer-name")
    beerName.innerHTML = beerData[0].name
}

async function renderRandomInfo(beerData){

}

const moreInfoButton = document.querySelector(".more-info-button")
moreInfoButton.addEventListener("click", function(){
    const beerInfoPage = document.querySelector(".beer-info-page")
    beerInfoPage.classList.add("visible")
})

const randomBeerButton = document.querySelector(".random-button")
randomBeerButton.addEventListener("click", async function(){
    const beerData = await getRandomBeer(randomBeerUrl)
    renderRandomBeer(beerData)
    console.log(beerData);
})
