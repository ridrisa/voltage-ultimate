/**
 * VOLTAGE BRIGHT - Gallery Page Scripts
 * Extracted from gallery.html for centralized JS management
 */

// Current lightbox state
let currentImages = [];
let currentIndex = 0;

// Initialize gallery
function initGallery() {
    // Load images dynamically from file system paths
    loadProjectImages();

    // Setup filters
    setupFilters();

    // Setup lightbox
    setupLightbox();
}

// Load images for projects that have hardcoded paths
function loadProjectImages() {
    Object.keys(projectImages).forEach(projectId => {
        const grid = document.getElementById(`grid-${projectId}`);
        if (!grid) return;

        const images = projectImages[projectId];

        if (images.length === 0) {
            // Show placeholder for projects that need dynamic loading
            grid.innerHTML = '<p class="gallery-loading-message">جاري تحميل الصور...</p>';
            return;
        }

        images.forEach((src, index) => {
            const item = createImageItem(src, index, projectId);
            grid.appendChild(item);
        });
    });
}

// Create image item element
function createImageItem(src, index, projectId) {
    const item = document.createElement('div');
    item.className = 'image-item loading';
    item.dataset.index = index;
    item.dataset.project = projectId;

    item.innerHTML = `
        <img src="${src}" alt="صورة المشروع" loading="lazy">
        <div class="image-overlay">
            <div class="zoom-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                    <path d="M11 8v6M8 11h6"/>
                </svg>
            </div>
        </div>
    `;

    // Handle image load
    const img = item.querySelector('img');
    img.onload = () => item.classList.remove('loading');
    img.onerror = () => {
        item.style.display = 'none';
    };

    // Click to open lightbox
    item.addEventListener('click', () => {
        openLightbox(projectId, index);
    });

    return item;
}

// Setup category filters
function setupFilters() {
    const filterBtns = document.querySelectorAll('.category-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            const sections = document.querySelectorAll('.project-section');

            sections.forEach(section => {
                if (filter === 'all') {
                    section.classList.remove('hidden');
                } else {
                    if (section.dataset.category === filter) {
                        section.classList.remove('hidden');
                    } else {
                        section.classList.add('hidden');
                    }
                }
            });
        });
    });
}

// Lightbox functionality
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(1); // RTL
        if (e.key === 'ArrowRight') navigateLightbox(-1); // RTL
    });
}

function openLightbox(projectId, index) {
    currentImages = projectImages[projectId] || [];
    currentIndex = index;

    if (currentImages.length === 0) return;

    updateLightboxImage();
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = currentImages.length - 1;
    if (currentIndex >= currentImages.length) currentIndex = 0;
    updateLightboxImage();
}

function updateLightboxImage() {
    const img = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');

    img.src = currentImages[currentIndex];
    counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initGallery);
