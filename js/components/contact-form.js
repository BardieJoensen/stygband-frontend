import { updateContactInfo } from "../services/admin-contact-service.js";

function generateFormField(labelText, inputConfig) {
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
}

export function renderContactForm(contact) {
    const form = document.createElement("form");

    const emailField = generateFormField("General Inquiries Email", {
        type: "email",
        id: "contactEmail",
        placeholder: "stuggofficial@gmail.com",
        value: contact?.email ?? "",
        required: true,
    });

    const emailNoteField = generateFormField("General Inquiries Note", {
        type: "text",
        id: "contactEmailNote",
        placeholder: "Fan mail, questions, feedback",
        value: contact?.emailNote ?? "",
    });

    const bookingEmailField = generateFormField("Booking & Press Email", {
        type: "email",
        id: "contactBookingEmail",
        placeholder: "booking@stygband.dk",
        value: contact?.bookingEmail ?? "",
    });

    const bookingNoteField = generateFormField("Booking & Press Note", {
        type: "text",
        id: "contactBookingNote",
        placeholder: "Management, bookings, media",
        value: contact?.bookingNote ?? "",
    });

    const submitBtn = document.createElement("button");
    submitBtn.className = "btn";
    submitBtn.type = "submit";
    submitBtn.textContent = "Save Changes";

    const msg = document.createElement("div");
    msg.id = "contactFormMessages";

    form.append(emailField, emailNoteField, bookingEmailField, bookingNoteField, submitBtn, msg);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            email:        form.querySelector("#contactEmail").value,
            emailNote:    form.querySelector("#contactEmailNote").value || null,
            bookingEmail: form.querySelector("#contactBookingEmail").value || null,
            bookingNote:  form.querySelector("#contactBookingNote").value || null,
        };

        submitBtn.disabled = true;
        submitBtn.textContent = "Saving…";
        msg.innerHTML = "";

        try {
            await updateContactInfo(payload);
            submitBtn.textContent = "Saved!";
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

    return form;
}
