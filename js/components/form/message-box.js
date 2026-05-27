export function renderMessageBox(id = "messageBox", config = {}) {
    const box = document.createElement("div");
    box.id = id;
    box.className = config.className ?? "";
    return box;
}
