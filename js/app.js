document.addEventListener("DOMContentLoaded", function () {
    const infoWindow = document.getElementById('infoWindow')
    const infoWindowContent = document.getElementById('infoWindowContent')
    let organizationName;
    let organizationId;
    const NameAndId = []
    async function getName() {
        const resonseWithName = await fetch('js/organizations.json');
        const dataWithName = await resonseWithName.json();
        const organizationsIdAndName = dataWithName.Organizations;

        for (let i = 0; i < organizationsIdAndName.length; i++) {
            const id = organizationsIdAndName[i].Id;
            const name = organizationsIdAndName[i].Name;
            NameAndId.push({
                id: id,
                name: name
            });

        }
    }

    getName();

    async function fieldRendering() {
        const responseWithCoordinates = await fetch(' js/coordinates.json');
        const data = await responseWithCoordinates.json();
        const coordinates = JSON.parse(data[0].Location);
        const latitude = coordinates.Center[0];
        const longitude = coordinates.Center[1];
        organizationId = data[0].OrganizationId;
        const map = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'OpenStreetMap',
            maxZoom: 18,
        }).addTo(map);
        const polygon = L.polygon(coordinates.Polygon).addTo(map);
        const marker = L.marker([latitude, longitude], {
            icon: markIco
        }).addTo(map);
        let b = NameAndId.find(item => {
            if (item.id === organizationId) {
                return true
            }
        })
        marker.on('click', function () {

            infoWindow.style.display = "flex";

            infoWindowContent.innerHTML = b.name;
        })
        const closeButton = document.querySelector('.btn-close');

        closeButton.addEventListener('click', function () {
            infoWindow.style.display = "none";
        });
    }

    fieldRendering();
    const markIco = L.divIcon({
        html: '92',
        className: 'marker',
        iconSize: [21, 24]

    });
})