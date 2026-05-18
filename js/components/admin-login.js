import { login } from "../auth.js";

export function renderAdminLoginComponent({ onSuccessNavigate }) {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = `
        <div class="admin-login-page">
            <div class="admin-login-container">

                <a href="#/" class="admin-back-link">
                    <span class="admin-back-icon">←</span>
                    Back to Website
                </a>

                <div class="admin-login-header">
                    <div class="admin-lock-icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <h1>Admin Login</h1>
                    <p>Enter password to access admin panel</p>
                </div>

                <form id="loginForm" class="admin-login-form">
                    <div class="admin-form-group">
                        <label for="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter admin password"
                            required
                        />
                        <p id="message" class="admin-error"></p>
                    </div>

                    <button type="submit" class="btn admin-login-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    `;

    const form = wrapper.querySelector("#loginForm");
    const passwordInput = wrapper.querySelector("#password");
    const message = wrapper.querySelector("#message");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            await login("admin", passwordInput.value);
            onSuccessNavigate();
        } catch (err) {
            message.textContent = "Incorrect password";
        }
    });

    return wrapper.firstElementChild;
}