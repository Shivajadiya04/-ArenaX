gsap.from(".login-container", { duration: 1, opacity: 0, y: -50 });

gsap.from(".bg-img", {
  opacity: 0.2,
  y: 100,
  duration: 2,
  ease: "power2.out",
  stagger: 0.3,
  repeat: -1,
  yoyo: true
});
