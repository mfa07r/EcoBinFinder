// =========================================
// EcoBin Finder
// =========================================

// Create map
const map = L.map("map").setView([1.3521, 103.8198], 11);

// OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

let userMarker;
let recyclingBins = [];
let nearestMarkers = [];

// =========================================
// Calculate distance (km)
// =========================================
function distance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// =========================================
// Load GeoJSON
// =========================================

fetch("EwasteRecyclingGEOJSON.geojson")
.then(response => response.json())
.then(data => {

    L.geoJSON(data, {

        onEachFeature: function(feature, layer) {

            const p = feature.properties;

            recyclingBins.push({

                name: p.NAME,
                lat: feature.geometry.coordinates[1],
                lng: feature.geometry.coordinates[0],
                address: p.ADDRESSSTREETNAME,
                description: p.DESCRIPTION,
                access: p.ACCESSRESTRICTION,
                website: p.HYPERLINK.split(";")[0].trim(),
                layer: layer

            });

            layer.bindPopup(`
                <b>${p.NAME}</b><br>
                ${p.ADDRESSSTREETNAME}
            `);

            layer.on("click", () => {

                document.getElementById("info").innerHTML = `

                    <h2>${p.NAME}</h2>

                    <p><strong>📍 Address</strong><br>
                    ${p.ADDRESSSTREETNAME}</p>

                    <p><strong>♻️ Accepted Items</strong><br>
                    ${p.DESCRIPTION}</p>

                    <p><strong>🚪 Access</strong><br>
                    ${p.ACCESSRESTRICTION}</p>

                    <a href="${p.HYPERLINK.split(";")[0].trim()}"
                    target="_blank">

                    🧭 Get Directions

                    </a>

                `;

            });

        }

    }).addTo(map);

});

// =========================================
// GPS Button
// =========================================

document.getElementById("locateBtn")

.addEventListener("click", () => {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(showLocation);

});

// =========================================
// Show User Location
// =========================================

function showLocation(position) {

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    map.setView([lat, lng], 15);

    if (userMarker) {

        map.removeLayer(userMarker);

    }

    userMarker = L.marker([lat, lng])

        .addTo(map)

        .bindPopup("📍 You are here")

        .openPopup();

    // Remove previous highlighted markers

    nearestMarkers.forEach(marker => {

        map.removeLayer(marker);

    });

    nearestMarkers = [];

    // =====================================
    // Find nearest bins
    // =====================================

    const nearest = recyclingBins

        .map(bin => ({

            ...bin,

            distance: distance(lat, lng, bin.lat, bin.lng)

        }))

        .sort((a, b) => a.distance - b.distance)

        .slice(0, 3);

    // =====================================
    // Update nearest list
    // =====================================

    const list = document.getElementById("nearestList");

    list.innerHTML = "";

    const medals = ["🥇", "🥈", "🥉"];

    const bounds = [];

    bounds.push([lat, lng]);

    nearest.forEach((bin, index) => {

        list.innerHTML += `

            <li>

                ${medals[index]}

                <strong>${bin.name}</strong>

                <br>

                📍 ${bin.distance.toFixed(2)} km away

            </li>

        `;

        // Highlight nearest bins

        const marker = L.circleMarker([bin.lat, bin.lng], {

            radius: 12,

            color: "#FFD700",

            fillColor: "#FFD700",

            fillOpacity: 0.8

        }).addTo(map);

        marker.bindPopup(bin.name);

        nearestMarkers.push(marker);

        bounds.push([bin.lat, bin.lng]);

    });

    // Zoom to include user and nearest bins

    map.fitBounds(bounds, {

        padding: [60, 60]

    });

    // Automatically show nearest bin information

    if (nearest.length > 0) {

        const first = nearest[0];

        document.getElementById("info").innerHTML = `

            <h2>${first.name}</h2>

            <p><strong>📍 Address</strong><br>

            ${first.address}</p>

            <p><strong>♻️ Accepted Items</strong><br>

            ${first.description}</p>

            <p><strong>🚪 Access</strong><br>

            ${first.access}</p>

            <a href="https://www.google.com/maps/dir/${lat},${lng}/${first.lat},${first.lng}"

            target="_blank">

            🧭 Get Directions

            </a>

        `;

    }

}
