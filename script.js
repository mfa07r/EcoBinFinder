// Create the map centred on Singapore
const map = L.map('map').setView([1.3521, 103.8198], 11);

// Load OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let userMarker;

// Get the button
const locateBtn = document.getElementById("locateBtn");

// When button is clicked
locateBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(success, error);

});

// Success
function success(position) {

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    // Move the map
    map.setView([lat, lng], 16);

    // Remove old marker
    if (userMarker) {
        map.removeLayer(userMarker);
    }

    // Add marker
    userMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup("📍 You are here!")
        .openPopup();

}

// Error
function error() {
    alert("Unable to get your location. Please allow location access.");
}
