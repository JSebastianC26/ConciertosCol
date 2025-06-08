// Form Validation
(() => {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();

            if (!form.checkValidity()) {
                event.stopPropagation();
                // Add shake animation to invalid fields
                const invalidFields = form.querySelectorAll('.form-control:invalid');
                invalidFields.forEach(field => {
                    field.style.animation = 'shake 0.5s ease-in-out';
                    setTimeout(() => {
                        field.style.animation = '';
                    }, 500);
                });
            } else {
                // Show loading
                document.getElementById('loadingOverlay').style.display = 'flex';

                // Simulate login process
                setTimeout(() => {
                    document.getElementById('loadingOverlay').style.display = 'none';

                    // Success animation
                    const card = document.querySelector('.login-card');
                    card.style.transform = 'scale(1.05)';
                    card.style.boxShadow = '0 25px 50px rgba(255, 193, 7, 0.4)';

                    setTimeout(() => {
                        alert('¡Login exitoso! 🎉');
                        card.style.transform = '';
                        card.style.boxShadow = '';
                    }, 300);
                }, 2000);
            }

            form.classList.add('was-validated');
        });
    });

    // Add shake animation keyframes
    const style = document.createElement('style');
    style.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
`;
    document.head.appendChild(style);
})();

// Toggle Password Visibility
function togglePassword() {
    const input = document.getElementById("clave");
    const icon = document.getElementById("toggleIcon");

    if (input.type === "password") {
        input.type = "text";
        icon.className = "fas fa-eye-slash";
    } else {
        input.type = "password";
        icon.className = "fas fa-eye";
    }
}

// Add focus effects
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'translateY(-2px)';
    });

    input.addEventListener('blur', function () {
        this.parentElement.style.transform = '';
    });
});

// Parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 10;
    const y = (e.clientY / window.innerHeight) * 10;

    const musicNotes = document.querySelectorAll('.music-note');
    musicNotes.forEach((note, index) => {
        const speed = (index + 1) * 0.5;
        note.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});