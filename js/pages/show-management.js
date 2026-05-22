import { openModal } from "../components/modal.js";
import { renderShowForm } from "../components/show-form.js";
import { deleteShowById } from "../services/admin-show-service.js";
import { getUpcomingShows, getPastShows } from "../services/show-service.js";
import { PlusIcon } from "../components/icons.js";
import { renderShowRows } from "../components/show-rows.js";

export async function render(container) {
  container.innerHTML = `
          <div class="page-header">
              <h1>Show Management</h1>
              <div id="toggleContainer" class="toggle-section"></div>
              <div id="actionContainer"></div>
          </div>
          <div id="adminShow"></div>
      `;

  let showingPast = false;

  const btn = document.createElement("button");
  btn.className = "btn";
  btn.appendChild(PlusIcon());
  btn.append("Add Show");

  const btnUpcoming = document.createElement("button");
  btnUpcoming.className = "btn active";
  btnUpcoming.type = "button";
  btnUpcoming.textContent = "Upcoming";
  btnUpcoming.setAttribute("aria-pressed", "true");

  const btnPast = document.createElement("button");
  btnPast.className = "btn";
  btnPast.type = "button";
  btnPast.textContent = "Past";
  btnPast.setAttribute("aria-pressed", "false");

  btn.addEventListener("click", () => {
    openModal(renderShowForm(null, loadShows));
  });

  const onDelete = async (showId) => {
    await deleteShowById(showId);
    await loadShows();
  }

  const onEdit = async (showId) => {
    openModal(renderShowForm(showId, loadShows));
  }

  btnUpcoming.addEventListener("click", () => {
    showingPast = false;
    loadShows();
    btnUpcoming.classList.add("active");
    btnPast.classList.remove("active");
    btnUpcoming.setAttribute("aria-pressed", "true");
    btnPast.setAttribute("aria-pressed", "false");
  })

  btnPast.addEventListener("click", () => {
    showingPast = true;
    loadShows();
    btnPast.classList.add("active");
    btnUpcoming.classList.remove("active");
    btnPast.setAttribute("aria-pressed", "true");
    btnUpcoming.setAttribute("aria-pressed", "false");
  })

  async function loadShows() {
    const listContainer = document.getElementById('adminShow');
    listContainer.innerHTML = "";

    try {
      const shows = showingPast ? await getPastShows() : await getUpcomingShows();
      listContainer.appendChild(renderShowRows(shows, showingPast, true, onEdit, onDelete));
    } catch (error) {
      console.error("Failed to load shows:", error);
      listContainer.innerHTML = `
        <div class="error-message" role="alert">
          Failed to load shows. Please try again.
        </div>
      `;
    }
  }

  document.getElementById("toggleContainer").appendChild(btnUpcoming);
  document.getElementById("toggleContainer").appendChild(btnPast);
  document.getElementById("actionContainer").appendChild(btn);

  await loadShows();
}

export default { render };