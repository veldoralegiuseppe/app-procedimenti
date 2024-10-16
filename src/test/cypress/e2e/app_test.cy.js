describe('Verifica il titolo della finestra principale', () => {
    it('Dovrebbe avere il titolo corretto', () => {
      // Visita l'app in esecuzione - imposta la porta giusta per la tua app
      cy.visit('http://localhost:3000'); 
  
      // Verifica che il titolo del documento sia quello corretto
      cy.title().should('eq', 'Hello World!'); // Sostituisci 'Titolo della tua App' con il titolo reale
    });
  });
  