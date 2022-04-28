// finding users location, will return an array with lattitude, longitude
async function getCoords() {
    let pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [pos.coords.latitude, pos.coords.longitude]
}

// creating location icon 
var myIcon = L.icon({
    iconUrl: "./location-dot-solid.svg",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [-3, -76],
});

// map object with method to create map and create marker 
const myMap = {

        mapCreate(coords) {

            this.map = L.map('map', {
                center: coords,
                zoom: 13
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
                foo: 'bar',
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18,
                tileSize: 512,
                zoomOffset: -1,
            }).addTo(this.map);
        },

        // marker will take parameters based on the business selected 
        createMarker(lat, long, businessName) {
            this.marker = L.marker([lat, long], { icon: myIcon }).addTo(this.map).bindPopup(businessName).openPopup();
        }
    }
    // function to create map
async function createMap2(coordinates) {
    coordinates = await getCoords()

    myMap.mapCreate(coordinates)

    myMap.createMarker(coordinates[0], coordinates[1], "You are here")
}

// getting businesses using foursquare api
async function getBusiness(coordinates) {

    coordinates = await getCoords()

    let business = document.getElementById('business').value

    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'fsq3G51Ky3S4q8gWLSDM+ZuViJSkHSswKNAE8jZ/5FOyB7Q='
        }
    };

    let result = await fetch(`https://api.foursquare.com/v3/places/search?query=${business}&ll=${coordinates}&radius=35000&limit=5`, options)
    let resultObj = await result.json()
        // .then(response => response.json())
        // .then(response => console.log(response))
        // .catch(err => console.error(err));


    // using for loop to search through fetch results. Then save three variables lat, long, and businessName and pass those variables into createmarker to create marker for those businesses on the map 
    for (let i = 0; i < resultObj.results.length; i++) {

        lat = resultObj.results[i].geocodes.main.latitude
        long = resultObj.results[i].geocodes.main.longitude
        businessName = resultObj.results[i].name
        myMap.createMarker(lat, long, businessName)
    }
}

// when button is clicked, map will create markers for business locations
let submitBtn = document.querySelector('button')
submitBtn.addEventListener('click', getBusiness)


// removePrevious will switch onsubmit to true and refresh the page when submit is clicked.
// I did this in order to remove previous markers. please let me know how else i can do this without refreshing! 

// function removePrevious() {
//     let dropdown = document.getElementById('selectMenu')
//     dropdown.onsubmit = true
// }
// turn on this function to remove errors in console

window.onload = createMap2