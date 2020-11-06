
const randomBeerUrl = "https://api.punkapi.com/v2/beers/random"

async function getRandomBeer(url){
    const response = await fetch(url)
    const data = await response.json()
    return data
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

async function renderListInfo(beerData){
    let sortBeerData = []
    sortBeerData.push(beerData[0].abv)
    sortBeerData.push(beerData[0].volume)
    sortBeerData.push(beerData[0].ingredients)
    sortBeerData.push(beerData[0].food_pairing)
    sortBeerData.push(beerData[0].brewers_tips)

    console.log(sortBeerData);
    return sortBeerData
}

async function renderIngredients(beerData){

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

    document.querySelector(".beer-info").innerHTML = ""
    document.querySelector(".description").innerHTML = ""
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

   /*  for (let i = 6; i < 12; i++){
        const newListItem = document.createElement("li")
        newListItem.innerHTML = beerData[0][i]
        console.log(beerData[0][i]);
        document.querySelector(".beer-info").append(newListItem)
    } */
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
