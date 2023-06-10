const clickBtnTemplate = () => {
  cy.get("#btn-template").click();
};

const inputDiv = (target, n, value) => {
  cy.get(target).eq(n).invoke("text", value);
  cy.get(target).eq(n).focus();

  cy.get(".addition-template-result").click();
  cy.get(target).eq(n).should("not.be.focused");
};

describe("template spec", () => {
  beforeEach("페이지 방문", () => {
    cy.visit("../../src/memo.html");
  });

  it("최초에 페이지에 접속하면 display에 비어있는 에디터와 템플릿 버튼이 표시된다.", () => {
    cy.get("#header").should("be.visible");
    cy.get("#editor").should("be.visible");
    cy.get("#btn-template").should("be.visible");
  });

  it("에디터의 가산 템플릿 버튼을 누르면 에디터에 체크된 두개의 항목과 합계가 있는 템플릿이 표시된다.", () => {
    clickBtnTemplate();
    cy.get("[name='addition-template']").should("be.visible");
  });

  it("첫번째 항목에 1을 입력하고 포커스아웃시 합계에 1이 표시된다.", () => {
    clickBtnTemplate();
    inputDiv(".addition-template-table-td-number-input", 0, "1");

    cy.get(".addition-template-result").should("have.text", "1");
  });

  it("첫번째 항목에 01을 입력하고 포커스아웃시 합계에 1이 표시된다.", () => {
    clickBtnTemplate();
    inputDiv(".addition-template-table-td-number-input", 0, "01");

    cy.get(".addition-template-result").should("have.text", "1");
  });

  it("템플릿의 + 버튼을 누르면 체크된 항목이 추가된다.", () => {
    clickBtnTemplate();
    cy.get(".addition-template-tr-add-btn").click();

    cy.get(".addition-template-table tr").its("length").should("eq", 4);
  });

  it("각 항목에 1을 입력하면 합계에 2가 표시된다.", () => {
    clickBtnTemplate();
    inputDiv(".addition-template-table-td-number-input", 0, "1");
    inputDiv(".addition-template-table-td-number-input", 1, "1");
    cy.get(".addition-template-result").should("have.text", "2");
  });

  it("체크박스를 해제하면 합계에 1이 표시된다.", () => {
    clickBtnTemplate();
    inputDiv(".addition-template-table-td-number-input", 0, "1");
    inputDiv(".addition-template-table-td-number-input", 1, "1");

    cy.get('.addition-template-table input[type="checkbox"]').eq(0).uncheck();

    cy.get(".addition-template-result").should("have.text", "1");
  });

  it("항목의 체크박스를 누르면 합계에 2가 표시된다.", () => {
    clickBtnTemplate();
    inputDiv(".addition-template-table-td-number-input", 0, "1");
    inputDiv(".addition-template-table-td-number-input", 1, "1");

    cy.get('.addition-template-table input[type="checkbox"]').eq(0).uncheck();
    cy.get('.addition-template-table input[type="checkbox"]').eq(0).check();

    cy.get(".addition-template-result").should("have.text", "2");
  });

  it("항목의 오른쪽에 삭제 버튼을 누르면 항목이 사라지고 합계에 1이 표시된다.", () => {
    clickBtnTemplate();
    inputDiv(".addition-template-table-td-number-input", 0, "1");
    inputDiv(".addition-template-table-td-number-input", 1, "1");

    cy.get(".addition-template-td-delete-btn").eq(0).click();
    cy.get(".addition-template-result").should("have.text", "1");
    cy.get(".addition-template-table tr").its("length").should("eq", 2);
  });

  it("항목의 오른쪽에 삭제 버튼을 누르면 템플릿이 사라진다.", () => {
    clickBtnTemplate();
    inputDiv(".addition-template-table-td-number-input", 0, "1");
    inputDiv(".addition-template-table-td-number-input", 1, "1");

    cy.get(".addition-template-td-delete-btn").eq(0).click();
    cy.get(".addition-template-td-delete-btn").eq(0).click();
    cy.get("[name='addition-template']").should("not.exist");
  });
});
