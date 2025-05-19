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

document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".menubt");
    const menu = document.querySelector(".contmenu");

    function abmenu() {
        menu.classList.toggle("active");
    }

    menuButton.addEventListener("click", function (event) {
        abmenu();
        event.stopPropagation();
    });

    document.addEventListener("click", function (event) {
        if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
            menu.classList.remove("active");
        }
    });
    document.addEventListener("touchstart", function (event) {
        if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
            menu.classList.remove("active");
        }
    });
});

let slideActual = 0;
const slides = document.querySelectorAll('.muroa');

const clfondo =['fondo-1', 'fondo-2', 'fondo-3'];

const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');

const muroSection = document.getElementById("muro-section");

const imgflec = [
    {
        prev: "assets/images/flecha1.png",
        next: "assets/images/flecha2.png"
    },
    {
        prev: "assets/images/flecha3.png",
        next: "assets/images/flecha2.png"
    },
    {
        prev: "assets/images/flecha2.png",
        next: "assets/images/flecha1.png"
    }
];

function mostrarSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });

    btnNext.src = imgflec[index].next;
    btnPrev.src = imgflec[index].prev;

    muroSection.classList.remove(...clfondo);
    muroSection.classList.add(clfondo[index]);
}

function siguiente() {
    slideActual = (slideActual + 1) % slides.length;
    mostrarSlide(slideActual);
}

function anterior() {
    slideActual = (slideActual - 1 + slides.length) % slides.length;
    mostrarSlide(slideActual);
}

mostrarSlide(slideActual);


