const sections = Array.from(document.querySelectorAll('.section'));
const links = document.querySelectorAll('.nav-links a');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

function setActiveLink(target) {
  links.forEach(link => {
    link.classList.toggle('active', link.dataset.target === target);
  });
}

function scrollToSection(target) {
  const section = document.getElementById(`${target}-section`);
  if (!section) return;

  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  history.replaceState(null, '', `#${target}`);
  setActiveLink(target);
  console.log(`Navigated to ${target}`);
}

links.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const target = event.currentTarget.dataset.target;
    scrollToSection(target);
    navLinks.classList.remove('open');
  });
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

const observerOptions = {
  root: null,
  rootMargin: '-30% 0% -50% 0%',
  threshold: 0.2,
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id.replace('-section', '');
      setActiveLink(id);
      history.replaceState(null, '', `#${id}`);
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);
  return Promise.resolve(copied ? text : '');
}

function showCopyToast() {
  const toast = document.getElementById('copy-toast');
  if (!toast) return;

  toast.classList.add('show');
  window.clearTimeout(showCopyToast.timeout);
  showCopyToast.timeout = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 1400);
}

window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    scrollToSection(hash);
  } else {
    setActiveLink('home');
  }

  document.querySelectorAll('.contact-card').forEach(card => {
    let pressTimer;
    let longPressTriggered = false;

    const startPress = () => {
      longPressTriggered = false;
      pressTimer = window.setTimeout(() => {
        longPressTriggered = true;
        copyToClipboard(card.dataset.copyValue)
          .then(() => showCopyToast())
          .catch(() => showCopyToast());
      }, 450);
    };

    const clearPress = () => {
      if (pressTimer) {
        window.clearTimeout(pressTimer);
      }
      pressTimer = null;
    };

    card.addEventListener('pointerdown', startPress);
    card.addEventListener('pointerup', clearPress);
    card.addEventListener('pointerleave', clearPress);
    card.addEventListener('pointercancel', clearPress);
    card.addEventListener('click', event => {
      event.preventDefault();
      if (longPressTriggered) {
        longPressTriggered = false;
        return;
      }
      window.open(card.dataset.href, '_blank', 'noopener,noreferrer');
    });
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.open(card.dataset.href, '_blank', 'noopener,noreferrer');
      }
    });
  });

  const gofileLink = 'https://gofile.io/d/nZBMV2';
  const capabilityCards = document.querySelectorAll('.capability-card.clickable');
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalClose = document.querySelector('.modal-close');
  const modalWindow = document.querySelector('.modal-window');
  const modalDownload = document.querySelector('.modal-download');

  function openModal() {
    modalOverlay.classList.add('active');
    modalOverlay.classList.remove('closing');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.add('closing');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalWindow.addEventListener('animationend', () => {
      modalOverlay.classList.remove('active', 'closing');
    }, { once: true });
  }

  capabilityCards.forEach(card => {
    const cardName = card.dataset.card;
    const cardType = card.dataset.cardType;

    const activateCard = () => {
      if (cardName === 'junk-cleaner') {
        window.open(gofileLink, '_blank', 'noopener');
        return;
      }
      modalDownload.href = gofileLink;
      openModal();
    };

    card.addEventListener('click', activateCard);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activateCard();
      }
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', event => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
});

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    scrollToSection(hash);
  }
});
