import { updateBandBio } from "../services/band-bio-service.js";

export function renderBandBioForm(bio) {
    const form = document.createElement("form");

    const group = document.createElement("div");
    group.className = "form-field";

    const label = document.createElement("label");
    label.textContent = "Band Bio";
    label.htmlFor = "bandBioContent";

    const textarea = document.createElement("textarea");
    textarea.id = "bandBioContent";
    textarea.rows = 16;
    textarea.placeholder = "Write the band bio. Separate paragraphs with a blank line.";
    textarea.value = bio?.content ?? "";
    textarea.required = true;

    const hint = document.createElement("small");
    hint.className = "form-hint";
    hint.textContent = "Tip: link text like [Andelsslagteriet](https://example.com) will render as a clickable link.";

    group.append(label, textarea, hint);

    const submitBtn = document.createElement("button");
    submitBtn.className = "btn";
    submitBtn.type = "submit";
    submitBtn.textContent = "Save Changes";

    const msg = document.createElement("div");
    msg.id = "bandBioFormMessages";

    form.append(group, submitBtn, msg);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const content = textarea.value;

        submitBtn.disabled = true;
        submitBtn.textContent = "Saving…";
        msg.innerHTML = "";

        try {
            await updateBandBio(content);
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
