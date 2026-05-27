import { getBandBio } from '../services/band-bio-service.js';
import { renderBandBio } from '../components/band-bio.js';
import {getBandMemberById, getBandMembers} from '../services/band-member-service.js';
import { renderBandMembers } from '../components/band-members.js';
import { renderMemberProfile } from '../components/band-member-profile.js';

export async function render(container, params) {
    const memberId = params?.get('memberId') || '';
    if (memberId) {
        try {
            const member = await getBandMemberById(memberId);
            container.appendChild(renderMemberProfile(member));
        } catch (err) {
            const error = document.createElement('p');
            error.className = 'error-text';
            error.textContent = 'Member not found.';
            container.appendChild(error);
            const back = document.createElement('a');
            back.href = '#/about';
            back.textContent = '← Back to About';
            container.appendChild(back);
            console.error(err);
        }
    } else {
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
            const bandMembers = await getBandMembers();
            container.appendChild(renderBandMembers(bandMembers));
        } catch (err) {
            const error = document.createElement('p');
            error.className = 'error-text';
            error.textContent = 'Failed to load band members.';
            container.appendChild(error);
            console.error(err);
        }
    }
}
export default { render };