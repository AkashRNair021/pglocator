/**
 * contact.js
 * Handles frontend validation and submission logic for the Contact page.
 */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('contactForm');
    const successAlert = document.getElementById('successAlert');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', event => {
        event.preventDefault();
        
        // Native HTML5 Validation
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        // Simulate network request
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...`;
        submitBtn.disabled = true;

        setTimeout(() => {
            // Success State
            form.style.display = 'none';
            successAlert.classList.remove('d-none');
            successAlert.classList.add('d-flex');

            // Optionally reset form if user wants to send another message
            form.reset();
            form.classList.remove('was-validated');
            submitBtn.innerHTML = `Send Message <i class="bi bi-send ms-2"></i>`;
            submitBtn.disabled = false;
            
        }, 1500); // 1.5s delay simulation
    });
});
