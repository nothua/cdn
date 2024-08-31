async function loadData() {
  try {
    const response = await axios.get("/templates");

    const data = response.data;

    console.log(data);

    const table = $("#templates").DataTable();

    table.clear();

    data.forEach((template) => {
      table.row
        .add([
          template.name,
          template.type,
          `
                <span id="${template.id}-hidden-content" style="display:none">${template.content}</span>
                <button class="btn btn-sm btn-secondary" type="button" onclick="copyToClipboard('${template.id}')">
                    <i class="bi bi-clipboard me-2"></i> Copy
                </button>
                <a class="btn btn-sm btn-primary" onclick="editTemplate('${template.id}')">
                    <i class="bi bi-pencil me-2"></i> Edit
                </a>
                <button class="btn btn-sm btn-danger" type="button" onclick="deleteTemplate('${template.id}')">
                    <i class="bi bi-trash me-2"></i> Delete
                </button>
            `,
        ])
        .draw();
    });

    fadeOutPreloader();
  } catch (ex) {
    console.error(ex);
  }
}

function copyToClipboard(templateid) {
  const content = document.getElementById(
    `${templateid}-hidden-content`
  ).innerText;
  navigator.clipboard
    .writeText(content)
    .then(() => {
      showToast("Success", "Template copied to clipboard!");
    })
    .catch((error) => {
      showToast("Error", `Error copying template to clipboard!\n${error}`);
    });
}
