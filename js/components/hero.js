export function renderHero() {
    const hero = document.createElement('section');
    hero.className = 'hero';

    hero.innerHTML = `
        <div class="hero-wrapper">
            <img
                src="/assets/hero-image.jpg"
                alt="Band photo"
                class="hero-image"
            />

            <div class="hero-gradient"></div>

            <div class="hero-logo-overlay">
                <img
                    src="/assets/logo.png"
                    alt="Stügg Logo"
                    class="hero-logo"
                />
            </div>
        </div>
    `;

    return hero;
}
