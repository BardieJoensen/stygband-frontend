export function openModal(content) {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");

    const modal = document.createElement("div");
    modal.classList.add("modal");

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("modal-close");
    closeBtn.textContent = "×";

    closeBtn.onclick = () => overlay.remove();
    overlay.onclick = (e) => {
        if (e.target === overlay) overlay.remove();
    };

    document.addEventListener("keydown", function esc(e) {
        if (e.key === "Escape") {
            overlay.remove();
            document.removeEventListener("keydown", esc);
        }
    });

    modal.appendChild(closeBtn);
    modal.appendChild(content);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}
