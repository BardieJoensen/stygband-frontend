import {navigate} from '../router.js';
export function renderBandMembers(members) {

  const section = document.createElement('section');
  section.className = 'band-members';

  if (!members?.length) return section;

    members.forEach(member => {
      const card = document.createElement('div');
      const name = document.createElement('h3');
      const role = document.createElement('p');
      card.className = 'band-member-card';
      name.className = 'band-member-name';
      role.className = 'band-member-role';
      name.textContent = member.name;
      role.textContent = member.role;
      card.appendChild(name);
      card.appendChild(role);
      card.style.cursor = 'pointer'
      card.addEventListener('click', () => navigate(`/about?memberId=${member.id}`));
      section.appendChild(card);

    });
    return section;
}



