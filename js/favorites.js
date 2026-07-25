/**
 * favorites.js
 * Handles fetching and rendering favorite PGs from LocalStorage.
 */

document.addEventListener("DOMContentLoaded", () => {
    window.renderFavorites();
});

window.renderFavorites = function() {
    const container = document.getElementById("favoritesContainer");
    if (!container) return;

    const favIds = window.getFavoritesList();
    document.getElementById("favoritesCount").innerText = favIds.length;

    if (favIds.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5 my-5">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png" alt="Empty Favorites" class="img-fluid mb-4" style="max-height: 250px; opacity: 0.8;">
                <h3 class="fw-bold text-dark mb-2">No Favorites Yet</h3>
                <p class="text-muted mb-4 max-w-700 mx-auto">You haven't saved any properties yet. Browse our listings and click the heart icon to save your favorite PGs here for quick access later.</p>
                <a href="listings.html" class="btn btn-primary rounded-pill px-5 py-2 fw-medium shadow-sm">
                    <i class="bi bi-search me-2"></i> Browse Properties
                </a>
            </div>
        `;
        return;
    }

    const allData = window.PGData.getListings();
    const pgs = favIds.map(id => allData.find(pg => pg.id === id)).filter(Boolean);

    container.innerHTML = pgs.map(pg => {
        const badgeColor = pg.availability === 'Available' ? 'bg-success' : (pg.availability === 'Full' ? 'bg-danger' : 'bg-warning');
        
        return `
        <div class="col-md-6 col-lg-4">
            <div class="card pg-card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                <div class="position-relative">
                    <img src="${pg.image}" class="card-img-top object-fit-cover" alt="${pg.name}" style="height: 220px;">
                    <div class="position-absolute top-0 end-0 p-3 d-flex flex-column gap-2">
                        <button class="btn btn-light rounded-circle shadow-sm p-2 text-danger" title="Remove Favorite" onclick="window.toggleFavoriteGlobal('${pg.id}', this)">
                            <i class="bi bi-heart-fill"></i>
                        </button>
                    </div>
                    <span class="badge ${badgeColor} position-absolute top-0 start-0 m-3 shadow">
                        ${pg.availability}
                    </span>
                    <span class="badge bg-primary position-absolute bottom-0 start-0 m-3 rounded-pill px-3 py-2 fs-6 shadow">
                        ₹${pg.price}/mo
                    </span>
                </div>
                <div class="card-body p-4 d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title fw-bold mb-0 text-truncate" title="${pg.name}">${pg.name}</h5>
                        <div class="badge bg-success-subtle text-success rounded-pill px-2 py-1 flex-shrink-0">
                            <i class="bi bi-star-fill text-warning"></i> ${pg.rating}
                        </div>
                    </div>
                    
                    <p class="text-muted small mb-3"><i class="bi bi-geo-alt-fill text-primary"></i> ${pg.area || pg.location}</p>
                    
                    <div class="d-flex gap-2 mt-auto align-items-center pt-3 border-top">
                        <a href="property-details.html?id=${pg.id}" class="btn btn-outline-primary rounded-pill fw-medium flex-grow-1">View Details</a>
                        
                        <div class="form-check m-0 d-flex align-items-center justify-content-center bg-light rounded-pill px-3 py-2 border h-100" title="Compare">
                            <input class="form-check-input m-0 me-2" type="checkbox" value="${pg.id}" id="compare-${pg.id}" onchange="window.toggleCompare('${pg.id}', this)" ${window.getCompareList && window.getCompareList().includes(pg.id) ? 'checked' : ''}>
                            <label class="form-check-label small fw-medium" for="compare-${pg.id}">Compare</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `}).join('');
}
