import { logout, isLoggedIn } from "../auth.js";

export function renderAdminHeader() {
    const header = document.createElement('header');
    header.className = 'site-header admin-header';

    header.innerHTML = `
        <div class="header-container">
            <h1 class="logo">Admin panel</h1>
            <div class="admin-header__actions"></div>
        </div>
    `;

    const actions = header.querySelector('.admin-header__actions');

    function update() {
        actions.innerHTML = '';
        if (isLoggedIn()) {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = "Logout";
            btn.onclick = logout;
            actions.appendChild(btn);
        }
    }

    update();
    window.addEventListener('authChanged', update);

    return header;
}
