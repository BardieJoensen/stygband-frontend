export function openModal(content) {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");

    const modal = document.createElement("div");
    modal.classList.add("modal");

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("modal-close");
    closeBtn.textContent = "×";

    const close = () => {
        document.removeEventListener("keydown", onEsc);
        overlay.remove();
        content.cleanup?.();
    };

    const onEsc = (e) => {
        if (e.key === "Escape") close();
    };

    closeBtn.onclick = close;
    overlay.onclick = (e) => {
        if (e.target === overlay) close();
    };

    document.addEventListener("keydown", onEsc);

    modal.appendChild(closeBtn);
    modal.appendChild(content);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}
