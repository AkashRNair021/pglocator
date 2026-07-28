/**
 * admin-users.js
 * Handles logic for User Management: rendering tables, pagination, searching, filtering, suspending, deleting.
 */

let allUsers = [];
let filteredUsers = [];
let currentRoleTab = 'user'; // 'user' or 'owner'
let currentPage = 1;
const itemsPerPage = 6;

document.addEventListener("DOMContentLoaded", () => {
    initializeMockUsers();
    attachListeners();
    applyFilters();
});

function initializeMockUsers() {
    // If not in local storage, generate mock data
    if (!localStorage.getItem('adminMockUsers')) {
        const mockData = [
            { id: "usr-1", name: "John Doe", email: "john@example.com", role: "user", status: "Active", date: "2023-10-12" },
            { id: "usr-2", name: "Aman Gupta", email: "aman@example.com", role: "user", status: "Active", date: "2023-11-05" },
            { id: "usr-3", name: "Priya Sharma", email: "priya@example.com", role: "user", status: "Suspended", date: "2023-11-20" },
            { id: "usr-4", name: "Rohan Verma", email: "rohan@example.com", role: "user", status: "Active", date: "2023-12-01" },
            { id: "usr-5", name: "Neha Singh", email: "neha@example.com", role: "user", status: "Active", date: "2024-01-15" },
            { id: "usr-6", name: "Vikram R", email: "vikram@example.com", role: "user", status: "Active", date: "2024-02-10" },
            { id: "usr-7", name: "Ananya Patel", email: "ananya@example.com", role: "user", status: "Suspended", date: "2024-03-05" },
            { id: "usr-8", name: "Karthik N", email: "karthik@example.com", role: "user", status: "Active", date: "2024-03-22" },
            
            { id: "own-1", name: "Rajesh Kumar", email: "rajesh@owner.com", role: "owner", status: "Active", date: "2023-05-10" },
            { id: "own-2", name: "Sunita Reddy", email: "sunita@owner.com", role: "owner", status: "Active", date: "2023-06-15" },
            { id: "own-3", name: "Oasis Mgmt", email: "contact@oasis.com", role: "owner", status: "Active", date: "2023-08-20" },
            { id: "own-4", name: "Suresh K.", email: "suresh@owner.com", role: "owner", status: "Suspended", date: "2023-09-05" },
            { id: "own-5", name: "Meera Properties", email: "info@meera.com", role: "owner", status: "Active", date: "2024-01-10" }
        ];
        localStorage.setItem('adminMockUsers', JSON.stringify(mockData));
    }
    allUsers = JSON.parse(localStorage.getItem('adminMockUsers'));
}

function attachListeners() {
    document.getElementById("searchInput").addEventListener("input", () => { currentPage = 1; applyFilters(); });
    document.getElementById("statusFilter").addEventListener("change", () => { currentPage = 1; applyFilters(); });
}

window.switchTab = function(role) {
    currentRoleTab = role;
    currentPage = 1;
    applyFilters();
}

function applyFilters() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const status = document.getElementById("statusFilter").value;

    filteredUsers = allUsers.filter(u => {
        // Filter by Role Tab
        if (u.role !== currentRoleTab) return false;

        // Search
        if (search && !u.name.toLowerCase().includes(search) && !u.email.toLowerCase().includes(search)) {
            return false;
        }

        // Status
        if (status !== "All" && u.status !== status) return false;

        return true;
    });

    renderTable();
}

function renderTable() {
    const tbody = document.getElementById("usersTableBody");
    
    if (filteredUsers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-5 text-muted">No records found.</td></tr>`;
        document.getElementById("paginationInfo").innerText = "Showing 0 items";
        document.getElementById("paginationControls").innerHTML = "";
        return;
    }

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const currentItems = filteredUsers.slice(startIdx, endIdx);

    document.getElementById("paginationInfo").innerText = `Showing ${startIdx + 1}-${Math.min(endIdx, filteredUsers.length)} of ${filteredUsers.length}`;

    // Render Rows
    tbody.innerHTML = currentItems.map(u => {
        const isActive = u.status === "Active";
        const statusBadge = isActive 
            ? `<span class="badge bg-success-subtle text-success border border-success">Active</span>`
            : `<span class="badge bg-danger-subtle text-danger border border-danger">Suspended</span>`;

        // Generate Initials
        const initials = u.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
        const avatarColor = u.role === 'owner' ? 'primary' : 'info';

        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <div class="rounded-circle bg-${avatarColor}-subtle text-${avatarColor} d-flex align-items-center justify-content-center fw-bold shadow-sm" style="width: 40px; height: 40px;">
                            ${initials}
                        </div>
                        <span class="fw-bold text-dark">${u.name}</span>
                    </div>
                </td>
                <td class="text-muted">${u.email}</td>
                <td class="text-muted small">${u.date}</td>
                <td>${statusBadge}</td>
                <td class="text-end text-nowrap">
                    ${isActive 
                        ? `<button class="btn btn-sm btn-light border text-warning shadow-sm me-1" onclick="toggleStatus('${u.id}')" title="Suspend User"><i class="bi bi-pause-circle"></i></button>` 
                        : `<button class="btn btn-sm btn-light border text-success shadow-sm me-1" onclick="toggleStatus('${u.id}')" title="Reactivate User"><i class="bi bi-play-circle"></i></button>`
                    }
                    <button class="btn btn-sm btn-light border text-danger shadow-sm" onclick="deleteUser('${u.id}')" title="Delete"><i class="bi bi-trash"></i></button>
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

window.toggleStatus = function(id) {
    const idx = allUsers.findIndex(u => u.id === id);
    if (idx !== -1) {
        allUsers[idx].status = allUsers[idx].status === "Active" ? "Suspended" : "Active";
        localStorage.setItem('adminMockUsers', JSON.stringify(allUsers));
        applyFilters(); // Re-render
    }
}

window.deleteUser = function(id) {
    if (confirm("Are you sure you want to permanently delete this user?")) {
        allUsers = allUsers.filter(u => u.id !== id);
        localStorage.setItem('adminMockUsers', JSON.stringify(allUsers));
        applyFilters(); // Re-render
    }
}
