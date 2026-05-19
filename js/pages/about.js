import { getBandBio } from '../services/band-bio-service.js';
import { renderBandBio } from '../components/band-bio.js';
import { getBandMembers} from '../services/band-member-service.js';
import {renderBandMembers} from '../components/band-member.js';
export async function render(container) {
    const heading = document.createElement('h1');
    heading.className = 'page-title';
    heading.textContent = 'About';
    container.appendChild(heading);

    try {
        const bio = await getBandBio();
        container.appendChild(renderBandBio(bio));
    } catch (err) {
        const error = document.createElement('p');
        error.className = 'error-text';
        error.textContent = 'Failed to load band bio.';
        container.appendChild(error);
        console.error(err);
    }
    try {
        const bandMember = await getBandMembers();
        container.appendChild(renderBandMembers(bandMember));
    } catch (err) {
        const error = document.createElement('p');
        error.className = 'error-text';
        error.textContent = 'Failed to load band members.';
        container.appendChild(error);
        console.error(err);
    }

export default {render};
}