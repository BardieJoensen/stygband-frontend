export function renderFormField(labelText, inputConfig) {
    const group = document.createElement("div");
    group.className = "form-field";

    const label = document.createElement("label");
    label.textContent = labelText;
    label.htmlFor = inputConfig.id;

    const input = document.createElement("input");
    input.type = inputConfig.type;
    input.id = inputConfig.id;

    if (inputConfig.placeholder) input.placeholder = inputConfig.placeholder;
    if (inputConfig.required) input.required = true;

    // Default value support
    if (inputConfig.value !== undefined) {
        input.value = inputConfig.value;
    }

    group.append(label, input);

    return { group, input };
}
