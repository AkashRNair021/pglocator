/**
 * owner-add-pg.js
 * Handles validation, image upload preview, live preview modal, and saving to LocalStorage.
 */

const CURRENT_OWNER_ID = "owner-1"; // Simulated session

document.addEventListener("DOMContentLoaded", () => {
    // Form Validation and Submission
    const form = document.getElementById('addPgForm');
    
    form.addEventListener('submit', event => {
        event.preventDefault();
        
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        saveNewProperty();
    });

    // Image Upload Preview Logic
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');

    fileInput.addEventListener('change', handleFiles);

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            handleFiles();
        }
    });
});

function handleFiles() {
    const files = document.getElementById('fileInput').files;
    const container = document.getElementById('imagePreviewContainer');
    
    if (files.length > 0) {
        // Just show a visual indicator since we can't easily persist local files in this frontend-only demo without huge base64 strings
        container.innerHTML = Array.from(files).map(file => `
            <div class="badge bg-light text-dark border p-2 d-flex align-items-center gap-2">
                <i class="bi bi-image text-primary"></i> ${file.name}
            </div>
        `).join('');
    }
}

function gatherFormData() {
    const amenities = Array.from(document.querySelectorAll('.amenity-checkbox:checked')).map(cb => cb.value);
    const food = document.getElementById('f_food').value;
    if (food === "Yes") amenities.push("Food");

    return {
        id: 'pg-' + Math.floor(Math.random() * 100000),
        name: document.getElementById('f_name').value,
        gender: document.getElementById('f_gender').value,
        city: document.getElementById('f_city').value,
        area: document.getElementById('f_area').value,
        landmarks: [document.getElementById('f_landmark').value].filter(Boolean),
        price: parseInt(document.getElementById('f_rent').value) || 0,
        roomType: document.getElementById('f_roomType').value,
        occupancy: parseInt(document.getElementById('f_occupancy').value) || 1,
        amenities: amenities,
        rules: [document.getElementById('f_description').value].filter(Boolean),
        owner: {
            name: "Current Owner", // From session
            phone: document.getElementById('f_phone').value,
            email: document.getElementById('f_email').value
        },
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", // Placeholder for demo
        gallery: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
        ],
        rating: 0,
        popularity: 0,
        availability: "Available",
        ownerId: CURRENT_OWNER_ID
    };
}

window.previewPG = function() {
    const form = document.getElementById('addPgForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        alert("Please fill all required fields before previewing.");
        return;
    }

    const data = gatherFormData();
    
    // Render a simplified card preview
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = `
        <div class="card pg-card border-0 rounded-0 overflow-hidden">
            <div class="position-relative">
                <img src="${data.image}" class="card-img-top object-fit-cover" alt="${data.name}" style="height: 250px;">
                <span class="badge bg-success position-absolute top-0 start-0 m-3 shadow">
                    Available
                </span>
                <span class="badge bg-primary position-absolute bottom-0 start-0 m-3 rounded-pill px-3 py-2 fs-6 shadow">
                    ₹${data.price}/mo
                </span>
            </div>
            <div class="card-body p-4 text-start">
                <h4 class="fw-bold mb-2">${data.name}</h4>
                <p class="text-muted"><i class="bi bi-geo-alt-fill text-primary"></i> ${data.area}, ${data.city}</p>
                <div class="d-flex gap-2 mb-3">
                    <span class="badge bg-light text-dark border text-capitalize">${data.gender}</span>
                    <span class="badge bg-light text-dark border text-capitalize">${data.roomType}</span>
                </div>
                <h6 class="fw-bold mt-4">Amenities</h6>
                <div class="d-flex flex-wrap gap-2 text-muted small">
                    ${data.amenities.map(a => `<span class="bg-light px-2 py-1 rounded"><i class="bi bi-check-circle-fill text-success"></i> ${a}</span>`).join('') || 'None selected'}
                </div>
                <hr>
                <small class="text-muted"><i class="bi bi-telephone text-primary"></i> ${data.owner.phone}</small>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('previewModal'));
    modal.show();
}

function saveNewProperty() {
    const data = gatherFormData();
    
    let allData = window.PGData.getListings();
    allData.push(data);
    localStorage.setItem('pgListings', JSON.stringify(allData));
    
    // Close preview modal if open
    const modalEl = document.getElementById('previewModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();

    // Success UI
    document.body.innerHTML += `
        <div class="position-fixed top-0 start-50 translate-middle-x p-3" style="z-index: 9999">
            <div class="alert alert-success shadow-lg border-0 d-flex align-items-center rounded-pill px-4">
                <i class="bi bi-check-circle-fill fs-4 me-3"></i>
                <div>Property Listed Successfully! Redirecting...</div>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        window.location.href = "owner-dashboard.html";
    }, 1500);
}
