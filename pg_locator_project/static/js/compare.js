/**
 * compare.js
 * Handles fetching compare list from LocalStorage and building the comparison table.
 */

document.addEventListener("DOMContentLoaded", () => {
    renderCompareTable();
});

// Global helpers for compare list management
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

window.removeFromCompare = function(pgId) {
    let list = window.getCompareList();
    list = list.filter(id => id !== pgId);
    localStorage.setItem('pgCompareList', JSON.stringify(list));
    renderCompareTable(); // re-render table
}

window.isCompared = function(pgId) {
    return window.getCompareList().includes(pgId);
}

// Function to render the table in compare.html
function renderCompareTable() {
    const container = document.getElementById("compareContainer");
    if (!container) return;

    const compareIds = window.getCompareList();
    
    if (compareIds.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5 bg-white rounded-4 shadow-sm border border-light">
                <i class="bi bi-ui-checks-grid fs-1 text-muted mb-3 d-block"></i>
                <h4>No properties selected for comparison</h4>
                <p class="text-muted">Go to the listings page to select properties to compare.</p>
                <a href="listings.html" class="btn btn-primary rounded-pill px-4 mt-2">Find PGs</a>
            </div>
        `;
        return;
    }

    const allData = window.PGData.getListings();
    const pgs = compareIds.map(id => allData.find(pg => pg.id === id)).filter(Boolean);

    let theadHTML = `<tr><th class="border-0"></th>`;
    let rentRow = `<tr><td class="text-muted border-end">Rent (Monthly)</td>`;
    let typeRow = `<tr><td class="text-muted border-end">Room Type</td>`;
    let occRow = `<tr><td class="text-muted border-end">Occupancy</td>`;
    let ratingRow = `<tr><td class="text-muted border-end">Rating</td>`;
    let foodRow = `<tr><td class="text-muted border-end">Food</td>`;
    let wifiRow = `<tr><td class="text-muted border-end">WiFi</td>`;
    let laundryRow = `<tr><td class="text-muted border-end">Laundry</td>`;
    let parkingRow = `<tr><td class="text-muted border-end">Parking</td>`;
    let powerRow = `<tr><td class="text-muted border-end">Power Backup</td>`;
    let securityRow = `<tr><td class="text-muted border-end">Security</td>`;
    let ownerRow = `<tr><td class="text-muted border-end">Owner</td>`;
    let addressRow = `<tr><td class="text-muted border-end">Address</td>`;
    let ctaRow = `<tr><td class="border-0"></td>`;

    pgs.forEach(pg => {
        // Safe defaults for amenities checking
        const has = (item) => pg.amenities.includes(item) 
            ? '<i class="bi bi-check-circle-fill text-success fs-5"></i>' 
            : '<i class="bi bi-x-circle-fill text-danger fs-5 opacity-50"></i>';

        const ownerName = pg.owner ? pg.owner.name : "N/A";
        const address = pg.address || `${pg.area}, ${pg.city}`;

        theadHTML += `
            <th class="text-center position-relative border-0" style="width: ${100/pgs.length}%">
                <button onclick="window.removeFromCompare('${pg.id}')" class="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0 m-2 shadow" title="Remove">
                    <i class="bi bi-x"></i>
                </button>
                <img src="${pg.image}" class="compare-img mb-3 shadow-sm" alt="${pg.name}">
                <h5 class="fw-bold mb-1">${pg.name}</h5>
                <span class="badge bg-light text-dark border text-capitalize">${pg.gender}</span>
            </th>
        `;

        rentRow += `<td class="text-center fw-bold fs-5 text-primary">₹${pg.price}</td>`;
        typeRow += `<td class="text-center text-capitalize">${pg.roomType}</td>`;
        occRow += `<td class="text-center">${pg.occupancy} Person(s)</td>`;
        ratingRow += `<td class="text-center"><span class="badge bg-success-subtle text-success fs-6"><i class="bi bi-star-fill text-warning"></i> ${pg.rating}</span></td>`;
        
        foodRow += `<td class="text-center">${has("Food")}</td>`;
        wifiRow += `<td class="text-center">${has("WiFi")}</td>`;
        laundryRow += `<td class="text-center">${has("Laundry")}</td>`;
        parkingRow += `<td class="text-center">${has("Parking")}</td>`;
        powerRow += `<td class="text-center">${has("Power Backup")}</td>`;
        securityRow += `<td class="text-center">${has("Security")}</td>`;
        
        ownerRow += `<td class="text-center fw-medium">${ownerName}</td>`;
        addressRow += `<td class="text-center small text-muted">${address}</td>`;
        
        ctaRow += `
            <td class="text-center border-0">
                <a href="property-details.html?id=${pg.id}" class="btn btn-outline-primary rounded-pill w-100 fw-medium">View Details</a>
            </td>
        `;
    });

    // Fill remaining columns if less than 3
    for (let i = pgs.length; i < 3; i++) {
        theadHTML += `<th class="text-center border-0 align-middle"><div class="bg-light rounded-4 h-100 d-flex flex-column justify-content-center align-items-center py-5 border"><i class="bi bi-plus-lg text-muted fs-1 mb-2"></i><span class="text-muted small">Add Property</span></div></th>`;
        rentRow += `<td class="bg-light border-0"></td>`;
        typeRow += `<td class="bg-light border-0"></td>`;
        occRow += `<td class="bg-light border-0"></td>`;
        ratingRow += `<td class="bg-light border-0"></td>`;
        foodRow += `<td class="bg-light border-0"></td>`;
        wifiRow += `<td class="bg-light border-0"></td>`;
        laundryRow += `<td class="bg-light border-0"></td>`;
        parkingRow += `<td class="bg-light border-0"></td>`;
        powerRow += `<td class="bg-light border-0"></td>`;
        securityRow += `<td class="bg-light border-0"></td>`;
        ownerRow += `<td class="bg-light border-0"></td>`;
        addressRow += `<td class="bg-light border-0"></td>`;
        ctaRow += `<td class="bg-light border-0"></td>`;
    }

    theadHTML += `</tr>`;
    rentRow += `</tr>`;
    typeRow += `</tr>`;
    occRow += `</tr>`;
    ratingRow += `</tr>`;
    foodRow += `</tr>`;
    wifiRow += `</tr>`;
    laundryRow += `</tr>`;
    parkingRow += `</tr>`;
    powerRow += `</tr>`;
    securityRow += `</tr>`;
    ownerRow += `</tr>`;
    addressRow += `</tr>`;
    ctaRow += `</tr>`;

    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover compare-table mb-0 align-middle">
                <thead class="table-light">
                    ${theadHTML}
                </thead>
                <tbody>
                    ${rentRow}
                    ${ratingRow}
                    ${typeRow}
                    ${occRow}
                    <tr><td colspan="4" class="bg-light text-uppercase fw-bold text-muted small py-2">Amenities</td></tr>
                    ${foodRow}
                    ${wifiRow}
                    ${laundryRow}
                    ${parkingRow}
                    ${powerRow}
                    ${securityRow}
                    <tr><td colspan="4" class="bg-light text-uppercase fw-bold text-muted small py-2">Details</td></tr>
                    ${ownerRow}
                    ${addressRow}
                </tbody>
                <tfoot class="table-light">
                    ${ctaRow}
                </tfoot>
            </table>
        </div>
    `;
}
