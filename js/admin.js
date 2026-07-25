/**
 * admin.js
 * Handles Admin Dashboard logic: rendering stats, initializing Chart.js, and populating tables.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Force role to admin
    if (window.PGData && window.PGData.getRole() !== 'admin') {
        window.PGData.setRole('admin');
    }

    renderAdminStats();
    initCharts();
    renderTables();
});

function renderAdminStats() {
    const properties = window.PGData.getListings();
    
    // Mock calculations for demo
    const totalPGs = properties.length;
    const totalUsers = 4250; 
    const totalOwners = 312;
    const pendingApprovals = 14;

    const statsHTML = `
        <div class="col-md-3">
            <div class="stat-card border-start border-primary border-4 rounded-3 h-100 p-4 d-block position-relative overflow-hidden">
                <i class="bi bi-people text-primary position-absolute end-0 top-50 translate-middle-y me-n2" style="font-size: 5rem; opacity: 0.1;"></i>
                <h6 class="text-muted fw-bold text-uppercase mb-1">Total Users</h6>
                <h2 class="fw-bolder mb-0 text-dark">${totalUsers.toLocaleString()}</h2>
                <small class="text-success fw-medium"><i class="bi bi-arrow-up-short"></i> 12% this month</small>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card border-start border-info border-4 rounded-3 h-100 p-4 d-block position-relative overflow-hidden">
                <i class="bi bi-person-badge text-info position-absolute end-0 top-50 translate-middle-y me-n2" style="font-size: 5rem; opacity: 0.1;"></i>
                <h6 class="text-muted fw-bold text-uppercase mb-1">Total Owners</h6>
                <h2 class="fw-bolder mb-0 text-dark">${totalOwners}</h2>
                <small class="text-success fw-medium"><i class="bi bi-arrow-up-short"></i> 5 new today</small>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card border-start border-success border-4 rounded-3 h-100 p-4 d-block position-relative overflow-hidden">
                <i class="bi bi-building text-success position-absolute end-0 top-50 translate-middle-y me-n2" style="font-size: 5rem; opacity: 0.1;"></i>
                <h6 class="text-muted fw-bold text-uppercase mb-1">Total PGs listed</h6>
                <h2 class="fw-bolder mb-0 text-dark">${totalPGs}</h2>
                <small class="text-muted fw-medium">Across 12 cities</small>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card border-start border-warning border-4 rounded-3 h-100 p-4 d-block position-relative overflow-hidden">
                <i class="bi bi-hourglass-split text-warning position-absolute end-0 top-50 translate-middle-y me-n2" style="font-size: 5rem; opacity: 0.1;"></i>
                <h6 class="text-muted fw-bold text-uppercase mb-1">Pending Approvals</h6>
                <h2 class="fw-bolder mb-0 text-dark">${pendingApprovals}</h2>
                <small class="text-danger fw-medium">Requires attention</small>
            </div>
        </div>
    `;

    document.getElementById("adminStatsContainer").innerHTML = statsHTML;
}

function initCharts() {
    // 1. Line Chart for Platform Growth
    const ctxGrowth = document.getElementById('growthChart').getContext('2d');
    
    // Gradient fill for line chart
    let gradient = ctxGrowth.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.4)');   
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

    new Chart(ctxGrowth, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            datasets: [{
                label: 'New Users',
                data: [400, 550, 700, 650, 900, 1200, 1100, 1500],
                borderColor: '#4f46e5',
                backgroundColor: gradient,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#4f46e5',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { borderDash: [5, 5], color: '#e2e8f0' } },
                x: { grid: { display: false } }
            }
        }
    });

    // 2. Doughnut Chart for Users by Category
    const ctxCategory = document.getElementById('categoryChart').getContext('2d');
    new Chart(ctxCategory, {
        type: 'doughnut',
        data: {
            labels: ['Students', 'Professionals', 'Owners'],
            datasets: [{
                data: [55, 35, 10],
                backgroundColor: ['#4f46e5', '#ec4899', '#f59e0b'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } }
            }
        }
    });
}

function renderTables() {
    // Latest Listings Table
    const properties = window.PGData.getListings().slice(-5).reverse(); // Mock latest 5
    const listingsTbody = document.getElementById("latestListingsTableBody");
    
    listingsTbody.innerHTML = properties.map(pg => {
        // Mocking some as pending for the demo
        const isPending = Math.random() > 0.7; 
        const statusBadge = isPending 
            ? `<span class="badge bg-warning-subtle text-warning border border-warning">Pending</span>`
            : `<span class="badge bg-success-subtle text-success border border-success">Approved</span>`;
            
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <img src="${pg.image}" class="rounded-2 object-fit-cover shadow-sm" width="40" height="40">
                        <span class="fw-bold text-dark text-truncate" style="max-width: 150px;">${pg.name}</span>
                    </div>
                </td>
                <td class="text-muted">${pg.city}</td>
                <td class="fw-medium">₹${pg.price}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-sm btn-light border text-primary" title="Review">
                        <i class="bi bi-eye"></i>
                    </button>
                    ${isPending ? `<button class="btn btn-sm btn-success shadow-sm ms-1" title="Approve"><i class="bi bi-check"></i></button>` : ''}
                </td>
            </tr>
        `;
    }).join('');

    // Recent Users Table
    const users = [
        { name: "John Doe", role: "Seeker", avatar: "JD", color: "primary" },
        { name: "Meera Reddy", role: "Owner", avatar: "MR", color: "danger" },
        { name: "Aman Gupta", role: "Seeker", avatar: "AG", color: "success" },
        { name: "Suresh K.", role: "Owner", avatar: "SK", color: "warning" },
        { name: "Priya S.", role: "Seeker", avatar: "PS", color: "info" }
    ];
    
    const usersTbody = document.getElementById("recentUsersTableBody");
    usersTbody.innerHTML = users.map(u => `
        <tr>
            <td>
                <div class="d-flex align-items-center gap-3">
                    <div class="rounded-circle bg-${u.color}-subtle text-${u.color} d-flex align-items-center justify-content-center fw-bold shadow-sm" style="width: 35px; height: 35px;">
                        ${u.avatar}
                    </div>
                    <span class="fw-medium text-dark">${u.name}</span>
                </div>
            </td>
            <td>
                <span class="badge bg-light text-dark border">${u.role}</span>
            </td>
        </tr>
    `).join('');
}
