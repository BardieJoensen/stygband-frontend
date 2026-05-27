import { getBandBio, updateBandBio } from "../services/band-bio-service.js";

function renderBioForm(bio) {
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

    group.append(label, textarea);

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

export async function render(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1>Edit Band Bio</h1>
        </div>
        <div id="bandBioFormContainer"></div>
    `;

    const formContainer = container.querySelector("#bandBioFormContainer");

    try {
        const bio = await getBandBio();
        formContainer.appendChild(renderBioForm(bio));
    } catch (error) {
        console.error("Failed to load band bio:", error);
        formContainer.innerHTML = `
            <div class="error-message" role="alert">
                Failed to load band bio. Please try again.
            </div>
        `;
    }
}

export default { render };
