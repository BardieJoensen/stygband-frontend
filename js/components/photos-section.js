import { renderPhotoGrid } from './photo-grid.js';

export function renderPhotoSection(photos) {
    const safePhotos = Array.isArray(photos) ? photos : [];

    if (safePhotos.length === 0) {
        console.warn('No photos to display in the photo section.');
        return null; // Return null to indicate no section should be rendered
    }

    const section = document.createElement('section');
    section.classList.add('home-section', 'photos-section');

    const heading = document.createElement('h2');
    heading.className = 'section-heading';
    heading.textContent = 'Photos';
    section.appendChild(heading);

    section.appendChild(renderPhotoGrid(safePhotos));

    const viewAll = document.createElement('a');
    viewAll.href = '/photos';
    viewAll.className = 'btn block';
    viewAll.textContent = 'View All Photos';
    section.appendChild(viewAll);

    return section;
}