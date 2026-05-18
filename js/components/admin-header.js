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

    // Remove listener when header is removed from DOM
    const observer = new MutationObserver(() => {
        if (!header.isConnected) {
            window.removeEventListener('authChanged', update);
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return header;
}
