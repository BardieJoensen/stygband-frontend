import { uploadPhotos } from "../services/photo-service.js";
import { getShows } from "../services/show-service.js";

export async function renderPhotoUpload(onUploadComplete) {
    const container = document.createElement("div");
    container.classList.add("photo-upload");

    container.innerHTML = `
        <form id="photoUploadForm">
            <h2>Upload Photos</h2>

            <div class="form-field">
                <label for="showSelect">Associated Show (optional)</label>
                <select id="showSelect">
                    <option value="">-- None --</option>
                </select>
            </div>

            <div class="form-field">
                <label for="dateTakenInput">Date Taken</label>
                <input 
                    type="date" 
                    id="dateTakenInput"
                    required
                >
            </div>

            <div class="form-field">
                <label for="photographerInput">Photographer (optional)</label>
                <input 
                    type="text" 
                    id="photographerInput" 
                    placeholder="Enter photographer"
                >
            </div>

            <div class="form-field">
                <label for="captionInput">Caption (optional)</label>
                <input 
                    type="text" 
                    id="captionInput" 
                    placeholder="Enter caption"
                >
            </div>

            <label class="upload-area" id="uploadArea" tabindex="0">
                <span>Tap or drop photos here</span>
                <input type="file" id="photoFiles" multiple accept="image/*" capture="environment">
            </label>

            <div id="preview" class="preview"></div>

            <button id="confirmUploadBtn" class="btn" type="submit" disabled>Upload</button>
            <div id="uploadMessages"></div>
        </form>
    `;

    const form = container.querySelector("#photoUploadForm");
    const showSelect = container.querySelector("#showSelect");
    const dateTakenInput = container.querySelector("#dateTakenInput");
    dateTakenInput.valueAsDate = new Date(); // default to today

    let shows = [];
    try {
        const loadedShows = await getShows();
        if (Array.isArray(loadedShows)) {
            shows = loadedShows;
        }
    } catch (error) {
        console.error("Failed to load shows for photo upload:", error);
        showSelect.disabled = true;
        const showField = showSelect.closest(".form-field");
        if (showField) {
            showField.hidden = true;
        }
    }

    if (shows.length > 0 && showSelect && dateTakenInput) {
        shows.forEach(show => {
            const option = document.createElement("option");
            option.value = show.id;
            option.textContent = `${show.date} - ${show.city} @ ${show.venue}`;
            showSelect.appendChild(option);
        });

        // Auto-fill date when a show is selected
        showSelect.addEventListener("change", () => {
            const selectedShow = shows.find(s => String(s.id) === showSelect.value);
            if (selectedShow) {
                dateTakenInput.value = selectedShow.date;
            } else {
                dateTakenInput.valueAsDate = new Date();
            }
        });
    }

    const photographerInput = container.querySelector("#photographerInput");
    const captionInput = container.querySelector("#captionInput");

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
    container.cleanup = () => {
        window.removeEventListener("dragover", preventDefaults);
        window.removeEventListener("drop", preventDefaults);
    };

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
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (selectedFiles.length === 0) return;

        const caption = captionInput.value.trim();
        const photographer = photographerInput.value.trim();
        const dateTaken = dateTakenInput.value;
        const showId = showSelect.value || null;

        confirmBtn.disabled = true;
        confirmBtn.textContent = "Uploading…";
        msg.innerHTML = "";

        try {
            const result = await uploadPhotos(selectedFiles, {
                caption,
                photographer,
                dateTaken,
                showId
            });
            renderMessages(container, result);

            // refresh photo grid after upload completes
            await onUploadComplete?.();

            // Reset state after upload
            selectedFiles = [];
            preview.innerHTML = "";
            captionInput.value = "";
            photographerInput.value = "";
            dateTakenInput.valueAsDate = new Date();
            showSelect.value = "";
            fileInput.value = "";
            confirmBtn.disabled = true;
            confirmBtn.textContent = "Done!";
            setTimeout(() => confirmBtn.textContent = "Upload", 1600);

        } catch (err) {
            msg.replaceChildren();
            const errorP = document.createElement("p");
            errorP.classList.add("error");
            errorP.textContent = `Upload failed: ${err.message}`;
            msg.appendChild(errorP);
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
    msg.replaceChildren();

    if (result.uploaded.length > 0) {
        const uploadedP = document.createElement("p");
        const uploadedStrong = document.createElement("strong");
        uploadedStrong.textContent = "Uploaded:";
        uploadedP.appendChild(uploadedStrong);
        uploadedP.append(` ${result.uploaded.length}`);
        msg.appendChild(uploadedP);
    }

    if (result.errors.length > 0) {
        const errorsHeaderP = document.createElement("p");
        const errorsStrong = document.createElement("strong");
        errorsStrong.textContent = "Errors:";
        errorsHeaderP.appendChild(errorsStrong);
        msg.appendChild(errorsHeaderP);

        result.errors.forEach(err => {
            const errP = document.createElement("p");
            errP.textContent = `${err.filename}: ${err.reason}`;
            msg.appendChild(errP);
        });
    }
}
