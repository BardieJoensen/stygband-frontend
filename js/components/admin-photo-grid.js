import { BASE_URL } from "../api.js";
import { TrashIcon, SquarePenIcon } from "./icons.js";
import { deletePhoto } from "../services/photo-service.js";

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

    safePhotos.forEach((photo, index) => {
        grid.appendChild(renderAdminPhotoCard(photo, index, safePhotos));
    });

    return grid;
}

function renderAdminPhotoCard(photo, index, photos) {
    const card = document.createElement('div');
    card.classList.add('admin-photo-card');

    card.appendChild(renderActions(photo, card, photos));
    card.appendChild(renderImage(photo, index, photos));
    card.appendChild(renderMetadata(photo));

    return card;
}

function renderActions(photo, card, photos) {
    const actions = document.createElement('div');
    actions.classList.add('admin-photo-actions');

    // Add action buttons to the actions container
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.classList.add('btn', 'icon-btn');
    editBtn.setAttribute('aria-label', 'Edit photo');
    editBtn.appendChild(SquarePenIcon());
    editBtn.onclick = () => {
        alert("Edit functionality not implemented yet."); // TODO: Implement edit functionality
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
            await deletePhoto(photo.id);
            card.remove();
            photos.splice(photos.indexOf(photo), 1);
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

function renderImage(photo, index, photos) {
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
        document.dispatchEvent(new CustomEvent('open-lightbox', {
            detail: { photos, index }
        }));
    });

    return wrapper;
}
