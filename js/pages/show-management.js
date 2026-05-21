import { openModal} from "../components/modal.js";
import { renderShowForm } from "../components/show-form.js";
import {createShow, editShowById, deleteShowById } from "../services/admin-show-service.js";
import {getUpcomingShows, getPastShows} from "../services/show-service.js";
import { PlusIcon } from "../components/icons.js";
import {renderShowRows} from "../components/show-rows.js";

export async function render(container) {
  container.innerHTML = `
        <div class="page-header">
            <h1>Show Management</h1>
            <div id="actionContainer"></div>
        </div>
        <div id="adminShow"></div>
    `;
  const btn = document.createElement("button");
  btn.className = "btn";
  btn.appendChild(PlusIcon());
  btn.append("Add Show");
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

  async function loadShows() {
    const shows = await getUpcomingShows();
    const listContainer = document.getElementById('adminShow');
    listContainer.innerHTML = "";
    listContainer.appendChild(renderShowRows(shows, false, true, onEdit, onDelete));
  }

  document.getElementById("actionContainer").appendChild(btn);

  await loadShows();
}

export default { render };

