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
        document.getElementById("ubicacion").innerText = "¡Gracias! Este espacio ha sido registrado:)";
    })
    .catch(error => {
        document.getElementById("ubicacion").innerText = "Error enviando la ubicación: " + error.message;
    });
}

mapboxgl.accessToken = 'pk.eyJ1IjoiYW9ncDE5NzUiLCJhIjoiY2wxa3pjb3l2MDVyMTNpb2IyamE2MDd6aiJ9.KPEZMDwX23m8T1kv00Df_g';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/aogp1975/cl272mur3002314nwa4tjlp1g',
        center: [-99.505968, 19.288687],
        zoom: 12
    });

    map.on('load', function () {
        // Cargar imagen ANTES de agregar capas
        map.loadImage('https://cdn.glitch.global/74cdea08-eedd-447b-b9f5-de3a59867dbf/star.png?v=1741310640806', function (error, image) {
            if (error) {
                console.error('Error al cargar la imagen:', error);
                return;
            }
            map.addImage('star', image);

            // Obtener archivo GeoJSON
            fetch('https://geojson-stickers-backend.glitch.me/stickers.geojson')
                .then(response => response.json())
                .then(data => {
                    console.log('GeoJSON cargado:', data); // Verificar si el archivo se carga

                    map.addSource('stickers', {
                        type: 'geojson',
                        data: data
                    });


                    // Capa de puntos interactivos
                    map.addLayer({
                        id: 'stickers-layer',
                        type: 'symbol',
                        source: 'stickers',
                        minzoom: 14, // Aparecen cuando el usuario hace zoom
                        layout: {
                            'icon-image': 'star',
                            'icon-size': 0.04
                        }
                    });
                })
                .catch(error => console.error('Error al cargar GeoJSON:', error));
        });
    });
