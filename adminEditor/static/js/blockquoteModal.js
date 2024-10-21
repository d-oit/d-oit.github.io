// blockquoteModal.js
export function initializeBlockquoteModal() {
    const insertBtn = document.getElementById("insert-blockquote-btn");
    insertBtn.addEventListener("click", () => {
        const type = document.getElementById("blockquote-type").value;
        window.addEditorText(`> [!${type}]\n> Your blockquote content here\n`);
        window.hideModal("blockquoteModal");
    });
}