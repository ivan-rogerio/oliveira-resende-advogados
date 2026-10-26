/* ========================================================================== 
   OLIVEIRA E RESENDE — INTERAÇÕES GERAIS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.main-header');
    const logo = document.querySelector('.logo-img');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');

    /* ----------------------------------------------------------------------
       HEADER — estado transparente no Hero / estado sólido no scroll
       ---------------------------------------------------------------------- */
    const syncHeader = () => {
        const scrolled = window.scrollY > 28;
        header?.classList.toggle('is-scrolled', scrolled);

        if (logo) {
            const target = scrolled
                ? 'assets/images/logo-azul.png'
                : 'assets/images/logo-metalico.png';

            if (logo.getAttribute('src') !== target) {
                logo.classList.remove('logo-ready');
                window.setTimeout(() => {
                    logo.src = target;
                }, 120);
            }
        }
    };

    if (logo) {
        logo.addEventListener('load', () => logo.classList.add('logo-ready'));
    }

    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });

    /* ----------------------------------------------------------------------
       MENU MOBILE
       ---------------------------------------------------------------------- */
    let isMenuOpen = false;

    const setMenuState = (open) => {
        isMenuOpen = open;
        mobileMenu?.classList.toggle('active', open);
        mobileMenuButton?.setAttribute('aria-expanded', String(open));

        if (menuIcon) menuIcon.style.display = open ? 'none' : 'block';
        if (closeIcon) closeIcon.style.display = open ? 'block' : 'none';
    };

    mobileMenuButton?.addEventListener('click', () => setMenuState(!isMenuOpen));

    mobileMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenuState(false));
    });

    /* Fecha o menu com Escape. */
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && isMenuOpen) setMenuState(false);
    });

    /* ----------------------------------------------------------------------
       REVEAL PROGRESSIVO DAS SEÇÕES
       A classe de preparação só é adicionada quando o JS está disponível;
       sem JavaScript, todo o conteúdo continua visível.
       ---------------------------------------------------------------------- */
    const sections = document.querySelectorAll('.main-section');
    const revealSelectors = [
        '.about-content > *', '.about-column',
        '.services-header > *', '.service-card',
        '.features-intro > *', '.feature-item',
        '.contact-info > *', '.contact-form-wrapper',
        '.footer-brand', '.footer-links-col', '.footer-bottom'
    ].join(',');

    const revealItems = document.querySelectorAll(revealSelectors);
    revealItems.forEach((item, index) => {
        item.classList.add('reveal-item');
        item.style.setProperty('--reveal-delay', `${(index % 6) * 90}ms`);
    });
    document.documentElement.classList.add('has-reveal-motion');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -7% 0px',
            threshold: 0.10
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            });
        }, observerOptions);

        revealItems.forEach(item => revealObserver.observe(item));

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, observerOptions);
        sections.forEach(section => sectionObserver.observe(section));
    } else {
        revealItems.forEach(item => item.classList.add('is-revealed'));
        sections.forEach(section => section.classList.add('is-visible'));
    }

    /* Microinteração discreta no formulário: feedback visual ao focar campos. */
    document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea')
        .forEach(field => {
            field.addEventListener('focus', () => field.closest('.form-group')?.classList.add('is-focused'));
            field.addEventListener('blur', () => field.closest('.form-group')?.classList.remove('is-focused'));
        });
});
