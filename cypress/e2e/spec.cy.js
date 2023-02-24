function recursivelyScroll(done) {
  cy.get("#scroller").scrollTo("right");
}
import { recurse } from "cypress-recurse";

describe("template spec", () => {
  it("Should display at least one facility in booking panel", (done) => {
    cy.visit("http://localhost:3000");
    cy.get("#walletaddress").type("rDF8kbsdZYfNSbXFwPLJEVBMB9p5P9pS5M");
    cy.get("#nodetypes").select("Test");
    cy.get("#nodetypes").select("Main");
    cy.wait(500);
    cy.get("#network").select("wss://xrpl.link");
    cy.contains("Enter").click();

    cy.wait(1000);

    recursivelyScroll(done);

    cy.get("#scroller").scrollTo("right");
    recurse(
      () => cy.contains("element", "Loading").should(() => {}),
      (card) => {
        console.log(card);
        card.length > 0;
      },
      {
        limit: 300,
        log: false,
        post() {
          // cy.intercept("/**").as("ajax-requests");

          //cy.wait("@ajax-requests", { timeout: 40000 });
          cy.gett("#scroller").should("not.have.class", "loading", {
            timeout: 20000,
          });
          recursivelyScroll(done);
        },
      }
    );
  });
});
