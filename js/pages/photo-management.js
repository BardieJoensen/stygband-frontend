import { openModal } from "../components/modal.js";
import { renderPhotoUpload } from "../components/photo-upload.js";
import { renderPhotoGrid } from "../components/photo-grid.js";
import { getPhotos } from "../services/photo-service.js";
import { PlusIcon } from "../components/icons.js"; // ← add this

export async function render(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1>Photo Management</h1>
            <div id="actionContainer"></div>
        </div>
        <div id="adminPhotoGrid"></div>
    `;

    const btn = document.createElement("button");
    btn.id = "openUploadModal";
    btn.classList.add("btn");
    btn.appendChild(PlusIcon());
    btn.append("Add Photos");

    document.getElementById("actionContainer").appendChild(btn);

    btn.onclick = () => {
        const uploadUI = renderPhotoUpload(loadPhotos);
        openModal(uploadUI);
    };

    await loadPhotos();
}

async function loadPhotos() {
    const photos = await getPhotos();
    const gridContainer = document.getElementById("adminPhotoGrid");

    gridContainer.innerHTML = "";
    gridContainer.appendChild(renderPhotoGrid(photos));
}

export default { render };
