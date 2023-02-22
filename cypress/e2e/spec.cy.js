function recursivelyScroll(done) {
  cy.get("#scroller")
    .scrollTo("right")
    .then(($el) => {
      // If the element contains a loading class, we wait one second and scroll down again
      if ($el.find(".sentinel").length > 0) {
        debugger;
        cy.intercept("/**").as("ajax-requests");

        cy.wait("@ajax-requests").then(() => {
          recursivelyScroll(done);
        });
      } else {
        // We are done waiting, no more loading is needed
        // write test here

        done();
      }
    });
}
import { recurse } from "cypress-recurse";

describe("template spec", () => {
  it("Should display at least one facility in booking panel", (done) => {
    cy.visit("http://localhost:3000");
    cy.get("#walletaddress").type("rhCmJgCKMZWosWF3R2cUHjroQZCQAZ4KWE");
    cy.get("#nodetypes").select("Test");
    cy.get("#nodetypes").select("Main");
    cy.wait(500);
    cy.get("#network").select("wss://xrpl.link");
    cy.contains("Enter").click();

    cy.wait(1000);

    recursivelyScroll(done);
  });
});
