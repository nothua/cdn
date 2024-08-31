const preloader = document.querySelector(".preloader");

document.addEventListener("DOMContentLoaded", () => {
  loadData();
});

function fadeOutPreloader() {
  const preloader = document.querySelector(".preloader");
  const pageContent = document.querySelector(".page-content");

  setTimeout(() => {
    preloader.style.display = "none";
    pageContent.style.display = "block";
    pageContent.style.opacity = 1;
  }, 500);
}

// const quill = new Quill("#editor", {
//   theme: "snow",
// });

document
  .querySelector("#createNewtemplate")
  .addEventListener("click", async function () {
    const turndownService = new TurndownService();
    const id = this.getAttribute("data-template-id");
    const name = document.querySelector("#templateName").value;
    const type = document.querySelector("#templateType").value;
    const content = document.querySelector("#templateContent").value;

    if (!name || !type || !content) {
      alert("Name, Type, and Content are required!");
      return;
    }

    try {
      const url = "/templates/create";

      axios
        .post(url, {
          name,
          type,
          data: content,
          id,
        })
        .then((response) => {
          //clean modal
          resetModal();

          showToast("Success", "Template created successfully!");

          loadData();
        });
    } catch (error) {
      showToast("Error", `Error creating template!\n${error}`);
    }
  });

function editTemplate(templateId) {
  axios
    .get(`/templates/${templateId}`)
    .then((response) => {
      const template = response.data;
      document.querySelector("#templateName").value = template.name;
      document.querySelector("#templateType").value = template.type;
      document.querySelector("#templateContent").value = template.content;

      document
        .getElementById("createNewtemplate")
        .setAttribute("data-template-id", template.id);

      const modal = new bootstrap.Modal(
        document.getElementById("templateForm")
      );
      modal.show();
    })
    .catch((error) => {
      console.log(error);
      showToast("Error", `Error loading template!\n${error}`);
    });
}

function deleteTemplate(templateId) {
  if (!confirm("Are you sure you want to delete this template?")) {
    return;
  }

  axios
    .delete(`/templates/${templateId}`)
    .then((response) => {
      showToast("Success", "Template deleted successfully!");
      loadData();
    })
    .catch((error) => {
      showToast("Error", `Error deleting template!\n${error}`);
    });
}

function showToast(title, message) {
  toast.querySelector(".toast-header").querySelector(".me-auto").innerText =
    title;
  toast.querySelector(".toast-body").innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}

function resetModal() {
  document.getElementById("templateName").value = "";
  document.getElementById("templateType").value = "Assist";
  document.getElementById("templateContent").value = "";
  document
    .getElementById("createNewtemplate")
    .removeAttribute("data-template-id");
}

function openCreateModal() {
  resetModal();

  const modal = new bootstrap.Modal(document.getElementById("templateForm"));
  modal.show();
}
