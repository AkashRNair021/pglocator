/**
 * app.js
 * Main initialization script. Handles component injection (Navbar/Footer) and active link highlighting.
 */

// Global variables for paths
const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
const basePath = isIndex ? './' : '../';

document.addEventListener("DOMContentLoaded", () => {
    injectGlobalLoader();
    injectNavbar();
    injectFooter();
    
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

function getPaths() {
    const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    return {
        base: isIndex ? './' : '../',
        pages: isIndex ? './pages/' : './'
    };
}

function injectNavbar() {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    if (!navbarPlaceholder) return;

    const paths = getPaths();
    
    // Check if we have role simulation, fallback to guest if not available
    const currentRole = window.PGData ? window.PGData.getRole() : 'guest';

    let roleDropdowns = '';
    
    if (currentRole === 'owner' || currentRole === 'admin') {
        roleDropdowns += `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle fw-medium" href="#" id="ownerDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Owner
                </a>
                <ul class="dropdown-menu shadow-sm border-0" aria-labelledby="ownerDropdown">
                    <li><a class="dropdown-item" href="${paths.pages}owner-dashboard.html"><i class="bi bi-speedometer2 me-2"></i> Owner Dashboard</a></li>
                    <li><a class="dropdown-item" href="${paths.pages}owner-add-pg.html"><i class="bi bi-plus-circle me-2"></i> Add PG</a></li>
                    <li><a class="dropdown-item" href="${paths.pages}owner-dashboard.html"><i class="bi bi-building-gear me-2"></i> Manage PG</a></li>
                </ul>
            </li>
        `;
    }

    if (currentRole === 'admin') {
        roleDropdowns += `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle fw-medium" href="#" id="adminDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Admin
                </a>
                <ul class="dropdown-menu shadow-sm border-0" aria-labelledby="adminDropdown">
                    <li><a class="dropdown-item" href="${paths.pages}admin-dashboard.html"><i class="bi bi-speedometer me-2"></i> Dashboard</a></li>
                    <li><a class="dropdown-item" href="${paths.pages}admin-listings.html"><i class="bi bi-list-check me-2"></i> Manage Listings</a></li>
                    <li><a class="dropdown-item" href="${paths.pages}admin-users.html"><i class="bi bi-people me-2"></i> Manage Users</a></li>
                </ul>
            </li>
        `;
    }

    const navbarHTML = `
        <nav class="navbar navbar-expand-xl navbar-light fixed-top custom-navbar">
            <div class="container">
                <a class="navbar-brand fw-bolder fs-4 d-flex align-items-center gap-2" href="${paths.base}index.html">
                    <div class="brand-logo-container bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                        <i class="bi bi-houses-fill"></i>
                    </div>
                    <span class="brand-text">PG Locator</span>
                </a>
                
                <button class="navbar-toggler border-0 shadow-none p-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav mx-auto mb-2 mb-xl-0 gap-1">
                        <li class="nav-item"><a class="nav-link fw-medium" href="${paths.base}index.html">Home</a></li>
                        <li class="nav-item"><a class="nav-link fw-medium" href="${paths.pages}listings.html">Find PG</a></li>
                        <li class="nav-item"><a class="nav-link fw-medium" href="${paths.pages}compare.html">Compare</a></li>
                        <li class="nav-item"><a class="nav-link fw-medium" href="${paths.pages}favorites.html">Favorites</a></li>
                        <li class="nav-item"><a class="nav-link fw-medium" href="${paths.pages}about.html">About</a></li>
                        <li class="nav-item"><a class="nav-link fw-medium" href="${paths.pages}faq.html">FAQ</a></li>
                        <li class="nav-item"><a class="nav-link fw-medium" href="${paths.pages}contact.html">Contact</a></li>
                        ${roleDropdowns}
                    </ul>
                    
                    <div class="d-flex align-items-center gap-3 mt-3 mt-xl-0">
                        <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" onclick="toggleRole()">
                            Role: <span class="fw-bold text-dark">${currentRole}</span>
                        </button>
                        <a href="${paths.pages}listings.html" class="btn btn-primary rounded-pill px-4">Explore Now</a>
                    </div>
                </div>
            </div>
        </nav>
    `;

    navbarPlaceholder.innerHTML = navbarHTML;
}

function injectFooter() {
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (!footerPlaceholder) return;

    const paths = getPaths();

    footerPlaceholder.innerHTML = `
        <footer class="custom-footer pt-5 pb-4 mt-5">
            <div class="container">
                <div class="row gy-4">
                    <div class="col-lg-4 col-md-6">
                        <a class="navbar-brand fw-bolder fs-4 d-flex align-items-center gap-2 mb-3 text-dark text-decoration-none" href="${paths.base}index.html">
                            <i class="bi bi-houses-fill text-primary"></i> PG Locator
                        </a>
                        <p class="text-muted mb-4 pe-lg-4">Your trusted partner in finding the perfect home away from home. We provide verified, secure, and comfortable accommodations tailored for you.</p>
                        <div class="social-icons d-flex gap-3">
                            <a href="#" class="btn btn-light rounded-circle shadow-sm text-primary"><i class="bi bi-facebook"></i></a>
                            <a href="#" class="btn btn-light rounded-circle shadow-sm text-info"><i class="bi bi-twitter-x"></i></a>
                            <a href="#" class="btn btn-light rounded-circle shadow-sm text-danger"><i class="bi bi-instagram"></i></a>
                            <a href="#" class="btn btn-light rounded-circle shadow-sm text-primary"><i class="bi bi-linkedin"></i></a>
                        </div>
                    </div>
                    
                    <div class="col-lg-2 col-md-6">
                        <h5 class="fw-bold mb-4">Quick Links</h5>
                        <ul class="list-unstyled d-flex flex-column gap-2 footer-links">
                            <li><a href="${paths.base}index.html">Home</a></li>
                            <li><a href="${paths.pages}listings.html">Find PG</a></li>
                            <li><a href="${paths.pages}about.html">About Us</a></li>
                            <li><a href="${paths.pages}faq.html">FAQ</a></li>
                        </ul>
                    </div>

                    <div class="col-lg-3 col-md-6">
                        <h5 class="fw-bold mb-4">Legal</h5>
                        <ul class="list-unstyled d-flex flex-column gap-2 footer-links">
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Cookie Policy</a></li>
                            <li><a href="#">Refund Policy</a></li>
                        </ul>
                    </div>
                    
                    <div class="col-lg-3 col-md-6">
                        <h5 class="fw-bold mb-4">Contact Us</h5>
                        <ul class="list-unstyled d-flex flex-column gap-3 contact-info text-muted">
                            <li class="d-flex align-items-start gap-2">
                                <i class="bi bi-geo-alt-fill text-primary mt-1"></i>
                                <span>123 Tech Park, Koramangala<br>Bangalore, 560034</span>
                            </li>
                            <li class="d-flex align-items-center gap-2">
                                <i class="bi bi-envelope-fill text-primary"></i>
                                <a href="mailto:hello@pglocator.com" class="text-muted text-decoration-none hover-primary">hello@pglocator.com</a>
                            </li>
                            <li class="d-flex align-items-center gap-2">
                                <i class="bi bi-telephone-fill text-primary"></i>
                                <a href="tel:+919876543210" class="text-muted text-decoration-none hover-primary">+91 98765 43210</a>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <hr class="mt-5 mb-4 border-secondary opacity-25">
                
                <div class="row align-items-center">
                    <div class="col-md-6 text-center text-md-start">
                        <p class="mb-0 text-muted small">&copy; ${new Date().getFullYear()} PG Locator. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    `;
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

// Global Compare Helpers
window.getCompareList = function() {
    return JSON.parse(localStorage.getItem('pgCompareList') || '[]');
}

window.toggleCompare = function(pgId, checkboxElement) {
    let list = window.getCompareList();
    if (list.includes(pgId)) {
        list = list.filter(id => id !== pgId);
        if (checkboxElement) checkboxElement.checked = false;
    } else {
        if (list.length >= 3) {
            alert("You can only compare up to 3 properties at a time.");
            if (checkboxElement) checkboxElement.checked = false;
            return;
        }
        list.push(pgId);
        if (checkboxElement) checkboxElement.checked = true;
    }
    localStorage.setItem('pgCompareList', JSON.stringify(list));
}

// Global Favorites Helpers
window.getFavoritesList = function() {
    return JSON.parse(localStorage.getItem('pgFavorites') || '[]');
}

window.isFavorite = function(pgId) {
    return window.getFavoritesList().includes(pgId);
}

window.toggleFavoriteGlobal = function(pgId, buttonElement) {
    let list = window.getFavoritesList();
    const isFav = list.includes(pgId);
    
    if (isFav) {
        list = list.filter(id => id !== pgId);
        if (buttonElement) {
            buttonElement.classList.replace('text-danger', 'text-muted');
            const icon = buttonElement.querySelector('i');
            if (icon) icon.classList.replace('bi-heart-fill', 'bi-heart');
            
            // If it's the detailed button format (with text)
            if (buttonElement.innerText.includes('Saved')) {
                buttonElement.innerHTML = `<i class="bi bi-heart me-1"></i> Save`;
            }
        }
    } else {
        list.push(pgId);
        if (buttonElement) {
            buttonElement.classList.replace('text-muted', 'text-danger');
            const icon = buttonElement.querySelector('i');
            if (icon) icon.classList.replace('bi-heart', 'bi-heart-fill');
            
            // If it's the detailed button format (with text)
            if (buttonElement.innerText.includes('Save')) {
                buttonElement.innerHTML = `<i class="bi bi-heart-fill me-1"></i> Saved`;
            }
        }
    }
    localStorage.setItem('pgFavorites', JSON.stringify(list));
    
    // If we are on the favorites page, we might want to re-render when removed
    if (window.location.pathname.includes('favorites.html') && isFav && window.renderFavorites) {
        window.renderFavorites();
    }
}
