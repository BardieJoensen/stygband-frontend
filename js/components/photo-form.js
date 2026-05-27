import { getShows } from "../services/show-service.js";
import { updatePhotoById } from "../services/photo-service.js";
import { renderFormField } from "./form/form-field.js";
import { renderSelectFormField } from "./form/select-form-field.js";
import { renderSubmitBtn } from "./form/submit-btn.js";
import { renderMessageBox } from "./form/message-box.js";

export async function renderPhotoEditForm(photo, onComplete) {
    const container = document.createElement("div");

    const formHeader = document.createElement("h2");
    formHeader.textContent = "Edit Photo";
    container.appendChild(formHeader);

    const form = document.createElement("form");
    form.id = "photoEditForm";
    container.appendChild(form);

    const { group: showSelectField, select: showSelect } =
        renderSelectFormField("Associated Show (optional)", {
            id: "showSelect",
            options: [{ value: "", text: "-- None --" }]
        });
    form.appendChild(showSelectField);

    const { group: dateTakenField, input: dateTakenInput } = renderFormField("Date Taken", {
        type: "date",
        id: "dateTakenInput",
        required: true,
        value: photo.dateTaken ? photo.dateTaken.split("T")[0] : ""
    });
    form.appendChild(dateTakenField);

    const { group: photographerField, input: photographerInput } = renderFormField("Photographer (optional)", {
        type: "text",
        id: "photographerInput",
        placeholder: "Enter photographer",
        value: photo.photographer ?? ""
    });
    form.appendChild(photographerField);

    const { group: captionField, input: captionInput } = renderFormField("Caption (optional)", {
        type: "text",
        id: "captionInput",
        placeholder: "Enter caption",
        value: photo.caption ?? ""
    });
    form.appendChild(captionField);

    let shows = [];
    try {
        const loadedShows = await getShows();
        if (Array.isArray(loadedShows)) {
            shows = loadedShows;
        }
    } catch (error) {
        console.error("Failed to load shows for photo edit:", error);
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
            option.textContent = `${show.date} - ${show.city} @ ${show.venue} `;
            showSelect.appendChild(option);
        });

        // Auto-fill date when a show is selected
        showSelect.addEventListener("change", () => {
            const selectedShow = shows.find(s => String(s.id) === showSelect.value);
            if (selectedShow) {
                dateTakenInput.value = selectedShow.date;
            } else {
                dateTakenInput.value = new Date().toISOString().split("T")[0];
            }
        });
    }

    showSelect.value = photo.show?.id || "";

    const submitBtn = renderSubmitBtn("Save Changes", {
        id: "submitBtn",
    });
    form.appendChild(submitBtn);

    const msg = renderMessageBox("photoEditMessages");
    form.appendChild(msg);

    // --- Submit handler ---
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const photoData = {
            dateTaken: dateTakenInput.value,
            photographer: photographerInput.value,
            caption: captionInput.value,
            showId: showSelect.value || null
        };

        submitBtn.disabled = true;
        submitBtn.textContent = "Saving…";
        msg.innerHTML = "";

        try {
            const updatedPhoto = await updatePhotoById(photo.id, photoData);
            
            onComplete?.(updatedPhoto);

            submitBtn.textContent = "Done!";
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = "Save Changes";
            }, 1600);

        } catch (err) {
            const errP = document.createElement("p");
            errP.classList.add("error");
            errP.textContent = err.message;
            msg.appendChild(errP);

            submitBtn.disabled = false;
            submitBtn.textContent = "Save Changes";
        }
    });

    return container;
}