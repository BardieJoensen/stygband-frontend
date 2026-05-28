import { openModal } from "../components/modal.js";
import { renderPhotoUpload } from "../components/photo-upload.js";
import { renderAdminPhotoGrid } from "../components/admin-photo-grid.js";
import { getPhotos } from "../services/photo-service.js";
import { PlusIcon } from "../components/icons.js";
import { createLightbox, openLightbox } from "../components/lightbox.js";
import { renderBatchPhotoEditForm } from "../components/batch-photo-edit-form.js";

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

let currentSelectionState = null;

function createActionContainer(loadPhotos) {
    const actionContainer = document.createElement("div");
    actionContainer.id = "actionContainer";

    // Batch Edit button
    const batchBtn = document.createElement("button");
    batchBtn.id = "batchEditBtn";
    batchBtn.classList.add("btn", "hidden");
    batchBtn.textContent = "Edit Selected";

    batchBtn.onclick = async() => {
        openModal(await renderBatchPhotoEditForm(currentSelectionState, async () => await loadPhotos()));
    };

    // Add Photos button
    const addBtn = document.createElement("button");
    addBtn.id = "openUploadModal";
    addBtn.classList.add("btn");
    addBtn.appendChild(PlusIcon());
    addBtn.append("Add Photos");

    addBtn.onclick = async () => {
        try {
            const uploadUI = await renderPhotoUpload(loadPhotos);
            openModal(uploadUI);
        } catch (err) {
            console.error("Failed to initialize upload form:", err);
            alert("Could not open upload form. Please try again.");
        }
    };

    actionContainer.appendChild(batchBtn);
    actionContainer.appendChild(addBtn);

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
    const selectionState = {
        selectedIds: new Set(),

        add(id) {
            this.selectedIds.add(id);
            this.onChange();
        },

        delete(id) {
            this.selectedIds.delete(id);
            this.onChange();
        },

        onChange() {
            const batchBtn = document.getElementById("batchEditBtn");
            if (batchBtn) {
                batchBtn.classList.toggle("hidden", this.selectedIds.size === 0);
            }
        },

        clear() {
            this.selectedIds.clear();
            this.onChange();
        }
    };

    currentSelectionState = selectionState;

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
        gridContainer.appendChild(renderAdminPhotoGrid(photos, currentSelectionState));
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
