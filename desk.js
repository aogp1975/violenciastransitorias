window.addEventListener("DOMContentLoaded", function () {
  const popupin = document.getElementById("popinicio");
  popupin.style.display = "flex";
});

function toggleLayer (layerId, visible) {
  const visibility = visible ? 'visible' : 'none';
  map.setLayoutProperty(layerId, 'visibility', visibility);
}

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
    map.loadImage('assets/images/icon1.png', function (error, imagepas) {
      if (error) return console.error(error);
      map.addImage('pasamos', imagepas);
    
    map.loadImage('assets/images/acoso.png', function (error, imageacos){
      if (error) return console.error(error);
      map.addImage('acoso', imageacos);
    

      fetch('https://backend-vt.onrender.com/stickers.geojson')
        .then(res => res.json())
        .then(data => {
          map.addSource('stickers', {
            type: 'geojson',
            data: data
          });

          map.addLayer({
            id: 'zona_acoso-layer',
            type: 'symbol',
            source: 'stickers',
            filter: ['==', ['get', 'tipo'], 'zona_acoso'],
            layout: {
              'icon-image': 'acoso',
              'icon-size': 0.05
            }
          });

          map.addLayer({
            id: 'por_aqui-layer',
            type: 'symbol',
            source: 'stickers',
            filter: ['==', ['get', 'tipo'], 'por_aqui'],
            layout: {
              'icon-image': 'pasamos',
              'icon-size': 0.05
            }
          });

          ['zona_acoso-layer', 'por_aqui-layer'].forEach(layerId => {
            map.on('click', layerId, (e) => {
              const coords = e.features [0].geometry.coordinates.slice();
              const imagen = e.features [0].properties.imagen;

              const contenido = imagen 
              ? `<img src="${imagen}" style = "width: 150 px;">`
              : 'Sin imagen';

              new mapboxgl.Popup()
                .setLngLat(coords)
                .setHTML(contenido)
                .addTo(map);
            });
          });
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
  

