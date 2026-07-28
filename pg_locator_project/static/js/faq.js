/**
 * faq.js
 * Handles live search filtering of FAQ accordion items.
 */

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('faqSearch');
    const accordionItems = document.querySelectorAll('.accordion-item');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const noResults = document.getElementById('noResults');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        let anyVisible = false;

        // If search is active, show all tab panes so we can search globally
        if (query.length > 0) {
            tabPanes.forEach(pane => {
                pane.classList.add('show', 'active');
                // Hide the tab pane title when searching globally
                const title = pane.querySelector('h3');
                if (title) title.style.display = 'none';
            });
            
            // Remove active state from sidebar pills to avoid confusion
            document.querySelectorAll('.nav-pills .nav-link').forEach(link => {
                link.classList.remove('active');
            });
        } else {
            // Reset to default (General tab active)
            tabPanes.forEach(pane => {
                pane.classList.remove('show', 'active');
                const title = pane.querySelector('h3');
                if (title) title.style.display = 'block';
            });
            document.getElementById('cat-general').classList.add('show', 'active');
            document.getElementById('cat-general-tab').classList.add('active');
        }

        accordionItems.forEach(item => {
            const questionText = item.querySelector('.accordion-button').innerText.toLowerCase();
            const answerText = item.querySelector('.accordion-body').innerText.toLowerCase();

            if (questionText.includes(query) || answerText.includes(query)) {
                item.style.display = 'block';
                anyVisible = true;
                
                // If searching, automatically expand the matched items
                if (query.length > 0) {
                    const button = item.querySelector('.accordion-button');
                    const collapse = item.querySelector('.accordion-collapse');
                    button.classList.remove('collapsed');
                    button.setAttribute('aria-expanded', 'true');
                    collapse.classList.add('show');
                } else {
                    // Reset expansion when search cleared
                    const button = item.querySelector('.accordion-button');
                    const collapse = item.querySelector('.accordion-collapse');
                    button.classList.add('collapsed');
                    button.setAttribute('aria-expanded', 'false');
                    collapse.classList.remove('show');
                }
            } else {
                item.style.display = 'none';
            }
        });

        // Show/Hide no results empty state
        if (query.length > 0 && !anyVisible) {
            noResults.classList.remove('d-none');
        } else {
            noResults.classList.add('d-none');
        }
    });

    // Re-bind sidebar clicks to clear search and restore standard tab behavior
    document.querySelectorAll('.nav-pills .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            searchInput.value = '';
            // Reset visibility
            accordionItems.forEach(item => {
                item.style.display = 'block';
                const button = item.querySelector('.accordion-button');
                const collapse = item.querySelector('.accordion-collapse');
                button.classList.add('collapsed');
                button.setAttribute('aria-expanded', 'false');
                collapse.classList.remove('show');
            });
            noResults.classList.add('d-none');
            
            // Restore titles
            tabPanes.forEach(pane => {
                const title = pane.querySelector('h3');
                if (title) title.style.display = 'block';
            });
        });
    });
});
