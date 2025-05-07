window.addEventListener('DOMContentLoaded', () => {
    // GSAP timeline
    const tl = gsap.timeline({ defaults: { ease: 'power1.out' } });
  
    // Animate title
    tl.from('.hero-title', { y: 50, opacity: 0, duration: 1 });
  
    // Animate subtitle
    tl.from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5');
  
    // Animate hero buttons
    tl.from('.hero-buttons button', { y: 20, opacity: 0, stagger: 0.2, duration: 0.6 }, '-=0.4');
  
    // Animate logo and nav
    tl.from('.logo', { x: -50, opacity: 0, duration: 0.8 }, '-=1');
    tl.from('.nav-buttons a', { x: 50, opacity: 0, stagger: 0.1, duration: 0.6 }, '-=0.8');
  
    // Animate About Us section title
    tl.from('.section-title', { y: 40, opacity: 0, duration: 1 }, '-=0.4');
  
    // Animate About Us cards (only once)
    tl.from('.about-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.3
    }, '-=0.5');
  
    // Button hover effect
    const buttons = document.querySelectorAll('.btn-solid, .btn-outline');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.05, duration: 0.3 });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, duration: 0.3 });
      });
    });
  });
  