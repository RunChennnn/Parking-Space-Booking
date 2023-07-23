describe('Search', () => {
  it('Finds a spot in search', () => {
    cy.visit('http://localhost:3000/');

    // Add credentials
    cy.get('#email-input').type('cypress.tests@email.com');
    cy.get('#password-input').type('Cypress1');
    cy.get('#login-button').click();

    // Do search
    cy.get('#search-input').type('george');
    cy.get('#search-button').click();

    // Check content
    cy.contains('Address: 485 George Street Sydney 2000');
    cy.contains('Regular price per hour: $15.00');
  })
})