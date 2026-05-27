import { getContactInfo } from "../services/contact-service.js";
import { renderContactForm } from "../components/contact-form.js";

export async function render(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1>Edit Contact Info</h1>
        </div>
        <div id="contactFormContainer"></div>
    `;

    const formContainer = container.querySelector("#contactFormContainer");

    try {
        const contact = await getContactInfo();
        formContainer.appendChild(renderContactForm(contact));
    } catch (error) {
        console.error("Failed to load contact info:", error);
        formContainer.innerHTML = `
            <div class="error-message" role="alert">
                Failed to load contact info. Please try again.
            </div>
        `;
    }
}

export default { render };
