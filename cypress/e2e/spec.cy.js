import { recurse } from "cypress-recurse";

describe("template spec", () => {
  [
    "radT5HJfA6yWP2yvukhG1KxyQq38SybCZw",
    "rK8B6YThXFfgJywBQoPykQvkqGE9FTBy7y",
    "rHh17LPJywYqBRVkmHANRH3cJeyZ3t7DCP",
    "rsvSVU4PGY1erjVtkLBGSeK8BnXUUpjs4K",
    "rD4HRrWLKmxw4kQhQtB7o8pX9464EyD6ov",
  ].forEach((address) => {
    it("Should load " + address, () => {
      cy.visit("http://localhost:3000");
      cy.get("#walletaddress").type(address);
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
              cy.get(".card").should("have.length.least", card.length);
            });
          },
        }
      );
    });
  });
});
