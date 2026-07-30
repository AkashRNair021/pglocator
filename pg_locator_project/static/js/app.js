/**
 * app.js
 * Main initialization script. Handles component injection (Navbar/Footer) and active link highlighting.
 */

// Global variables for paths
const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
const basePath = isIndex ? './' : '../';

document.addEventListener("DOMContentLoaded", () => {
    injectGlobalLoader();
    
    // Hide global loader once DOM is ready and a small delay for smooth transition
    setTimeout(() => {
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 300);
    highlightActiveLink();
});

function injectGlobalLoader() {
    if (!document.getElementById('global-loader')) {
        const loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.innerHTML = '<div class="loader-spinner"></div>';
        document.body.prepend(loader);
    }
}



function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Check if the current URL ends with the link's href (ignoring ./ or ../)
        const cleanHref = linkHref.replace('./', '').replace('../', '').replace('pages/', '');
        const cleanPath = currentPath.split('/').pop() || 'index.html';
        
        if (cleanPath === cleanHref || (cleanPath === '' && cleanHref === 'index.html')) {
            link.classList.add('active', 'text-primary');
            // If it's a dropdown item, also highlight the parent dropdown toggle
            const dropdownParent = link.closest('.dropdown');
            if (dropdownParent) {
                dropdownParent.querySelector('.dropdown-toggle').classList.add('active', 'text-primary');
            }
        }
    });
}

// Utility to switch roles easily for demonstration purposes
window.toggleRole = function() {
    const roles = ['guest', 'owner', 'admin'];
    let current = window.PGData.getRole();
    let nextIndex = (roles.indexOf(current) + 1) % roles.length;
    window.PGData.setRole(roles[nextIndex]);
    window.location.reload();
}

// Global Compare Helpers (Django Backend)
window.toggleCompare = function(pgId, checkboxElement) {
    fetch(`/compare/api/toggle/${pgId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': window.getCookie('csrftoken'),
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (response.status === 401 || response.status === 403) {
            window.location.href = '/accounts/login/?next=' + window.location.pathname;
            throw new Error('Unauthorized');
        }
        return response.json().then(data => ({ status: response.status, body: data }));
    })
    .then(({ status, body }) => {
        if (status === 400) {
            // Limit reached
            alert(body.error);
            if (checkboxElement) checkboxElement.checked = false;
            return;
        }
        
        const isCompared = body.status === 'added';
        if (checkboxElement) checkboxElement.checked = isCompared;
    })
    .catch(error => console.error('Error toggling compare:', error));
}

window.removeFromCompare = function(pgId) {
    fetch(`/compare/api/toggle/${pgId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': window.getCookie('csrftoken'),
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (response.ok) {
            window.location.reload(); // Reload the compare page to refresh the table
        }
    })
    .catch(error => console.error('Error removing from compare:', error));
}

// Global Favorites Helpers (Django Backend)
window.getCookie = function(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

window.toggleFavoriteGlobal = function(pgId, buttonElement) {
    fetch(`/favorites/api/toggle/${pgId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': window.getCookie('csrftoken'),
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (response.status === 401 || response.status === 403) {
            window.location.href = '/accounts/login/?next=' + window.location.pathname;
            throw new Error('Unauthorized');
        }
        return response.json();
    })
    .then(data => {
        if (!data) return;
        
        const isFav = data.status === 'added';
        
        if (!isFav) {
            if (buttonElement) {
                buttonElement.classList.replace('text-danger', 'text-muted');
                const icon = buttonElement.querySelector('i');
                if (icon) icon.classList.replace('bi-heart-fill', 'bi-heart');
                
                // If it's the detailed button format (with text)
                if (buttonElement.innerText.includes('Saved')) {
                    buttonElement.innerHTML = `<i class="bi-heart me-1"></i> Save`;
                }
            }
            // If on favorites page, remove the card visually
            if (window.location.pathname.includes('/favorites/')) {
                const card = buttonElement.closest('.col-md-6'); // adjust selector based on layout
                if (card) {
                    card.style.display = 'none';
                }
                const countEl = document.getElementById('favoritesCount');
                if (countEl) countEl.innerText = data.count;
            }
        } else {
            if (buttonElement) {
                buttonElement.classList.replace('text-muted', 'text-danger');
                const icon = buttonElement.querySelector('i');
                if (icon) icon.classList.replace('bi-heart', 'bi-heart-fill');
                
                // If it's the detailed button format (with text)
                if (buttonElement.innerText.includes('Save')) {
                    buttonElement.innerHTML = `<i class="bi-heart-fill me-1"></i> Saved`;
                }
            }
        }
    })
    .catch(error => console.error('Error toggling favorite:', error));
}
