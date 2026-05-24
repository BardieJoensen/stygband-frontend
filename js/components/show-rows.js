import { CalendarIcon, MapPinIcon, SquarePenIcon, TrashIcon } from "./icons.js";

export function renderShowRows(shows, showPast = false, isAdmin = false, onEdit, onDelete) {
    const safeShows = Array.isArray(shows) ? shows : [];

    const list = document.createElement('div');
    list.className = 'shows-list';

    if (safeShows.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'no-shows';
        empty.textContent = showPast
            ? 'No past gigs registered yet.'
            : 'No upcoming gigs at the moment. Check back soon!';
        list.appendChild(empty);
        return list;
    }

    safeShows.forEach(show => {
        const row = document.createElement('div');
        row.className = 'show-row';

        // DATE
        const dateWrap = document.createElement('div');
        dateWrap.className = 'show-info show-date';
        dateWrap.appendChild(CalendarIcon());
        const date = document.createElement('span');
        date.textContent = show.date;
        dateWrap.appendChild(date);

        // CITY
        const cityWrap = document.createElement('div');
        cityWrap.className = 'show-info show-city';
        cityWrap.appendChild(MapPinIcon());
        const city = document.createElement('span');
        city.textContent = show.city;
        cityWrap.appendChild(city);

        // VENUE
        const venue = document.createElement('span');
        venue.className = 'show-venue';
        venue.textContent = show.venue;

        // Append info blocks
        row.appendChild(dateWrap);
        row.appendChild(cityWrap);
        row.appendChild(venue);

        // BUTTONS
        const actions = document.createElement('div');
        actions.className = 'show-actions';

        if (!showPast && show.ticketLink) {
            const btn = document.createElement('a');
            btn.href = show.ticketLink;
            btn.target = "_blank";
            btn.rel = "noopener noreferrer";
            btn.className = "btn";
            btn.append("Tickets");
            actions.appendChild(btn);
        }

        if (showPast && show.hasPhotos) {
            const link = document.createElement('a');
            link.href = `/photos?showId=${show.id}`;
            link.textContent = 'Photos';
            link.className = 'btn';
            actions.appendChild(link);
        }

        if (isAdmin) {
            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.classList.add('btn', 'icon-btn');
            editBtn.setAttribute('aria-label', 'Edit Show');
            editBtn.appendChild(SquarePenIcon());
            editBtn.onclick = () => onEdit(show);
            actions.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.classList.add('btn', 'icon-btn');
            deleteBtn.setAttribute('aria-label', 'Delete Show');
            deleteBtn.appendChild(TrashIcon());
            deleteBtn.onclick = () => onDelete(show.id);
            actions.appendChild(deleteBtn);
        }
        row.appendChild(actions);
        list.appendChild(row);
    });
    return list;
}
