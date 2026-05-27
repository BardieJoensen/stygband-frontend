// /components/form/submit-button.js
export function renderSubmitBtn(text = "Submit", config = {}) {
    const btn = document.createElement("button");
    btn.type = "submit";
    btn.className = config.className ?? "btn";
    btn.id = config.id ?? "submitBtn";
    btn.disabled = config.disabled ?? false;
    btn.textContent = text;

    return btn;
}