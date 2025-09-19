document.addEventListener('DOMContentLoaded', function() {

    // --- Animaciones al hacer scroll ---
    const revealElements = document.querySelectorAll('.fade-in, .reveal-left, .reveal-right, .reveal-bottom');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // El elemento se revela cuando el 10% es visible
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });

    // --- Lógica del menú móvil (hamburguesa) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            // Esta es una implementación básica. Para un menú completo, necesitarías
            // crear y estilizar un menú desplegable o lateral.
            alert('Menú móvil activado! Aquí se añadiría la lógica para mostrar los enlaces.');
        });
    }
    
    // --- Manejo del envío del formulario ---
    // IMPORTANTE: Este código solo previene el envío. Necesitarás
    // un servicio de backend o de terceros para que el formulario envíe emails.
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Previene que la página se recargue
            
            // Aquí podrías usar servicios como Formspree, Netlify Forms,
            // o un backend propio para enviar los datos.
            
            alert('Gracias por tu mensaje! (Este es un mensaje de prueba)');
            contactForm.reset(); // Limpia el formulario
        });
    }

});