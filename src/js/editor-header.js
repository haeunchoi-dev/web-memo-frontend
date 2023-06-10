const editorHeader = () => {
  const $editableHeading = document.querySelector("#header");
  const placeholderText = "제목";

  if (!$editableHeading.textContent) {
    addPlaceHolder();
  }

  function addPlaceHolder() {
    $editableHeading.textContent = placeholderText;
    $editableHeading.classList.add("placeholder");
  }

  function removePlaceHolder() {
    $editableHeading.textContent = "";
    $editableHeading.classList.remove("placeholder");
  }

  $editableHeading.addEventListener("focus", function () {
    if (this.textContent === placeholderText) {
      removePlaceHolder();
    }
  });

  $editableHeading.addEventListener("blur", function () {
    if (!this.textContent.trim()) {
      addPlaceHolder();
    }
  });
};

export default editorHeader;
