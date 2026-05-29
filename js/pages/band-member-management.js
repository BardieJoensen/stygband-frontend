import { BASE_URL } from "../api.js";
import { openModal } from "../components/modal.js";
import { renderBandMemberForm } from "../components/band-member-form.js";
import { getBandMembers } from "../services/band-member-service.js";
import { SquarePenIcon } from "../components/icons.js";

function renderMemberRow(member, onEdit) {
    const row = document.createElement("div");
    row.className = "admin-member-row";

    if (member.photoUrl) {
        const thumb = document.createElement("img");
        thumb.src = `${BASE_URL}${member.photoUrl}`;
        thumb.alt = member.name;
        thumb.className = "admin-member-thumb";
        row.appendChild(thumb);
    }

    const info = document.createElement("div");
    info.className = "admin-member-info";

    const nameEl = document.createElement("h3");
    nameEl.textContent = member.name;

    const roleEl = document.createElement("p");
    roleEl.textContent = member.role;

    info.append(nameEl, roleEl);
    row.appendChild(info);

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn";
    editBtn.setAttribute("aria-label", `Edit ${member.name}`);
    editBtn.appendChild(SquarePenIcon());
    editBtn.append("Edit");
    editBtn.onclick = () => onEdit(member);
    row.appendChild(editBtn);

    return row;
}

function renderMemberList(members, onEdit) {
    const list = document.createElement("div");
    list.className = "admin-member-list";
    members.forEach(m => list.appendChild(renderMemberRow(m, onEdit)));
    return list;
}

export async function render(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1>Member Management</h1>
        </div>
        <div id="memberList"></div>
    `;

    const listContainer = container.querySelector("#memberList");

    const onEdit = (member) => {
        openModal(renderBandMemberForm(member, loadMembers));
    };

    async function loadMembers() {
        listContainer.innerHTML = "";
        try {
            const members = await getBandMembers();
            listContainer.appendChild(renderMemberList(members, onEdit));
        } catch (err) {
            console.error("Failed to load band members:", err);
            listContainer.innerHTML = `
                <div class="error-message" role="alert">
                    Failed to load members. Please try again.
                </div>
            `;
        }
    }

    await loadMembers();
}

export default { render };
