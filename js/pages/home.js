import { renderHero } from '../components/hero.js';
import { renderContactInfo } from '../components/contact-info.js';
import { getUpcomingShows, getPastShows } from "../services/show-service.js";
import { getContactInfo } from "../services/contact-service.js";
import { getRecentPhotos } from "../services/photo-service.js";
import { renderPhotoSection } from '../components/photos-section.js';
import { renderShowsSection } from '../components/shows-section.js';
import { createLightbox, openLightbox } from '../components/lightbox.js';

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
    container.appendChild(renderHero());

    const [upcomingShows, pastShows, contact, photos] = await Promise.all([
        getUpcomingShows().catch(err => { console.error('Failed to load upcoming shows:', err); return []; }),
        getPastShows().catch(err => { console.error('Failed to load past shows:', err); return []; }),
        getContactInfo().catch(err => { console.error('Failed to load contact info:', err); return null; }),
        getRecentPhotos().catch(err => { console.error('Failed to load photos:', err); return []; })
    ]);

    const showsSection = renderShowsSection(upcomingShows, pastShows);
    showsSection.id = 'shows';
    container.appendChild(showsSection);

    const photoSection = renderPhotoSection(photos);
    if (photoSection) {
        photoSection.id = 'photos';
        container.appendChild(photoSection);
    }

    const contactSection = renderContactInfo(contact);
    contactSection.id = 'contact';
    container.appendChild(contactSection);
}

export default { render };
