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
    const links = nav.querySelectorAll('a');
    
    hamburger.addEventListener('click', function (){
        nav.classList.toggle('open');
    });
    
    links.forEach(function (link) {
        link.addEventListener('click', function (){
            nav.classList.remove('open');
        })
    });
    
    function update() {
        hamburger.classList.add('hidden');
        nav.innerHTML = '';
        if (isLoggedIn()) {
            hamburger.classList.remove('hidden');

            const photosLink = document.createElement('a');
            photosLink.href = "#/admin/photos";
            photosLink.textContent = "Photos";
            nav.appendChild(photosLink);

            const btn = document.createElement('a');
            btn.className = 'btn';
            btn.textContent = "Logout";
            btn.onclick = logout;
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
