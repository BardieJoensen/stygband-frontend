import { isLoggedIn, logout } from "./auth.js";
import { renderHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";
import { renderAdminHeader } from "./components/admin-header.js";

const routes = {
    '/': { module: './pages/home.js', auth: false, layout: 'public' },
    '/photos': { module: './pages/photos.js', auth: false, layout: 'public' },
    '/about': { module: './pages/about.js', auth: false, layout: 'public' },

    '/admin': { module: './pages/login.js', auth: false, layout: 'admin' },
    '/admin/login': { module: './pages/login.js', auth: false, layout: 'admin' },
    '/admin/dashboard': { module: './pages/dashboard.js', auth: true, layout: 'admin' },
    '/admin/photos': { module: './pages/photo-management.js', auth: true, layout: 'admin' },
    '/admin/shows': { module: './pages/show-management.js', auth: true, layout: 'admin' },
};

const anchorRoutes = {
    '/shows': 'shows',
    '/contact': 'contact',
};

async function renderPage(path, params) {
    const route = routes[path] || routes['/'];

    if (route.auth && !isLoggedIn()) {
        logout();
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
    const path = window.location.pathname || '/';
    const params = new URLSearchParams(window.location.search);

    const route = routes[path] || routes['/'];

    const anchorId = anchorRoutes[path];

    if (anchorId) {
        const existing = document.getElementById(anchorId);
        if (existing) {
            existing.scrollIntoView({ behavior: 'smooth' });
        } else {
            renderLayout(route.layout);
            await renderPage('/', params);
            document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' });
        }
        return;
    }

    if (path === '/' && document.getElementById('shows')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    renderLayout(route.layout);
    await renderPage(path, params);
}

function renderLayout(layout = 'public') {
    const content = document.getElementById('content');
    const headerRoot = document.getElementById('header-root');
    const footerRoot = document.getElementById('footer-root');

    headerRoot.replaceChildren();
    footerRoot.replaceChildren();

    if (layout === 'admin') {
        content.classList.add('admin-layout');
        headerRoot.appendChild(renderAdminHeader());
    } else {
        content.classList.remove('admin-layout');
        headerRoot.appendChild(renderHeader());
        footerRoot.appendChild(renderFooter());
    }
}

// Intercept clicks on internal links so navigation stays client-side
// instead of triggering a full page load.
function handleLinkClick(event) {
    if (event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
    }

    const link = event.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    // Skip external links, protocol-relative URLs ("//host"), and new-tab links.
    if (!href || !href.startsWith('/') || href.startsWith('//') || link.target === '_blank') {
        return;
    }

    event.preventDefault();
    navigate(href);
}

window.addEventListener("popstate", handleRoute);
window.addEventListener("load", handleRoute);
document.addEventListener("click", handleLinkClick);

export function navigate(path) {
    if (path !== window.location.pathname + window.location.search) {
        window.history.pushState({}, '', path);
    }
    handleRoute();
}
