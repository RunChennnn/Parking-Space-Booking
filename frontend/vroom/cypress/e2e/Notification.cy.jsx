describe('Notification', () => {
  it('Finds a spot searching by address', () => {
    cy.visit('http://localhost:3000');
    cy.get('#register-button').click();

    // Register
    const password = 'Cypress1';
    cy.get('#email-input').type('notification@owner.com');
    cy.get('#password-input').type(password);
    cy.get('#confirm-password-input').type(password);
    cy.get('#register-button').click();

    // Get to new spot page
    cy.get('#nav-manage-spots-button').click();
    cy.get('#new-spot-button').click();

    // Make a new spot
    cy.get('#description-input').type('notification test');
    cy.get('#street-number-input').type('1');
    cy.get('#street-name-input').type('Parliament Drive');
    cy.get('#suburb-input').type('Canberra');
    cy.get('#postcode-input').type('2600');
    cy.get('#price-input').type('20');
    cy.get('#card-number-input').type('1234123412341234');
    cy.get('#card-name-input').type('John Howard');
    cy.get('#cvv-input').type('123');
    cy.get('#confirm-register-button').click();
    cy.contains('1 Parliament Drive Canberra')

    // Get to new spot page
    cy.get('#nav-manage-spots-button').click();
    cy.get('#new-spot-button').click();

    // Make a second spot
    cy.get('#description-input').type('notification test');
    cy.get('#street-number-input').type('2');
    cy.get('#street-name-input').type('Parliament Drive');
    cy.get('#suburb-input').type('Canberra');
    cy.get('#postcode-input').type('2600');
    cy.get('#price-input').type('20');
    cy.get('#card-number-input').type('1234123412341234');
    cy.get('#card-name-input').type('John Howard');
    cy.get('#cvv-input').type('123');
    cy.get('#confirm-register-button').click();
    cy.contains('1 Parliament Drive Canberra');

    // Log in as renter
    cy.get('#nav-logout-button').click();
    cy.get('#email-input').type('notification@renter.com');
    cy.get('#password-input').type('Cypress1');
    cy.get('#login-button').click();

    // Do search
    cy.get('#search-input').type('1 Parliament Drive Canberra');
    cy.get('#search-button').click();
    cy.contains('Maximum hourly price');
    cy.contains('View').click();

    // Rent spot
    cy.get('#rent-button').click();
    cy.contains('StartTimePicker').type('080120231200pm');
    cy.contains('EndTimePicker').type('080320231200pm');
    cy.get('#card-number-input').type('1234123412341234');
    cy.get('#card-name-input').type('John Howard');
    cy.get('#cvv-input').type('123');
    cy.get('#go-to-confirm-button').click();
    cy.get('#confirm-confirm-button').click();

    // Delete booking
    cy.get('#nav-my-account-button').click();
    cy.contains('notification@renter.com');
    cy.contains('View Booking').click();
    cy.get('#cancel-button').click();
    cy.get('#confirm-cancel-button').click();

    // Go to owner account
    cy.get('#nav-logout-button').click();
    cy.get('#email-input').type('notification@owner.com');
    cy.get('#password-input').type('Cypress1');
    cy.get('#login-button').click();

    // Check notification
    cy.get('#nav-notifications-button').click();
    cy.contains('postcode 2600 are in high demand')

    // Delete account
    cy.get('#nav-my-account-button').click();
    cy.get('#update-account-button').click();
    cy.get('#delete-account-button').click();
    cy.get('#auth-password-input').type(password);
    cy.get('#auth-confirm-button').click();

    // Check back at login page
    cy.contains('Don\'t have an account?');
  })
})