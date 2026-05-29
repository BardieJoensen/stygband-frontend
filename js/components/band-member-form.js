import { BASE_URL } from "../api.js";
import { updateBandMember, updateBandMemberPhoto } from "../services/admin-band-member-service.js";

function generateFormField(labelText, inputConfig) {
    const group = document.createElement("div");
    group.className = "form-field";

    const label = document.createElement("label");
    label.textContent = labelText;
    label.htmlFor = inputConfig.id;

    const input = document.createElement("input");
    input.type = inputConfig.type;
    input.id = inputConfig.id;
    input.value = inputConfig.value ?? "";
    if (inputConfig.required) input.required = true;

    group.append(label, input);
    return group;
}

export function renderBandMemberForm(member, onComplete) {
    // Track photoUrl locally so the photo upload (immediate) and the text
    // save (deferred until Save Changes) can both contribute to the
    // payload sent on submit.
    let currentPhotoUrl = member.photoUrl ?? null;

    const container = document.createElement("div");

    const title = document.createElement("h2");
    title.textContent = `Edit ${member.name}`;

    const form = document.createElement("form");

    // --- Photo upload (independent — uploads on file selection) ---
    const photoGroup = document.createElement("div");
    photoGroup.className = "form-field member-form-photo";

    const photoLabel = document.createElement("label");
    photoLabel.textContent = "Photo";
    photoGroup.appendChild(photoLabel);

    const photoPreview = document.createElement("img");
    photoPreview.className = "member-form-preview";
    photoPreview.alt = `${member.name} photo`;
    if (currentPhotoUrl) {
        photoPreview.src = `${BASE_URL}${currentPhotoUrl}`;
    }
    photoGroup.appendChild(photoPreview);

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg, image/png, image/webp";
    fileInput.id = "memberPhotoFile";
    photoGroup.appendChild(fileInput);

    const photoStatus = document.createElement("p");
    photoStatus.className = "member-form-photo-status";
    photoGroup.appendChild(photoStatus);

    fileInput.addEventListener("change", async () => {
        if (!fileInput.files.length) return;
        const file = fileInput.files[0];

        photoStatus.textContent = "Uploading…";
        photoStatus.classList.remove("error");

        try {
            const updated = await updateBandMemberPhoto(member.id, file);
            currentPhotoUrl = updated.photoUrl;
            photoPreview.src = `${BASE_URL}${currentPhotoUrl}`;
            photoStatus.textContent = "Photo updated.";
            if (onComplete) onComplete();
        } catch (err) {
            photoStatus.textContent = err.message;
            photoStatus.classList.add("error");
        }
    });

    // --- Text fields ---
    const nameField = generateFormField("Name", {
        type: "text", id: "memberName", value: member.name, required: true,
    });
    const roleField = generateFormField("Role", {
        type: "text", id: "memberRole", value: member.role, required: true,
    });

    const bioGroup = document.createElement("div");
    bioGroup.className = "form-field";
    const bioLabel = document.createElement("label");
    bioLabel.textContent = "Bio";
    bioLabel.htmlFor = "memberBio";
    const bioInput = document.createElement("textarea");
    bioInput.id = "memberBio";
    bioInput.rows = 6;
    bioInput.value = member.bio ?? "";
    bioInput.required = true;
    const bioHint = document.createElement("small");
    bioHint.className = "form-hint";
    bioHint.textContent = "Tip: link text like [Other Band](https://…) will render as a clickable link.";
    bioGroup.append(bioLabel, bioInput, bioHint);

    // --- Submit ---
    const submitBtn = document.createElement("button");
    submitBtn.className = "btn";
    submitBtn.type = "submit";
    submitBtn.textContent = "Save Changes";

    const msg = document.createElement("div");
    msg.id = "memberFormMessages";

    form.append(photoGroup, nameField, roleField, bioGroup, submitBtn, msg);
    container.append(title, form);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            name: form.querySelector("#memberName").value,
            role: form.querySelector("#memberRole").value,
            bio: bioInput.value,
            photoUrl: currentPhotoUrl,
        };

        submitBtn.disabled = true;
        submitBtn.textContent = "Saving…";
        msg.innerHTML = "";

        try {
            await updateBandMember(member.id, payload);
            if (onComplete) onComplete();
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

    return container;
}
