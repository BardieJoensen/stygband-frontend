// Build a DocumentFragment from plain text, turning Markdown-style links
// [label](https://…) into <a> elements with the label as text and the URL
// as href. Also auto-detects bare http(s) URLs as a convenience.
//
// Why a custom helper instead of a Markdown lib: we only want clickable
// links — no bold/italic/headings — and the alternative (rendering admin
// HTML directly) would require a sanitizer. Building <a> elements
// ourselves means the admin's URL only ever becomes an href attribute,
// never executable markup.
const LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>"]+)/g;

export function linkify(text) {
    const fragment = document.createDocumentFragment();
    if (!text) return fragment;

    let lastIndex = 0;
    let match;
    LINK_PATTERN.lastIndex = 0;

    while ((match = LINK_PATTERN.exec(text)) !== null) {
        // Text between the previous match and this one
        if (match.index > lastIndex) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }

        const a = document.createElement('a');
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        if (match[1] !== undefined) {
            // [label](url) — group 1 is label, group 2 is url
            a.textContent = match[1];
            a.href = match[2];
        } else {
            // bare URL — group 3
            a.textContent = match[3];
            a.href = match[3];
        }
        fragment.appendChild(a);

        lastIndex = match.index + match[0].length;
    }

    // Trailing text after the last match (or the whole string if no matches)
    if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    return fragment;
}
