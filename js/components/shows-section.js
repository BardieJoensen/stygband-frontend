import { renderUpcomingShows } from './upcoming-shows.js';
import { renderPastShows } from './past-shows.js';

export function renderShowsSection(upcomingShows, pastShows) {
    const section = document.createElement('section');
    section.classList.add('home-section', 'shows-section');
    
    const heading = document.createElement('h2');
    heading.className = 'section-heading';
    heading.textContent = 'Shows';
    section.appendChild(heading);

    const toggleSection = document.createElement('div');
    toggleSection.className = 'toggle-section';

    const btnUpcoming = document.createElement('button');
    btnUpcoming.type = 'button';
    btnUpcoming.className = 'btn active';
    btnUpcoming.textContent = 'Upcoming';
    btnUpcoming.setAttribute('aria-pressed', 'true');

    const btnPast = document.createElement('button');
    btnPast.type = 'button';
    btnPast.className = 'btn';
    btnPast.textContent = 'Past Shows';
    btnPast.setAttribute('aria-pressed', 'false');

    const upcomingSection = renderUpcomingShows(upcomingShows);

    const pastShowsSection = renderPastShows(pastShows);
    pastShowsSection.classList.add('hidden');

    // Clicking 'Upcoming' shows upcoming and hides past
    btnUpcoming.addEventListener('click', () => {
        upcomingSection.classList.remove('hidden');
        pastShowsSection.classList.add('hidden');
        btnUpcoming.classList.add('active');
        btnPast.classList.remove('active');
        btnUpcoming.setAttribute('aria-pressed', 'true');
        btnPast.setAttribute('aria-pressed', 'false');
    });

    // Clicking 'Past Shows' shows past and hides upcoming
    btnPast.addEventListener('click', () => {
        upcomingSection.classList.add('hidden');
        pastShowsSection.classList.remove('hidden');
        btnPast.classList.add('active');
        btnUpcoming.classList.remove('active');
        btnPast.setAttribute('aria-pressed', 'true');
        btnUpcoming.setAttribute('aria-pressed', 'false');
    });

    toggleSection.appendChild(btnUpcoming);
    toggleSection.appendChild(btnPast);
    section.appendChild(toggleSection);
    section.appendChild(upcomingSection);
    section.appendChild(pastShowsSection);

    return section;
}