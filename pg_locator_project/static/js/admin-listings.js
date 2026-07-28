/**
 * admin-listings.js
 * Handles the logic for managing PG listings (Approve, Reject, Delete), searching, filtering, and pagination.
 */

let allListings = [];
let filteredListings = [];
let currentPage = 1;
const itemsPerPage = 5;

document.addEventListener("DOMContentLoaded", () => {
    // Force role to admin
    if (window.PGData && window.PGData.getRole() !== 'admin') {
        window.PGData.setRole('admin');
    }

    initializeData();
    populateCityFilter();
    attachListeners();
    applyFilters();
});

// Seed moderation status if it doesn't exist
function initializeData() {
    allListings = window.PGData.getListings();
    
    let needsUpdate = false;
    allListings.forEach((pg, index) => {
        if (!pg.moderationStatus) {
            // Randomly assign a status for demo purposes, mostly Approved
            const rand = Math.random();
            if (rand > 0.8) pg.moderationStatus = "Pending";
            else if (rand > 0.95) pg.moderationStatus = "Rejected";
            else pg.moderationStatus = "Approved";
            needsUpdate = true;
        }
    });

    if (needsUpdate) {
        localStorage.setItem('pgListings', JSON.stringify(allListings));
    }
}

function populateCityFilter() {
    const cities = [...new Set(allListings.map(pg => pg.city))].filter(Boolean);
    const filter = document.getElementById("cityFilter");
    cities.forEach(city => {
        const opt = document.createElement("option");
        opt.value = city;
        opt.innerText = city;
        filter.appendChild(opt);
    });
}

function attachListeners() {
    document.getElementById("searchInput").addEventListener("input", () => { currentPage = 1; applyFilters(); });
    document.getElementById("statusFilter").addEventListener("change", () => { currentPage = 1; applyFilters(); });
    document.getElementById("cityFilter").addEventListener("change", () => { currentPage = 1; applyFilters(); });
}

function applyFilters() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const status = document.getElementById("statusFilter").value;
    const city = document.getElementById("cityFilter").value;

    filteredListings = allListings.filter(pg => {
        // Search
        if (search && !pg.name.toLowerCase().includes(search) && !pg.id.toLowerCase().includes(search) && !pg.ownerId.toLowerCase().includes(search)) {
            return false;
        }
        // Status
        if (status !== "All" && pg.moderationStatus !== status) return false;
        // City
        if (city !== "All" && pg.city !== city) return false;

        return true;
    });

    renderTable();
}

function renderTable() {
    const tbody = document.getElementById("listingsTableBody");
    
    if (filteredListings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-5 text-muted">No listings found matching the criteria.</td></tr>`;
        document.getElementById("paginationInfo").innerText = "Showing 0 items";
        document.getElementById("paginationControls").innerHTML = "";
        return;
    }

    // Pagination logic
    const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const currentItems = filteredListings.slice(startIdx, endIdx);

    // Update Info
    document.getElementById("paginationInfo").innerText = `Showing ${startIdx + 1}-${Math.min(endIdx, filteredListings.length)} of ${filteredListings.length}`;

    // Render Rows
    tbody.innerHTML = currentItems.map(pg => {
        let statusBadge = "";
        if (pg.moderationStatus === "Approved") statusBadge = `<span class="badge bg-success-subtle text-success border border-success">Approved</span>`;
        else if (pg.moderationStatus === "Pending") statusBadge = `<span class="badge bg-warning-subtle text-warning border border-warning">Pending</span>`;
        else if (pg.moderationStatus === "Rejected") statusBadge = `<span class="badge bg-danger-subtle text-danger border border-danger">Rejected</span>`;

        return `
            <tr>
                <td class="text-muted small">${pg.id}</td>
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <img src="${pg.image}" class="rounded-2 object-fit-cover shadow-sm" width="45" height="45">
                        <div>
                            <h6 class="fw-bold mb-0 text-dark">${pg.name}</h6>
                            <small class="text-muted fw-medium">₹${pg.price}/mo</small>
                        </div>
                    </div>
                </td>
                <td class="text-muted small">${pg.area}, ${pg.city}</td>
                <td class="text-muted small">${pg.ownerId}</td>
                <td>${statusBadge}</td>
                <td class="text-end text-nowrap">
                    ${pg.moderationStatus !== 'Approved' ? `<button class="btn btn-sm btn-light border text-success shadow-sm me-1" onclick="updateStatus('${pg.id}', 'Approved')" title="Approve"><i class="bi bi-check-lg"></i></button>` : ''}
                    ${pg.moderationStatus !== 'Rejected' ? `<button class="btn btn-sm btn-light border text-warning shadow-sm me-1" onclick="updateStatus('${pg.id}', 'Rejected')" title="Reject"><i class="bi bi-x-lg"></i></button>` : ''}
                    <button class="btn btn-sm btn-light border text-danger shadow-sm" onclick="deleteListing('${pg.id}')" title="Delete"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const controls = document.getElementById("paginationControls");
    let html = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <button class="page-link shadow-none text-dark" onclick="changePage(${currentPage - 1})">Previous</button>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <button class="page-link shadow-none ${currentPage === i ? 'bg-primary border-primary' : 'text-dark'}" onclick="changePage(${i})">${i}</button>
            </li>
        `;
    }

    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <button class="page-link shadow-none text-dark" onclick="changePage(${currentPage + 1})">Next</button>
        </li>
    `;
    controls.innerHTML = html;
}

window.changePage = function(page) {
    currentPage = page;
    renderTable();
}

window.updateStatus = function(id, newStatus) {
    const idx = allListings.findIndex(p => p.id === id);
    if (idx !== -1) {
        allListings[idx].moderationStatus = newStatus;
        localStorage.setItem('pgListings', JSON.stringify(allListings));
        applyFilters(); // Re-render
    }
}

window.deleteListing = function(id) {
    if (confirm("Are you sure you want to permanently delete this listing?")) {
        allListings = allListings.filter(p => p.id !== id);
        localStorage.setItem('pgListings', JSON.stringify(allListings));
        applyFilters(); // Re-render
    }
}
