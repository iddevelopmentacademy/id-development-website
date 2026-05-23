
(function () {
  const languageButtons = document.querySelectorAll('.lang-btn');
  const translatableNodes = document.querySelectorAll('[data-en][data-bg]');
  const placeholderNodes = document.querySelectorAll('[data-placeholder-en][data-placeholder-bg]');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const faqItems = document.querySelectorAll('.faq-item');
  const galleryImages = document.querySelectorAll('.gallery-item img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const savedLanguage = localStorage.getItem('site-language') || 'en';

  function setNodeText(node, lang) {
    const value = node.getAttribute(`data-${lang}`);
    if (value !== null) node.textContent = value;
  }

  function setOptionLabels(lang) {
    document.querySelectorAll('option[data-en][data-bg]').forEach((option) => {
      const value = option.getAttribute(`data-${lang}`);
      if (value !== null) option.textContent = value;
    });
  }

  function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.body.dataset.language = lang;
    localStorage.setItem('site-language', lang);

    translatableNodes.forEach((node) => setNodeText(node, lang));
    placeholderNodes.forEach((node) => {
      const placeholder = node.getAttribute(`data-placeholder-${lang}`);
      if (placeholder !== null) node.setAttribute('placeholder', placeholder);
    });

    const titleNode = document.querySelector('title[data-en][data-bg]');
    if (titleNode) {
      const title = titleNode.getAttribute(`data-${lang}`);
      if (title) document.title = title;
    }

    setOptionLabels(lang);

    languageButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.lang === lang);
    });
  }

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => applyLanguage(button.dataset.lang));
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    if (!button) return;
    button.addEventListener('click', () => item.classList.toggle('open'));
  });

  if (galleryImages.length && lightbox && lightboxImage) {
    galleryImages.forEach((image) => {
      image.addEventListener('click', () => {
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt || '';
        lightbox.classList.add('open');
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
    lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.classList.remove('open'); });
  }

  if (contactForm && formNote) {
    const submitButton = document.getElementById('contactSubmit');
    const formMessages = {
      en: {
        sending: 'Sending your message...',
        success: 'Thank you. Your message has been sent successfully.',
        error: 'Something went wrong. Please try again in a moment.',
        firstConfirm: 'Almost done. Please open the confirmation email and activate the form once, then submit again.'
      },
      bg: {
        sending: 'Изпращаме вашето съобщение...',
        success: 'Благодарим ви. Вашето съобщение беше изпратено успешно.',
        error: 'Възникна проблем. Моля, опитайте отново след малко.',
        firstConfirm: 'Още една стъпка: отворете имейла за потвърждение и активирайте формата еднократно, след което изпратете отново.'
      }
    };

    const setFormNote = (type, text) => {
      formNote.textContent = text;
      formNote.classList.remove('is-error', 'is-success');
      formNote.classList.add(type === 'error' ? 'is-error' : 'is-success');
      formNote.style.display = 'block';
    };

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const currentLang = document.documentElement.lang === 'bg' ? 'bg' : 'en';
      const labels = formMessages[currentLang];
      const formData = new FormData(contactForm);

      setFormNote('success', labels.sending);
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalText = submitButton.textContent;
        submitButton.textContent = labels.sending;
      }

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        const data = await response.json().catch(() => ({}));
        const message = typeof data.message === 'string' ? data.message.toLowerCase() : '';

        if (!response.ok) {
          const confirmHint = message.includes('confirm') || message.includes('activate');
          throw new Error(confirmHint ? 'first-confirm' : 'request-failed');
        }

        contactForm.reset();
        setOptionLabels(currentLang);
        setFormNote('success', labels.success);
      } catch (error) {
        if (error.message === 'first-confirm') {
          setFormNote('error', labels.firstConfirm);
        } else {
          setFormNote('error', labels.error);
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.originalText || submitButton.textContent;
        }
      }
    });
  }

  applyLanguage(savedLanguage);
})();
