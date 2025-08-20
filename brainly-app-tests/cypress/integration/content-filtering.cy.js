describe('Content Filtering and Search', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/dashboard');
  });

  it('should filter content by category', () => {
    // Navigate to content area
    cy.get('[data-cy="content-nav"]').click();
    
    // Apply category filter
    cy.get('[data-cy="category-filter"]').select('Notes');
    cy.get('[data-cy="apply-filter"]').click();
    
    // Verify filtered results
    cy.get('[data-cy="content-item"]').should('have.length.greaterThan', 0);
    cy.get('[data-cy="content-item"]').each(($item) => {
      cy.wrap($item).find('[data-cy="item-category"]').should('contain', 'Notes');
    });
    
    // Test another category
    cy.get('[data-cy="category-filter"]').select('Articles');
    cy.get('[data-cy="apply-filter"]').click();
    
    cy.get('[data-cy="content-item"]').each(($item) => {
      cy.wrap($item).find('[data-cy="item-category"]').should('contain', 'Articles');
    });
  });

  it('should search content by keyword', () => {
    cy.visit('/dashboard');
    
    // Search for specific keyword
    cy.get('[data-cy="search-input"]').type('javascript');
    cy.get('[data-cy="search-button"]').click();
    
    // Verify search results
    cy.get('[data-cy="search-results"]').should('be.visible');
    cy.get('[data-cy="content-item"]').should('have.length.greaterThan', 0);
    
    // Each result should contain the search term
    cy.get('[data-cy="content-item"]').each(($item) => {
      cy.wrap($item).should('contain.text', 'javascript');
    });
    
    // Test search with no results
    cy.get('[data-cy="search-input"]').clear().type('nonexistentterm12345');
    cy.get('[data-cy="search-button"]').click();
    
    cy.get('[data-cy="no-results-message"]').should('be.visible');
    cy.get('[data-cy="no-results-message"]').should('contain', 'No results found');
  });

  it('should filter by date range', () => {
    cy.visit('/dashboard');
    
    // Open date filter
    cy.get('[data-cy="date-filter-toggle"]').click();
    cy.get('[data-cy="date-filter-panel"]').should('be.visible');
    
    // Set date range (last 7 days)
    cy.get('[data-cy="date-range-preset"]').select('Last 7 days');
    cy.get('[data-cy="apply-date-filter"]').click();
    
    // Verify filtered results
    cy.get('[data-cy="content-item"]').should('have.length.greaterThan', 0);
    
    // Check that all items are within the date range
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    cy.get('[data-cy="content-item"]').each(($item) => {
      cy.wrap($item).find('[data-cy="item-date"]').then(($date) => {
        const itemDate = new Date($date.text());
        expect(itemDate).to.be.greaterThan(sevenDaysAgo);
      });
    });
  });

  it('should filter by tags', () => {
    cy.visit('/dashboard');
    
    // Select specific tags
    cy.get('[data-cy="tag-filter"]').click();
    cy.get('[data-cy="tag-option"][data-tag="programming"]').click();
    cy.get('[data-cy="tag-option"][data-tag="tutorial"]').click();
    cy.get('[data-cy="apply-tag-filter"]').click();
    
    // Verify results contain selected tags
    cy.get('[data-cy="content-item"]').each(($item) => {
      cy.wrap($item).find('[data-cy="item-tags"]').should('match', /programming|tutorial/);
    });
    
    // Clear tags and verify all content shows
    cy.get('[data-cy="clear-tag-filter"]').click();
    cy.get('[data-cy="content-item"]').should('have.length.greaterThan', 0);
  });

  it('should sort content by different criteria', () => {
    cy.visit('/dashboard');
    
    // Sort by date (newest first)
    cy.get('[data-cy="sort-dropdown"]').select('Date (Newest)');
    
    let previousDate = null;
    cy.get('[data-cy="content-item"]').each(($item) => {
      cy.wrap($item).find('[data-cy="item-date"]').then(($date) => {
        const currentDate = new Date($date.text());
        if (previousDate) {
          expect(currentDate).to.be.at.most(previousDate);
        }
        previousDate = currentDate;
      });
    });
    
    // Sort by title (alphabetical)
    cy.get('[data-cy="sort-dropdown"]').select('Title (A-Z)');
    
    let previousTitle = null;
    cy.get('[data-cy="content-item"]').each(($item) => {
      cy.wrap($item).find('[data-cy="item-title"]').then(($title) => {
        const currentTitle = $title.text().toLowerCase();
        if (previousTitle) {
          expect(currentTitle.localeCompare(previousTitle)).to.be.at.least(0);
        }
        previousTitle = currentTitle;
      });
    });
  });

  it('should combine multiple filters', () => {
    cy.visit('/dashboard');
    
    // Apply multiple filters
    cy.get('[data-cy="category-filter"]').select('Notes');
    cy.get('[data-cy="search-input"]').type('react');
    cy.get('[data-cy="tag-filter"]').click();
    cy.get('[data-cy="tag-option"][data-tag="programming"]').click();
    cy.get('[data-cy="apply-filters"]').click();
    
    // Verify results match all criteria
    cy.get('[data-cy="content-item"]').each(($item) => {
      // Should be Notes category
      cy.wrap($item).find('[data-cy="item-category"]').should('contain', 'Notes');
      // Should contain "react"
      cy.wrap($item).should('contain.text', 'react');
      // Should have programming tag
      cy.wrap($item).find('[data-cy="item-tags"]').should('contain', 'programming');
    });
    
    // Clear all filters
    cy.get('[data-cy="clear-all-filters"]').click();
    
    // Verify all content is shown again
    cy.get('[data-cy="content-item"]').should('have.length.greaterThan', 0);
    cy.get('[data-cy="filter-summary"]').should('contain', 'Showing all items');
  });

  it('should persist filters across page navigation', () => {
    cy.visit('/dashboard');
    
    // Apply filters
    cy.get('[data-cy="category-filter"]').select('Articles');
    cy.get('[data-cy="search-input"]').type('javascript');
    cy.get('[data-cy="apply-filters"]').click();
    
    // Navigate away and back
    cy.get('[data-cy="profile-nav"]').click();
    cy.get('[data-cy="dashboard-nav"]').click();
    
    // Verify filters are still applied
    cy.get('[data-cy="category-filter"]').should('have.value', 'Articles');
    cy.get('[data-cy="search-input"]').should('have.value', 'javascript');
    cy.get('[data-cy="content-item"]').each(($item) => {
      cy.wrap($item).find('[data-cy="item-category"]').should('contain', 'Articles');
      cy.wrap($item).should('contain.text', 'javascript');
    });
  });

  it('should handle empty search results gracefully', () => {
    cy.visit('/dashboard');
    
    // Search for something that doesn't exist
    cy.get('[data-cy="search-input"]').type('zyxwvutsrqponmlkjihgfedcba');
    cy.get('[data-cy="search-button"]').click();
    
    // Should show empty state
    cy.get('[data-cy="empty-state"]').should('be.visible');
    cy.get('[data-cy="empty-state-message"]').should('contain', 'No content found');
    cy.get('[data-cy="clear-search-button"]').should('be.visible');
    
    // Clear search should restore results
    cy.get('[data-cy="clear-search-button"]').click();
    cy.get('[data-cy="content-item"]').should('have.length.greaterThan', 0);
  });
});
