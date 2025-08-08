// Mobile Performance Optimizations
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let isTouch = 'ontouchstart' in window;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Loading screen animation
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simulate loading time and hide loading screen
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 800);
    }, 2500);

    // Prevent scrolling during loading
    document.body.style.overflow = 'hidden';
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu(forceState) {
        const isOpen = forceState !== undefined ? forceState : !hamburger.classList.contains('active');
        hamburger.classList.toggle('active', isOpen);
        navMenu.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    }

    hamburger.addEventListener('click', function() {
        toggleMenu();
    });

    // Keyboard accessibility
    hamburger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            toggleMenu(false);
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Gallery Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            galleryItems.forEach(item => {
                // Add fade out effect
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    if (filterValue === 'all') {
                        item.style.display = 'block';
                        item.classList.remove('hide');
                    } else {
                        const itemCategory = item.getAttribute('data-category');
                        if (itemCategory === filterValue) {
                            item.style.display = 'block';
                            item.classList.remove('hide');
                        } else {
                            item.style.display = 'none';
                            item.classList.add('hide');
                        }
                    }

                    // Fade in effect
                    setTimeout(() => {
                        if (item.style.display !== 'none') {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }
                    }, 50);
                }, 200);
            });
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission (replace with actual form handling)
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            this.reset();
        });
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
            border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#b8daff'};
        `;

        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: inherit;
                    padding: 0;
                    line-height: 1;
                }
                .notification-close:hover {
                    opacity: 0.7;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Enhanced scroll animations with Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100); // Stagger animation
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add scroll reveal classes to elements
    const revealElements = document.querySelectorAll('.specialty-card, .contact-item, .about-text, .section-title, .section-subtitle');
    revealElements.forEach((el, index) => {
        if (index % 3 === 0) {
            el.classList.add('scroll-reveal-left');
        } else if (index % 3 === 1) {
            el.classList.add('scroll-reveal');
        } else {
            el.classList.add('scroll-reveal-right');
        }
        scrollObserver.observe(el);
    });

    // Gallery items scroll animation
    const galleryItemsScroll = document.querySelectorAll('.gallery-item');
    galleryItemsScroll.forEach((item, index) => {
        item.classList.add('scroll-reveal');
        item.style.transitionDelay = `${(index % 6) * 0.1}s`;
        scrollObserver.observe(item);
    });

    // Enhanced gallery item hover effects with particle animation
    const galleryItemsForHover = document.querySelectorAll('.gallery-item');
    galleryItemsForHover.forEach(item => {
        item.addEventListener('mouseenter', function() {
            createParticles(this);
            this.style.transform = 'translateY(-15px) rotateX(5deg) rotateY(5deg) scale(1.02)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });

    // Create particle effect on hover
    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        const particleCount = 6;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: rgba(248, 200, 220, 0.8);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                animation: particleFloat 1.5s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1500);
        }
    }

    // Add particle animation keyframes
    if (!document.querySelector('#particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-50px) scale(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Lightbox: create, open, close
    let lightboxOverlayElement = null;
    let lightboxImageElement = null;
    function ensureLightboxMounted() {
        if (lightboxOverlayElement) return;
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Image preview');
        overlay.innerHTML = `
            <div class="lightbox-content">
                <img class="lightbox-image" alt="Enlarged image" />
                <button class="lightbox-close" aria-label="Close">&times;</button>
            </div>
        `;
        document.body.appendChild(overlay);
        lightboxOverlayElement = overlay;
        lightboxImageElement = overlay.querySelector('.lightbox-image');
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeLightbox();
        });
        // Close button
        overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        // Prevent closing when clicking inside content
        overlay.querySelector('.lightbox-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    function openLightbox(imageSrc, imageAlt = 'Enlarged image') {
        ensureLightboxMounted();
        if (!lightboxOverlayElement || !lightboxImageElement) return;
        lightboxImageElement.setAttribute('src', imageSrc);
        lightboxImageElement.setAttribute('alt', imageAlt || 'Enlarged image');
        lightboxOverlayElement.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        if (!lightboxOverlayElement) return;
        lightboxOverlayElement.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
    // Attach click handlers to open lightbox
    ensureLightboxMounted();
    galleryItemsForHover.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) openLightbox(img.getAttribute('src'), img.getAttribute('alt'));
        });
    });

    // Add loading states for form submission
    const submitBtn = document.querySelector('.contact-form .btn-primary');
    if (submitBtn) {
        const originalText = submitBtn.textContent;
        
        contactForm.addEventListener('submit', function() {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Reset after 2 seconds (simulate processing)
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Add active states for navigation based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinksForScroll = document.querySelectorAll('.nav-link[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinksForScroll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Add CSS for active nav links
    const navStyle = document.createElement('style');
    navStyle.textContent = `
        .nav-link.active {
            color: var(--accent-pink) !important;
        }
        .nav-link.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(navStyle);

    // Performance optimization: Debounce scroll events
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

    // Apply debounce to scroll events
    const debouncedScrollHandler = debounce(() => {
        // Handle scroll events here if needed
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu and lightbox
        if (e.key === 'Escape') {
            toggleMenu(false);
            if (document.querySelector('.lightbox-overlay.open')) {
                closeLightbox();
            }
        }
    });

    // Initialize gallery with all items visible
    galleryItems.forEach(item => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    console.log('Mai Bakeries website loaded successfully! 🍪');
});

// Mobile-Specific Enhancements
if (isMobile || isTouch) {
    // Enhanced touch interactions for gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        let touchStartTime = 0;
        
        item.addEventListener('touchstart', function(e) {
            touchStartTime = Date.now();
            this.style.transform = 'scale(0.98)';
            this.style.transition = 'transform 0.1s ease';
        });
        
        item.addEventListener('touchend', function(e) {
            const touchDuration = Date.now() - touchStartTime;
            this.style.transform = 'scale(1)';
            
            // If it's a quick tap (less than 300ms), show overlay
            if (touchDuration < 300) {
                const overlay = this.querySelector('.gallery-overlay');
                if (overlay) {
                    overlay.style.opacity = overlay.style.opacity === '1' ? '0' : '1';
                    overlay.style.transform = overlay.style.opacity === '1' ? 'translateY(0)' : 'translateY(100%)';
                }
            }
        });
        
        item.addEventListener('touchcancel', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Optimize animations for mobile performance
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        // Reduce animation complexity on mobile
        element.style.animationDuration = '8s';
        element.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Enhanced mobile navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Add touch feedback to hamburger
    if (hamburger) {
        hamburger.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        hamburger.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // Prevent zoom on input focus (iOS)
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (window.innerWidth < 768) {
                document.querySelector('meta[name=viewport]').setAttribute('content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            }
        });
        
        input.addEventListener('blur', function() {
            document.querySelector('meta[name=viewport]').setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
        });
    });
}

// Enhanced scroll performance for mobile
let ticking = false;
function updateScrollEffects() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});

// Form validation with mobile-friendly messages
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('#name').value.trim();
        const email = this.querySelector('#email').value.trim();
        const subject = this.querySelector('#subject').value.trim();
        const message = this.querySelector('#message').value.trim();
        
        if (!name || !email || !subject || !message) {
            // Mobile-friendly error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'mobile-error-message';
            errorDiv.innerHTML = '⚠️ Please fill in all fields';
            errorDiv.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #ff6b6b;
                color: white;
                padding: 1rem 2rem;
                border-radius: 25px;
                z-index: 9999;
                font-size: 1rem;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                animation: slideDown 0.3s ease;
            `;
            
            document.body.appendChild(errorDiv);
            setTimeout(() => {
                errorDiv.remove();
            }, 3000);
            return;
        }
        
        // Success message
        const successDiv = document.createElement('div');
        successDiv.className = 'mobile-success-message';
        successDiv.innerHTML = '✅ Thank you! We\'ll get back to you soon.';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 9999;
            font-size: 1rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            animation: slideDown 0.3s ease;
        `;
        
        document.body.appendChild(successDiv);
        setTimeout(() => {
            successDiv.remove();
        }, 4000);
        
        // Reset form
        this.reset();
    });
}

// Add slide animation keyframe
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
