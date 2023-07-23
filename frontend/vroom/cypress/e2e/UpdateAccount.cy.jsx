describe('Update Account', () => {
  it('Update email', () => {
    cy.visit('http://localhost:3000');

    const password = 'Cypress1';

    // Add credentials
    cy.get('#email-input').type('cypress.tests@email.com');
    cy.get('#password-input').type(password);
    cy.get('#login-button').click();

    // Go to update page
    cy.get('#nav-my-account-button').click();
    cy.get('#update-account-button').click();

    // Submit new email
    cy.get('#email-input').should('have.value', 'cypress.tests@email.com')
    // cy.contains('cypress.tests@email.com', { timeout: 20000 });
    // cy.wait(500);
    cy.get('#email-input').focus().clear().type('cypress.temporary@email.com');
    cy.get('#update-account-button').click();
    cy.get('#auth-password-input').type(password);
    cy.get('#auth-confirm-button').click();

    cy.contains('cypress.temporary@email.com', { timeout: 20000 });

    // Go to update page
    cy.get('#nav-my-account-button').click();
    cy.get('#update-account-button').click();

    // Submit new email
    cy.get('#email-input').should('have.value', 'cypress.temporary@email.com')
    // cy.contains('cypress.temporary@email.com', { timeout: 20000 });
    // cy.wait(500);
    cy.get('#email-input').focus().clear().type('cypress.tests@email.com');
    cy.get('#update-account-button').click();
    cy.get('#auth-password-input').type(password);
    cy.get('#auth-confirm-button').click();

    cy.contains('cypress.tests@email.com', { timeout: 20000 });
  })

  it('Update password', () => {
    cy.visit('http://localhost:3000');

    const password = 'Cypress1';
    const fake_password = 'comp9900';

    // Add credentials
    cy.get('#email-input').type('cypress.tests@email.com');
    cy.get('#password-input').type(password);
    cy.get('#login-button').click();

    // Go to update page
    cy.get('#nav-my-account-button').click();
    cy.get('#update-account-button').click();

    // Submit new password
    cy.get('#password-input').type(fake_password);
    cy.get('#confirm-password-input').type(fake_password);
    cy.get('#update-account-button').click();
    cy.get('#auth-password-input').type(password);
    cy.get('#auth-confirm-button').click();

    cy.contains('cypress.tests@email.com', { timeout: 20000 });

    // Logout and login
    cy.get('#nav-logout-button').click();
    cy.contains('Don\'t have an account?', { timeout: 20000 });
    cy.get('#email-input').type('cypress.tests@email.com');
    cy.get('#password-input').type(fake_password);
    cy.get('#login-button').click();

    // Go to update page
    cy.get('#nav-my-account-button').click();
    cy.get('#update-account-button').click();

    // Reset password
    cy.get('#password-input').type(password);
    cy.get('#confirm-password-input').type(password);
    cy.get('#update-account-button').click();
    cy.get('#auth-password-input').type(fake_password);
    cy.get('#auth-confirm-button').click();

    cy.contains('No Upcoming Bookings') // Make sure test runs to completion
  })
})