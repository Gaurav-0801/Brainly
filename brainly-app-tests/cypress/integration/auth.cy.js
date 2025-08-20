/// <reference types="cypress" />

describe('JWT Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login with valid credentials', () => {
    cy.get('[data-cy="email-input"]').type('user@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="login-button"]').click();
    
    // Verify successful login
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="user-menu"]').should('be.visible');
    cy.get('[data-cy="welcome-message"]').should('contain', 'Welcome back');
    
    // Verify JWT token is stored
    cy.window().then((win) => {
      expect(win.localStorage.getItem('authToken')).to.not.be.null;
    });
  });

  it('should reject invalid credentials', () => {
    cy.get('[data-cy="email-input"]').type('invalid@example.com');
    cy.get('[data-cy="password-input"]').type('wrongpassword');
    cy.get('[data-cy="login-button"]').click();
    
    // Should stay on login page
    cy.url().should('include', '/login');
    cy.get('[data-cy="error-message"]').should('be.visible');
    cy.get('[data-cy="error-message"]').should('contain', 'Invalid credentials');
  });

  it('should handle token expiration gracefully', () => {
    // Login first
    cy.login(); // Custom command
    
    // Manually set expired token
    cy.window().then((win) => {
      win.localStorage.setItem('authToken', 'expired_token_here');
    });
    
    // Try to access protected route
    cy.visit('/dashboard');
    
    // Should redirect to login
    cy.url().should('include', '/login');
    cy.get('[data-cy="session-expired-message"]').should('be.visible');
  });

  it('should logout successfully', () => {
    cy.login();
    cy.visit('/dashboard');
    
    // Logout
    cy.get('[data-cy="user-menu"]').click();
    cy.get('[data-cy="logout-button"]').click();
    
    // Should redirect to login
    cy.url().should('include', '/login');
    
    // Token should be removed
    cy.window().then((win) => {
      expect(win.localStorage.getItem('authToken')).to.be.null;
    });
  });

  it('should maintain session across page reloads', () => {
    cy.login();
    cy.visit('/dashboard');
    
    // Reload page
    cy.reload();
    
    // Should still be logged in
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="user-menu"]').should('be.visible');
  });

  it('should redirect to intended page after login', () => {
    // Try to access protected route without login
    cy.visit('/notes/create');
    
    // Should redirect to login
    cy.url().should('include', '/login');
    
    // Login
    cy.get('[data-cy="email-input"]').type('user@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="login-button"]').click();
    
    // Should redirect to originally intended page
    cy.url().should('include', '/notes/create');
  });

  it('should validate password strength on registration', () => {
    cy.visit('/register');
    
    // Test weak password
    cy.get('[data-cy="email-input"]').type('newuser@example.com');
    cy.get('[data-cy="password-input"]').type('123');
    cy.get('[data-cy="confirm-password-input"]').type('123');
    
    cy.get('[data-cy="password-strength"]').should('contain', 'Weak');
    cy.get('[data-cy="register-button"]').should('be.disabled');
    
    // Test strong password
    cy.get('[data-cy="password-input"]').clear().type('StrongPassword123!');
    cy.get('[data-cy="confirm-password-input"]').clear().type('StrongPassword123!');
    
    cy.get('[data-cy="password-strength"]').should('contain', 'Strong');
    cy.get('[data-cy="register-button"]').should('not.be.disabled');
  });

  it('should handle network errors during authentication', () => {
    // Intercept login request and force network error
    cy.intercept('POST', '/api/auth/login', { forceNetworkError: true }).as('loginRequest');
    
    cy.get('[data-cy="email-input"]').type('user@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="login-button"]').click();
    
    cy.wait('@loginRequest');
    
    // Should show network error message
    cy.get('[data-cy="error-message"]').should('contain', 'Network error');
    cy.get('[data-cy="retry-button"]').should('be.visible');
  });
});
