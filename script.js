// Create the map centred on Singapore
const map = L.map('map').setView([1.3521, 103.8198], 11);
let recyclingBins = [];
// OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let userMarker;

// ---------------------
// GPS BUTTON
// ---------------------

const locateBtn = document.getElementById("locateBtn");

locateBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported.");
        return;
    }

    navigator.geolocation.getCurrentPosition(showLocation);

});

function showLocation(position){

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    map.setView([lat,lng],15);

    if(userMarker){
        map.removeLayer(userMarker);
    }

    userMarker = L.marker([lat,lng])
        .addTo(map)
        .bindPopup("📍 You are here")
        .openPopup();

}

// ---------------------
// LOAD OFFICIAL GEOJSON
// ---------------------

fetch("EwasteRecyclingGEOJSON.geojson")
.then(response => response.json())
.then(data => {

    L.geoJSON(data, {

        onEachFeature: function(feature, layer){

            const p = feature.properties;

            const info = `
                <b>${p.NAME}</b><br><br>

                <b>Address:</b><br>
                ${p.ADDRESSSTREETNAME}<br><br>

                <b>Description:</b><br>
                ${p.DESCRIPTION}
            `;

            layer.bindPopup(info);

            layer.on("click", () => {

                document.getElementById("info").innerHTML = `
                    <h2>${p.NAME}</h2>

                    <p><strong>Address:</strong><br>
                    ${p.ADDRESSSTREETNAME}</p>

                    <p><strong>Description:</strong><br>
                    ${p.DESCRIPTION}</p>

                    <p><strong>Access:</strong><br>
                    ${p.ACCESSRESTRICTION}</p>

                    <a href="${p.HYPERLINK.split(";")[0].trim()}"
                       target="_blank">
                       Visit Website
                    </a>

                `;

            });

        }

    }).addTo(map);

});
