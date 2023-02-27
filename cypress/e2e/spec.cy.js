import { recurse } from "cypress-recurse";

describe("template spec", () => {
  it("Should display at least one facility in booking panel", () => {
    cy.visit("http://localhost:3000");
    cy.get("#walletaddress").type("rK8B6YThXFfgJywBQoPykQvkqGE9FTBy7y");
    cy.get("#nodetypes").select("Test");
    cy.get("#nodetypes").select("Main");
    cy.wait(500);
    cy.get("#network").select("wss://xrpl.link");
    cy.contains("Enter").click();

    cy.wait(1000);

    recurse(
      () => cy.get("#sentinel").should(() => {}),
      (card) => {
        card.should("not.exist");
      },
      {
        log: true,
        limit: 120, // max number of iterations
        timeout: 3000000, // time limit in ms
        delay: 2000,
        post() {
          cy.get(".card").then((card) => {
            cy.get("#scroller").scrollTo("right");
            cy.get(".card").should("have.length.greaterThan", card.length);
          });
        },
      }
    );
  });
});
