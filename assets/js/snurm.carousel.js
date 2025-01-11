
// Album data with image paths
const albums = [
    {
        id: 'stockwell-fc',
        title: 'Stockwell FC',
        description: 'Football club photos and memories',
        imageCount: 4,
        imagePaths: [
            'images/face-paint (2).webp',
            'images/face-paint (3).webp',
            'images/face-paint (4).webp',
            'images/face-paint (5).webp'
        ]
    },
    {
        id: 'events-trips',
        title: 'Events and Trips',
        description: 'Various events and excursions',
        imageCount: 10,
        imagePaths: [
            'images/232.webp',
            'images/191.webp',
            'images/317.webp',
            'images/544.webp',
            'images/554.webp',
            'images/574.webp',
            'images/581.webp',
            'images/787.webp',
            'images/864.webp',
            'images/93.webp'
        ]
    },
    {
        id: 'supplementary-school',
        title: 'Supplementary School',
        description: 'Educational activities and achievements',
        imageCount: 10,
        imagePaths: [
            'images/ROA.webp',
            'images/ROA1.webp',
            'images/ROA2.webp',
            'images/ROA3.webp',
            'images/ROA4.webp',
            'images/ROA5.webp',
            'images/ROA7.jpg',
            'images/ROA8.jpg',
            'images/ROA10.jpg'
        ]
    }
];

// State management
let currentAlbum = null;
let currentImageIndex = 0;

// Helper function to get correct image path for GitHub Pages
function getImagePath(path) {
    return `${REPO_PATH}/${path}`;
}

// Lightbox functions
function openLightbox(albumId, imageIndex) {
    currentAlbum = albums.find(a => a.id === albumId);
    currentImageIndex = imageIndex;
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const count = document.getElementById('image-count');
    
    if (!lightbox || !lightboxImg || !count) {
        console.error('Required lightbox elements not found');
        return;
    }
    
    // Set image source with proper path
    lightboxImg.src = getImagePath(currentAlbum.imagePaths[currentImageIndex]);
    lightboxImg.alt = `${currentAlbum.title} photo ${currentImageIndex + 1}`;
    
    // Update image counter
    count.textContent = `${currentImageIndex + 1} / ${currentAlbum.imagePaths.length}`;
    
    // Show lightbox
    lightbox.classList.add('active');
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
    document.removeEventListener('keydown', handleKeyPress);
}

function navigateImage(direction) {
    if (!currentAlbum) return;
    
    currentImageIndex = (currentImageIndex + direction + currentAlbum.imagePaths.length) % currentAlbum.imagePaths.length;
    
    const lightboxImg = document.getElementById('lightbox-img');
    const count = document.getElementById('image-count');
    
    if (!lightboxImg || !count) return;
    
    lightboxImg.src = getImagePath(currentAlbum.imagePaths[currentImageIndex]);
    lightboxImg.alt = `${currentAlbum.title} photo ${currentImageIndex + 1}`;
    count.textContent = `${currentImageIndex + 1} / ${currentAlbum.imagePaths.length}`;
}

function handleKeyPress(e) {
    switch (e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            navigateImage(-1);
            break;
        case 'ArrowRight':
            navigateImage(1);
            break;
    }
}

// Album view functions
function showAlbum(albumId) {
    const album = albums.find(a => a.id === albumId);
    if (!album) return;
    
    const albumView = document.getElementById('albumView');
    const albumsGrid = document.getElementById('albumsGrid');
    const albumTitle = document.getElementById('albumTitle');
    const photosGrid = document.getElementById('photosGrid');
    
    if (!albumView || !albumsGrid || !albumTitle || !photosGrid) return;
    
    albumTitle.textContent = album.title;
    
    // Create photo grid with proper image paths
    photosGrid.innerHTML = album.imagePaths.map((imagePath, index) => `
        <div class="photo-item" onclick="openLightbox('${albumId}', ${index})">
            <img src="${getImagePath(imagePath)}" 
                 alt="${album.title} photo ${index + 1}"
                 loading="lazy">
        </div>
    `).join('');
    
    albumsGrid.style.display = 'none';
    albumView.style.display = 'block';
}

function showAlbums() {
    const albumView = document.getElementById('albumView');
    const albumsGrid = document.getElementById('albumsGrid');
    
    if (!albumView || !albumsGrid) return;
    
    albumView.style.display = 'none';
    albumsGrid.style.display = 'grid';
}

// Create album cards
function createAlbumCards() {
    const albumsGrid = document.getElementById('albumsGrid');
    if (!albumsGrid) return;
    
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

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createAlbumCards();
    
    // Debug image paths
    console.log('Repository path:', REPO_PATH);
    console.log('Sample image path:', getImagePath(albums[0].imagePaths[0]));
});
