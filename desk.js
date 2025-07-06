window.addEventListener("DOMContentLoaded", function () {
  const popupin = document.getElementById("popinicio");
  popupin.style.display = "flex";
});

function cerrarpop() {
  const popupin = document.getElementById('popinicio');
  popupin.style.display = 'none';
}

function opwin(id) {
  document.getElementById(id).classList.remove("hidewin");
}
function cerrarwin(id) {
  document.getElementById(id).classList.add("hidewin");
}
function registrarubi() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const tipo = document.getElementById("tiposticker").value;

      document.getElementById("result").innerText = `Ubicación registrada`;

      fetch("https://backend-vt.onrender.com/guardar_ubi", {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          latitud: lat, 
          longitud: lon,
          tipo: tipo
        })
      });
    });
  }
}

mapboxgl.accessToken = 'pk.eyJ1IjoiYW9ncDE5NzUiLCJhIjoiY2wxa3pjb3l2MDVyMTNpb2IyamE2MDd6aiJ9.KPEZMDwX23m8T1kv00Df_g';

const ubidef = [-99.505968, 19.288687];

function initmap (center, showmarcador = false) {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/aogp1975/cl272mur3002314nwa4tjlp1g',
    center: center,
    zoom: 14
  });

  map.on('load', function () {
    map.loadImage('https://backend-vt.onrender.com/public/pasamos.png', function (error, image) {
      if (error) return console.error(error);
      map.addImage('pasamos', image);

      fetch('https://backend-vt.onrender.com/stickers.geojson')
        .then(res => res.json())
        .then(data => {
          map.addSource('stickers', {
            type: 'geojson',
            data: data
          });

          map.addLayer({
            id: 'stickers-layer',
            type: 'symbol',
            source: 'stickers',
            layout: {
              'icon-image': 'pasamos',
              'icon-size': 0.07
            }
          });

          map.on('click', 'stickers-layer', (e) => {
            const coords = e.features[0].geometry.coordinates.slice();
            const props = e.features[0].properties;
            const imagen = props.imagen;

            const contenido = imagen
            ? `<img src="${imagen}" style="width: 150px; height: auto;">`
            : 'Sin imagen disponible';

            new mapboxgl.Popup()
            .setLngLat(coords)
            .setHTML(contenido)
            .addTo(map);
          });
        });
    });

    if (showmarcador) {
      new mapboxgl.Marker({ color: '#02fb54' })
        .setLngLat(center)
        .setPopup (
          new mapboxgl.Popup({ offset: 30, closeOnClick: true})
            .setHTML('<img src="assets/images/carmap.png" style ="max-width: 20vh;">')
            .addClassName('popmark')
          )
        .addTo(map)
        .togglePopup();
    }
  });
}

navigator.geolocation.getCurrentPosition( 
  (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  initmap([lon, lat], true);
  },
  (error) => {
    console.warn('Ubicación no permitida, se ubica por defecto');
    initmap(ubidef, false);
  }
);
  

