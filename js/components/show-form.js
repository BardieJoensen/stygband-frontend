import { createShow, updateShowById } from "../services/admin-show-service.js";
import { renderFormField } from "./form/form-field.js";
import { renderSubmitBtn } from "./form/submit-button.js";
import { renderMessageBox } from "./form/message-box.js";

export function renderShowForm(show = null, onComplete) {
    const isEdit = show !== null;

    const container = document.createElement("div");
    const form = document.createElement("form");

    const title = document.createElement("h2");
    title.textContent = isEdit ? "Edit Show" : "Add Show";

    // --- Form fields ---
    const { group: dateField, input: dateInput } = renderFormField("Date", {
        type: "date",
        id: "showDate",
        value: isEdit ? show.date : "",
        required: true,
    });

    const { group: cityField, input: cityInput } = renderFormField("City", {
        type: "text",
        id: "showCity",
        placeholder: "City",
        value: isEdit ? show.city : "",
        required: true,
    });

    const { group: venueField, input: venueInput } = renderFormField("Venue", {
        type: "text",
        id: "showVenue",
        placeholder: "Venue",
        value: isEdit ? show.venue : "",
        required: true,
    });

    const { group: ticketField, input: ticketInput } = renderFormField("Ticket Link (optional)", {
        type: "url",
        id: "showTicketLink",
        placeholder: "https://...",
        value: isEdit ? (show.ticketLink ?? "") : "",
    });

    // --- Submit button ---
    const submitBtn = renderSubmitBtn(isEdit ? "Save Changes" : "Add Show", {
        id: "showSubmitBtn"
    });

    // --- Message box ---
    const msg = renderMessageBox("showFormMessages");

    // --- Assemble form ---
    form.append(dateField, cityField, venueField, ticketField, submitBtn);
    container.append(title, form, msg);

    // --- Submit handler ---
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const showData = {
            date: dateInput.value,
            city: cityInput.value,
            venue: venueInput.value,
            ticketLink: ticketInput.value || null,
        };

        submitBtn.disabled = true;
        submitBtn.textContent = isEdit ? "Saving…" : "Adding…";
        msg.innerHTML = "";

        try {
            if (isEdit) {
                await updateShowById(show.id, showData);
            } else {
                await createShow(showData);
            }

            onComplete?.();

            submitBtn.textContent = "Done!";
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = isEdit ? "Save Changes" : "Add Show";
            }, 1600);

        } catch (err) {
            const errP = document.createElement("p");
            errP.classList.add("error");
            errP.textContent = err.message;
            msg.appendChild(errP);

            submitBtn.disabled = false;
            submitBtn.textContent = isEdit ? "Save Changes" : "Add Show";
        }
    });

    return container;
}
