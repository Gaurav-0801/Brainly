describe('Content Sharing Features', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/dashboard');
  });

  it('should share content via public link', () => {
    // Create or select a piece of content
    cy.get('[data-cy="content-item"]').first().click();
    cy.get('[data-cy="share-button"]').click();
    
    // Generate public link
    cy.get('[data-cy="generate-public-link"]').click();
    cy.get('[data-cy="public-link-input"]').should('be.visible');
    cy.get('[data-cy="public-link-input"]').should('not.be.empty');
    
    // Copy link
    cy.get('[data-cy="copy-link-button"]').click();
    cy.get('[data-cy="copy-success-message"]').should('contain', 'Link copied');
    
    // Test the generated link (in new window/tab simulation)
    cy.get('[data-cy="public-link-input"]').then(($input) => {
      const shareUrl = $input.val();
      cy.window().then((win) => {
        // Logout and visit share link
        win.localStorage.removeItem('authToken');
      });
      
      cy.visit(shareUrl);
      cy.get('[data-cy="shared-content"]').should('be.visible');
      cy.get('[data-cy="content-title"]').should('not.be.empty');
    });
  });

  it('should share content with specific users', () => {
    cy.get('[data-cy="content-item"]').first().click();
    cy.get('[data-cy="share-button"]').click();
    
    // Switch to user sharing tab
    cy.get('[data-cy="share-with-users-tab"]').click();
    
    // Add user by email
    cy.get('[data-cy="user-email-input"]').type('friend@example.com');
    cy.get('[data-cy="add-user-button"]').click();
    
    // Verify user is added to share list
    cy.get('[data-cy="shared-user-list"]').should('contain', 'friend@example.com');
    
    // Set permissions
    cy.get('[data-cy="permission-select"]').select('view');
    
    // Send share invitation
    cy.get('[data-cy="send-invitation-button"]').click();
    cy.get('[data-cy="share-success-message"]').should('contain', 'Invitation sent');
  });

  it('should manage sharing permissions', () => {
    // Share content first
    cy.get('[data-cy="content-item"]').first().click();
    cy.get('[data-cy="share-button"]').click();
    cy.get('[data-cy="share-with-users-tab"]').click();
    cy.get('[data-cy="user-email-input"]').type('editor@example.com');
    cy.get('[data-cy="permission-select"]').select('edit');
    cy.get('[data-cy="add-user-button"]').click();
    
    // Navigate to sharing management
    cy.get('[data-cy="manage-sharing"]').click();
    
    // Verify shared users list
    cy.get('[data-cy="shared-users-table"]').should('be.visible');
    cy.get('[data-cy="shared-user-row"]').should('contain', 'editor@example.com');
    
    // Change permission level
    cy.get('[data-cy="permission-dropdown"]').first().select('view');
    cy.get('[data-cy="update-permission"]').click();
    cy.get('[data-cy="permission-updated-message"]').should('be.visible');
    
    // Remove user from sharing
    cy.get('[data-cy="remove-user-button"]').first().click();
    cy.get('[data-cy="confirm-remove"]').click();
    cy.get('[data-cy="shared-user-row"]').should('not.exist');
  });

  it('should handle sharing link expiration', () => {
    cy.get('[data-cy="content-item"]').first().click();
    cy.get('[data-cy="share-button"]').click();
    
    // Set link expiration
    cy.get('[data-cy="link-expiration-toggle"]').click();
    cy.get('[data-cy="expiration-date"]').type('2024-12-31');
    cy.get('[data-cy="generate-public-link"]').click();
    
    // Verify expiration is set
    cy.get('[data-cy="link-expires-info"]').should('contain', '2024-12-31');
    
    // Test revoking link
    cy.get('[data-cy="revoke-link-button"]').click();
    cy.get('[data-cy="confirm-revoke"]').click();
    cy.get('[data-cy="link-revoked-message"]').should('be.visible');
  });

  it('should track sharing analytics', () => {
    // Create and share content
    cy.get('[data-cy="content-item"]').first().click();
    cy.get('[data-cy="share-button"]').click();
    cy.get('[data-cy="generate-public-link"]').click();
    
    // Navigate to analytics
    cy.get('[data-cy="view-analytics"]').click();
    
    // Verify analytics data
    cy.get('[data-cy="analytics-panel"]').should('be.visible');
    cy.get('[data-cy="view-count"]').should('exist');
    cy.get('[data-cy="share-count"]').should('exist');
    cy.get('[data-cy="last-accessed"]').should('exist');
    
    // Check detailed analytics
    cy.get('[data-cy="detailed-analytics"]').click();
    cy.get('[data-cy="analytics-chart"]').should('be.visible');
    cy.get('[data-cy="visitor-details"]').should('be.visible');
  });

  it('should export shared content', () => {
    cy.get('[data-cy="content-item"]').first().click();
    cy.get('[data-cy="export-button"]').click();
    
    // Test different export formats
    cy.get('[data-cy="export-format"]').select('PDF');
    cy.get('[data-cy="export-download"]').click();
    
    // Verify download initiated (check for download attribute or success message)
    cy.get('[data-cy="export-success"]').should('contain', 'Export started');
    
    // Test markdown export
    cy.get('[data-cy="export-format"]').select('Markdown');
    cy.get('[data-cy="export-download"]').click();
    cy.get('[data-cy="export-success"]').should('contain', 'Export started');
    
    // Test JSON export
    cy.get('[data-cy="export-format"]').select('JSON');
    cy.get('[data-cy="export-download"]').click();
    cy.get('[data-cy="export-success"]').should('contain', 'Export started');
  });

  it('should handle sharing errors gracefully', () => {
    // Intercept sharing API and force error
    cy.intercept('POST', '/api/share', { statusCode: 500 }).as('shareError');
    
    cy.get('[data-cy="content-item"]').first().click();
    cy.get('[data-cy="share-button"]').click();
    cy.get('[data-cy="share-with-users-tab"]').click();
    cy.get('[data-cy="user-email-input"]').type('test@example.com');
    cy.get('[data-cy="add-user-button"]').click();
    
    cy.wait('@shareError');
    
    // Should show error message
    cy.get('[data-cy="share-error-message"]').should('be.visible');
    cy.get('[data-cy="retry-share-button"]').should('be.visible');
  });

  it('should validate email addresses when sharing', () => {
    cy.get('[data-cy="content-item"]').first().click();
    cy.get('[data-cy="share-button"]').click();
    cy.get('[data-cy="share-with-users-tab"]').click();
    
    // Test invalid email
    cy.get('[data-cy="user-email-input"]').type('invalid-email');
    cy.get('[data-cy="add-user-button"]').click();
    
    cy.get('[data-cy="email-validation-error"]').should('contain', 'Invalid email');
    cy.get('[data-cy="add-user-button"]').should('be.disabled');
    
    // Test valid email
    cy.get('[data-cy="user-email-input"]').clear().type('valid@example.com');
    cy.get('[data-cy="add-user-button"]').should('not.be.disabled');
  });

  it('should support batch sharing operations', () => {
    // Select multiple content items
    cy.get('[data-cy="select-all-checkbox"]').click();
    cy.get('[data-cy="selected-items-count"]').should('contain', 'items selected');
    
    // Bulk share action
    cy.get('[data-cy="bulk-share-button"]').click();
    cy.get('[data-cy="bulk-share-modal"]').should('be.visible');
    
    // Add multiple users
    cy.get('[data-cy="bulk-user-emails"]').type('user1@example.com, user2@example.com, user3@example.com');
    cy.get('[data-cy="bulk-permission-select"]').select('view');
    cy.get('[data-cy="send-bulk-invitations"]').click();
    
    cy.get('[data-cy="bulk-share-success"]').should('contain', 'Invitations sent');
  });
});
