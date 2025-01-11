// Album data with image paths
const albums = [
  {
      id: 'stockwell-fc',
      title: 'Stockwell FC',
      description: 'Football club photos and memories',
      imageCount: 4,
      imagePaths: [
          '../images/face-paint (2).webp',
          '../images/face-paint (3).webp',
          '../images/face-paint (4).webp',
          '../images/face-paint (5).webp'
          
      ]
  },
  {
      id: 'events-trips',
      title: 'Events and Trips',
      description: 'Various events and excursions',
      imageCount: 10,
      imagePaths: [
          '../images/232.webp',
          '../images/191.webp',
          '../images/317.webp',
          '../images/544.webp',
          '../images/554.webp',
          '../images/574.webp',
          '../images/581.webp',
          '../images/787.webp',
          '../images/864.webp',
          '../images/93.webp'
          
      ]
  },
  {
      id: 'supplementary-school',
      title: 'Supplementary School',
      description: 'Educational activities and achievements',
      imageCount: 10,
      imagePaths: [
          '../images/ROA.webp',
          '../images/ROA1.webp',
          '../images/ROA2.webp',
          '../images/ROA3.webp',
          '../images/ROA4.webp',
          '../images/ROA5.webp',
          '../images/ROA7.jpg',
          '../images/ROA8.jpg',
          '../images/ROA10.jpg'
          
      ]
  }
];

let currentAlbum = null;
let currentImageIndex = 0;

// Lightbox functions
function openLightbox(albumId, imageIndex) {
  currentAlbum = albums.find(a => a.id === albumId);
  currentImageIndex = imageIndex;
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  lightboxImg.src = currentAlbum.imagePaths[currentImageIndex];
  lightboxImg.alt = `${currentAlbum.title} photo ${currentImageIndex + 1}`;
  lightbox.classList.add('active');

  // Add keyboard navigation
  document.addEventListener('keydown', handleKeyPress);
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.removeEventListener('keydown', handleKeyPress);
}

function navigateImage(direction) {
  currentImageIndex = (currentImageIndex + direction + currentAlbum.imagePaths.length) % currentAlbum.imagePaths.length;
  const lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.src = currentAlbum.imagePaths[currentImageIndex];
  lightboxImg.alt = `${currentAlbum.title} photo ${currentImageIndex + 1}`;
}

function handleKeyPress(e) {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateImage(-1);
  if (e.key === 'ArrowRight') navigateImage(1);
}

// Show specific album
function showAlbum(albumId) {
  const album = albums.find(a => a.id === albumId);
  const albumView = document.getElementById('albumView');
  const albumsGrid = document.getElementById('albumsGrid');
  const albumTitle = document.getElementById('albumTitle');
  const photosGrid = document.getElementById('photosGrid');
  
  albumTitle.textContent = album.title;
  photosGrid.innerHTML = album.imagePaths.map((imagePath, index) => `
      <div class="photo-item" onclick="openLightbox('${albumId}', ${index})">
          <img src="${imagePath}" alt="${album.title} photo ${index + 1}">
      </div>
  `).join('');
  
  albumsGrid.style.display = 'none';
  albumView.style.display = 'block';
}

// Show albums grid
function showAlbums() {
  const albumView = document.getElementById('albumView');
  const albumsGrid = document.getElementById('albumsGrid');
  
  albumView.style.display = 'none';
  albumsGrid.style.display = 'grid';
}

// Create album cards
function createAlbumCards() {
  const albumsGrid = document.getElementById('albumsGrid');
  albumsGrid.innerHTML = albums.map(album => `
      <div class="card" onclick="showAlbum('${album.id}')">
          <div class="card-content">
              <div class="thumbnail">
                  <svg class="camera-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                           d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z">
                      </path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                           d="M15 13a3 3 0 11-6 0 3 3 0 016 0z">
                      </path>
                  </svg>
              </div>
              <div class="text-center">
                  <h3 class="album-title">${album.title}</h3>
                  <p class="album-description">${album.description}</p>
                  <p class="photo-count">${album.imageCount} photos</p>
              </div>
          </div>
      </div>
  `).join('');
}

// Initialize gallery
document.addEventListener('DOMContentLoaded', createAlbumCards);
