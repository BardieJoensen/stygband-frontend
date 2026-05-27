import { getBandBio } from "../services/band-bio-service.js";
import { renderBandBioForm } from "../components/band-bio-form.js";

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
        formContainer.appendChild(renderBandBioForm(bio));
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
