/* eslint-disable */

// Adapted from https://github.com/fiduswriter/simple-datatables/blob/main/docs/demos/19-bootstrap-table/index.html
let tableOptions = {
    perPage: 10,
    locale: "{{ site.Language.Lang | default "en" }}",
    labels: {
      "placeholder": "{{ T "tablePlaceholder" }}",
      "searchTitle": "{{ T "tablesSearchTitle" }}",
      "perPage": "{{ T "tablesPerPage" }}",
      "noRows": "{{ T "tablesNoRows" }}",
      "noResults": "{{ T "tablesNoResults" }}",
      "info": "{{ T "tablesInfo" }}"
    },
    perPageSelect: [5, 10, 20, 50, ["{{ T "tablePageSelectAll" }}", -1]],
     classes: {
         active: "active",
         disabled: "disabled",
         selector: "form-control form-select",
         paginationList: "pagination",
         paginationListItem: "page-item",
         paginationListItemLink: "page-link"

     },
    // // template: options => `<div class='${options.classes.top} fixed-table-toolbar'>
    // // ${
    // // options.paging && options.perPageSelect ?
    // // `<div class='${options.classes.dropdown} bs-bars float-left'>
    // // <label>
    // // <select class='${options.classes.selector}'></select>
    // // </label>
    // // </div>` :
    // // ""
    // // }
    // // ${
    // // options.searchable ?
    // // `<div class='${options.classes.search} float-right search btn-group'>
    // // <input class='${options.classes.input} form-control search-input' placeholder='Search' type='search' title='Search within table'>
    // // </div>` :
    // // ""
    // // }
    // // </div>
    // // <div class='${options.classes.bottom}'>
    // // ${
    // // options.paging ?
    // // `<div class='${options.classes.info}'></div>` :
    // // ""
    // // }
    // // <nav class='${options.classes.pagination}'></nav>
    // // </div>`,
    // tableRender: (_data, table, _type) => {
    //     // ignore type ('main', 'print', 'header', 'message')
    //     const thead = table.childNodes[0]
    //     thead.childNodes[0].childNodes.forEach(th => {
    //         if (!th.attributes) {
    //             th.attributes = {}
    //         }
    //         th.attributes.scope = "col"
    //         const innerHeader = th.childNodes[0]
    //         if (!innerHeader.attributes) {
    //             innerHeader.attributes = {}
    //         }
    //         let innerHeaderClass = innerHeader.attributes.class ? `${innerHeader.attributes.class} th-inner` : "th-inner"
    
    //         if (innerHeader.nodeName === "a") {
    //             innerHeaderClass += " sortable sortable-center both"
    //             if (th.attributes.class?.includes("desc")) {
    //                 innerHeaderClass += " desc"
    //             } else if (th.attributes.class?.includes("asc")) {
    //                 innerHeaderClass += " asc"
    //             }
    //         }
    //         innerHeader.attributes.class = innerHeaderClass
    //     })
    
    //     return table
    // }
}    

document.querySelectorAll('.data-table').forEach(tbl => {
    let sortable = (tbl.getAttribute('data-table-sortable') === 'true')
    tableOptions.sortable = sortable;
    let paging = (tbl.getAttribute('data-table-paging') === 'true')
    tableOptions.paging = paging;
    let searchable = (tbl.getAttribute('data-table-searchable') === 'true')
    tableOptions.searchable = searchable;
    tableOptions.locale =  (tbl.getAttribute('data-table-locale'))
    var labels = tbl.getAttribute('data-table-labels');
    tableOptions.labels =  JSON.parse(labels)
    window.dt = new window.simpleDatatables.DataTable(tbl, 
        tableOptions
    )
})
