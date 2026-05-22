import { getPhotos } from '../services/photo-service.js';
import { getShowById } from '../services/show-service.js';
import { renderPhotoGrid } from '../components/photo-grid.js';
import { createLightbox, openLightbox } from '../components/lightbox.js';
import { navigate } from '../router.js';

let photoState = null;        // cached photos
let currentFilter = null;     // last used showId
let filteredShow = null;      // cached show details for active show filter
let currentShowFilter = null; // showId for cached show details

function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

// Ensure lightbox setup is idempotent across dynamically imported page modules.
if (!document.querySelector('.lightbox-overlay')) {
    createLightbox();
}

if (!window.__openLightboxListenerRegistered) {
    document.addEventListener('open-lightbox', e => {
        openLightbox(e.detail.photos, e.detail.index);
    });
    window.__openLightboxListenerRegistered = true;
}

export async function render(container, params) {

    const showId = params?.get('showId') || null;

    // Reuse the cached list until the active filter changes.
    const shouldFetch =
        !photoState ||
        currentFilter !== showId;

    let loading = null;
    if (shouldFetch) {
        // Show a lightweight loading state only when we are actually fetching.
        loading = document.createElement('p');
        loading.textContent = 'Loading photos...';
        loading.classList.add('loading-text');
        container.appendChild(loading);
    }

    try {
        if (shouldFetch) {
            const photos = await getPhotos(showId);
            photoState = Array.isArray(photos) ? photos : [];
            currentFilter = showId;
        }

        if (loading) loading.remove();

        // Render the page title and the current photo set.
        const header = document.createElement('h1');
        header.classList.add('page-title');
        header.textContent = 'Photos';
        container.appendChild(header);

        // If a show filter is active, render a small filter bar with a clear button.
        if (showId) {
            const filterBar = document.createElement('div');
            filterBar.className = 'filter-bar';

            // Fetch show details only when cache is empty or filter changed.
            const needsShowUpdate =
                !filteredShow ||
                currentShowFilter !== showId;

            if (needsShowUpdate) {
                try {
                    filteredShow = await getShowById(showId);
                    currentShowFilter = showId;
                } catch (error) {
                    filteredShow = null;
                    console.error('Failed to load show details for filter.', error);
                }
            }

            const show = filteredShow;
            const label = document.createElement('div');
            label.className = 'filter-text';

            const labelPrefix = document.createElement('p');
            labelPrefix.textContent = 'Filtered by show:';

            const labelValue = document.createElement('p');
            const strong = document.createElement('strong');
            const hasShowDetails =
                show &&
                isNonEmptyString(show.date) &&
                isNonEmptyString(show.city) &&
                isNonEmptyString(show.venue);
            strong.textContent = !show
                ? 'Show details unavailable'
                : hasShowDetails
                    ? `${show.date} - ${show.city} @ ${show.venue}`
                    : `Show #${showId}`;
            labelValue.appendChild(strong);

            label.appendChild(labelPrefix);
            label.appendChild(labelValue);

            const clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.className = 'btn';
            clearBtn.textContent = 'Clear filter';
            clearBtn.addEventListener('click', () => navigate('/photos'));

            filterBar.appendChild(label);
            filterBar.appendChild(clearBtn);
            container.appendChild(filterBar);
        }

        const grid = renderPhotoGrid(photoState);
        container.appendChild(grid);

    } catch (err) {
        // Keep the loading placeholder in place and turn it into an error message.
        if (loading) {
            loading.textContent = 'Failed to load photos.';
            loading.classList.add('error-text');
        }
        console.error(err);
    }
}

export default { render };
