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

        // Booking modal functionality
        setupBookingModal();

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

        // Prepare form data
        const formData = new FormData(elements.contactForm);
        const inquiryData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            destination: formData.get('destination'),
            travelers: formData.get('travelers'),
            checkin: formData.get('checkin'),
            checkout: formData.get('checkout'),
            message: formData.get('message'),
            timestamp: new Date().toISOString(),
            type: 'general_inquiry'
        };

        // Send email using EmailJS (preferred method)
        sendEmailViaEmailJS(inquiryData)
            .then(() => {
                // Reset form
                elements.contactForm.reset();
                clearAllErrors(elements.contactForm);
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                elements.contactForm.classList.remove('loading');
                
                // Show success message
                showNotification('Thank you! Your inquiry has been sent successfully. We\'ll get back to you soon!', 'success');
                
                // Store inquiry for reference
                storeInquiry(inquiryData);
            })
            .catch((error) => {
                console.error('EmailJS failed, trying fallback method:', error);
                
                // Try fallback method (PHP backend or mailto)
                sendEmailFallback(inquiryData)
                    .then(() => {
                        // Reset form
                        elements.contactForm.reset();
                        clearAllErrors(elements.contactForm);
                        
                        // Reset button
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        elements.contactForm.classList.remove('loading');
                        
                        // Show success message
                        showNotification('Thank you! Your inquiry has been sent successfully. We\'ll get back to you soon!', 'success');
                        
                        // Store inquiry for reference
                        storeInquiry(inquiryData);
                    })
                    .catch((fallbackError) => {
                        console.error('All email methods failed:', fallbackError);
                        
                        // Reset button
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        elements.contactForm.classList.remove('loading');
                        
                        // Show error with instructions
                        showNotification('Email service temporarily unavailable. Your inquiry has been saved. Please try again later or contact us directly.', 'warning');
                        
                        // Still store locally for reference
                        storeInquiry(inquiryData);
                    });
            });
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
            
            // Update footer destinations
            updateFooterDestinations();
            
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
        
        // Update logo/company name with header logo support
        const logoElements = document.querySelectorAll('.logo');
        logoElements.forEach(logoEl => {
            const spanElement = logoEl.querySelector('span');
            
            if (config.companyInfo.headerLogo && config.companyInfo.headerLogo.type === 'image') {
                // Replace text with image
                const existingImg = logoEl.querySelector('.header-logo-img');
                if (!existingImg) {
                    const img = document.createElement('img');
                    img.src = config.companyInfo.headerLogo.imagePath;
                    img.alt = config.companyInfo.headerLogo.fallbackText || config.companyInfo.name;
                    img.className = 'header-logo-img';
                    img.style.height = config.companyInfo.headerLogo.height || '40px';
                    img.style.width = 'auto';
                    img.style.maxWidth = '100%';
                    img.style.objectFit = 'contain';
                    
                    // Handle image load error - fallback to text
                    img.onerror = function() {
                        console.warn('Header logo image failed to load, using fallback text');
                        if (spanElement) {
                            spanElement.textContent = config.companyInfo.headerLogo.fallbackText || config.companyInfo.name;
                            spanElement.style.display = 'inline';
                        }
                        this.style.display = 'none';
                    };
                    
                    // Hide text span when image is used
                    if (spanElement) {
                        spanElement.style.display = 'none';
                    }
                    
                    // Insert image after the icon
                    const icon = logoEl.querySelector('i');
                    if (icon) {
                        icon.insertAdjacentElement('afterend', img);
                    } else {
                        logoEl.prepend(img);
                    }
                }
            } else {
                // Use text logo
                if (spanElement && config.companyInfo.name) {
                    spanElement.textContent = config.companyInfo.name;
                    spanElement.style.display = 'inline';
                }
                
                // Remove image if it exists
                const existingImg = logoEl.querySelector('.header-logo-img');
                if (existingImg) {
                    existingImg.remove();
                }
            }
        });
        
        // Update contact information with proper visibility handling
        updateContactDetails();
        
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

    // Update contact details with proper visibility handling
    function updateContactDetails() {
        if (!config.companyInfo) {
            // Hide all contact items if no company info
            const contactItems = document.querySelectorAll('.contact-item');
            contactItems.forEach(item => {
                item.style.display = 'none';
            });
            return;
        }

        // Handle Phone Contact
        const phoneIcon = document.querySelector('i.fa-phone');
        const phoneContactItem = phoneIcon ? phoneIcon.closest('.contact-item') : null;
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        
        if (config.companyInfo.phone && config.companyInfo.phone.trim() !== '') {
            // Show phone contact and update information
            if (phoneContactItem) phoneContactItem.style.display = 'flex';
            phoneLinks.forEach(el => {
                el.href = `tel:${config.companyInfo.phone.replace(/[^\d+]/g, '')}`;
                el.textContent = config.companyInfo.phone;
            });
        } else {
            // Hide phone contact if no phone number
            if (phoneContactItem) phoneContactItem.style.display = 'none';
        }

        // Handle Email Contact
        const emailIcon = document.querySelector('i.fa-envelope');
        const emailContactItem = emailIcon ? emailIcon.closest('.contact-item') : null;
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        
        if (config.companyInfo.email && config.companyInfo.email.trim() !== '') {
            // Show email contact and update information
            if (emailContactItem) emailContactItem.style.display = 'flex';
            emailLinks.forEach(el => {
                el.href = `mailto:${config.companyInfo.email}`;
                el.textContent = config.companyInfo.email;
            });
        } else {
            // Hide email contact if no email
            if (emailContactItem) emailContactItem.style.display = 'none';
        }

        // Handle Address Contact
        const addressIcon = document.querySelector('i.fa-map-marker-alt');
        const addressContactItem = addressIcon ? addressIcon.closest('.contact-item') : null;
        
        if (config.companyInfo.address && 
            config.companyInfo.address.street && 
            config.companyInfo.address.city && 
            config.companyInfo.address.state) {
            
            // Show address contact and update information
            if (addressContactItem) {
                addressContactItem.style.display = 'flex';
                const addressP = addressContactItem.querySelector('p');
                if (addressP) {
                    let addressText = config.companyInfo.address.street;
                    let cityLine = config.companyInfo.address.city;
                    
                    if (config.companyInfo.address.state) {
                        cityLine += `, ${config.companyInfo.address.state}`;
                    }
                    if (config.companyInfo.address.zip) {
                        cityLine += ` ${config.companyInfo.address.zip}`;
                    }
                    
                    addressP.innerHTML = `${addressText}<br>${cityLine}`;
                }
            }
        } else {
            // Hide address contact if insufficient address info
            if (addressContactItem) addressContactItem.style.display = 'none';
        }

        // Update structured data if present
        const structuredData = document.querySelector('script[type="application/ld+json"]');
        if (structuredData && config.companyInfo) {
            try {
                const data = JSON.parse(structuredData.textContent);
                if (config.companyInfo.name) data.name = config.companyInfo.name;
                if (config.companyInfo.phone) data.telephone = config.companyInfo.phone;
                if (config.companyInfo.email) data.email = config.companyInfo.email;
                if (config.companyInfo.website) data.url = config.companyInfo.website;
                
                if (config.companyInfo.address) {
                    data.address = {
                        "@type": "PostalAddress",
                        "streetAddress": config.companyInfo.address.street || "",
                        "addressLocality": config.companyInfo.address.city || "",
                        "addressRegion": config.companyInfo.address.state || "",
                        "postalCode": config.companyInfo.address.zip || "",
                        "addressCountry": config.companyInfo.address.country || "US"
                    };
                }
                
                structuredData.textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                console.warn('Could not update structured data:', error);
            }
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
                            <a href="#book" class="btn btn-outline book-now-btn" 
                               data-destination="${destination.name}" 
                               data-price="${destination.price}" 
                               data-image="${destination.image}">Book Now</a>
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

    // Update footer destinations
    function updateFooterDestinations() {
        if (!config.destinations || !Array.isArray(config.destinations)) return;
        
        const footerDestinations = document.getElementById('footerDestinations');
        if (!footerDestinations) return;
        
        footerDestinations.innerHTML = '';
        
        // Show up to 5 destinations in footer
        const destinationsToShow = config.destinations.slice(0, 5);
        
        destinationsToShow.forEach(destination => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            
            link.href = '#destinations';
            link.textContent = destination.name;
            link.addEventListener('click', function(e) {
                e.preventDefault();
                // First scroll to destinations section
                const destinationsSection = document.getElementById('destinations');
                if (destinationsSection) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    window.scrollTo({
                        top: destinationsSection.offsetTop - headerHeight - 20,
                        behavior: 'smooth'
                    });
                    
                    // Then open the destination modal after a short delay
                    setTimeout(() => {
                        openDestinationModal(destination.name);
                    }, 800);
                }
            });
            
            listItem.appendChild(link);
            footerDestinations.appendChild(listItem);
        });
    }

    // Booking Modal Functionality
    function setupBookingModal() {
        // Handle Book Now button clicks
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('book-now-btn') || e.target.closest('.book-now-btn')) {
                e.preventDefault();
                const bookBtn = e.target.classList.contains('book-now-btn') ? e.target : e.target.closest('.book-now-btn');
                openBookingModal(bookBtn);
            }
            
            // Handle destination card clicks (but not book now buttons)
            if (e.target.closest('.destination-card') && !e.target.closest('.book-now-btn')) {
                e.preventDefault();
                const destinationCard = e.target.closest('.destination-card');
                const destinationName = destinationCard.querySelector('.destination-title').textContent;
                openDestinationModal(destinationName);
            }
            
            // Handle destination modal book button
            if (e.target.id === 'destModalBookBtn') {
                e.preventDefault();
                closeDestinationModal();
                setTimeout(() => {
                    openBookingModal(e.target);
                }, 300);
            }
        });

        // Handle booking form submission
        const quickBookingForm = document.getElementById('quickBookingForm');
        if (quickBookingForm) {
            quickBookingForm.addEventListener('submit', handleQuickBooking);
        }

        // Close modal when clicking backdrop
        const bookingModal = document.getElementById('bookingModal');
        if (bookingModal) {
            bookingModal.addEventListener('click', function(e) {
                if (e.target === bookingModal) {
                    closeBookingModal();
                }
            });
        }
        
        const destinationModal = document.getElementById('destinationModal');
        if (destinationModal) {
            destinationModal.addEventListener('click', function(e) {
                if (e.target === destinationModal) {
                    closeDestinationModal();
                }
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const bookingModal = document.getElementById('bookingModal');
                const destinationModal = document.getElementById('destinationModal');
                
                if (bookingModal && bookingModal.style.display !== 'none') {
                    closeBookingModal();
                } else if (destinationModal && destinationModal.style.display !== 'none') {
                    closeDestinationModal();
                }
            }
        });
        
        // Handle destination modal tabs
        setupDestinationTabs();
    }

    function openBookingModal(bookBtn) {
        const modal = document.getElementById('bookingModal');
        if (!modal) return;

        // Get destination data
        const destination = bookBtn.getAttribute('data-destination') || 'Selected Destination';
        const price = bookBtn.getAttribute('data-price') || 'Contact for pricing';
        const image = bookBtn.getAttribute('data-image') || '';

        // Update modal content
        const modalDestinationName = document.getElementById('modalDestinationName');
        const modalDestinationPrice = document.getElementById('modalDestinationPrice');
        const modalDestinationImage = document.getElementById('modalDestinationImage');

        if (modalDestinationName) modalDestinationName.textContent = destination;
        if (modalDestinationPrice) modalDestinationPrice.textContent = `Starting from ${price}`;
        if (modalDestinationImage && image) {
            modalDestinationImage.src = image;
            modalDestinationImage.alt = destination;
        }

        // Pre-fill the special requests field with destination context
        const modalRequests = document.getElementById('modalRequests');
        if (modalRequests) {
            modalRequests.placeholder = `Tell us about your dream trip to ${destination}. Any specific interests, activities, or requirements for your visit?`;
        }

        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Focus on first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input:not([type="hidden"])');
            if (firstInput) firstInput.focus();
        }, 300);

        // Set minimum date to today
        const checkinInput = document.getElementById('modalCheckin');
        if (checkinInput) {
            const today = new Date().toISOString().split('T')[0];
            checkinInput.setAttribute('min', today);
        }
    }

    function closeBookingModal() {
        const modal = document.getElementById('bookingModal');
        if (!modal) return;

        modal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Reset form
        const form = document.getElementById('quickBookingForm');
        if (form) {
            form.reset();
            clearAllErrors(form);
        }

        // Clear modal content
        const modalDestinationName = document.getElementById('modalDestinationName');
        const modalDestinationPrice = document.getElementById('modalDestinationPrice');
        const modalDestinationImage = document.getElementById('modalDestinationImage');
        const modalRequests = document.getElementById('modalRequests');

        if (modalDestinationName) modalDestinationName.textContent = 'Selected Destination';
        if (modalDestinationPrice) modalDestinationPrice.textContent = 'Starting from $0';
        if (modalDestinationImage) {
            modalDestinationImage.src = '';
            modalDestinationImage.alt = '';
        }
        if (modalRequests) {
            modalRequests.placeholder = 'Tell us about your dream trip, special occasions, interests, or any specific requirements...';
        }
    }

    function handleQuickBooking(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Validate required fields
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showFieldError(field.closest('.form-group'), field, `${getFieldLabel(field)} is required.`);
            } else {
                clearErrors(field);
            }
        });

        // Email validation
        const emailField = form.querySelector('#modalEmail');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                isValid = false;
                showFieldError(emailField.closest('.form-group'), emailField, 'Please enter a valid email address.');
            }
        }

        // Date validation
        const checkinField = form.querySelector('#modalCheckin');
        if (checkinField && checkinField.value) {
            const selectedDate = new Date(checkinField.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                isValid = false;
                showFieldError(checkinField.closest('.form-group'), checkinField, 'Please select a future date.');
            }
        }

        if (!isValid) {
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Request...';
        submitBtn.disabled = true;

        // Get booking details
        const destination = document.getElementById('modalDestinationName').textContent;
        const price = document.getElementById('modalDestinationPrice').textContent;
        
        // Prepare booking data
        const bookingData = {
            destination: destination,
            price: price,
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            travelers: formData.get('travelers'),
            checkin: formData.get('checkin'),
            duration: formData.get('duration'),
            budget: formData.get('budget'),
            requests: formData.get('requests'),
            timestamp: new Date().toISOString()
        };

        // Add booking type identifier
        bookingData.type = 'booking_request';

        // Send booking email
        sendEmailViaEmailJS(bookingData)
            .then(() => {
                // Reset button
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                
                // Close modal
                closeBookingModal();
                
                // Show success message with booking details
                const travelerText = bookingData.travelers === '1' ? 'traveler' : 'travelers';
                const successMessage = `Thank you ${bookingData.name}! Your booking request for ${destination} (${bookingData.travelers} ${travelerText}) has been sent successfully. We'll contact you within 24 hours to finalize your dream trip!`;
                
                showNotification(successMessage, 'success');
                
                // Store booking for reference
                storeInquiry(bookingData);
                
                // Auto-fill the main contact form if user clicks "Book Now" and then scrolls to contact
                setTimeout(() => {
                    const mainForm = document.querySelector('.contact-form');
                    if (mainForm) {
                        const nameField = mainForm.querySelector('#name');
                        const emailField = mainForm.querySelector('#email');
                        const phoneField = mainForm.querySelector('#phone');
                        const messageField = mainForm.querySelector('#message');
                        
                        if (nameField && !nameField.value) nameField.value = bookingData.name;
                        if (emailField && !emailField.value) emailField.value = bookingData.email;
                        if (phoneField && !phoneField.value && bookingData.phone) phoneField.value = bookingData.phone;
                        if (messageField && !messageField.value) {
                            messageField.value = `Hi! I'm interested in booking a trip to ${destination} for ${bookingData.travelers} ${travelerText}. ${bookingData.requests ? 'Additional details: ' + bookingData.requests : ''}`;
                        }
                    }
                }, 1000);
            })
            .catch((error) => {
                console.error('Booking email failed, trying fallback:', error);
                
                // Try fallback method
                sendEmailFallback(bookingData)
                    .then(() => {
                        // Reset button
                        submitBtn.innerHTML = originalHTML;
                        submitBtn.disabled = false;
                        
                        // Close modal
                        closeBookingModal();
                        
                        // Show success message
                        const travelerText = bookingData.travelers === '1' ? 'traveler' : 'travelers';
                        const successMessage = `Thank you ${bookingData.name}! Your booking request has been sent. We'll contact you within 24 hours!`;
                        
                        showNotification(successMessage, 'success');
                        storeInquiry(bookingData);
                    })
                    .catch((fallbackError) => {
                        console.error('All booking email methods failed:', fallbackError);
                        
                        // Reset button
                        submitBtn.innerHTML = originalHTML;
                        submitBtn.disabled = false;
                        
                        // Don't close modal, show error
                        showNotification('Email service temporarily unavailable. Your booking request has been saved. Please try again later or contact us directly.', 'warning');
                        storeInquiry(bookingData);
                    });
            });
    }

    // Destination Modal Functionality
    function openDestinationModal(destinationName) {
        const modal = document.getElementById('destinationModal');
        if (!modal) return;

        // Find destination data
        const destination = config.destinations ? config.destinations.find(dest => dest.name === destinationName) : null;
        
        if (!destination) {
            console.error('Destination not found:', destinationName);
            return;
        }

        // Update modal content
        updateDestinationModalContent(destination);
        
        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Show first tab by default
        showDestinationTab('itinerary');
    }

    function updateDestinationModalContent(destination) {
        // Update hero section
        const modalImage = document.getElementById('destModalImage');
        const modalName = document.getElementById('destModalName');
        const modalDescription = document.getElementById('destModalDescription');
        const modalDuration = document.getElementById('destModalDuration');
        const modalPrice = document.getElementById('destModalPrice');

        if (modalImage) modalImage.src = destination.image || '';
        if (modalName) modalName.textContent = destination.name || '';
        if (modalDescription) modalDescription.textContent = destination.description || '';
        if (modalDuration) modalDuration.innerHTML = `<i class="fas fa-clock"></i> ${destination.duration || 'Duration not specified'}`;
        if (modalPrice) modalPrice.innerHTML = `<i class="fas fa-tag"></i> Starting from ${destination.price || 'Contact for pricing'}`;

        // Update book button
        const bookBtn = document.getElementById('destModalBookBtn');
        if (bookBtn) {
            bookBtn.setAttribute('data-destination', destination.name || '');
            bookBtn.setAttribute('data-price', destination.price || '');
            bookBtn.setAttribute('data-image', destination.image || '');
        }

        // Update itinerary
        updateItineraryTab(destination.itinerary || []);
        
        // Update highlights
        updateHighlightsTab(destination.highlights || []);
        
        // Update included items
        updateIncludedTab(destination.included || []);
    }

    function updateItineraryTab(itinerary) {
        const container = document.getElementById('itineraryContainer');
        if (!container) return;

        container.innerHTML = '';
        
        if (itinerary.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500">No itinerary information available.</p>';
            return;
        }

        itinerary.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'itinerary-day';
            
            const activitiesHTML = day.activities ? day.activities.map(activity => 
                `<div class="itinerary-activity">${activity}</div>`
            ).join('') : '';

            dayElement.innerHTML = `
                <div class="itinerary-day-header">
                    <div class="day-number">${day.day}</div>
                    <h3 class="day-title">${day.title}</h3>
                </div>
                <div class="itinerary-activities">
                    ${activitiesHTML}
                </div>
            `;
            
            container.appendChild(dayElement);
        });
    }

    function updateHighlightsTab(highlights) {
        const container = document.getElementById('highlightsContainer');
        if (!container) return;

        container.innerHTML = '';
        
        if (highlights.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500">No highlights information available.</p>';
            return;
        }

        // Icon mapping for different types of highlights
        const highlightIcons = {
            'temple': '🏛️',
            'ancient': '🏛️',
            'culture': '🎭',
            'cultural': '🎭',
            'beach': '🏖️',
            'sand': '🏖️',
            'water': '💧',
            'ocean': '🌊',
            'sea': '🌊',
            'mountain': '⛰️',
            'volcano': '🌋',
            'forest': '🌲',
            'nature': '🌿',
            'wildlife': '🦋',
            'food': '🍽️',
            'cooking': '👨‍🍳',
            'cuisine': '🍽️',
            'restaurant': '🍽️',
            'dining': '🍽️',
            'spa': '🧘‍♀️',
            'massage': '💆‍♀️',
            'relaxation': '🧘‍♀️',
            'adventure': '🎢',
            'tour': '🚌',
            'sightseeing': '👁️',
            'museum': '🏛️',
            'art': '🎨',
            'sunset': '🌅',
            'sunrise': '🌄',
            'night': '🌙',
            'market': '🛒',
            'shopping': '🛍️',
            'dance': '💃',
            'music': '🎵',
            'festival': '🎉',
            'ceremony': '🎊',
            'boat': '⛵',
            'cruise': '🛥️',
            'dive': '🤿',
            'snorkel': '🤿',
            'swim': '🏊‍♀️',
            'church': '⛪',
            'mosque': '🕌',
            'garden': '🌺',
            'park': '🌳',
            'wine': '🍷',
            'tasting': '🍷',
            'vineyard': '🍇',
            'hotel': '🏨',
            'resort': '🏖️',
            'luxury': '💎',
            'palace': '🏰',
            'castle': '🏰',
            'default': '✨'
        };

        function getIconForHighlight(highlight) {
            const lowerHighlight = highlight.toLowerCase();
            for (const [keyword, icon] of Object.entries(highlightIcons)) {
                if (lowerHighlight.includes(keyword)) {
                    return icon;
                }
            }
            return highlightIcons.default;
        }

        highlights.forEach((highlight, index) => {
            const highlightElement = document.createElement('div');
            highlightElement.className = 'highlight-item';
            
            const icon = document.createElement('div');
            icon.className = 'highlight-icon';
            icon.textContent = getIconForHighlight(highlight);
            
            const text = document.createElement('div');
            text.className = 'highlight-text';
            text.textContent = highlight;
            
            highlightElement.appendChild(icon);
            highlightElement.appendChild(text);
            
            // Add staggered animation delay
            highlightElement.style.animationDelay = `${index * 0.1}s`;
            
            container.appendChild(highlightElement);
        });
    }

    function updateIncludedTab(included) {
        const container = document.getElementById('includedContainer');
        if (!container) return;

        container.innerHTML = '';
        
        if (included.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500">No included items information available.</p>';
            return;
        }

        included.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'included-item';
            itemElement.textContent = item;
            container.appendChild(itemElement);
        });
    }

    function setupDestinationTabs() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('tab-btn')) {
                const tabName = e.target.getAttribute('data-tab');
                showDestinationTab(tabName);
                
                // Update active tab button
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    }

    function showDestinationTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show selected tab
        const selectedTab = document.getElementById(`${tabName}-tab`);
        if (selectedTab) {
            selectedTab.style.display = 'block';
        }
        
        // Update active button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            }
        });
    }

    function closeDestinationModal() {
        const modal = document.getElementById('destinationModal');
        if (!modal) return;

        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Make functions globally available for onclick handlers
    window.closeBookingModal = closeBookingModal;
    window.closeDestinationModal = closeDestinationModal;

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

    // Email Sending Functions
    async function sendEmailViaEmailJS(data) {
        // Check if EmailJS is available
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS not loaded');
        }

        // Get EmailJS configuration from config
        const EMAIL_CONFIG = config?.emailjs || {};

        // Validate configuration
        if (!EMAIL_CONFIG.serviceID || !EMAIL_CONFIG.publicKey) {
            throw new Error('Email service configuration error - check config.json');
        }

        const serviceID = EMAIL_CONFIG.serviceID;
        const templateID = data.type === 'booking_request' ? EMAIL_CONFIG.templates.booking : EMAIL_CONFIG.templates.inquiry;
        const publicKey = EMAIL_CONFIG.publicKey;

        // Prepare template parameters
        const templateParams = {
            to_name: 'Travel Agency Admin',
            from_name: data.name,
            from_email: data.email,
            phone: data.phone || 'Not provided',
            subject: data.type === 'booking_request' ? `Booking Request: ${data.destination}` : 'New Travel Inquiry',
            message: formatEmailMessage(data),
            reply_to: data.email,
            timestamp: new Date(data.timestamp).toLocaleString()
        };

        try {
            const result = await emailjs.send(serviceID, templateID, templateParams, publicKey);
            console.log('✅ EmailJS Success:', result);
            return result;
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }

    async function sendEmailFallback(data) {
        // Method 1: Try PHP backend if available
        try {
            const response = await fetch('send-email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('PHP backend not available');
            }
        } catch (error) {
            console.log('PHP backend not available, trying mailto fallback');
        }

        // Method 2: Fallback to mailto (opens user's email client)
        return new Promise((resolve, reject) => {
            try {
                const adminEmail = config.companyInfo?.email || 'admin@wanderlust-travel.com';
                const subject = encodeURIComponent(data.type === 'booking_request' ? `Booking Request: ${data.destination}` : 'New Travel Inquiry');
                const body = encodeURIComponent(formatEmailMessage(data));
                
                const mailtoLink = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
                
                // Create a temporary link and click it
                const tempLink = document.createElement('a');
                tempLink.href = mailtoLink;
                tempLink.style.display = 'none';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                
                // Show user instructions
                setTimeout(() => {
                    showNotification('Your email client should open with a pre-filled message. Please send the email to complete your inquiry.', 'info');
                }, 1000);
                
                resolve({ method: 'mailto', success: true });
            } catch (error) {
                reject(error);
            }
        });
    }

    function formatEmailMessage(data) {
        if (data.type === 'booking_request') {
            return `
BOOKING REQUEST DETAILS
========================

Customer Information:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}

Travel Details:
- Destination: ${data.destination}
- Number of Travelers: ${data.travelers}
- Preferred Departure: ${data.checkin || 'Not specified'}
- Trip Duration: ${data.duration || 'Not specified'}
- Budget Range: ${data.budget || 'Not specified'}
- Price Range: ${data.price || 'Not specified'}

Special Requests:
${data.requests || 'None'}

Timestamp: ${new Date(data.timestamp).toLocaleString()}

Please contact the customer within 24 hours to finalize their booking.

---
This booking request was submitted through the travel agency website.
            `.trim();
        } else {
            return `
TRAVEL INQUIRY DETAILS
======================

Customer Information:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}

Travel Preferences:
- Interested Destination: ${data.destination || 'Not specified'}
- Number of Travelers: ${data.travelers || 'Not specified'}
- Check-in Date: ${data.checkin || 'Not specified'}
- Check-out Date: ${data.checkout || 'Not specified'}

Message:
${data.message || 'None'}

Timestamp: ${new Date(data.timestamp).toLocaleString()}

Please respond to this inquiry as soon as possible.

---
This inquiry was submitted through the travel agency website contact form.
            `.trim();
        }
    }

    function storeInquiry(data) {
        try {
            const inquiries = JSON.parse(localStorage.getItem('travel-inquiries') || '[]');
            inquiries.push(data);
            
            // Keep only the latest 50 inquiries
            if (inquiries.length > 50) {
                inquiries.splice(0, inquiries.length - 50);
            }
            
            localStorage.setItem('travel-inquiries', JSON.stringify(inquiries));
            console.log('Inquiry stored locally for reference');
        } catch (error) {
            console.error('Error storing inquiry:', error);
        }
    }

    // Admin notification system (for website owners)
    function setupAdminNotifications() {
        // Production version - admin features removed for security
        return;
    }

    function showInquiriesPanel() {
        const inquiries = JSON.parse(localStorage.getItem('travel-inquiries') || '[]');
        
        if (inquiries.length === 0) {
            showNotification('No inquiries found.', 'info');
            return;
        }

        // Create modal to show inquiries
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            max-width: 800px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            padding: 20px;
        `;

        let inquiriesHTML = '<h2>Recent Inquiries</h2>';
        inquiries.slice(-10).reverse().forEach((inquiry, index) => {
            const date = new Date(inquiry.timestamp).toLocaleString();
            const type = inquiry.type === 'booking_request' ? 'Booking Request' : 'General Inquiry';
            
            inquiriesHTML += `
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 10px 0;">
                    <h3 style="margin: 0 0 10px 0; color: #2563eb;">${type} - ${inquiry.name}</h3>
                    <p><strong>Email:</strong> ${inquiry.email}</p>
                    <p><strong>Phone:</strong> ${inquiry.phone || 'Not provided'}</p>
                    ${inquiry.destination ? `<p><strong>Destination:</strong> ${inquiry.destination}</p>` : ''}
                    ${inquiry.travelers ? `<p><strong>Travelers:</strong> ${inquiry.travelers}</p>` : ''}
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Message:</strong><br>${inquiry.message || inquiry.requests || 'None'}</p>
                    <button onclick="copyInquiry(${index})" style="background: #10b981; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Copy Details</button>
                </div>
            `;
        });

        inquiriesHTML += `
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="this.closest('.inquiries-modal').remove()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Close</button>
                <button onclick="clearInquiries()" style="background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin-left: 10px;">Clear All</button>
            </div>
        `;

        content.innerHTML = inquiriesHTML;
        modal.appendChild(content);
        modal.className = 'inquiries-modal';
        document.body.appendChild(modal);

        // Global functions for the modal
        window.copyInquiry = (index) => {
            const inquiry = inquiries.slice(-10).reverse()[index];
            const text = formatEmailMessage(inquiry);
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Inquiry details copied to clipboard!', 'success');
            });
        };

        window.clearInquiries = () => {
            localStorage.removeItem('travel-inquiries');
            modal.remove();
            showNotification('All inquiries cleared.', 'success');
        };
    }

    // Initialize admin features
    setupAdminNotifications();





})();