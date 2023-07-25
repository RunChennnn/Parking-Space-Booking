describe('Search', () => {
  it('Finds a spot searching by address', () => {
    cy.visit('http://localhost:3000/');

    // Add credentials
    cy.get('#email-input').type('cypress.tests@email.com');
    cy.get('#password-input').type('Cypress1');
    cy.get('#login-button').click();

    // Do search
    cy.get('#search-input').type('george');
    cy.get('#search-button').click();
    cy.contains('Maximum hourly price');

    // Check content
    cy.contains('View').click();
    cy.contains('Recent Reviews');
    cy.contains('485 George Street Sydney 2000');
    // cy.contains('Regular price per hour: $15.00');
  })

  it('Finds a spot searching by user', () => {
    cy.visit('http://localhost:3000/');

    // Add credentials
    cy.get('#email-input').type('cypress.tests@email.com');
    cy.get('#password-input').type('Cypress1');
    cy.get('#login-button').click();

    // Do search
    cy.get('#search-input').type('nickistestingemail');
    cy.get('#search-button').click();
    cy.contains('Maximum hourly price');

    // Check content
    // cy.contains('Address: 485 George Street Sydney 2000');
    // cy.contains('Regular price per hour: $15.00');
    cy.contains('View').click();
    cy.contains('Recent Reviews');
    cy.contains('108 ANU street Acton 2601');
  })
})