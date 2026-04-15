document.addEventListener('DOMContentLoaded', () => {

    // ── Universal Intersection Observer for ALL animations ──
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',  // Trigger 50px before it enters
        threshold: 0.05
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing after it animates once
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // List of all elements we want to animate on scroll
    const animatedElements = document.querySelectorAll(`
        .fade-in-up,
        .gsap-slide-left,
        .gsap-slide-right,
        .gsap-zoom-rotate,
        .gsap-text-reveal,
        .gsap-stagger-cards > *
    `);

    // Add them to observer
    animatedElements.forEach(el => {
        scrollObserver.observe(el);
        
        // Safety net: Immediately reveal if it's already in the viewport on load
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 50) {
            el.classList.add('visible');
        }
    });

    // ── GSAP ONLY for Parallax (doesn't hide elements) ──
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Parallax backgrounds
        gsap.utils.toArray('.gsap-parallax-bg').forEach(section => {
            gsap.to(section, {
                backgroundPositionY: '30%',
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }

});
