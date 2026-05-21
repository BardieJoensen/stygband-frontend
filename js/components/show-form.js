import { createShow, editShowById } from "../services/admin-show-service.js";

export function renderShowForm(show = null, onComplete) {
    const isEdit = show !== null;
    const container = document.createElement("div");

    container.innerHTML = `
        <h2>${isEdit ? "Edit Show" : "Add Show"}</h2>
        <div class="admin-form-group">
            <label>Date</label>
            <input type="date" id="showDate" value="${isEdit ? show.date : ""}">
        </div>
        <div class="admin-form-group">
            <label>City</label>
            <input type="text" id="showCity" placeholder="City" value="${isEdit ? show.city : ""}">
        </div>
        <div class="admin-form-group">
            <label>Venue</label>
            <input type="text" id="showVenue" placeholder="Venue" value="${isEdit ? show.venue : ""}">
        </div>
        <div class="admin-form-group">
            <label>Ticket Link</label>
            <input type="url" id="showTicketLink" placeholder="https://..." value="${isEdit ? (show.ticketLink ?? "") : ""}">
        </div>
        <button class="btn" id="showSubmitBtn">${isEdit ? "Save Changes" : "Add Show"}</button>
        <div id="showFormMessages"></div>
    `;

    const submitBtn = container.querySelector("#showSubmitBtn");
    const msg = container.querySelector("#showFormMessages");

    submitBtn.addEventListener("click", async () => {
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
                await editShowById(show.id, showData);
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