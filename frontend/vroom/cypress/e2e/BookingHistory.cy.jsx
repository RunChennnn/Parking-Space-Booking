describe('Booking History', () => {
  it('Displays history correctly as renter', () => {
    cy.visit('http://localhost:3000');

    // Add credentials
    cy.get('#email-input').type('cypress.renter@email.com');
    cy.get('#password-input').type('Cypress1');
    cy.get('#login-button').click();

    // Navigate to history
    cy.get('#nav-my-account-button').click();
    cy.get('#view-history-button').click();

    // Check content
    cy.contains('Booking History');
    cy.contains('485 George Street Sydney 2000');
    cy.contains('Sunday, 16 July');

    // Go to review page
    cy.contains('View').click();

    // Check content
    cy.contains('Leave your review here!');
    cy.contains('Address: 485 George Street Sydney 2000');
    cy.url().should('contain', '/review/');
  })

  it('Displays history correctly as owner', () => {
    cy.visit('http://localhost:3000');

    // Add credentials
    cy.get('#email-input').type('cypress.owner@email.com');
    cy.get('#password-input').type('Cypress1');
    cy.get('#login-button').click();

    // Navigate to history
    cy.get('#nav-my-account-button').click();
    cy.get('#view-history-button').click();

    // Check content
    cy.contains('Booking History');
    cy.contains('485 George Street Sydney 2000 (as owner)');
    cy.contains('Sunday, 16 July');

    // Go to review page
    cy.contains('View').click();

    // Check content
    cy.contains('Address: 485 George Street Sydney 2000');
    cy.url().should('contain', '/view/');
  })

  it('Displays history of empty account correctly', () => {
    cy.visit('http://localhost:3000');

    // Add credentials
    cy.get('#email-input').type('cypress.tests@email.com');
    cy.get('#password-input').type('Cypress1');
    cy.get('#login-button').click();

    // Navigate to history
    cy.get('#nav-my-account-button').click();
    cy.get('#view-history-button').click();

    // Check content
    cy.contains('No previous bookings to show');
  })

})

// describe('Login', loginTest)

// export default loginTest