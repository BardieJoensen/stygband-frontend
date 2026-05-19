import { isLoggedIn } from "../auth.js";
import { navigate } from "../router.js";
import { renderAdminLoginComponent } from "../components/admin-login.js";

async function render(container, params) {
    if (isLoggedIn()) {
        navigate("/admin/dashboard");
        return;
    }

    try {
        const adminLogin = renderAdminLoginComponent({
            onSuccessNavigate: () => navigate("/admin/dashboard"),
        });

        container.innerHTML = "";
        container.appendChild(adminLogin);
    } catch (err) {
        container.innerHTML = "<p>Unable to load login. Please try again.</p>";
    }
}

export default { render };
