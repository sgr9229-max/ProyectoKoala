//AUTOPLAY CARRUSEL

// Auto-play del carrusel
document.addEventListener("DOMContentLoaded", () => {
    let index = 1;
    const totalSlides = 4; // Cambia si se agregan más imágenes, en este caso solo hay 4

setInterval(() => {
    const radio = document.getElementById("slide" + index);
        if (radio) {
        radio.checked = true;
        }
    index++;
        if (index > totalSlides) index = 1;
        }, 5000); // Cambia cada 5 segundos
});
