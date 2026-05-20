import { uploadPhotos } from "../services/photo-service.js";

export function renderPhotoUpload(onUploadComplete) {
    const container = document.createElement("div");
    container.classList.add("photo-upload");

    container.innerHTML = `
        <h2>Upload Photos</h2>
        <input type="file" id="photoFiles" multiple accept="image/*">
        <button id="uploadBtn" class="btn">Upload</button>
        <div id="uploadMessages"></div>
    `;

    container.querySelector("#uploadBtn").onclick = async () => {
        const files = container.querySelector("#photoFiles").files;
        if (!files.length) return;

        const result = await uploadPhotos(files);
        renderMessages(container, result);

        if (onUploadComplete) onUploadComplete();
    };

    return container;
}

function renderMessages(container, result) {
    const msg = container.querySelector("#uploadMessages");
    msg.innerHTML = "";

    if (result.uploaded.length > 0) {
        msg.innerHTML += `<p><strong>Uploaded:</strong> ${result.uploaded.length}</p>`;
    }

    if (result.errors.length > 0) {
        msg.innerHTML += `<p><strong>Errors:</strong></p>`;
        result.errors.forEach(err => {
            msg.innerHTML += `<p>${err.filename}: ${err.reason}</p>`;
        });
    }
}
