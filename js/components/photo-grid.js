import { BASE_URL } from '../api.js';

// Render a grid of clickable photo thumbnails that can open in the lightbox.
export function renderPhotoGrid(photos) {
    const safePhotos = Array.isArray(photos) ? photos : [];

    if (safePhotos.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'no-photos';
        empty.textContent = 'No photos available.';
        return empty; // Return the empty message element to indicate no grid will be rendered
    }

    const grid = document.createElement('div');
    grid.classList.add('photo-grid');

    safePhotos.forEach((photo, index) => {
        const wrapper = document.createElement('button');
        wrapper.type = 'button';
        wrapper.classList.add('photo-grid-item');

        // Add skeleton
        const skeleton = document.createElement('div');
        skeleton.classList.add('photo-skeleton');
        wrapper.appendChild(skeleton);

        // Load the thumbnail from the API base URL.
        const img = document.createElement('img');
        img.src = `${BASE_URL}${photo.url}`;
        // Use the photo caption if available, otherwise a generic fallback.
        img.alt = photo.caption || 'gallery photo';
        img.loading = 'lazy'; // Hint to browser to lazy-load offscreen images

        // When image loads, remove skeleton
        img.onload = () => skeleton.remove();

        // Handle image load errors gracefully by showing a fallback UI instead of a broken image.
        img.onerror = () => {
            skeleton.remove();
            console.error("Image failed to load:", img.src);

            const fallback = document.createElement('div');
            fallback.classList.add('photo-fallback');

            fallback.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <line x1="4" y1="4" x2="20" y2="20"/>
                </svg>
            `;

            img.replaceWith(fallback);
        };

        wrapper.appendChild(img);

        wrapper.addEventListener('click', () => {
            // Instead of opening the lightbox here, publish an app-level event.
            // This keeps the grid focused on rendering and lets the lightbox stay decoupled.
            document.dispatchEvent(new CustomEvent('open-lightbox', {
                // Pass the full photo list plus the clicked index so the lightbox
                // can show the current image and still support next/previous navigation.
                detail: { photos: safePhotos, index }
            }));
        });

        grid.appendChild(wrapper);
    });

    return grid;
}

