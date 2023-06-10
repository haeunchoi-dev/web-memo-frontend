function additionTemplate() {
  const $btnTemplate = document.querySelector("#btn-template");
  const $editor = document.getElementById("editor");

  function getNode(tag) {
    return document.createElement(tag);
  }

  function addClass(node, className) {
    node.classList.add(className);
  }

  function getTemplateTable() {
    const table = getNode("table");
    const colgroup = gatTemplateTableColgroup();
    const tr1 = getTemplateTableTr();
    const tr2 = getTemplateTableTr();

    addClass(table, "addition-template-table");

    table.appendChild(colgroup);
    table.appendChild(tr1);
    table.appendChild(tr2);

    return table;
  }

  function gatTemplateTableColgroup() {
    const colgroup = getNode("colgroup");
    const col1 = getNode("col");
    const col2 = getNode("col");
    const col3 = getNode("col");

    col1.setAttribute("width", "8%");
    col2.setAttribute("width", "50%");
    col3.setAttribute("width", "40%");

    colgroup.appendChild(col1);
    colgroup.appendChild(col2);
    colgroup.appendChild(col3);

    return colgroup;
  }

  function getTemplateTableTr() {
    const tr = getNode("tr");
    const td1 = getTemplateTableFirstTd();
    const td2 = getTemplateTableSecondTd();
    const td3 = getTemplateTableLastTd();

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    return tr;
  }

  function getTemplateTableFirstTd() {
    const td = getNode("td");
    const checkbox = getTemplateTableFirstTdCheckBox();

    td.appendChild(checkbox);

    return td;
  }

  function getTemplateTableFirstTdCheckBox() {
    const checkbox = getNode("input");

    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("checked", "checked");

    checkbox.addEventListener("change", function (e) {
      const isChecked = e.target.checked;
      const tr = e.target.closest("tr");
      if (isChecked) {
        tr.classList.remove("strikethrough");
      } else {
        tr.classList.add("strikethrough");
      }

      sumAllLastTdInput(e.target.closest("table"));
    });

    return checkbox;
  }

  function getTemplateTableSecondTd() {
    const td = getNode("td");
    const divContentEditable = getNode("div");

    divContentEditable.setAttribute("contenteditable", "true");

    td.appendChild(divContentEditable);

    return td;
  }

  function getTemplateTableLastTd() {
    const td = getNode("td");
    const divNumberInput = getTemplateTableLastTdInput();
    const divDeleteBtn = getTemplateTableTrRemoveBtn();

    addClass(td, "addition-template-table-td-last");

    td.appendChild(divNumberInput);
    td.appendChild(divDeleteBtn);

    return td;
  }

  function getTemplateTableLastTdInput() {
    const divNumberInput = getNode("div");
    addClass(divNumberInput, "addition-template-table-td-number-input");
    divNumberInput.setAttribute("contenteditable", "true");

    divNumberInput.addEventListener("blur", function (e) {
      checkNumber(e.target, e.target.innerText);
      sumAllLastTdInput(e.target.closest("table"));
    });

    return divNumberInput;
  }

  function adjustedCursorPosition(node) {
    var range = document.createRange();
    var selection = window.getSelection();
    range.selectNodeContents(node);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function checkNumber(node, value) {
    let inputValue = value;

    if (inputValue.startsWith("-")) {
      inputValue = "-" + inputValue.replace(/[^0-9.]/g, "");
    } else {
      inputValue = inputValue.replace(/[^0-9.]/g, "");
    }

    const decimalCount = (inputValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
      const parts = inputValue.split(".");
      inputValue = parts.shift() + "." + parts.join("");
    }

    const numericValue = parseFloat(inputValue);
    inputValue = isNaN(numericValue) ? "" : numericValue;

    node.innerText = inputValue;
  }

  function sumAllLastTdInput(table) {
    const selectedRows = Array.from(table.querySelectorAll("tr")).filter(
      function (row) {
        const checkbox = row.querySelector('input[type="checkbox"]');
        return checkbox && checkbox.checked;
      }
    );

    const result = selectedRows.reduce(
      (sum, o) =>
        sum +
        Number(
          o
            .querySelector(".addition-template-table-td-number-input")
            .innerText.trim()
        ),
      0
    );

    table
      .closest("[name='addition-template']")
      .querySelector(".addition-template-result").innerText = result;
  }

  function getTemplateTableTrRemoveBtn() {
    const deleteBtn = getNode("div");

    deleteBtn.setAttribute("role", "button");
    addClass(deleteBtn, "addition-template-td-delete-btn");
    deleteBtn.textContent = "-";

    deleteBtn.addEventListener("click", function (e) {
      const closestTable = e.target.closest("table");
      if (closestTable.getElementsByTagName("tr").length == 1) {
        e.target.closest("[name='addition-template']").remove();
      } else {
        e.target.closest("tr").remove();
      }
      sumAllLastTdInput(closestTable);
    });

    return deleteBtn;
  }

  function getTemplateTableControlBtn() {
    const cntBtn = getNode("div");
    cntBtn.setAttribute("role", "button");
    addClass(cntBtn, "addition-template-cnt-btn");
    cntBtn.textContent = "...";

    //Control event 등록

    return cntBtn;
  }

  function getTemplateTableTrAddBtn() {
    const trAddBtn = getNode("div");
    trAddBtn.setAttribute("role", "button");
    addClass(trAddBtn, "addition-template-tr-add-btn");
    trAddBtn.textContent = "+";

    trAddBtn.addEventListener("click", function (e) {
      e.target
        .closest("[name='addition-template']")
        .querySelector("table")
        .appendChild(getTemplateTableTr());
    });

    return trAddBtn;
  }

  function getTemplateResultTable() {
    const resultTable = getNode("table");
    const resultTr = getNode("tr");
    const resultTd = getNode("td");

    addClass(resultTable, "addition-template-table");
    addClass(resultTd, "addition-template-result");
    resultTd.textContent = "0";

    resultTr.appendChild(resultTd);
    resultTable.appendChild(resultTr);

    return resultTable;
  }

  function getTemplate() {
    const additionTemplateNode = getNode("div");
    const tableDivNode = getNode("div");
    const tableNode = getTemplateTable();
    const cntBtn = getTemplateTableControlBtn();
    const trAddBtn = getTemplateTableTrAddBtn();
    const resultTable = getTemplateResultTable();

    additionTemplateNode.setAttribute("name", "addition-template");
    additionTemplateNode.setAttribute("contenteditable", "false");
    tableDivNode.classList.add("addition-template-table-div");

    tableDivNode.appendChild(tableNode);
    tableDivNode.appendChild(cntBtn);
    tableDivNode.appendChild(trAddBtn);

    additionTemplateNode.appendChild(tableDivNode);
    additionTemplateNode.appendChild(resultTable);

    return additionTemplateNode;
  }

  function appendNode(node) {
    $editor.appendChild(node);
  }

  function insertNodeAfterCaret(selection, node) {
    const range = selection.getRangeAt(0);
    range.insertNode(node);
    range.setStartAfter(node);
    range.setEndAfter(node);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function isCursorInEditor(selection) {
    return (
      selection.rangeCount > 0 &&
      $editor.contains(selection.getRangeAt(0).endContainer)
    );
  }

  function addTemplate() {
    const selection = window.getSelection();
    const template = getTemplate();
    const br = getNode("br");

    if (isCursorInEditor(selection)) {
      insertNodeAfterCaret(selection, template);
      insertNodeAfterCaret(selection, br);
    } else {
      appendNode(template);
      appendNode(br);
    }
  }

  $btnTemplate.addEventListener("click", addTemplate);
}
additionTemplate();
