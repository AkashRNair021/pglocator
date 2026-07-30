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

// Stats are now rendered by Django templates

function initCharts() {
    // Read JSON data from DOM
    let chartMonths = [];
    let chartUsers = [];
    let chartCategoryLabels = [];
    let chartCategoryData = [];
    
    try {
        chartMonths = JSON.parse(document.getElementById('chartMonthsData').textContent);
        chartUsers = JSON.parse(document.getElementById('chartUsersData').textContent);
        chartCategoryLabels = JSON.parse(document.getElementById('chartCategoryLabelsData').textContent);
        chartCategoryData = JSON.parse(document.getElementById('chartCategoryData').textContent);
    } catch (e) {
        console.error("Error parsing chart data from JSON script tags", e);
    }

    // 1. Line Chart for Platform Growth
    const canvasGrowth = document.getElementById('growthChart');
    if (canvasGrowth) {
        const ctxGrowth = canvasGrowth.getContext('2d');
        
        // Gradient fill for line chart
        let gradient = ctxGrowth.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(79, 70, 229, 0.4)');   
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

        new Chart(ctxGrowth, {
            type: 'line',
            data: {
                labels: chartMonths,
                datasets: [{
                    label: 'New Registrations',
                    data: chartUsers,
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
    }

    // 2. Doughnut Chart for Users by Category
    const canvasCategory = document.getElementById('categoryChart');
    if (canvasCategory) {
        const ctxCategory = canvasCategory.getContext('2d');
        new Chart(ctxCategory, {
            type: 'doughnut',
            data: {
                labels: chartCategoryLabels,
                datasets: [{
                    data: chartCategoryData,
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
}

function renderTables() {
    // Tables are now rendered by Django templates
}
