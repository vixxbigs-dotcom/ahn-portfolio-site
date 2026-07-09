const header = document.querySelector('#siteHeader');
const menuButton = document.querySelector('.mobile-menu-button');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');
const sections = document.querySelectorAll('main section[id]');
const reveals = document.querySelectorAll('.reveal');

const updateHeader = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 6);
};

const closeMobileMenu = () => {
  nav.classList.remove('is-open');
  document.body.classList.remove('is-menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
};

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  document.body.classList.toggle('is-menu-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

reveals.forEach((element) => revealObserver.observe(element));

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    });
  },
  {
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0
  }
);

sections.forEach((section) => activeObserver.observe(section));

const initProjectGalleries = () => {
  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
      if (!gallery.closest('.project-showcase')?.querySelector('h3')?.textContent.includes('YouTube')) return;
    const slides = Array.from(gallery.querySelectorAll('.gallery-slide'));
    const prevButton = gallery.querySelector('.gallery-button.prev');
    const nextButton = gallery.querySelector('.gallery-button.next');
    const dotsContainer = gallery.querySelector('.gallery-dots');
    let currentIndex = 0;

    if (!slides.length) return;

    const dots = slides.map((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'gallery-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `${index + 1}번째 이미지 보기`);
      dot.addEventListener('click', (event) => {
        event.preventDefault();
        showSlide(index);
      });
      dotsContainer.appendChild(dot);
      return dot;
    });

    const showSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === currentIndex);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === currentIndex);
      });
    };

    prevButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      showSlide(currentIndex - 1);
    });

    nextButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      showSlide(currentIndex + 1);
    });

    showSlide(0);
  });
};

const initOptionalGifBackgrounds = () => {
  document.querySelectorAll('.ai-bg-section[data-bg]').forEach((section) => {
    const bgPath = section.getAttribute('data-bg');
    if (!bgPath) return;

    const tester = new Image();
    tester.onload = () => {
      section.style.setProperty('--ai-bg', `url("${bgPath}")`);
      section.classList.add('has-ai-bg');
    };
    tester.onerror = () => {
      section.classList.remove('has-ai-bg');
    };
    tester.src = bgPath;
  });
};

window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('load', () => {
  updateHeader();
  initProjectGalleries();
  initOptionalGifBackgrounds();
});
