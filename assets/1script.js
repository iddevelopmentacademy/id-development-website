document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelector('.nav-links');
  const menuToggle = document.querySelector('.menu-toggle');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('is-open'));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('is-open'));
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealItems.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const contactForm = document.querySelector('#contact-form');
  if (contactForm && !contactForm.dataset.formsubmit) {
    const statusMessage = document.querySelector('#form-status');

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = (formData.get('name') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const organisation = (formData.get('organisation') || '').toString().trim();
      const topic = (formData.get('topic') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();

      if (!name || !email || !message) {
        if (statusMessage) {
          statusMessage.textContent = 'Please complete your name, email address and message.';
        }
        return;
      }

      const subject = encodeURIComponent(`Website enquiry: ${topic || 'General information'}`);
      const body = encodeURIComponent(
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Organisation: ${organisation || '-'}\n` +
        `Topic: ${topic || '-'}\n\n` +
        `${message}`
      );

      window.location.href = `mailto:id.development@yahoo.com?subject=${subject}&body=${body}`;

      if (statusMessage) {
        statusMessage.textContent = 'We are opening your email app so you can send the message.';
      }
    });
  }
});
