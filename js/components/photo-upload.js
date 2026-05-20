import { uploadPhotos } from "../services/photo-service.js";

export function renderPhotoUpload(onUploadComplete, closeModal) {
    const container = document.createElement("div");
    container.classList.add("photo-upload");

    container.innerHTML = `
        <h2>Upload Photos</h2>

        <label class="upload-area" id="uploadArea">
            <span>Tap or drop photos here</span>
            <input type="file" id="photoFiles" multiple accept="image/*" capture="environment">
        </label>

        <div id="preview" class="preview"></div>

        <button id="confirmUploadBtn" class="btn" disabled>Upload</button>
        <div id="uploadMessages"></div>
    `;

    const fileInput = container.querySelector("#photoFiles");
    const uploadArea = container.querySelector("#uploadArea");
    const preview = container.querySelector("#preview");
    const confirmBtn = container.querySelector("#confirmUploadBtn");

    let selectedFiles = [];

    // -----------------------------
    // FILE SELECTION (tap)
    // -----------------------------
    fileInput.onchange = () => {
        selectedFiles = Array.from(fileInput.files);
        renderPreview(preview, selectedFiles);
        confirmBtn.disabled = selectedFiles.length === 0;
    };

    // -----------------------------
    // DRAG & DROP SUPPORT
    // -----------------------------
    uploadArea.ondragover = (e) => {
        e.preventDefault();
        uploadArea.classList.add("dragging");
    };

    uploadArea.ondragleave = () => {
        uploadArea.classList.remove("dragging");
    };

    uploadArea.ondrop = (e) => {
        e.preventDefault();
        uploadArea.classList.remove("dragging");

        selectedFiles = Array.from(e.dataTransfer.files);
        fileInput.files = e.dataTransfer.files;

        renderPreview(preview, selectedFiles);
        confirmBtn.disabled = selectedFiles.length === 0;
    };

    // -----------------------------
    // CONFIRM UPLOAD
    // -----------------------------
    confirmBtn.onclick = async () => {
        if (selectedFiles.length === 0) return;

        confirmBtn.disabled = true;
        confirmBtn.textContent = "Uploading…";

        const msg = container.querySelector("#uploadMessages");
        msg.innerHTML = "";

        try {
            const result = await uploadPhotos(selectedFiles);
            renderMessages(container, result);

            if (onUploadComplete) onUploadComplete();

            // Close modal after success
            if (closeModal) {
                setTimeout(() => closeModal(), 800);
            }

        } catch (err) {
            msg.innerHTML = `<p class="error">Upload failed: ${err.message}</p>`;
        }

        confirmBtn.disabled = false;
        confirmBtn.textContent = "Upload";
    };

    return container;
}

// -----------------------------
// Preview thumbnails
// -----------------------------
function renderPreview(preview, files) {
    preview.innerHTML = "";
    for (const file of files) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.classList.add("preview-thumb");
        preview.appendChild(img);
    }
}

// -----------------------------
// Upload result messages
// -----------------------------
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
