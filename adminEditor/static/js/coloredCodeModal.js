// coloredCodeModal.js
export function initializeColoredCodeModal () {
  const insertBtn = document.getElementById('insert-colored-code-btn')
  const languageSelect = document.getElementById('code-language')

  const languages = ['JavaScript', 'Python', 'HTML', 'CSS', 'C#', 'Hugo', 'Java', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'TypeScript', 'Go', 'Rust', 'R', 'Perl', 'Scala', 'Dart', 'SQL', 'Bash', 'PowerShell', 'MATLAB', 'Objective-C', 'Assembly', 'Fortran', 'COBOL', 'Lua', 'Clojure', 'Elixir', 'Erlang', 'F#', 'Haskell', 'Julia', 'Lisp', 'Pascal', 'Prolog', 'Racket', 'Scheme', 'Json', 'XML', 'YAML', 'VHDL', 'LaTeX', 'Less', 'SCSS', 'Shell']
  languages.forEach(lang => {
    const option = document.createElement('option')
    option.value = lang.toLowerCase()
    option.textContent = lang
    languageSelect.appendChild(option)
  })

  insertBtn.addEventListener('click', () => {
    const language = document.getElementById('code-language').value
    const code = document.getElementById('code-content').value
    const formattedCode = '```' + language + '\n' + code + '\n```'
    window.addEditorText(formattedCode)
    window.hideModal('coloredCodeModal')
  })
}
