import { navigate } from '../router.js';
import {BASE_URL} from "../api.js";
import { linkify } from '../utils/linkify.js';

export function renderMemberProfile(member) {
  const section = document.createElement('section');
  section.className = 'member-profile';

  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'back-btn';
  back.textContent = '← Back';
  back.addEventListener('click', () => navigate('/about'));
  section.appendChild(back);

  if (member.photoUrl) {
    const img = document.createElement('img');
    img.src = `${BASE_URL}${member.photoUrl}`
    img.alt = member.name;
    img.className = 'member-profile-photo';
    section.appendChild(img);
  }

  const name = document.createElement('h1');
  name.className = 'member-profile-name';
  name.textContent = member.name;
  section.appendChild(name);

  const role = document.createElement('p');
  role.className = 'member-profile-role';
  role.textContent = member.role;
  section.appendChild(role);

  if (member.bio) {
    const bio = document.createElement('p');
    bio.className = 'member-profile-bio';
    bio.appendChild(linkify(member.bio));
    section.appendChild(bio);
  }

  return section;
}