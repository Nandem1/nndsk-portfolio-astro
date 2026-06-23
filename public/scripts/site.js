/* global document, window, Element, HTMLDialogElement, IntersectionObserver */

(() => {
  function initReveal() {
    const reveals = document.querySelectorAll('[data-reveal]');

    if (reveals.length > 0 && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
      );

      reveals.forEach(element => observer.observe(element));
      return;
    }

    reveals.forEach(element => element.classList.add('is-visible'));
  }

  function initDialogs() {
    document.addEventListener('click', event => {
      if (!(event.target instanceof Element)) return;

      const opener = event.target.closest('[data-dialog-open]');
      if (!opener) return;

      const id = opener.getAttribute('data-dialog-open');
      if (!id) return;

      const dialog = document.getElementById(id);
      if (!(dialog instanceof HTMLDialogElement)) return;

      dialog.showModal();
      event.preventDefault();
    });

    document.addEventListener('click', event => {
      if (!(event.target instanceof Element)) return;

      const dialog = event.target.closest('dialog.lightbox');
      if (dialog instanceof HTMLDialogElement && event.target === dialog) {
        dialog.close();
      }
    });
  }

  initReveal();
  initDialogs();
})();
