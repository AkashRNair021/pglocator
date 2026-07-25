/**
 * search.js
 * Handles instant filtering, sorting, and rendering of PG listings.
 */

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("listingsContainer")) {
        attachFilterListeners();
        applyFilters(); // Initial render
    }
});

function attachFilterListeners() {
    const inputs = [
        document.getElementById("filterSearch"),
        document.getElementById("filterCity"),
        document.getElementById("filterRent"),
        document.getElementById("filterRoomType"),
        document.getElementById("sortSelect")
    ];

    const radios = document.querySelectorAll('input[name="filterGender"]');
    const checkboxes = document.querySelectorAll('.filter-amenity');

    // Add input event to search and rent (instant)
    document.getElementById("filterSearch").addEventListener("input", applyFilters);
    document.getElementById("filterRent").addEventListener("input", (e) => {
        document.getElementById("rentLabel").innerText = `₹0 - ₹${e.target.value}`;
        applyFilters();
    });

    // Add change event to selects
    document.getElementById("filterCity").addEventListener("change", applyFilters);
    document.getElementById("filterRoomType").addEventListener("change", applyFilters);
    document.getElementById("sortSelect").addEventListener("change", applyFilters);

    radios.forEach(r => r.addEventListener("change", applyFilters));
    checkboxes.forEach(c => c.addEventListener("change", applyFilters));
}

window.resetFilters = function() {
    document.getElementById("filterSearch").value = "";
    document.getElementById("filterCity").value = "";
    document.getElementById("filterRent").value = 20000;
    document.getElementById("rentLabel").innerText = `₹0 - ₹20000`;
    document.getElementById("filterRoomType").value = "";
    document.getElementById("genderAny").checked = true;
    document.getElementById("sortSelect").value = "popularity";
    
    document.querySelectorAll('.filter-amenity').forEach(c => c.checked = false);
    
    applyFilters();
}

function applyFilters() {
    // 1. Get filter values
    const search = document.getElementById("filterSearch").value.toLowerCase();
    const city = document.getElementById("filterCity").value;
    const maxRent = parseInt(document.getElementById("filterRent").value);
    const roomType = document.getElementById("filterRoomType").value;
    const gender = document.querySelector('input[name="filterGender"]:checked').value;
    const sort = document.getElementById("sortSelect").value;
    
    const requiredAmenities = Array.from(document.querySelectorAll('.filter-amenity:checked')).map(c => c.value);

    // 2. Fetch raw data
    let data = window.PGData.getListings();

    // 3. Filter data
    let filtered = data.filter(pg => {
        // Search text (Name or Area)
        if (search && !pg.name.toLowerCase().includes(search) && !pg.area.toLowerCase().includes(search)) return false;
        
        // City
        if (city && pg.city !== city) return false;
        
        // Max Rent
        if (pg.price > maxRent) return false;
        
        // Gender
        if (gender && pg.gender !== gender) return false;

        // Room Type
        if (roomType && pg.roomType !== roomType) return false;

        // Amenities (Must contain ALL checked amenities)
        if (requiredAmenities.length > 0) {
            const hasAll = requiredAmenities.every(req => pg.amenities.includes(req));
            if (!hasAll) return false;
        }

        return true;
    });

    // 4. Sort data
    if (sort === "priceLow") filtered.sort((a, b) => a.price - b.price);
    else if (sort === "priceHigh") filtered.sort((a, b) => b.price - a.price);
    else if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
    else if (sort === "popularity") filtered.sort((a, b) => b.popularity - a.popularity);

    // 5. Render results
    renderCards(filtered);
}

function renderCards(listings) {
    const container = document.getElementById("listingsContainer");
    document.getElementById("resultsCount").innerText = listings.length;

    if (listings.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center text-muted py-5 mt-5">
                <i class="bi bi-search fs-1 mb-3 d-block text-black-50"></i>
                <h4>No properties found matching your criteria.</h4>
                <p>Try adjusting your filters.</p>
                <button class="btn btn-outline-primary rounded-pill mt-2" onclick="resetFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }

    container.innerHTML = listings.map(pg => {
        const badgeColor = pg.availability === 'Available' ? 'bg-success' : (pg.availability === 'Full' ? 'bg-danger' : 'bg-warning');
        
        return `
        <div class="col-md-6 col-xl-4">
            <div class="card pg-card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                <div class="position-relative">
                    <img src="${pg.image}" class="card-img-top object-fit-cover" alt="${pg.name}" style="height: 220px;">
                    <div class="position-absolute top-0 end-0 p-3 d-flex flex-column gap-2">
                        <button class="btn btn-light rounded-circle shadow-sm p-2 ${window.isFavorite && window.isFavorite(pg.id) ? 'text-danger' : 'text-muted'}" title="Toggle Favorite" onclick="window.toggleFavoriteGlobal('${pg.id}', this)">
                            <i class="bi ${window.isFavorite && window.isFavorite(pg.id) ? 'bi-heart-fill' : 'bi-heart'}"></i>
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
                    
                    <p class="text-muted small mb-3"><i class="bi bi-geo-alt-fill text-primary"></i> ${pg.area}, ${pg.city}</p>
                    
                    <div class="d-flex gap-2 mb-3 flex-wrap">
                        <span class="badge bg-light text-dark border text-capitalize"><i class="bi bi-gender-ambiguous text-secondary"></i> ${pg.gender}</span>
                        <span class="badge bg-light text-dark border text-capitalize"><i class="bi bi-door-open text-secondary"></i> ${pg.roomType}</span>
                    </div>

                    <div class="d-flex flex-wrap gap-2 text-muted small mt-auto mb-4">
                        ${pg.amenities.slice(0, 4).map(a => `<span class="bg-light px-2 py-1 rounded"><i class="bi bi-check-circle-fill text-success"></i> ${a}</span>`).join('')}
                        ${pg.amenities.length > 4 ? `<span class="bg-light px-2 py-1 rounded">+${pg.amenities.length - 4}</span>` : ''}
                    </div>

                    <div class="d-flex gap-2 mt-auto align-items-center">
                        <a href="property-details.html?id=${pg.id}" class="btn btn-primary rounded-pill fw-medium flex-grow-1 py-2">View Details</a>
                        
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
