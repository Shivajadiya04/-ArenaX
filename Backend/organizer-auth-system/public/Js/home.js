window.addEventListener('DOMContentLoaded', () => {
  // GSAP Animations (already correct)
  const tl = gsap.timeline({ defaults: { ease: 'power1.out' } });

  tl.from('.hero-title', { y: 50, opacity: 0, duration: 1 });
  tl.from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5');
  tl.from('.hero-buttons button', { y: 20, opacity: 0, stagger: 0.2, duration: 0.6 }, '-=0.4');
  tl.from('.logo', { x: -50, opacity: 0, duration: 0.8 }, '-=1');
  tl.from('.nav-buttons a', { x: 50, opacity: 0, stagger: 0.1, duration: 0.6 }, '-=0.8');
  tl.from('.section-title', { y: 40, opacity: 0, duration: 1 }, '-=0.4');
  tl.from('.about-card', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.3
  }, '-=0.5');

  // Button hover
  const buttons = document.querySelectorAll('.btn-solid, .btn-outline');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.05, duration: 0.3 });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1, duration: 0.3 });
    });
  });

  // ⭐ Sidebar toggle logic
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  const closeBtn = document.getElementById('closeBtn');

  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      console.log("clicked")
      sidebar.classList.add('active');
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('active');
      console.log("clicked")
    });
  }
});


  