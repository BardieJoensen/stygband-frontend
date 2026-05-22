import { logout, isLoggedIn } from "../auth.js";

export function renderAdminHeader() {
    const header = document.createElement('header');
    header.className = 'site-header admin-header';

    header.innerHTML = `
        <div class="header-container">
            <h1 class="logo">Admin panel</h1>
                <nav class="site-nav">
                </nav>
                <button class="hamburger">☰</button>
        </div>
    `;
    
    const hamburger = header.querySelector('.hamburger');
    const nav = header.querySelector('.site-nav');
    
    hamburger.addEventListener('click', function (){
        nav.classList.toggle('open');
    });
    
    nav.addEventListener('click', function (event) {
        if (event.target.closest('a')) {
            nav.classList.remove('open');
        }
    });
    
    function update() {
        hamburger.classList.add('hidden');
        nav.innerHTML = '';
        if (isLoggedIn()) {
            hamburger.classList.remove('hidden');

            const showsLink = document.createElement('a');
            showsLink.href = "#/admin/shows";
            showsLink.textContent = "Shows";
            nav.appendChild(showsLink);

            const photosLink = document.createElement('a');
            photosLink.href = "#/admin/photos";
            photosLink.textContent = "Photos";
            nav.appendChild(photosLink);

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn';
            btn.textContent = "Logout";
            btn.addEventListener('click', logout);
            nav.appendChild(btn);
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
