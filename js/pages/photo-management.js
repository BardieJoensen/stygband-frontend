import { openModal } from "../components/modal.js";
import { renderPhotoUpload } from "../components/photo-upload.js";
import { renderAdminPhotoGrid } from "../components/admin-photo-grid.js";
import { getPhotos } from "../services/photo-service.js";
import { PlusIcon } from "../components/icons.js";
import { createLightbox, openLightbox } from "../components/lightbox.js";

// Ensure lightbox setup is idempotent across dynamically imported page modules.
if (!document.querySelector('.lightbox-overlay')) {
    createLightbox();
}

if (!window.__openLightboxListenerRegistered) {
    document.addEventListener('open-lightbox', e => {
        openLightbox(e.detail.photos, e.detail.index);
    });
    window.__openLightboxListenerRegistered = true;
}

function createActionContainer(loadPhotos) {
    const actionContainer = document.createElement("div");
    actionContainer.id = "actionContainer";

    const btn = document.createElement("button");
    btn.id = "openUploadModal";
    btn.classList.add("btn");
    btn.appendChild(PlusIcon());
    btn.append("Add Photos");

    btn.onclick = async () => {
        const uploadUI = await renderPhotoUpload(loadPhotos);
        openModal(uploadUI);
    };

    actionContainer.appendChild(btn);
    return actionContainer;
}

function createPageHeader(loadPhotos) {
    const header = document.createElement("div");
    header.classList.add("page-header");
    const title = document.createElement("h1");
    title.textContent = "Photo Management";
    header.appendChild(title);
    header.appendChild(createActionContainer(loadPhotos));
    return header;
}

export async function render(container) {
    container.appendChild(createPageHeader(loadPhotos));

    const gridContainer = document.createElement("div");
    gridContainer.id = "adminPhotoGrid";
    container.appendChild(gridContainer);

    await loadPhotos();
}

async function loadPhotos() {
    const gridContainer = document.getElementById("adminPhotoGrid");

    if (!gridContainer) return;

    try {
        const photos = await getPhotos();

        gridContainer.innerHTML = "";
        gridContainer.appendChild(renderAdminPhotoGrid(photos));
    } catch (error) {
        console.error("Failed to load photos:", error);
        gridContainer.replaceChildren();
        const errorEl = document.createElement("p");
        errorEl.className = "admin-error";
        errorEl.textContent = "Could not load photos right now.";
        gridContainer.appendChild(errorEl);
    }
}

export default { render };
