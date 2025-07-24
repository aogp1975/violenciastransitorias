window.addEventListener("DOMContentLoaded", function () {
  const popupin = document.getElementById("popinicio");
  popupin.style.display = "flex";
});

document.getElementById("tiposticker").addEventListener("change", function () {
  const tipo = this.value;
  const form = document.getElementById("formtestimonio");
  if (tipo === "zona_acoso") {
    form.classList.remove("hidewin");
  } else {
    form.classList.add("hidewin");
  }
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

      let testimonio = null;
      if (tipo === 'zona_acoso') {
        testimonio = {
          q_sucedio: document.getElementById("q_uno").value,
          q_hora: document.getElementById("q_dos").value,
          q_sent: document.getElementById("q_tres").value,
          q_cambios: document.getElementById("q_cuatro").value,
          q_espacio: document.getElementById("q_cinco").value
        };
      }
  

      document.getElementById("result").innerText = `Ubicación registrada`;

      fetch("https://backend-vt.onrender.com/guardar_ubi", {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lat: lat, 
          lng: lon,
          type: tipo,
          testimonio: testimonio
        })
      })
      .then(res => {
        if (!res.ok) {
          throw new Error("Error en la solicitud al backend");
        }
        return res.json();
    })
    .then(data => {
      console.log("punto registrado:", data);
    })
    .catch(err => {
      console.error("Error al registrar", err);
      document.getElementById("result").innerText= `Hubo un error`;
    });
  }); 
} else {
  document.getElementById("result").innerText = "La feo no es coms";
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
    

      fetch('https://backend-vt.onrender.com/creageojson')
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
          
          appfiltro(map);

          document.getElementById('filtro_acoso').addEventListener('change', () => appfiltro(map));
          document.getElementById('filtro_pasamos').addEventListener('change', () => appfiltro(map));

          ['zona_acoso-layer', 'por_aqui-layer'].forEach(layerId => {
            map.on('click', layerId, (e) => {
              const coords = e.features [0].geometry.coordinates.slice();
              const props = e.features[0].properties;

              let contenido = ''; 
              if (props.tipo === 'zona_acoso' && props.testimonio) {
                let t;
                try {
                  t= typeof props.testimonio === 'string' ? JSON.parse(props.testimonio) : props.testimonio;
                } catch (e) {
                  t = null;
                }
                if (t) {
                contenido =`
                  <strong>¿Qué sucedió?</strong><br>${t.q_sucedio}<br><br>
                  <strong>¿Qué hora era?</strong><br>${t.q_hora}<br><br>
                  <strong>¿Qué sentiste?</strong><br>${t.q_sent}<br><br>
                  <strong>¿Cambiaste tus rutinas, rutas, vestimenta, etc?</strong><br>${t.q_cambios}<br><br>
                  <strong>¿Cómo te sientes en el espacio público?</strong><br>${t.q_espacio}`;
              } else {
                contenido = 'Sticker colocado, aquí también pasamos. Visita el repositorio visual en Instagram @violenciastransitorias';
              }
            }

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

function appfiltro(map) {
  const mostraracos = document.getElementById('filtro_acoso').checked;
  const mostrarpas = document.getElementById('filtro_pasamos').checked;

  map.setLayoutProperty('zona_acoso-layer', 'visibility', mostraracos ? 'visible' : 'none');
  map.setLayoutProperty('por_aqui-layer', 'visibility', mostrarpas ? 'visible' : 'none');
}
  

