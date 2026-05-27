import { uploadPhotos } from "../services/photo-service.js";
import { getShows } from "../services/show-service.js";
import { renderFormField } from "./form/form-field.js";
import { renderSelectFormField } from "./form/select-form-field.js";
import { renderUploadArea } from "./form/upload-area.js";
import { renderSubmitBtn } from "./form/submit-btn.js";
import { renderMessageBox } from "./form/message-box.js";

export async function renderPhotoUpload(onUploadComplete) {
    const container = document.createElement("div");
    container.classList.add("photo-upload");

    const formHeader = document.createElement("h2");
    formHeader.textContent = "Upload Photos";
    container.appendChild(formHeader);

    const form = document.createElement("form");
    form.id = "photoUploadForm";
    container.appendChild(form);

    const { group: showSelectField, select: showSelect } =
        renderSelectFormField("Associated Show (optional)", {
            id: "showSelect",
            options: [{ value: "", text: "-- None --" }]
        });
    form.appendChild(showSelectField);

    const today = new Date().toISOString().split("T")[0];
    const { group: dateTakenField, input: dateTakenInput } = renderFormField("Date Taken", {
        type: "date",
        id: "dateTakenInput",
        required: true,
        value: today
    });
    form.appendChild(dateTakenField);

    const { group: photographerField, input: photographerInput } = renderFormField("Photographer (optional)", {
        type: "text",
        id: "photographerInput",
        placeholder: "Enter photographer"
    });
    form.appendChild(photographerField);

    const { group: captionField, input: captionInput } = renderFormField("Caption (optional)", {
        type: "text",
        id: "captionInput",
        placeholder: "Enter caption"
    });
    form.appendChild(captionField);

    const { group: uploadField, input: fileInput, wrapper: uploadArea, preview } =
        renderUploadArea("Photos", {
            id: "uploadArea",
            inputId: "photoFiles",
            accept: "image/*",
            capture: "environment"
        });
    form.appendChild(uploadField);

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
            option.textContent = `${show.date} - ${show.city} @${show.venue} `;
            showSelect.appendChild(option);
        });

        // Auto-fill date when a show is selected
        showSelect.addEventListener("change", () => {
            const selectedShow = shows.find(s => String(s.id) === showSelect.value);
            if (selectedShow) {
                dateTakenInput.value = selectedShow.date;
            } else {
                dateTakenInput.value = today;
            }
        });
    }

    const confirmBtn = renderSubmitBtn("Upload", {
        id: "confirmUploadBtn",
        disabled: true
    });
    form.appendChild(confirmBtn);

    const msg = renderMessageBox("uploadMessages");
    form.appendChild(msg);

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
            dateTakenInput.value = today;
            showSelect.value = "";
            fileInput.value = "";
            confirmBtn.disabled = true;
            confirmBtn.textContent = "Done!";
            setTimeout(() => confirmBtn.textContent = "Upload", 1600);

        } catch (err) {
            msg.replaceChildren();
            const errorP = document.createElement("p");
            errorP.classList.add("error");
            errorP.textContent = `Upload failed: ${err.message} `;
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
        uploadedP.append(` ${result.uploaded.length} `);
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
            errP.textContent = `${err.filename}: ${err.reason} `;
            msg.appendChild(errP);
        });
    }
}
