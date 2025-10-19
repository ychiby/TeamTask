// GSAP Animations
function initAnimations() {
    // Animate feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.1
        });
    });

    // Navbar animation on scroll
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            gsap.to(navbar, { y: -100, duration: 0.3 });
        } else {
            gsap.to(navbar, { y: 0, duration: 0.3 });
        }
        
        lastScroll = currentScroll;
    });
}

// Initialize animations when GSAP is loaded
if (typeof gsap !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
        initAnimations();
    }
}
