// internalLinksModal.js
export function initializeInternalLinksModal() {
    const modalBody = document.getElementById("internalLinksArea");
    const insertBtn = document.getElementById("insert-internal-link-btn");

    const langSelect = document.createElement("select");
    langSelect.id = "languageSelect";
    langSelect.className = "form-select mb-3";
    langSelect.innerHTML = `<option value="-">Select language</option>
        <option value="de">German</option>
        <option value="en">English</option>
    `;
    modalBody.appendChild(langSelect);

    const fileSelect = document.createElement("select");
    fileSelect.id = "internalLinkSelect";
    fileSelect.className = "form-select mb-3 caret";
    modalBody.appendChild(fileSelect);

    langSelect.addEventListener("change", () => {
        const selectedLang = langSelect.value;
        fetch(`/api/list?lang=${selectedLang}`)
            .then(response => response.json())
            .then(files => {
                fileSelect.innerHTML = "";
                addDefaultOption(fileSelect);
                files.forEach(file => addLinkOption(fileSelect, file, selectedLang));
            });
    });

    const linkTextInput = document.createElement("input");
    linkTextInput.type = "text";
    linkTextInput.id = "internalLinkText";
    linkTextInput.className = "form-control mt-3";
    linkTextInput.placeholder = "Enter link text (optional)";
    modalBody.appendChild(linkTextInput);

    insertBtn.addEventListener("click", () => {
        insertInternalLink();
    });
}

function addDefaultOption(selectElement) {
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Select a file";
    selectElement.appendChild(defaultOption);
}

function addLinkOption(selectElement, file, lang) {
    const option = document.createElement("option");
    option.value = file;
    option.text = file;
    option.setAttribute("data-language", lang);
    selectElement.appendChild(option);
}

function insertInternalLink() {
    const lang = document.getElementById("languageSelect").value;
    if (lang == "-") {
        alert("Please select a language and file");
        return;
    }
    const fileSelect = document.getElementById("internalLinkSelect");
    const path = fileSelect.value;
    const text = document.getElementById("internalLinkText").value;

    var showButton = document.getElementById("flexSwitchUseButton").value;
    showButton = showButton == "on" ? "true" : "false";
    var selectButtonColorElement = document.getElementById("buttonColorSelect");
    var selectedButtonColorValue = selectButtonColorElement.options[selectButtonColorElement.selectedIndex].value;
    const link = `{{< refLink ref="${path}" lang="${lang}" text="${text}" showButton="${showButton}" color="${selectedButtonColorValue}" >}}`;
    window.addEditorText(link);
    window.hideModal("internalLinksModal");
}