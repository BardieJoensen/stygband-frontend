export function renderFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';

    const year = new Date().getFullYear();
    footer.innerHTML = `
    <div class="footer-container">
        <div class="footer-socials">
            <a href="https://www.facebook.com/STUGGofficial/" class="social-btn" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/stuggofficial/" class="social-btn" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://www.tiktok.com/@stuggofficial" class="social-btn" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
            <a href="https://www.youtube.com/@stuggofficial6124" class="social-btn" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
            <a href="https://open.spotify.com/artist/6faOKb101lzOAatluvBUNs" class="social-btn" target="_blank" rel="noopener noreferrer" aria-label="Spotify"><i class="fa-brands fa-spotify"></i></a>
        </div>
        <p class="footer-copy">© ${year} STÜGG. All rights reserved.</p>
    </div>
    `;

    return footer;
}
