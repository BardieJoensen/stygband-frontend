export function renderHeader() {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
    <div class="header-container">
        <h1 class="logo"><a href="#/"><img src="assets/logo_zero_padding.png" alt="Stügg"></a></h1>
        <nav class="site-nav">
            <a href="#/">Home</a>
            <a href="#/shows">Shows</a>
            <a href="#/photos">Photos</a>
            <a href="https://stugg.bandcamp.com/" target="_blank" rel="noopener noreferrer">Shop</a>
            <a href="#/about">About</a>
            <a href="#/contact">Contact</a>
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

    const homeLinks = header.querySelectorAll('a[href="#/"]');
    homeLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    return header;
}
