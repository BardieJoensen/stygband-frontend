export function renderSelectFormField(labelText, selectConfig) {
    const group = document.createElement("div");
    group.className = "form-field";

    const label = document.createElement("label");
    label.textContent = labelText;
    label.htmlFor = selectConfig.id;

    const select = document.createElement("select");
    select.id = selectConfig.id;
    if (selectConfig.required) select.required = true;

    // Add options if provided
    if (Array.isArray(selectConfig.options)) {
        selectConfig.options.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option.value;
            opt.textContent = option.text;
            select.appendChild(opt);
        });
    }

    group.append(label, select);

    return { group, select };
}
