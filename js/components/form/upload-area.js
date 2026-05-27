export function renderUploadArea(labelText, config = {}) {
    const group = document.createElement("div");
    group.className = "form-field";

    const label = document.createElement("label");
    label.textContent = labelText;
    label.htmlFor = config.inputId ?? "fileInput";

    const wrapper = document.createElement("label");
    wrapper.className = "upload-area";
    wrapper.id = config.id ?? "uploadArea";
    wrapper.tabIndex = 0;

    const span = document.createElement("span");
    span.textContent = config.placeholder ?? "Tap or drop files here";

    const input = document.createElement("input");
    input.type = "file";
    input.id = config.inputId ?? "fileInput";
    input.multiple = config.multiple ?? true;
    input.accept = config.accept ?? "image/*";
    if (config.capture) input.capture = config.capture;

    wrapper.append(span, input);

    const preview = document.createElement("div");
    preview.className = "preview";
    preview.id = `${input.id}-preview`;

    group.append(label, wrapper, preview);

    return {
        group,
        wrapper,
        input,
        preview
    };
}
