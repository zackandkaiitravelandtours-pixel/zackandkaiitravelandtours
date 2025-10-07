// Travel Agency Website JavaScript
(function() {
    'use strict';

    // Configuration object
    let config = {};

    // DOM Elements
    const elements = {
        navToggle: document.querySelector('.nav-toggle'),
        navMenu: document.querySelector('.nav-menu'),
        navLinks: document.querySelectorAll('.nav-link'),
        header: document.querySelector('.header'),
        backToTopBtn: document.getElementById('backToTop'),
        contactForm: document.querySelector('.contact-form'),
        newsletterForm: document.querySelector('.newsletter-form'),
        fadeElements: document.querySelectorAll('.fade-in')
    };

    // Initialize the application
    function init() {
        loadConfiguration().then(() => {
            applyConfiguration();
            setupEventListeners();
            setupScrollEffects();
            setupFormValidation();
            setupSmoothScrolling();
            setupAnimations();
            
            // Set minimum date for check-in and check-out
            setMinimumDates();
            
            console.log('Travel Agency website initialized successfully!');
        }).catch(error => {
            console.warn('Could not load configuration, using defaults:', error);
            setupEventListeners();
            setupScrollEffects();
            setupFormValidation();
            setupSmoothScrolling();
            setupAnimations();
            setMinimumDates();
        });
    }

    // Event Listeners Setup
    function setupEventListeners() {
        // Mobile navigation toggle
        if (elements.navToggle && elements.navMenu) {
            elements.navToggle.addEventListener('click', toggleMobileNav);
        }

        // Close mobile nav when clicking on links
        elements.navLinks.forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });

        // Scroll events
        window.addEventListener('scroll', throttle(handleScroll, 10));
        window.addEventListener('resize', throttle(handleResize, 250));

        // Back to top button
        if (elements.backToTopBtn) {
            elements.backToTopBtn.addEventListener('click', scrollToTop);
        }

        // Form submissions
        if (elements.contactForm) {
            elements.contactForm.addEventListener('submit', handleContactForm);
        }

        if (elements.newsletterForm) {
            elements.newsletterForm.addEventListener('submit', handleNewsletterForm);
        }

        // Close mobile nav when clicking outside
        document.addEventListener('click', handleOutsideClick);
    }

    // Mobile Navigation Functions
    function toggleMobileNav(e) {
        e.preventDefault();
        elements.navToggle.classList.toggle('active');
        elements.navMenu.classList.toggle('active');
        elements.navToggle.setAttribute('aria-expanded', 
            elements.navMenu.classList.contains('active'));
        
        // Prevent body scroll when nav is open
        document.body.style.overflow = elements.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileNav() {
        elements.navToggle.classList.remove('active');
        elements.navMenu.classList.remove('active');
        elements.navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    function handleOutsideClick(e) {
        if (!elements.navMenu.contains(e.target) && !elements.navToggle.contains(e.target)) {
            closeMobileNav();
        }
    }

    // Scroll Effects
    function setupScrollEffects() {
        handleScroll(); // Initial call
    }

    function handleScroll() {
        const scrollY = window.pageYOffset;
        
        // Header background opacity
        if (elements.header) {
            if (scrollY > 50) {
                elements.header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                elements.header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                elements.header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                elements.header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12)';
            }
        }

        // Back to top button visibility
        if (elements.backToTopBtn) {
            if (scrollY > 300) {
                elements.backToTopBtn.classList.add('visible');
            } else {
                elements.backToTopBtn.classList.remove('visible');
            }
        }

        // Animate elements on scroll
        animateOnScroll();
    }

    function handleResize() {
        // Close mobile nav on resize to larger screen
        if (window.innerWidth > 768) {
            closeMobileNav();
        }
    }

    // Smooth Scrolling
    function setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = elements.header ? elements.header.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile nav after clicking
                    closeMobileNav();
                }
            });
        });
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Form Validation and Handling
    function setupFormValidation() {
        // Real-time validation for contact form
        if (elements.contactForm) {
            const inputs = elements.contactForm.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => clearErrors(input));
            });
        }
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const fieldGroup = field.closest('.form-group');
        
        // Remove existing error messages
        clearErrors(field);
        
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${getFieldLabel(field)} is required.`;
        }
        
        // Email validation
        else if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }
        
        // Phone validation
        else if (fieldName === 'phone' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
            }
        }
        
        // Date validation
        else if (field.type === 'date' && value) {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                isValid = false;
                errorMessage = 'Please select a future date.';
            }
        }

        // Display validation result
        if (!isValid) {
            showFieldError(fieldGroup, field, errorMessage);
        } else {
            showFieldSuccess(fieldGroup, field);
        }

        return isValid;
    }

    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isFormValid = true;

        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        // Additional validation for date range
        const checkinDate = form.querySelector('#checkin');
        const checkoutDate = form.querySelector('#checkout');
        
        if (checkinDate && checkoutDate && checkinDate.value && checkoutDate.value) {
            if (new Date(checkoutDate.value) <= new Date(checkinDate.value)) {
                showFieldError(checkoutDate.closest('.form-group'), checkoutDate, 
                    'Check-out date must be after check-in date.');
                isFormValid = false;
            }
        }

        return isFormValid;
    }

    function showFieldError(fieldGroup, field, message) {
        fieldGroup.classList.remove('success');
        fieldGroup.classList.add('error');
        
        // Remove existing error message
        const existingError = fieldGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        fieldGroup.appendChild(errorElement);
    }

    function showFieldSuccess(fieldGroup, field) {
        fieldGroup.classList.remove('error');
        fieldGroup.classList.add('success');
        
        const existingError = fieldGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    function clearErrors(field) {
        const fieldGroup = field.closest('.form-group');
        fieldGroup.classList.remove('error', 'success');
        
        const existingError = fieldGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    function getFieldLabel(field) {
        const label = field.closest('.form-group').querySelector('label');
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }

    // Form Submission Handlers
    function handleContactForm(e) {
        e.preventDefault();
        
        if (!validateForm(elements.contactForm)) {
            showNotification('Please correct the errors and try again.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        elements.contactForm.classList.add('loading');

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset form
            elements.contactForm.reset();
            clearAllErrors(elements.contactForm);
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            elements.contactForm.classList.remove('loading');
            
            // Show success message
            showNotification('Thank you! Your inquiry has been sent successfully. We\'ll get back to you soon!', 'success');
        }, 2000);
    }

    function handleNewsletterForm(e) {
        e.preventDefault();
        
        const emailInput = elements.newsletterForm.querySelector('input[type="email"]');
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailValue) {
            showNotification('Please enter your email address.', 'error');
            return;
        }
        
        if (!emailRegex.test(emailValue)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = elements.newsletterForm.querySelector('button');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        // Simulate newsletter subscription
        setTimeout(() => {
            emailInput.value = '';
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            showNotification('Successfully subscribed to our newsletter!', 'success');
        }, 1500);
    }

    function clearAllErrors(form) {
        const errorGroups = form.querySelectorAll('.form-group.error, .form-group.success');
        errorGroups.forEach(group => {
            group.classList.remove('error', 'success');
        });
        
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.remove());
    }

    // Animations
    function setupAnimations() {
        // Initialize Intersection Observer for scroll animations
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe all elements with fade-in class
            document.querySelectorAll('.fade-in').forEach(el => {
                animationObserver.observe(el);
            });
        }
    }

    function animateOnScroll() {
        // Parallax effect for hero section (optional)
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    }

    // Utility Functions
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function setMinimumDates() {
        const today = new Date().toISOString().split('T')[0];
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');
        
        if (checkinInput) {
            checkinInput.setAttribute('min', today);
            checkinInput.addEventListener('change', function() {
                if (checkoutInput) {
                    const checkinDate = new Date(this.value);
                    checkinDate.setDate(checkinDate.getDate() + 1);
                    checkoutInput.setAttribute('min', checkinDate.toISOString().split('T')[0]);
                }
            });
        }
        
        if (checkoutInput) {
            checkoutInput.setAttribute('min', today);
        }
    }

    // Notification System
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => closeNotification(notification));

        // Auto close
        setTimeout(() => {
            closeNotification(notification);
        }, 5000);
    }

    function closeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    function getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    function getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    // Performance Optimization
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    // Detect if running on GitHub Pages
    function isGitHubPages() {
        const hostname = window.location.hostname;
        return hostname.includes('github.io') || hostname.includes('githubpages.com');
    }

    // Load configuration from config.json or browser storage
    async function loadConfiguration() {
        try {
            // For GitHub Pages, try browser storage first
            if (isGitHubPages()) {
                const savedConfig = localStorage.getItem('travel-agency-config');
                if (savedConfig) {
                    config = JSON.parse(savedConfig);
                    console.log('Configuration loaded from browser storage');
                    return config;
                }
            }

            // Try to load from config.json
            const response = await fetch('config.json');
            if (!response.ok) {
                throw new Error('Config file not found');
            }
            config = await response.json();
            
            // Save to browser storage for future use
            localStorage.setItem('travel-agency-config', JSON.stringify(config));
            
            return config;
        } catch (error) {
            console.error('Error loading configuration:', error);
            
            // Final fallback to browser storage
            const savedConfig = localStorage.getItem('travel-agency-config');
            if (savedConfig) {
                config = JSON.parse(savedConfig);
                console.log('Fallback: Configuration loaded from browser storage');
                return config;
            }
            
            throw error;
        }
    }

    // Apply configuration to the website
    function applyConfiguration() {
        if (!config || Object.keys(config).length === 0) {
            return;
        }

        try {
            // Apply theme colors
            applyTheme();
            
            // Update company information
            updateCompanyInfo();
            
            // Update hero section
            updateHeroSection();
            
            // Update services
            updateServices();
            
            // Update destinations
            updateDestinations();
            
            // Update testimonials
            updateTestimonials();
            
            // Update SEO
            updateSEO();
            
            console.log('Configuration applied successfully');
        } catch (error) {
            console.error('Error applying configuration:', error);
        }
    }

    // Apply theme colors
    function applyTheme() {
        if (!config.theme) return;
        
        const root = document.documentElement;
        if (config.theme.primaryColor) {
            root.style.setProperty('--primary-color', config.theme.primaryColor);
        }
        if (config.theme.secondaryColor) {
            root.style.setProperty('--secondary-color', config.theme.secondaryColor);
        }
        if (config.theme.accentColor) {
            root.style.setProperty('--accent-color', config.theme.accentColor);
        }
        if (config.theme.fontFamily) {
            root.style.setProperty('--font-family', `'${config.theme.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`);
        }
    }

    // Update company information
    function updateCompanyInfo() {
        if (!config.companyInfo) return;
        
        // Update logo/company name
        const logoElements = document.querySelectorAll('.logo span');
        logoElements.forEach(el => {
            if (config.companyInfo.name) {
                el.textContent = config.companyInfo.name;
            }
        });
        
        // Update contact information
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(el => {
            if (config.companyInfo.phone) {
                el.href = `tel:${config.companyInfo.phone.replace(/[^\d+]/g, '')}`;
                el.textContent = config.companyInfo.phone;
            }
        });
        
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(el => {
            if (config.companyInfo.email) {
                el.href = `mailto:${config.companyInfo.email}`;
                el.textContent = config.companyInfo.email;
            }
        });
        
        // Update address
        if (config.companyInfo.address) {
            const addressElements = document.querySelectorAll('.contact-item p');
            addressElements.forEach(el => {
                if (el.innerHTML.includes('Street')) {
                    el.innerHTML = `${config.companyInfo.address.street}<br>${config.companyInfo.address.city}, ${config.companyInfo.address.state} ${config.companyInfo.address.zip}`;
                }
            });
        }
        
        // Update social media links
        if (config.socialMedia) {
            const socialLinks = {
                facebook: document.querySelector('a[aria-label*="Facebook"], a[href*="facebook"]'),
                instagram: document.querySelector('a[aria-label*="Instagram"], a[href*="instagram"]'),
                twitter: document.querySelector('a[aria-label*="Twitter"], a[href*="twitter"]'),
                linkedin: document.querySelector('a[aria-label*="LinkedIn"], a[href*="linkedin"]')
            };
            
            Object.keys(socialLinks).forEach(platform => {
                if (socialLinks[platform] && config.socialMedia[platform]) {
                    socialLinks[platform].href = config.socialMedia[platform];
                }
            });
        }
    }

    // Update hero section
    function updateHeroSection() {
        if (!config.hero) return;
        
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && config.hero.title) {
            heroTitle.textContent = config.hero.title;
        }
        
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle && config.hero.subtitle) {
            heroSubtitle.textContent = config.hero.subtitle;
        }
        
        const heroImage = document.querySelector('.hero-image img');
        if (heroImage && config.hero.backgroundImage) {
            heroImage.src = config.hero.backgroundImage;
        }
        
        const heroButtons = document.querySelectorAll('.hero-buttons .btn');
        if (heroButtons.length >= 2) {
            if (config.hero.button1Text) {
                heroButtons[0].textContent = config.hero.button1Text;
            }
            if (config.hero.button2Text) {
                heroButtons[1].textContent = config.hero.button2Text;
            }
        }
    }

    // Update services section
    function updateServices() {
        if (!config.services || !Array.isArray(config.services)) return;
        
        const servicesGrid = document.querySelector('.services-grid');
        if (!servicesGrid) return;
        
        servicesGrid.innerHTML = '';
        
        config.services.forEach(service => {
            const serviceCard = document.createElement('article');
            serviceCard.className = 'service-card';
            serviceCard.innerHTML = `
                <div class="service-icon">
                    <i class="${service.icon}" aria-hidden="true"></i>
                </div>
                <h3 class="service-title">${service.title}</h3>
                <p class="service-description">${service.description}</p>
            `;
            servicesGrid.appendChild(serviceCard);
        });
    }

    // Update destinations section
    function updateDestinations() {
        if (!config.destinations || !Array.isArray(config.destinations)) return;
        
        const destinationsGrid = document.querySelector('.destinations-grid');
        if (!destinationsGrid) return;
        
        destinationsGrid.innerHTML = '';
        
        config.destinations.forEach(destination => {
            const destinationCard = document.createElement('article');
            destinationCard.className = 'destination-card';
            destinationCard.innerHTML = `
                <div class="destination-image">
                    <img src="${destination.image}" 
                         alt="${destination.name} - ${destination.description}" 
                         loading="lazy">
                    <div class="destination-overlay">
                        <div class="destination-info">
                            <h3 class="destination-title">${destination.name}</h3>
                            <p class="destination-price">Starting from ${destination.price}</p>
                            <a href="#book" class="btn btn-outline">Book Now</a>
                        </div>
                    </div>
                </div>
            `;
            destinationsGrid.appendChild(destinationCard);
        });
    }

    // Update testimonials section
    function updateTestimonials() {
        if (!config.testimonials || !Array.isArray(config.testimonials)) return;
        
        const testimonialsGrid = document.querySelector('.testimonials-grid');
        if (!testimonialsGrid) return;
        
        testimonialsGrid.innerHTML = '';
        
        config.testimonials.forEach(testimonial => {
            const testimonialCard = document.createElement('article');
            testimonialCard.className = 'testimonial-card';
            
            // Generate stars
            const stars = Array(testimonial.rating).fill('<i class="fas fa-star" aria-hidden="true"></i>').join('');
            
            testimonialCard.innerHTML = `
                <div class="testimonial-content">
                    <div class="stars" aria-label="${testimonial.rating} star rating">
                        ${stars}
                    </div>
                    <blockquote>
                        <p>"${testimonial.text}"</p>
                    </blockquote>
                    <div class="testimonial-author">
                        <img src="${testimonial.image}" 
                             alt="${testimonial.name}" 
                             class="author-image"
                             loading="lazy">
                        <div class="author-info">
                            <cite class="author-name">${testimonial.name}</cite>
                            <span class="author-location">${testimonial.location}</span>
                        </div>
                    </div>
                </div>
            `;
            testimonialsGrid.appendChild(testimonialCard);
        });
    }

    // Update SEO information
    function updateSEO() {
        if (!config.seo && !config.companyInfo) return;
        
        // Update page title
        if (config.companyInfo && config.companyInfo.name) {
            document.title = `${config.companyInfo.name} - ${config.companyInfo.tagline || 'Your Dream Vacation Awaits'}`;
        }
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && (config.seo?.metaDescription || config.companyInfo?.description)) {
            metaDescription.content = config.seo?.metaDescription || config.companyInfo.description;
        }
        
        // Update meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords && config.seo?.keywords) {
            metaKeywords.content = config.seo.keywords;
        }
        
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && config.companyInfo?.name) {
            ogTitle.content = `${config.companyInfo.name} - ${config.companyInfo.tagline || 'Your Dream Vacation Awaits'}`;
        }
        
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription && (config.seo?.metaDescription || config.companyInfo?.description)) {
            ogDescription.content = config.seo?.metaDescription || config.companyInfo.description;
        }
        
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl && config.companyInfo?.website) {
            ogUrl.content = config.companyInfo.website;
        }
    }

    // Listen for configuration updates from admin panel
    function setupAdminSync() {
        window.addEventListener('message', (event) => {
            if (event.data.type === 'CONFIG_UPDATED') {
                config = event.data.config;
                applyConfiguration();
                console.log('Configuration updated from admin panel');
            }
        });
        
        // Listen for storage changes (when admin panel saves)
        window.addEventListener('storage', (event) => {
            if (event.key === 'travel-agency-config' && event.newValue) {
                config = JSON.parse(event.newValue);
                applyConfiguration();
                console.log('Configuration updated from storage');
            }
        });
    }

    // Enhanced initialization
    function enhancedInit() {
        setupAdminSync();
        init();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhancedInit);
    } else {
        enhancedInit();
    }

    // Expose some functions globally for debugging (development only)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        window.TravelAgency = {
            showNotification,
            validateForm,
            throttle,
            debounce
        };
    }

})();