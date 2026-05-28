import { getShows } from "../services/show-service.js";
import { batchUpdatePhotos } from "../services/photo-service.js";
import { renderFormField } from "./form/form-field.js";
import { renderSelectFormField } from "./form/select-form-field.js";
import { renderSubmitBtn } from "./form/submit-btn.js";
import { renderMessageBox } from "./form/message-box.js";

export async function renderBatchPhotoEditForm(selectionState, onComplete) {
    const container = document.createElement("div");

    const header = document.createElement("h2");
    header.textContent = `Batch Edit (${selectionState.selectedIds.size} photos)`;
    container.appendChild(header);

    const form = document.createElement("form");
    form.id = "batchPhotoEditForm";
    container.appendChild(form);

    const sectionHeader = document.createElement("h3");
    sectionHeader.textContent = "Fields to update";
    form.appendChild(sectionHeader);

    // --- Show Select ---
    const { group: showGroup, select: showSelect } =
        renderSelectFormField(null, {
            options: [{ value: "", text: "-- None --" }]
        });

    let shows = [];
    try {
        shows = await getShows();
        shows.forEach(show => {
            const opt = document.createElement("option");
            opt.value = show.id;
            opt.textContent = `${show.date} - ${show.city} @ ${show.venue}`;
            showSelect.appendChild(opt);
        });
    } catch (err) {
        console.error("Failed to load shows:", err);
        showSelect.disabled = true;
    }

    const showField = wrapOptionalField("Show", showGroup, () => showSelect.value);
    form.appendChild(showField.wrapper);

    // --- Date Taken ---
    const { group: dateGroup, input: dateInput } =
        renderFormField(null, {
            type: "date"
        });

    const dateField = wrapOptionalField("Date Taken", dateGroup, () => dateInput.value);
    form.appendChild(dateField.wrapper);

    // --- Photographer ---
    const { group: photographerGroup, input: photographerInput } =
        renderFormField(null, {
            type: "text",
            placeholder: "Enter photographer"
        });

    const photographerField = wrapOptionalField("Photographer", photographerGroup, () => photographerInput.value);
    form.appendChild(photographerField.wrapper);

    // --- Caption ---
    const { group: captionGroup, input: captionInput } =
        renderFormField(null, {
            type: "text",
            placeholder: "Enter caption"
        });

    const captionField = wrapOptionalField("Caption", captionGroup, () => captionInput.value);
    form.appendChild(captionField.wrapper);

    // --- Submit button ---
    const submitBtn = renderSubmitBtn("Apply Changes");
    form.appendChild(submitBtn);

    const msg = renderMessageBox("batchEditMessages");
    form.appendChild(msg);

    // --- Submit handler ---
    form.onsubmit = async (e) => {
        e.preventDefault();

        const payload = {
            photoIds: [...selectionState.selectedIds]
        };

        const fields = {
            caption: captionField.getValue(),
            photographer: photographerField.getValue(),
            dateTaken: dateField.getValue(),
            showId: showField.getValue()
        };

        for (const [key, val] of Object.entries(fields)) {
            if (val !== undefined) payload[key] = val;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Saving…";
        msg.innerHTML = "";

        try {
            await batchUpdatePhotos(payload);
            selectionState.clear();

            await onComplete?.(selectionState);

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
            submitBtn.textContent = "Apply Changes";
        }
    };

    return container;
}

// --- Optional field wrapper helper ---
function wrapOptionalField(label, fieldGroup, getValueFn) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("batch-field-wrapper");

    const id = `apply-${label.toLowerCase().replace(/\s+/g, "-")}`;

    const applyToggle = document.createElement("input");
    applyToggle.type = "checkbox";
    applyToggle.id = id;
    applyToggle.classList.add("apply-toggle");

    const applyLabel = document.createElement("label");
    applyLabel.textContent = `${label}`;
    applyLabel.htmlFor = id;

    const inputs = fieldGroup.querySelectorAll("input, select");
    inputs.forEach(i => i.disabled = true);

    applyToggle.onchange = () => {
        const enabled = applyToggle.checked;
        inputs.forEach(i => i.disabled = !enabled);
        if (!enabled) inputs.forEach(i => i.value = "");
    };

    wrapper.append(applyToggle, applyLabel, fieldGroup);

    return {
        wrapper,
        getValue() {
            if (!applyToggle.checked) return undefined;
            const value = getValueFn();
            return value === "" ? null : value;
        }
    };
}

