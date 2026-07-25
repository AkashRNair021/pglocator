/**
 * owner.js
 * Handles Owner Dashboard logic: statistics, data table, and CRUD operations on PGs.
 */

// Simulated currently logged in owner
const CURRENT_OWNER_ID = "owner-1";

let propertyToDelete = null;

document.addEventListener("DOMContentLoaded", () => {
    // Force role to owner for this dashboard if they somehow bypassed
    if (window.PGData.getRole() !== 'owner') {
        window.PGData.setRole('owner');
    }
    
    renderDashboard();
});

function getOwnerProperties() {
    const allData = window.PGData.getListings();
    return allData.filter(pg => pg.ownerId === CURRENT_OWNER_ID);
}

function renderDashboard() {
    const properties = getOwnerProperties();
    
    renderStats(properties);
    renderTable(properties);
}

function renderStats(properties) {
    const totalProps = properties.length;
    
    // Demo calculation for vacant/occupied
    let totalRooms = totalProps * 10; // Pretend each PG has 10 rooms
    let occupiedRooms = 0;
    
    let monthlyRevenue = 0;

    properties.forEach(pg => {
        if (pg.availability === 'Available') occupiedRooms += 4;
        else if (pg.availability === 'Few Left') occupiedRooms += 8;
        else if (pg.availability === 'Full') occupiedRooms += 10;
        
        monthlyRevenue += (pg.price * (occupiedRooms > 0 ? (occupiedRooms/10) * 10 : 0)); 
        // Simple demo calculation
    });

    const vacantRooms = totalRooms - occupiedRooms;

    const statsHTML = `
        <div class="col-md-3">
            <div class="stat-card">
                <div class="stat-icon bg-primary-subtle text-primary">
                    <i class="bi bi-building"></i>
                </div>
                <div>
                    <h6 class="text-muted mb-1 fw-medium">Total Properties</h6>
                    <h3 class="fw-bolder mb-0">${totalProps}</h3>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card">
                <div class="stat-icon bg-success-subtle text-success">
                    <i class="bi bi-door-open-fill"></i>
                </div>
                <div>
                    <h6 class="text-muted mb-1 fw-medium">Occupied Rooms</h6>
                    <h3 class="fw-bolder mb-0">${occupiedRooms}</h3>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card">
                <div class="stat-icon bg-warning-subtle text-warning">
                    <i class="bi bi-door-closed"></i>
                </div>
                <div>
                    <h6 class="text-muted mb-1 fw-medium">Vacant Rooms</h6>
                    <h3 class="fw-bolder mb-0">${vacantRooms}</h3>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card">
                <div class="stat-icon bg-info-subtle text-info">
                    <i class="bi bi-currency-rupee"></i>
                </div>
                <div>
                    <h6 class="text-muted mb-1 fw-medium">Est. Revenue</h6>
                    <h3 class="fw-bolder mb-0">₹${monthlyRevenue.toLocaleString()}</h3>
                </div>
            </div>
        </div>
    `;

    document.getElementById("statsContainer").innerHTML = statsHTML;
}

function renderTable(properties) {
    const tbody = document.getElementById("propertiesTableBody");
    
    if (properties.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-5 text-muted">You have not listed any properties yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = properties.map(pg => {
        let badgeClass = 'bg-success';
        if (pg.availability === 'Full') badgeClass = 'bg-danger';
        else if (pg.availability === 'Few Left') badgeClass = 'bg-warning';

        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <img src="${pg.image || 'https://via.placeholder.com/60'}" class="rounded-3 object-fit-cover" width="60" height="60" alt="${pg.name}">
                        <div>
                            <h6 class="fw-bold mb-0 text-dark">${pg.name}</h6>
                            <small class="text-muted"><i class="bi bi-geo-alt-fill"></i> ${pg.area}, ${pg.city}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge bg-light text-dark border text-capitalize">${pg.gender}</span></td>
                <td><span class="badge ${badgeClass}">${pg.availability}</span></td>
                <td class="fw-medium text-primary">₹${pg.price}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-light text-primary border me-1 shadow-sm" onclick="window.prepareEditModal('${pg.id}')" title="Edit">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-light text-danger border shadow-sm" onclick="window.prepareDeleteModal('${pg.id}')" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Modal Handlers
window.prepareAddModal = function() {
    document.getElementById("propertyModalLabel").innerText = "Add New Property";
    document.getElementById("propertyForm").reset();
    document.getElementById("pgId").value = "";
}

window.prepareEditModal = function(id) {
    const properties = getOwnerProperties();
    const pg = properties.find(p => p.id === id);
    if (!pg) return;

    document.getElementById("propertyModalLabel").innerText = "Edit Property";
    document.getElementById("pgId").value = pg.id;
    document.getElementById("pgName").value = pg.name;
    document.getElementById("pgCity").value = pg.city;
    document.getElementById("pgArea").value = pg.area;
    document.getElementById("pgGender").value = pg.gender;
    document.getElementById("pgPrice").value = pg.price;
    document.getElementById("pgStatus").value = pg.availability;

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('propertyModal'));
    modal.show();
}

window.saveProperty = function() {
    // Basic validation
    const name = document.getElementById("pgName").value;
    const city = document.getElementById("pgCity").value;
    const price = document.getElementById("pgPrice").value;
    if (!name || !city || !price) {
        alert("Please fill all required fields.");
        return;
    }

    const id = document.getElementById("pgId").value;
    let allData = window.PGData.getListings();

    if (id) {
        // Edit existing
        const index = allData.findIndex(p => p.id === id);
        if (index !== -1) {
            allData[index].name = name;
            allData[index].city = city;
            allData[index].area = document.getElementById("pgArea").value;
            allData[index].gender = document.getElementById("pgGender").value;
            allData[index].price = parseInt(price);
            allData[index].availability = document.getElementById("pgStatus").value;
        }
    } else {
        // Add new
        const newPg = {
            id: 'pg-' + Math.floor(Math.random() * 10000),
            name: name,
            city: city,
            area: document.getElementById("pgArea").value,
            gender: document.getElementById("pgGender").value,
            price: parseInt(price),
            availability: document.getElementById("pgStatus").value,
            ownerId: CURRENT_OWNER_ID,
            rating: 0,
            popularity: 0,
            roomType: "shared",
            occupancy: 2,
            amenities: ["WiFi", "Security"],
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" // placeholder
        };
        allData.push(newPg);
    }

    localStorage.setItem('pgListings', JSON.stringify(allData));
    
    // Hide modal and re-render
    bootstrap.Modal.getInstance(document.getElementById('propertyModal')).hide();
    renderDashboard();
}

window.prepareDeleteModal = function(id) {
    propertyToDelete = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

window.confirmDelete = function() {
    if (!propertyToDelete) return;
    
    let allData = window.PGData.getListings();
    allData = allData.filter(pg => pg.id !== propertyToDelete);
    localStorage.setItem('pgListings', JSON.stringify(allData));
    
    propertyToDelete = null;
    bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
    renderDashboard();
}
