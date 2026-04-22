/* ============================================
   PORTFOLIO WEBSITE - JAVASCRIPT
   Handles interactivity and dynamic features
   ============================================ */

// ============================================
// UTILITY FUNCTIONS (defined first so they're available)
// ============================================

/**
 * Throttle function to optimize scroll event listeners
 */
function throttle(func, wait) {
    let timeout = null;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (!timeout) {
            func(...args);
            timeout = setTimeout(later, wait);
        }
    };
}

/**
 * Debounce function for resize events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// DARK MODE TOGGLE
// ============================================

const themeBtn = document.getElementById('theme-btn');

function initializeDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeBtn.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        themeBtn.textContent = '🌙';
    }
}

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    themeBtn.textContent = isDarkMode ? '☀️' : '🌙';
});

// ============================================
// HAMBURGER MENU (MOBILE)
// ============================================

const hamburgerBtn = document.getElementById('hamburger-btn');
const navMenu = document.querySelector('.nav-menu');

if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// ============================================
// SMOOTH SCROLLING NAVIGATION
// ============================================

const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            updateActiveLink(link);

            // Close mobile menu
            if (hamburgerBtn) {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });
});

// ============================================
// UPDATE ACTIVE NAVIGATION LINK
// ============================================

function updateActiveLink(clickedLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    clickedLink.classList.add('active');
}

window.addEventListener('scroll', throttle(() => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}, 100));

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

function setupScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.skill-card, .project-card, .stat, .about-text, .contact-link, .section-title, .contact-form'
    );

    revealElements.forEach(el => el.classList.add('scroll-reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
}

// ============================================
// SKILL PROGRESS ANIMATION
// ============================================

function setupSkillBars() {
    const skillCards = document.querySelectorAll('.skill-card');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target.querySelector('.skill-progress');
                if (bar && !entry.target.hasAttribute('data-animated')) {
                    entry.target.setAttribute('data-animated', 'true');
                    const width = bar.style.width;
                    bar.style.width = '0';
                    requestAnimationFrame(() => {
                        bar.style.transition = 'width 1.5s cubic-bezier(0.16,1,0.3,1)';
                        bar.style.width = width;
                    });
                }
            }
        });
    }, { threshold: 0.5 });

    skillCards.forEach(card => skillObserver.observe(card));
}

// ============================================
// PROJECT CARD SPOTLIGHT EFFECT
// ============================================

function setupSpotlightEffect() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });
}

// ============================================
// TYPING ANIMATION (type + delete loop)
// ============================================

function setupTypingAnimation() {
    const typedEl = document.getElementById('typed-text');
    if (!typedEl) return;

    const phrases = [
        "Coding Enthusiast",
        "Aspiring Full Stack Developer"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            typedEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === current.length) {
            speed = 2000; // pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    type();
}

// ============================================
// FORM HANDLING
// ============================================

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = contactForm.querySelector('input[placeholder="Your Name"]').value;
        const email = contactForm.querySelector('input[placeholder="Your Email"]').value;
        const message = contactForm.querySelector('textarea[placeholder="Your Message"]').value;

        if (name.trim() && email.trim() && message.trim()) {
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            console.log('Form submitted:', { name, email, message });
        } else {
            showNotification('Please fill in all fields.', 'error');
        }
    });
}

// ============================================
// NOTIFICATION MESSAGES
// ============================================

function showNotification(text, type) {
    const notification = document.createElement('div');
    notification.textContent = text;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 24px',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '600',
        fontSize: '0.95rem',
        zIndex: '1000',
        transform: 'translateX(120%)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
    });

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

const scrollTopBtn = document.getElementById('scroll-top-btn');

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }, 100));
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

window.addEventListener('scroll', throttle(() => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.12)';
    } else {
        navbar.style.boxShadow = '0 1px 20px rgba(0, 0, 0, 0.06)';
    }
}, 100));

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        themeBtn.click();
    }
});

// ============================================
// PAGE LOAD INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeDarkMode();
    setupTypingAnimation();
    setupScrollReveal();
    setupSkillBars();
    setupTiltEffect();

    // Auto update footer year
    const footerP = document.querySelector('.footer p');
    if (footerP) {
        footerP.innerHTML = `&copy; ${new Date().getFullYear()} Smit's Portfolio. All rights reserved.`;
    }

    console.log('Portfolio website loaded successfully!');
});

// ============================================
// CONSOLE MESSAGE FOR DEVELOPERS
// ============================================

console.log('%cWelcome to my Portfolio!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cCheck out the source code and feel free to connect with me!', 'color: #a855f7; font-size: 14px;');
