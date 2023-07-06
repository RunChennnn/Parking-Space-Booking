
describe('Register', () => {
  it('Fail due to used email', () => {
    cy.visit('http://localhost:3000');
    cy.get('#register-button').click();

    // Add credentials
    const password = 'Cypress1';
    cy.get('#email-input').type('cypress.tests@email.com');
    cy.get('#password-input').type(password);
    cy.get('#confirm-password-input').type(password);
    cy.get('#register-button').click();

    cy.contains('This email address is already used for an account. Please select a different email address and try again.');
  })

  it('Fail due to invalid email', () => {
    cy.visit('http://localhost:3000');
    cy.get('#register-button').click();

    // Add credentials
    const password = 'Cypress1';
    cy.get('#email-input').type('hello');
    cy.get('#password-input').type(password);
    cy.get('#confirm-password-input').type(password);
    cy.get('#register-button').click();

    cy.contains('Please choose a valid email address.');
  })

  it('Fail due to weak password (too short)', () => {
    cy.visit('http://localhost:3000');
    cy.get('#register-button').click();

    // Add credentials
    
    const password = 'C0i';
    cy.get('#email-input').type('cypress.tests@email.com');
    cy.get('#password-input').type(password);
    cy.get('#confirm-password-input').type(password);
    cy.get('#register-button').click();

    cy.contains('Please choose a different password and try again. Passwords must contain at least 8 characters, and contain at least 2 of the following: lowercase characters, uppercase characters, numbers.');
  })

  it('Fail due to weak password (not enough character types)', () => {
    cy.visit('http://localhost:3000');
    cy.get('#register-button').click();

    // Add credentials
    const password = 'this is a long but insecure password';
    cy.get('#email-input').type('cypress.tests@email.com');
    cy.get('#password-input').type(password);
    cy.get('#confirm-password-input').type(password);
    cy.get('#register-button').click();

    cy.contains('Please choose a different password and try again. Passwords must contain at least 8 characters, and contain at least 2 of the following: lowercase characters, uppercase characters, numbers.');
  })

  it('Fail due to mismatched passwords', () => {
    cy.visit('http://localhost:3000');
    cy.get('#register-button').click();

    // Add credentials
    cy.get('#email-input').type('cypress.tests@email.com');
    cy.get('#password-input').type('ValidPassword');
    cy.get('#confirm-password-input').type('MismatchedPassword');
    cy.get('#register-button').click();

    cy.contains('Please ensure passwords match and try again.');
  })

  it('Successful registration and deletion', () => {
    cy.visit('http://localhost:3000');
    cy.get('#register-button').click();

    // Register
    const password = 'Cypress1';
    cy.get('#email-input').type('test.cypress@actual.com');
    cy.get('#password-input').type(password);
    cy.get('#confirm-password-input').type(password);
    cy.get('#register-button').click();

    // Delete account
    cy.get('#nav-my-account-button').click();
    cy.get('#update-account-button').click();
    cy.get('#delete-account-button').click();
    cy.get('#auth-password-input').type(password);
    cy.get('#auth-confirm-button').click();

    // Check back at login page
    cy.contains('Don\'t have an account?', { timeout: 20000});

    // NOTE: if this fails, you might need to manually delete the 
    // account registered above.
  })
})

// describe('Register', registerTest)

// export default registerTest