describe('Kino Sandviken', () => {
  it('is the correct port', () => {
    cy.visit('http://localhost:5080/');
    cy.location().should((loq) => {
      expect(loq.host).to.eq('localhost:5080');
    });
  });

  it("has the text 'exklusiv IMAX-duk'", () => {
    cy.visit('http://localhost:5080/');
    cy.get('.modal-answer').contains('exklusiv IMAX-duk');
  });

  it("has a button with the text 'Logga in'", () => {
    cy.visit('http://localhost:5080/');
    cy.get('#loginButton').should('have.text', 'Logga in');
  });

  it('opens a modal when clicking the login button', () => {
    cy.visit('http://localhost:5080/');
    cy.get('#loginButton').should('have.text', 'Logga in');
    cy.get('#loginButton').click();
    cy.get('#register-btn').contains('Bli medlem');
  });

  it('inputs correct credentials in LS', () => {
    cy.visit('http://localhost:5080/');
    cy.get('#loginButton').click();
    cy.get('#register-btn').click();

    cy.get('#su-fname').type('Viktor');
    cy.get('#su-lname').type('Eriksson');
    cy.get('#su-username').type('viktornoskire');
    cy.get('#su-mail').type('mail@gmail.com');
    cy.get('#su-password').type('apelsin');
    cy.get('#su-c-password').type('apelsin');

    cy.get('.signup-form').submit();

    cy.get('#signup-confirm').contains('slutförd');
  });

  it('inputs incorrect credentials in LS', () => {
    cy.visit('http://localhost:5080/');
    cy.get('#loginButton').click();
    cy.get('#register-btn').click();

    cy.get('#su-fname').type('Viktor');
    cy.get('#su-lname').type('Eriksson');
    cy.get('#su-username').type('viktornoskire');
    cy.get('#su-mail').type('mail@gmail.com');
    cy.get('#su-password').type('apelsin');
    cy.get('#su-c-password').type('äpple');

    cy.get('.signup-form').submit();

    cy.get('#c-password-error').contains('Lösenorden matchar ej');
  });

  it('inputs existing credentials in LS', () => {
    cy.visit('http://localhost:5080/');
    cy.get('#loginButton').click();
    cy.get('#register-btn').click();

    cy.get('#su-fname').type('Viktor');
    cy.get('#su-lname').type('Eriksson');
    cy.get('#su-username').type('viktornoskire');
    cy.get('#su-mail').type('mail@gmail.com');
    cy.get('#su-password').type('apelsin');
    cy.get('#su-c-password').type('apelsin');

    cy.get('.signup-form').submit();

    cy.get('#goto-login').click();

    cy.get('#register-btn').click();
    cy.get('#su-fname').type('John');
    cy.get('#su-lname').type('Doe');
    cy.get('#su-username').type('viktornoskire');
    cy.get('#su-mail').type('mail@gmail.com');
    cy.get('#su-password').type('päron');
    cy.get('#su-c-password').type('päron');

    cy.get('.signup-form').submit();

    cy.get('#username-error').contains('Användarnamn upptaget');
    cy.get('#mail-error').contains('E-postadress upptaget');
  });
});
