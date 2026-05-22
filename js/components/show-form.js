import { createShow, updateShowById } from "../services/admin-show-service.js";

export function renderShowForm(show = null, onComplete) {
    const isEdit = show !== null;
    const container = document.createElement("div");
    const form = document.createElement("form");

    const title = document.createElement("h2");
    title.textContent = isEdit ? "Edit Show" : "Add Show";

    const generateFormField = (labelText, inputConfig) => {
        const group = document.createElement("div");
        group.className = "form-field";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.htmlFor = inputConfig.id;

        const input = document.createElement("input");
        input.type = inputConfig.type;
        input.id = inputConfig.id;
        if (inputConfig.placeholder) input.placeholder = inputConfig.placeholder;
        input.value = inputConfig.value ?? "";
        if (inputConfig.required) input.required = true;

        group.append(label, input);
        return group;
    };

    const dateField = generateFormField("Date", {
        type: "date",
        id: "showDate",
        value: isEdit ? show.date : "",
        required: true,
    });

    const cityField = generateFormField("City", {
        type: "text",
        id: "showCity",
        placeholder: "City",
        value: isEdit ? show.city : "",
        required: true,
    });

    const venueField = generateFormField("Venue", {
        type: "text",
        id: "showVenue",
        placeholder: "Venue",
        value: isEdit ? show.venue : "",
        required: true,
    });

    const ticketLinkField = generateFormField("Ticket Link (optional)", {
        type: "url",
        id: "showTicketLink",
        placeholder: "https://...",
        value: isEdit ? (show.ticketLink ?? "") : "",
    });

    const submitBtn = document.createElement("button");
    submitBtn.className = "btn";
    submitBtn.id = "showSubmitBtn";
    submitBtn.type = "submit";
    submitBtn.textContent = isEdit ? "Save Changes" : "Add Show";

    const msg = document.createElement("div");
    msg.id = "showFormMessages";

    form.append(dateField, cityField, venueField, ticketLinkField, submitBtn);
    container.append(title, form, msg);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const showData = {
            date:       container.querySelector("#showDate").value,
            city:       container.querySelector("#showCity").value,
            venue:      container.querySelector("#showVenue").value,
            ticketLink: container.querySelector("#showTicketLink").value || null,
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

            if (onComplete) onComplete();

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