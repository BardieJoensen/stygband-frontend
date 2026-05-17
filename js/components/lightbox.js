import { BASE_URL } from '../api.js';

let currentIndex = 0;
let photos = [];
let previouslyFocusedElement = null;

function trapFocus(overlay) {
    const focusableElements = overlay.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    overlay.addEventListener('keydown', e => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            // Shift + Tab: moving backwards
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        }

        // Tab: moving forwards
        if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    });
}

export function createLightbox() {
    const overlay = document.createElement('div');
    overlay.classList.add('lightbox-overlay');

    // Build the overlay once and reuse it for all photo selections.
    overlay.innerHTML = `
        <div class="lightbox-content">
            
            <img class="lightbox-image" alt="" loading="lazy"/>
            <div class="lightbox-fallback-overlay">
                <svg viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <line x1="4" y1="4" x2="20" y2="20"/>
                </svg>
            </div>
            <div class="lightbox-meta" aria-live="polite">
                <p class="lightbox-caption"></p>
                <p class="lightbox-photographer"></p>
            </div>
            <button class="lightbox-close" aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>

            <button class="lightbox-prev" aria-label="Previous photo" title="Previous photo">‹</button>
            <button class="lightbox-next" aria-label="Next photo" title="Next photo">›</button>
        </div>
    `;

    document.body.appendChild(overlay);

    // Clicking the dimmed backdrop should close the overlay.
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeLightbox();
    });

    // Wire the controls to the shared lightbox state.
    overlay.querySelector('.lightbox-close')
        .addEventListener('click', closeLightbox);

    overlay.querySelector('.lightbox-prev')
        .addEventListener('click', () => showImage(currentIndex - 1));

    overlay.querySelector('.lightbox-next')
        .addEventListener('click', () => showImage(currentIndex + 1));

    // Track touch position for swipe gesture detection on mobile.
    let startX = 0;

    overlay.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    });

    // Detect horizontal swipes to navigate between photos on touch devices.
    overlay.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;

        // Only register swipes that are at least 50 pixels in distance.
        if (Math.abs(diff) > 50) {
            if (diff < 0) showImage(currentIndex + 1);  // swipe left → next
            else showImage(currentIndex - 1);           // swipe right → prev
        }
    });

    return overlay;
}

export function openLightbox(photoList, index) {
    photos = photoList;
    currentIndex = index;

    const overlay = document.querySelector('.lightbox-overlay');
    
    // Store the element that opened the lightbox (for restoring focus later)
    previouslyFocusedElement = document.activeElement;
    
    overlay.classList.add('active');
    trapFocus(overlay);
    
    // Move focus to the close button (first focusable element)
    overlay.querySelector('.lightbox-close').focus();

    // Show the selected image immediately when the lightbox opens.
    showImage(index);
}

function closeLightbox() {
    document.querySelector('.lightbox-overlay').classList.remove('active');
    
    // Restore focus to the element that opened the lightbox
    if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
    }
}

function showImage(index) {
    if (index < 0) index = photos.length - 1;
    if (index >= photos.length) index = 0;

    currentIndex = index;

    const img = document.querySelector('.lightbox-image');
    const fallbackOverlay = document.querySelector('.lightbox-fallback-overlay');
    const meta = document.querySelector('.lightbox-meta');
    const captionEl = document.querySelector('.lightbox-caption');
    const photographerEl = document.querySelector('.lightbox-photographer');

    // Reset fallback state
    fallbackOverlay.style.display = "none";
    img.style.opacity = "1";
    img.classList.remove('loaded');

    const photo = photos[index];
    img.src = `${BASE_URL}${photo.url}`;
    img.alt = photo.caption || 'gallery photo';

    const captionText = photo.caption?.trim() || '';
    const photographerText = photo.photographer?.trim() || '';

    captionEl.textContent = captionText;
    photographerEl.textContent = photographerText ? `Photo by ${photographerText}` : '';
    meta.hidden = !captionText && !photographerText;

    img.onerror = () => {
        console.error("Lightbox image failed:", img.src);

        img.classList.remove('loaded');
        img.style.opacity = "0"; // hide broken image
        fallbackOverlay.style.display = "flex";
    };

    img.onload = () => img.classList.add('loaded');

    // Preload next/prev
    const nextIndex = (currentIndex + 1) % photos.length;
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;

    new Image().src = `${BASE_URL}${photos[nextIndex].url}`;
    new Image().src = `${BASE_URL}${photos[prevIndex].url}`;
}


// Enable keyboard shortcuts for lightbox navigation when it is open.
document.addEventListener('keydown', e => {
    const overlay = document.querySelector('.lightbox-overlay');
    if (!overlay?.classList.contains('active')) return;

    // Arrow keys navigate, Escape closes.
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'Escape') closeLightbox();
});