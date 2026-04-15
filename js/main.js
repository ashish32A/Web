document.addEventListener('DOMContentLoaded', () => {
    // ── Enable animations (opt-in approach: content visible by default) ──
    document.body.classList.add('js-animations-ready');

    // Immediately reveal anything already in the viewport
    requestAnimationFrame(() => {
        document.querySelectorAll('.fade-in-up').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight + 50) {
                el.classList.add('visible');
            }
        });
    });

    // Safety net: after 2s make ALL fade-in-up visible regardless
    setTimeout(() => {
        document.querySelectorAll('.fade-in-up').forEach(el => el.classList.add('visible'));
    }, 2000);

    // Preloader — let animation play briefly, then fade out smoothly
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => preloader.remove(), 700);
            }, 800);
        });
        // Fallback: force hide after 4s even if load is slow
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 700);
        }, 4000);
    }


    // ── Image error fallback: show gradient placeholder if CDN fails ──
    document.querySelectorAll('img[src*="aplusolution.in"]').forEach(img => {
        img.addEventListener('error', function() {
            this.style.cssText = `
                display: block !important;
                background: linear-gradient(135deg, #D72F2D22, #F15A2422);
                min-height: 180px;
                border-radius: inherit;
            `;
            this.removeAttribute('src');
        });
        // Force reload attempt — sometimes blocked images need explicit trigger
        if (img.src) {
            const src = img.src;
            img.src = '';
            img.src = src;
        }
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        });
    }

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
        // Close menu on link click
        navMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            });
        });
    }

    // Set Active Nav Link — auto-detects current page from URL
    (function setActiveNavLink() {
        let page = window.location.pathname.split('/').pop();
        // Handle root URL, empty path, or hash-only (all = home)
        if (!page || page === '' || page === '/' || /^#/.test(page)) page = 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href') || '';
            const linkPage = href.split('/').pop().split('#')[0] || 'index.html';
            link.classList.toggle('active', linkPage === page);
        });
    })();

    // Vanilla Tilt Initialization
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.glass-card-3d'), {
            max: 10,
            speed: 400,
            glare: true,
            'max-glare': 0.15,
            scale: 1.02
        });
    }

    // Particles JS Initialization
    if (document.getElementById('particles-js') && typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 900 } },
                color: { value: ['#D72F2D','#b91d1b','#c0392b'] },
                shape: { type: 'circle' },
                opacity: { value: 0.7, random: true, anim: { enable: true, speed: 1, opacity_min: 0.3, sync: false } },
                size: { value: 6, random: true },
                line_linked: { enable: true, distance: 150, color: '#D72F2D', opacity: 0.35, width: 1.5 },
                move: { enable: true, speed: 1.5, random: true, out_mode: 'out' }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
                modes: { grab: { distance: 140, line_linked: { opacity: 0.4 } }, push: { particles_nb: 3 } }
            },
            retina_detect: true
        });
    }

    // Testimonial Carousel
    startTestimonialCarousel();
});


function startTestimonialCarousel() {
    const track = document.querySelector('.testimonial-track');
    if (!track) return;

    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentIndex = 0;
    const total = cards.length;
    let interval;

    function moveCarousel(index) {
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function autoPlay() {
        interval = setInterval(() => {
            moveCarousel(currentIndex + 1);
        }, 4000);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(interval);
            moveCarousel(currentIndex - 1);
            autoPlay();
        });

        nextBtn.addEventListener('click', () => {
            clearInterval(interval);
            moveCarousel(currentIndex + 1);
            autoPlay();
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            clearInterval(interval);
            moveCarousel(i);
            autoPlay();
        });
    });

    autoPlay();
}
