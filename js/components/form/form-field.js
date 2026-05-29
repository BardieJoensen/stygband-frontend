export function renderFormField(labelText, inputConfig) {
    const group = document.createElement("div");
    group.className = "form-field";

    // Only render label if provided
    if (labelText !== null && labelText !== undefined) {
        const label = document.createElement("label");
        label.textContent = labelText;
        label.htmlFor = inputConfig.id;
        group.appendChild(label);
    }

    const input = document.createElement("input");
    input.type = inputConfig.type;
    input.id = inputConfig.id;

    if (inputConfig.placeholder) input.placeholder = inputConfig.placeholder;
    if (inputConfig.required) input.required = true;

    // Handle null, empty string, and real values
    if (inputConfig.value !== undefined) {
        input.value = inputConfig.value === null ? "" : inputConfig.value;
    }

    group.appendChild(input);

    return { group, input };
}