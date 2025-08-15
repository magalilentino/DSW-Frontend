const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const imgs = document.querySelectorAll('.lightbox-img');

imgs.forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightbox.style.display = 'flex';
  });
});

// Cerrar al hacer clic fuera de la imagen
lightbox.addEventListener('click', (e) => {
  if(e.target !== lightboxImg) {
    lightbox.style.display = 'none';
  }
});