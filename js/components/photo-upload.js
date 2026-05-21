import { uploadPhotos } from "../services/photo-service.js";

export function renderPhotoUpload(onUploadComplete) {
    const container = document.createElement("div");
    container.classList.add("photo-upload");

    container.innerHTML = `
        <h2>Upload Photos</h2>

        <label class="upload-area" id="uploadArea" tabindex="0">
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
    const msg = container.querySelector("#uploadMessages");

    let selectedFiles = [];

    // -------------------------------------------------
    // GLOBAL DRAG SAFETY (prevents accidental navigation)
    // -------------------------------------------------
    const preventDefaults = (e) => e.preventDefault();
    window.addEventListener("dragover", preventDefaults);
    window.addEventListener("drop", preventDefaults);

    // -------------------------------------------------
    // FILE SELECTION (tap)
    // -------------------------------------------------
    fileInput.addEventListener("change", () => {
        selectedFiles = Array.from(fileInput.files);
        renderPreview(preview, selectedFiles);
        confirmBtn.disabled = selectedFiles.length === 0;
    });

    // -------------------------------------------------
    // DRAG & DROP SUPPORT
    // -------------------------------------------------
    uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadArea.classList.add("dragging");
    });

    uploadArea.addEventListener("dragleave", () => {
        uploadArea.classList.remove("dragging");
    });

    uploadArea.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadArea.classList.remove("dragging");

        selectedFiles = Array.from(e.dataTransfer.files);
        fileInput.files = e.dataTransfer.files;

        renderPreview(preview, selectedFiles);
        confirmBtn.disabled = selectedFiles.length === 0;
    });

    // -------------------------------------------------
    // KEYBOARD ACCESSIBILITY
    // -------------------------------------------------
    uploadArea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInput.click();
        }
    });

    // -------------------------------------------------
    // CONFIRM UPLOAD
    // -------------------------------------------------
    confirmBtn.addEventListener("click", async () => {
        if (selectedFiles.length === 0) return;

        confirmBtn.disabled = true;
        confirmBtn.textContent = "Uploading…";
        msg.innerHTML = "";

        try {
            const result = await uploadPhotos(selectedFiles);
            renderMessages(container, result);

            // Refresh grid
            if (onUploadComplete) onUploadComplete();

            // Reset state
            selectedFiles = [];
            preview.innerHTML = "";
            fileInput.value = "";
            confirmBtn.disabled = true;
            confirmBtn.textContent = "Done!";
            setTimeout(() => {
                confirmBtn.textContent = "Upload";
            }, 1600); // Short delay to show "Done!" state

            return;

        } catch (err) {
            msg.innerHTML = `<p class="error">Upload failed: ${err.message}</p>`;
            confirmBtn.disabled = false;
            confirmBtn.textContent = "Upload";
        }
    });

    return container;
}

// -------------------------------------------------
// Preview thumbnails (with memory-safe cleanup)
// -------------------------------------------------
function renderPreview(preview, files) {
    preview.innerHTML = "";

    files.forEach(file => {
        const url = URL.createObjectURL(file);
        const img = document.createElement("img");
        img.src = url;
        img.classList.add("preview-thumb");

        img.onload = () => URL.revokeObjectURL(url);

        preview.appendChild(img);
    });
}

// -------------------------------------------------
// Upload result messages
// -------------------------------------------------
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
