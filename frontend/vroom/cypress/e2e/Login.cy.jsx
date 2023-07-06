function loginTest () {
  it('Fail due to incorrect email', () => {
    cy.visit('http://localhost:3000');

    // Add credentials
    cy.get('#email-input').type('cypress.tests.wrong@email.com');
    cy.get('#password-input').type('Cypress1');
    cy.get('#login-button').click();

    cy.contains('Invalid username or password, please try again.');
  })

  it('Fail due to incorrect password', () => {
    cy.visit('http://localhost:3000');

    // Add credentials
    cy.get('#email-input').type('cypress.tests@email.com');
    cy.get('#password-input').type('Cypress1wrong');
    cy.get('#login-button').click();

    cy.contains('Invalid username or password, please try again.');
  })

  it('Fail due to no password entered', () => {
    cy.visit('http://localhost:3000');

    // Add credentials
    cy.get('#email-input').type('cypress.tests@email.com');
    cy.get('#login-button').click();

    cy.contains('Please enter a password and try again.');
  })

  it('Successful login', () => {
    cy.visit('http://localhost:3000');

    // Add credentials
    cy.get('#email-input').type('cypress.tests@email.com');
    cy.get('#password-input').type('Cypress1');
    cy.get('#login-button').click();

    // Check existence of home page
    cy.url().should('contain', '/home');
  })
}

describe('Login', loginTest)

export default loginTest