function obtUbi() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                let lat = pos.coords.latitude;
                let lon = pos.coords.longitude;
                document.getElementById("ubicacion").innerText = `Latitud: ${lat}, Longitud: ${lon}`;
            },
            (error) => {
                document.getElementById("ubicacion").innerText = "Error al obtener la ubicación: " + error.message;
            }
        );
    } else {
        document.getElementById("ubicacion").innerText = "Tu nav no soportó.";
    }
}