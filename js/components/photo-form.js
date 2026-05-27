export function renderPhotoEditForm(photo) {
    const container = document.createElement("div");
    container.classList.add("photo-edit-form");

    container.appendChild(document.createElement("h2")).textContent = "Edit Photo";

    const form = document.createElement("form");
    container.appendChild(form);

    container.appendChild(form);

    return container;
}