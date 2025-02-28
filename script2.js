function obtUbi() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;


                document.getElementById("ubicacion").innerText = `Ubicación obtenida: Lat ${lat}, Lon ${lon}`;
                
                enviarUbi(lat, lon);
            },
            (error) => {
                document.getElementById("ubicacion").innerText = "Error al obtener la ubicación: " + error.message;
            }
        );
    } else {
        document.getElementById("ubicacion").innerText = "Tu nav no soportó.";
    }
}

function enviarUbi(lat, lon) {
    fetch("https://geojson-stickers-backend.glitch.me/guardar_ubi", {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ latitud: lat, longitud: lon})
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("ubicacion").innerText = "Ubicación enviada con éxito";
    })
    .catch(error => {
        document.getElementById("ubicacion").innerText = "Error enviando ubicación: " + error.message;
    });
}