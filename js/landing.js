// Landing page logic
document.addEventListener('DOMContentLoaded', () => {
  // Add smooth scrolling for anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for sticky header
          behavior: 'smooth'
        });
      }
    });
  });

  // Highlight active template card (simulating a carousel or showcase switcher)
  const templateCards = document.querySelectorAll('.template-card');
  templateCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      templateCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
});
