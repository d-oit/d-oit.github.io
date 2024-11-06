export function searchModalDialog(editor) {
  // eslint-disable-next-line no-undef
  const searchModal = new bootstrap.Modal(
    document.getElementById('searchModal'),
  );
  searchModal.show();

  const searchField = document.getElementById('searchQuery');
  const findNextBtn = document.getElementById('searchBtn');
  const findPrevBtn = document.getElementById('searchPrevBtn');
  const replaceBtn = document.getElementById('replaceBtn');

  // Search logic
  findNextBtn.onclick = () => {
    const query = searchField.value;
    if (query) {
      editor.execCommand('find', { query });
    }
  };

  findPrevBtn.onclick = () => {
    const query = searchField.value;
    if (query) {
      editor.execCommand('findPrev', { query });
    }
  };

  replaceBtn.onclick = () => {
    const query = searchField.value;
    const replaceText = window.prompt('Replace with:');
    if (query && replaceText !== null) {
      editor.execCommand('replace', { query, replaceText });
    }
  };
}
