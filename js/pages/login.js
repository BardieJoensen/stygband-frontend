import { login, isLoggedIn } from "../auth.js";
import { navigate } from "../router.js";

async function render(container, params) {
    if (isLoggedIn()) {
        navigate("/admin/dashboard");
        return;
    }

    container.innerHTML = `
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

    document.getElementById("loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const password = document.getElementById("password").value;

        try {
            await login("admin", password);
            navigate("/admin/dashboard");
        } catch (err) {
            document.getElementById("message").textContent = "Incorrect password";
        }
    });
}

export default { render };
