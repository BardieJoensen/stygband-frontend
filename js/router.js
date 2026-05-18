import { isLoggedIn } from "./auth.js";
import { renderHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";
import { renderAdminHeader } from "./components/admin-header.js";

const routes = {
    '/': { module: './pages/home.js', auth: false, layout: 'public' },
    '/photos': { module: './pages/photos.js', auth: false, layout: 'public' },
    '/about': { module: './pages/about.js', auth: false, layout: 'public' },

    '/admin': { module: './pages/login.js', auth: false, layout: 'admin' },
    '/admin/login': { module: './pages/login.js', auth: false, layout: 'admin' },
    '/admin/dashboard': { module: './pages/dashboard.js', auth: true, layout: 'admin' }
};

const anchorRoutes = {
    '/tour': 'tour',
    '/contact': 'contact',
};

async function renderPage(path, params) {
    const route = routes[path] || routes['/'];

    if (route.auth && !isLoggedIn()) {
        window.location.hash = "#/admin";
        return;
    }

    try {
        const { default: page } = await import(route.module);
        const content = document.getElementById('content');
        content.innerHTML = '';
        await page.render(content, params);
    } catch (error) {
        console.error('Error loading page:', error);
        document.getElementById('content').innerHTML = '<p>Error loading page.</p>';
    }
}

async function handleRoute() {
    const hash = window.location.hash || '#/';
    const [path, queryString] = hash.slice(1).split('?');
    const params = new URLSearchParams(queryString);

    const route = routes[path] || routes['/'];
    renderLayout(route.layout);

    const anchorId = anchorRoutes[path];

    if (anchorId) {
        const existing = document.getElementById(anchorId);
        if (existing) {
            existing.scrollIntoView({ behavior: 'smooth' });
        } else {
            await renderPage('/', params);
            document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' });
        }
        return;
    }

    if (path === '/' && document.getElementById('tour')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    await renderPage(path, params);
}

function renderLayout(layout = 'public') {
    const headerRoot = document.getElementById('header-root');
    const footerRoot = document.getElementById('footer-root');

    headerRoot.replaceChildren();
    footerRoot.replaceChildren();

    if (layout === 'admin') {
        headerRoot.appendChild(renderAdminHeader());
    } else {
        headerRoot.appendChild(renderHeader());
        footerRoot.appendChild(renderFooter());
    }
}

window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);

export function navigate(path) {
    window.location.hash = path;
}
