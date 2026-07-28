/**
 * property-details.js
 * Handles fetching specific PG data from URL ID and rendering details.
 */

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pgId = urlParams.get('id');

    if (!pgId) {
        document.getElementById("detailsContainer").innerHTML = `
            <div class="col-12 text-center py-5">
                <h2>Property Not Found</h2>
                <a href="listings.html" class="btn btn-primary mt-3">Browse Listings</a>
            </div>
        `;
        return;
    }

    const pgData = window.PGData.getListings().find(p => p.id === pgId);

    if (pgData) {
        renderDetails(pgData);
    } else {
        document.getElementById("detailsContainer").innerHTML = `
            <div class="col-12 text-center py-5">
                <h2>Property Not Found</h2>
                <a href="listings.html" class="btn btn-primary mt-3">Browse Listings</a>
            </div>
        `;
    }
});

function renderDetails(pg) {
    const container = document.getElementById("detailsContainer");

    // Fallback data if incomplete in data.js
    const gallery = pg.gallery || [pg.image];
    const rules = pg.rules || ["No specific rules mentioned."];
    const landmarks = pg.landmarks || ["No landmarks mentioned."];
    const facilities = pg.facilities || [];
    const reviews = pg.reviews || [];
    const owner = pg.owner || { name: "Contact Owner", phone: "N/A", email: "N/A" };

    const thumbnailsHTML = gallery.map((img, index) => `
        <div class="col-3 mt-3">
            <img src="${img}" class="gallery-thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)">
        </div>
    `).join('');

    const amenitiesHTML = pg.amenities.map(a => `
        <span class="feature-pill"><i class="bi bi-check2-circle text-success fs-5"></i> ${a}</span>
    `).join('');

    const facilitiesHTML = facilities.map(f => `
        <span class="feature-pill"><i class="bi bi-asterisk text-primary fs-5"></i> ${f}</span>
    `).join('');

    const rulesHTML = rules.map(r => `
        <li class="mb-2 text-muted"><i class="bi bi-exclamation-circle text-warning me-2"></i>${r}</li>
    `).join('');

    const landmarksHTML = landmarks.map(l => `
        <li class="mb-2 text-muted"><i class="bi bi-geo text-info me-2"></i>${l}</li>
    `).join('');

    const reviewsHTML = reviews.length > 0 ? reviews.map(r => `
        <div class="review-card p-3 rounded-3 mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="fw-bold mb-0">${r.user}</h6>
                <div class="text-warning">
                    ${'<i class="bi bi-star-fill"></i>'.repeat(r.rating)}
                    ${'<i class="bi bi-star"></i>'.repeat(5 - r.rating)}
                </div>
            </div>
            <p class="text-muted mb-0 small fst-italic">"${r.comment}"</p>
        </div>
    `).join('') : '<p class="text-muted">No reviews yet.</p>';

    container.innerHTML = `
        <div class="col-lg-8">
            <!-- Image Gallery -->
            <div class="details-card p-3 mb-4">
                <img src="${gallery[0]}" id="mainImage" class="w-100 gallery-main-img shadow-sm" alt="${pg.name}">
                <div class="row g-2 px-1">
                    ${thumbnailsHTML}
                </div>
            </div>

            <!-- Header & Badges -->
            <div class="details-card">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <div class="d-flex gap-2 mb-2">
                            <span class="badge bg-primary text-capitalize">${pg.gender} PG</span>
                            <span class="badge bg-secondary text-capitalize">${pg.roomType}</span>
                        </div>
                        <h2 class="fw-bolder mb-1">${pg.name}</h2>
                        <p class="text-muted fs-5"><i class="bi bi-geo-alt-fill text-danger"></i> ${pg.address}</p>
                    </div>
                    <div class="text-end">
                        <div class="badge bg-success-subtle text-success fs-5 px-3 py-2 rounded-pill mb-2">
                            <i class="bi bi-star-fill text-warning"></i> ${pg.rating}
                        </div>
                        <div class="text-muted small">Based on reviews</div>
                    </div>
                </div>
            </div>

            <!-- Amenities & Facilities -->
            <div class="details-card">
                <h4 class="fw-bold mb-4">Amenities Provided</h4>
                <div class="d-flex flex-wrap gap-3 mb-4">
                    ${amenitiesHTML}
                </div>
                
                ${facilities.length > 0 ? `
                <h4 class="fw-bold mb-4 mt-4 border-top pt-4">Room Facilities</h4>
                <div class="d-flex flex-wrap gap-3">
                    ${facilitiesHTML}
                </div>
                ` : ''}
            </div>

            <div class="row g-4 mb-4">
                <div class="col-md-6">
                    <div class="details-card h-100 mb-0">
                        <h4 class="fw-bold mb-3">Rules & Regulations</h4>
                        <ul class="list-unstyled mb-0">
                            ${rulesHTML}
                        </ul>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="details-card h-100 mb-0">
                        <h4 class="fw-bold mb-3">Nearby Landmarks</h4>
                        <ul class="list-unstyled mb-0">
                            ${landmarksHTML}
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Reviews -->
            <div class="details-card">
                <h4 class="fw-bold mb-4">Customer Reviews</h4>
                ${reviewsHTML}
            </div>
        </div>

        <div class="col-lg-4">
            <!-- Booking & Pricing Sticky Card -->
            <div class="details-card sticky-booking-card border-primary shadow text-center">
                <div class="badge ${pg.availability === 'Available' ? 'bg-success' : 'bg-warning'} mb-3 fs-6 px-3 py-2 rounded-pill">
                    ${pg.availability}
                </div>
                <h2 class="fw-bolder text-primary mb-0">₹${pg.price} <span class="fs-6 text-muted fw-normal">/ month</span></h2>
                <p class="text-muted small mt-2">Security deposit might apply. Check with owner.</p>
                
                <hr class="my-4">
                
                <div class="text-start mb-4">
                    <h5 class="fw-bold mb-3">Owner Details</h5>
                    <p class="mb-1 fw-medium"><i class="bi bi-person-circle text-primary me-2"></i>${owner.name}</p>
                    <p class="mb-1"><i class="bi bi-telephone text-primary me-2"></i>${owner.phone}</p>
                    <p class="mb-0 text-truncate"><i class="bi bi-envelope text-primary me-2"></i><a href="mailto:${owner.email}">${owner.email}</a></p>
                </div>

                <div class="d-grid gap-3">
                    <button class="btn btn-primary btn-lg rounded-pill fw-bold shadow-sm" onclick="alert('Contacting owner...')">
                        <i class="bi bi-telephone-outbound me-2"></i> Contact Owner
                    </button>
                    
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-danger w-50 rounded-pill fw-medium ${window.isFavorite && window.isFavorite(pg.id) ? 'active' : ''}" onclick="window.toggleFavoriteGlobal('${pg.id}', this)">
                            <i class="bi ${window.isFavorite && window.isFavorite(pg.id) ? 'bi-heart-fill' : 'bi-heart'} me-1"></i> ${window.isFavorite && window.isFavorite(pg.id) ? 'Saved' : 'Save'}
                        </button>
                        <div class="btn btn-outline-dark w-50 rounded-pill d-flex align-items-center justify-content-center m-0">
                            <input class="form-check-input m-0 me-2 shadow-none border-dark" type="checkbox" id="compareCheck">
                            <label class="form-check-label fw-medium m-0 cursor-pointer" for="compareCheck">Compare</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

window.changeMainImage = function(src, element) {
    const mainImg = document.getElementById('mainImage');
    mainImg.style.opacity = 0;
    setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = 1;
    }, 150);

    // Update active state
    document.querySelectorAll('.gallery-thumbnail').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
}

