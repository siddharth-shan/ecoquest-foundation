/**
 * EcoQuest Foundation - Main JavaScript
 * Handles interactivity, animations, and dynamic features
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // Mobile Menu Toggle
    // ==========================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');

            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && mobileMenuToggle) {
            if (!event.target.closest('.nav-wrapper')) {
                navMenu.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    });

    // ==========================================
    // Animated Counter (Homepage Stats)
    // ==========================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Intersection Observer for counters
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(function(stat) {
            statsObserver.observe(stat);
        });
    }

    // ==========================================
    // Smooth Scroll for Anchor Links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip empty fragments or single #
            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // ==========================================
    // Resource Filtering (Resources Page)
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const resourceItems = document.querySelectorAll('.resource-item');

    if (filterButtons.length > 0) {
        filterButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                // Update active button
                filterButtons.forEach(function(btn) {
                    btn.classList.remove('active');
                });
                this.classList.add('active');

                // Get category
                const category = this.getAttribute('data-category');

                // Filter resources
                resourceItems.forEach(function(item) {
                    const itemCategory = item.getAttribute('data-category');

                    if (category === 'all' || category === itemCategory) {
                        item.style.display = 'block';
                        // Fade in animation
                        item.style.opacity = '0';
                        setTimeout(function() {
                            item.style.transition = 'opacity 0.3s ease';
                            item.style.opacity = '1';
                        }, 10);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // ==========================================
    // Contact Form Handling
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Here you would typically send the data to a server
            // For now, we'll just show a success message
            console.log('Form submitted:', data);

            // Show success message
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';

            // Optionally reset and show form again after delay
            setTimeout(function() {
                contactForm.reset();
                contactForm.style.display = 'block';
                formSuccess.style.display = 'none';
            }, 5000);
        });
    }

    // ==========================================
    // Newsletter Form Handling
    // ==========================================
    const newsletterForms = document.querySelectorAll('.newsletter-form');

    newsletterForms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = this.querySelector('input[type="email"]').value;

            // Here you would typically send to your email service
            console.log('Newsletter signup:', email);

            // Show confirmation
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    });

    // ==========================================
    // Scroll Animations
    // ==========================================
    const animatedElements = document.querySelectorAll('.mission-card, .program-card, .event-card, .achievement-card, .value-card, .resource-card');

    if (animatedElements.length > 0) {
        const scrollObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    // Stagger animation
                    setTimeout(function() {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'translateY(20px)';
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

                        requestAnimationFrame(function() {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        });
                    }, index * 100);

                    scrollObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(function(element) {
            scrollObserver.observe(element);
        });
    }

    // ==========================================
    // Navbar Scroll Effect
    // ==========================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)';
        }

        lastScroll = currentScroll;
    });

    // ==========================================
    // Back to Top Button (Optional Enhancement)
    // ==========================================
    function createBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '↑';
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Back to top');

        // Add styles
        Object.assign(backToTop.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#34a853',
            color: 'white',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            opacity: '0',
            visibility: 'hidden',
            transition: 'opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease',
            zIndex: '1000',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        });

        document.body.appendChild(backToTop);

        // Show/hide based on scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });

        // Scroll to top on click
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Hover effect
        backToTop.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.backgroundColor = '#137333';
        });

        backToTop.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.backgroundColor = '#34a853';
        });
    }

    // Create back to top button
    createBackToTop();

    // ==========================================
    // Form Validation Enhancement
    // ==========================================
    const formInputs = document.querySelectorAll('input[required], textarea[required], select[required]');

    formInputs.forEach(function(input) {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            this.classList.add('error');
        });

        input.addEventListener('input', function() {
            if (this.validity.valid) {
                this.classList.remove('error');
            }
        });
    });

    // Add error styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        input.error, textarea.error, select.error {
            border-color: #ea4335 !important;
        }
        input.error:focus, textarea.error:focus, select.error:focus {
            border-color: #ea4335 !important;
            box-shadow: 0 0 0 3px rgba(234, 67, 53, 0.1);
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // URL Parameter Handling for Contact Form
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const subjectParam = urlParams.get('subject');
    const subjectSelect = document.getElementById('subject');

    if (subjectParam && subjectSelect) {
        // Map URL parameters to form options
        const subjectMap = {
            'volunteer': 'volunteer',
            'partnership': 'partnership',
            'in-kind': 'donation'
        };

        const mappedSubject = subjectMap[subjectParam] || subjectParam;
        const option = subjectSelect.querySelector(`option[value="${mappedSubject}"]`);

        if (option) {
            subjectSelect.value = mappedSubject;
        }
    }

    // ==========================================
    // Image Lazy Loading (for better performance)
    // ==========================================
    const images = document.querySelectorAll('img[data-src]');

    if (images.length > 0 && 'IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // ==========================================
    // Print Friendly Styles
    // ==========================================
    window.addEventListener('beforeprint', function() {
        // Expand all collapsed sections
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.style.display = 'none';
        }
    });

    // ==========================================
    // Accessibility: Skip to main content
    // ==========================================
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';

    Object.assign(skipLink.style, {
        position: 'absolute',
        top: '-40px',
        left: '0',
        background: '#34a853',
        color: 'white',
        padding: '8px',
        textDecoration: 'none',
        zIndex: '10000'
    });

    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });

    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // ==========================================
    // Console Welcome Message
    // ==========================================
    console.log('%c🌍 Welcome to EcoQuest Foundation!', 'color: #34a853; font-size: 20px; font-weight: bold;');
    console.log('%cInterested in contributing to our code? Contact us!', 'color: #00a8e1; font-size: 14px;');

});

// ==========================================
// Utility Functions
// ==========================================

/**
 * Debounce function to limit rate of function execution
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

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Format date for events
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}
