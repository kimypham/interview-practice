describe('App E2E', () => {
    it('should display the main page', () => {
        cy.visit('/');

        cy.contains('Hello World! (And hello Canva!)');
    });
});
