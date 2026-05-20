import { renderPhotoUpload } from "../components/photo-upload.js";
import { renderPhotoGrid } from "../components/photo-grid.js";
import { getPhotos } from "../services/photo-service.js";

export async function render(container) {
    container.innerHTML = `<h1>Photo Management</h1>`;

    // Upload section
    const uploadSection = renderPhotoUpload(loadPhotos);
    container.appendChild(uploadSection);

    // Grid section
    const gridContainer = document.createElement("div");
    gridContainer.id = "adminPhotoGrid";
    container.appendChild(gridContainer);

    await loadPhotos();
}

async function loadPhotos() {
    const photos = await getPhotos();
    const gridContainer = document.getElementById("adminPhotoGrid");

    gridContainer.innerHTML = "";
    gridContainer.appendChild(renderPhotoGrid(photos));
}

export default { render };
