import { uploadPhotos } from "../services/photo-service.js";

export function renderPhotoUpload(onUploadComplete) {
    const container = document.createElement("div");
    container.classList.add("photo-upload");

    container.innerHTML = `
        <h2>Upload Photos</h2>

        <label class="upload-area" id="uploadArea">
            <span>Tap or drop photos here</span>
            <input type="file" id="photoFiles" multiple accept="image/*" capture="environment">
        </label>

        <div id="preview" class="preview"></div>
        <div id="uploadMessages"></div>
    `;

    const fileInput = container.querySelector("#photoFiles");
    const uploadArea = container.querySelector("#uploadArea");
    const preview = container.querySelector("#preview");

    // -----------------------------
    // AUTO-UPLOAD WHEN FILES PICKED
    // -----------------------------
    fileInput.onchange = async () => {
        if (fileInput.files.length > 0) {
            renderPreview(preview, fileInput.files);
            await handleUpload(fileInput.files, container, onUploadComplete);
        }
    };

    // -----------------------------
    // DRAG & DROP SUPPORT (desktop)
    // -----------------------------
    uploadArea.ondragover = (e) => {
        e.preventDefault();
        uploadArea.classList.add("dragging");
    };

    uploadArea.ondragleave = () => {
        uploadArea.classList.remove("dragging");
    };

    uploadArea.ondrop = async (e) => {
        e.preventDefault();
        uploadArea.classList.remove("dragging");

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            fileInput.files = droppedFiles;
            renderPreview(preview, droppedFiles);
            await handleUpload(droppedFiles, container, onUploadComplete);
        }
    };

    return container;
}

// -----------------------------
// Upload handler with messages
// -----------------------------
async function handleUpload(files, container, onUploadComplete) {
    const msg = container.querySelector("#uploadMessages");
    msg.innerHTML = `<p>Uploading…</p>`;

    try {
        const result = await uploadPhotos(files);
        renderMessages(container, result);

        if (onUploadComplete) onUploadComplete();
    } catch (err) {
        msg.innerHTML = `<p class="error">Upload failed: ${err.message}</p>`;
    }
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
