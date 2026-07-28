// Create the map centred on Singapore
const map = L.map('map').setView([1.3521, 103.8198], 11);

// Load OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
