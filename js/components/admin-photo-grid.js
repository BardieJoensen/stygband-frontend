import { BASE_URL } from "../api.js";
import { TrashIcon, SquarePenIcon } from "./icons.js";
import { deletePhoto } from "../services/photo-service.js";
import { openModal } from "./modal.js";
import { renderPhotoEditForm } from "./photo-form.js";

export function renderAdminPhotoGrid(photos) {
    const safePhotos = Array.isArray(photos) ? photos : [];

    if (safePhotos.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'no-photos';
        empty.textContent = 'No photos available.';
        return empty; // Return the empty message element to indicate no grid will be rendered
    }

    const grid = document.createElement('div');
    grid.classList.add('admin-photo-grid');

    safePhotos.forEach((photo) => {
        grid.appendChild(renderAdminPhotoCard(photo, safePhotos));
    });

    return grid;
}

function renderAdminPhotoCard(photo, photos) {
    // Wrap photo in a mutable object so closures always see the latest version
    const state = { photo };

    const card = document.createElement('div');
    card.classList.add('admin-photo-card');

    const onPhotoUpdated = (updatedPhoto) => {
        // Update global array
        const index = photos.findIndex(p => p.id === updatedPhoto.id);
        if (index !== -1) {
            photos[index] = updatedPhoto;
        }

        // Update local state
        state.photo = updatedPhoto;

        // Re-sort photos by dateTaken (descending)
        photos.sort((a, b) => new Date(b.dateTaken) - new Date(a.dateTaken));

        // Re-render entire grid
        const grid = card.closest('.admin-photo-grid');
        const newGrid = renderAdminPhotoGrid(photos);
        grid.replaceWith(newGrid);
    };

    // Build card using state.photo (never the original photo)
    card.appendChild(renderActions(state, card, photos, onPhotoUpdated));
    card.appendChild(renderImage(state, photos));
    card.appendChild(renderMetadata(state.photo));

    return card;
}

function renderActions(state, card, photos, onPhotoUpdated) {
    const actions = document.createElement('div');
    actions.classList.add('admin-photo-actions');

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.classList.add('btn', 'icon-btn');
    editBtn.setAttribute('aria-label', 'Edit photo');
    editBtn.appendChild(SquarePenIcon());

    editBtn.onclick = async () => {
        try {
            const editUI = await renderPhotoEditForm(state.photo, onPhotoUpdated);
            openModal(editUI);
        } catch (err) {
            console.error("Failed to initialize edit form:", err);
            alert("Could not open edit form. Please try again.");
        }
    };

    actions.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.classList.add('btn', 'icon-btn');
    deleteBtn.setAttribute('aria-label', 'Delete photo');
    deleteBtn.appendChild(TrashIcon());

    deleteBtn.onclick = async () => {
        if (!confirm("Are you sure you want to delete this photo? This action cannot be undone.")) {
            return;
        }

        deleteBtn.disabled = true;

        try {
            await deletePhoto(state.photo.id);
            card.remove();

            const photoIndex = photos.indexOf(state.photo);
            if (photoIndex !== -1) {
                photos.splice(photoIndex, 1);
            }
        } catch (err) {
            deleteBtn.disabled = false;
            alert(`Delete failed: ${err.message}`);
        }
    };

    actions.appendChild(deleteBtn);

    return actions;
}

function renderMetadata(photo) {
    const metadata = document.createElement('div');
    metadata.classList.add('admin-photo-metadata');

    const dateTaken = document.createElement('p');
    dateTaken.textContent = 'Date taken: ' + (photo.dateTaken || 'N/A');
    metadata.appendChild(dateTaken);

    const caption = document.createElement('p');
    caption.textContent = 'Caption: ' + (photo.caption || 'N/A');
    metadata.appendChild(caption);

    const photographer = document.createElement('p');
    photographer.textContent = 'Photographer: ' + (photo.photographer || 'N/A');
    metadata.appendChild(photographer);

    const show = document.createElement('p');
    show.textContent = 'Show: ' + (photo.show ? `${photo.show.date} - ${photo.show.city} @ ${photo.show.venue}` : 'N/A');
    metadata.appendChild(show);

    return metadata;
}

function renderImage(state, photos) {
    const photo = state.photo;

    const wrapper = document.createElement('button');
    wrapper.type = 'button';
    wrapper.classList.add('photo-grid-item');

    const skeleton = document.createElement('div');
    skeleton.classList.add('photo-skeleton');
    wrapper.appendChild(skeleton);

    const img = document.createElement('img');
    img.src = `${BASE_URL}${photo.url}`;
    img.alt = photo.caption || 'gallery photo';
    img.loading = 'lazy';

    img.onload = () => skeleton.remove();

    img.onerror = () => {
        skeleton.remove();

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
        const currentIndex = photos.indexOf(state.photo);
        if (currentIndex === -1) return;

        document.dispatchEvent(new CustomEvent('open-lightbox', {
            detail: { photos, index: currentIndex }
        }));
    });

    return wrapper;
}
