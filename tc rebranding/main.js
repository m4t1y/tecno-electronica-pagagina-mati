/* =============================================
   TECNO ELECTRÓNICA - Main JavaScript
   =============================================
   Comportamientos interactivos: 
   - Menú móvil
   - Header scroll
   - Smooth scroll
   - Scroll animations
   - FAQ accordion
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ── Header Scroll Effect ──
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ── Mobile Menu Toggle ──
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileNav.classList.toggle('open');
            document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
        });

        // Close mobile menu on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ── Smooth Scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            if (targetId === '#top') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                let top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                if (top < 0) top = 0;
                
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ── Scroll Animations (Intersection Observer) ──
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // ── Active nav link highlighting ──
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ── Counter animation for stat numbers ──
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const end = parseInt(target.dataset.count);
                    const suffix = target.dataset.suffix || '';
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.round(eased * end);
                        target.textContent = current + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // ── WhatsApp CTA link builder ──
    // EDITÁ: cambiá el número de WhatsApp acá
    const WHATSAPP_NUMBER = '5493541267777'; // <!-- WHATSAPP: cambiar número -->
    const WHATSAPP_MESSAGE = encodeURIComponent('Hola, me interesa conocer más sobre los servicios de Tecno Electrónica.');
    
    document.querySelectorAll('[data-whatsapp]').forEach(btn => {
        btn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
    });

    // ── Formulario de Contacto Interactivo ──
    const contactForm = document.getElementById('main-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Enviando...';
            submitBtn.disabled = true;

            const nombre = document.getElementById('contact-name')?.value?.trim() || '';
            const empresa = document.getElementById('contact-company')?.value?.trim() || 'Particular';
            const email = document.getElementById('contact-email')?.value?.trim() || '';
            const telefono = document.getElementById('contact-phone')?.value?.trim() || '';
            const servicio = document.getElementById('contact-service')?.value || '';
            const mensaje = document.getElementById('contact-message')?.value?.trim() || '';
            const aceptaContacto = contactForm.querySelector('input[name="acepta_contacto"]')?.checked ? 'Sí' : 'No';

            const formData = new FormData(contactForm);
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            }).then(() => {
                mostrarExito();
            }).catch(() => {
                mostrarExito();
            });

            function mostrarExito() {
                submitBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> ¡Solicitud Enviada!';
                submitBtn.style.background = 'var(--accent-green)';
                submitBtn.style.color = '#061A2B';

                setTimeout(() => {
                    const waMsg = encodeURIComponent(
                        `*Nueva Consulta Web — Tecno Electrónica*\n` +
                        `👤 *Nombre:* ${nombre}\n` +
                        `🏢 *Empresa / Institución:* ${empresa}\n` +
                        `📧 *Email:* ${email}\n` +
                        `📱 *Teléfono:* ${telefono}\n` +
                        `🛠 *Servicio de interés:* ${servicio}\n` +
                        `✅ *Acepta contacto:* ${aceptaContacto}\n` +
                        `💬 *Mensaje:* ${mensaje}`
                    );

                    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`, '_blank');

                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.color = '';
                    submitBtn.disabled = false;
                }, 1000);
            }
        });
    }

});
