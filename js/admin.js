// Admin Panel JavaScript for Travel Agency Website
let config = {};

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadConfig();
});

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Load configuration from config.json
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) {
            throw new Error('Could not load configuration');
        }
        config = await response.json();
        populateForm();
        showNotification('Configuration loaded successfully!', 'success');
    } catch (error) {
        console.error('Error loading config:', error);
        showNotification('Error loading configuration. Using defaults.', 'error');
        loadDefaults();
    }
}

// Load default configuration if config.json doesn't exist
function loadDefaults() {
    config = {
        companyInfo: {
            name: "Your Travel Agency",
            tagline: "Your Adventure Awaits",
            description: "Discover amazing destinations with our expert travel planning services.",
            phone: "+1 (555) 123-4567",
            email: "info@youragency.com",
            address: {
                street: "123 Main Street",
                city: "Your City",
                state: "ST",
                zip: "12345",
                country: "US"
            },
            website: "https://youragency.com"
        },
        theme: {
            primaryColor: "#2563eb",
            secondaryColor: "#f59e0b",
            accentColor: "#06b6d4",
            fontFamily: "Poppins"
        },
        hero: {
            title: "Your Dream Vacation Awaits",
            subtitle: "Discover breathtaking destinations and create unforgettable memories with our expert travel planning services.",
            backgroundImage: "images/hero-bg.jpg",
            button1Text: "Explore Destinations",
            button2Text: "Plan My Trip"
        },
        services: [
            {
                icon: "fas fa-plane",
                title: "Flight Booking",
                description: "Find the best deals on flights to your dream destination."
            }
        ],
        destinations: [
            {
                name: "Sample Destination",
                price: "$999",
                image: "images/destination-sample.jpg",
                description: "Beautiful destination description"
            }
        ],
        testimonials: [
            {
                name: "Happy Customer",
                location: "City, State",
                image: "images/testimonial-sample.jpg",
                rating: 5,
                text: "Amazing service and unforgettable experience!"
            }
        ],
        socialMedia: {
            facebook: "",
            instagram: "",
            twitter: "",
            linkedin: ""
        },
        seo: {
            metaDescription: "Professional travel agency services",
            keywords: "travel, vacation, destinations, tours",
            ogImage: "images/og-image.jpg"
        }
    };
    populateForm();
}

// Populate form fields with configuration data
function populateForm() {
    // Company Info
    document.getElementById('companyName').value = config.companyInfo.name || '';
    document.getElementById('tagline').value = config.companyInfo.tagline || '';
    document.getElementById('description').value = config.companyInfo.description || '';
    document.getElementById('phone').value = config.companyInfo.phone || '';
    document.getElementById('email').value = config.companyInfo.email || '';
    document.getElementById('address').value = config.companyInfo.address?.street || '';
    document.getElementById('city').value = config.companyInfo.address?.city || '';
    document.getElementById('state').value = config.companyInfo.address?.state || '';
    document.getElementById('zip').value = config.companyInfo.address?.zip || '';
    document.getElementById('website').value = config.companyInfo.website || '';

    // Social Media
    document.getElementById('facebook').value = config.socialMedia?.facebook || '';
    document.getElementById('instagram').value = config.socialMedia?.instagram || '';
    document.getElementById('twitter').value = config.socialMedia?.twitter || '';
    document.getElementById('linkedin').value = config.socialMedia?.linkedin || '';

    // Theme
    document.getElementById('primaryColor').value = config.theme?.primaryColor || '#2563eb';
    document.getElementById('secondaryColor').value = config.theme?.secondaryColor || '#f59e0b';
    document.getElementById('accentColor').value = config.theme?.accentColor || '#06b6d4';
    document.getElementById('fontFamily').value = config.theme?.fontFamily || 'Poppins';

    // Hero
    document.getElementById('heroTitle').value = config.hero?.title || '';
    document.getElementById('heroSubtitle').value = config.hero?.subtitle || '';
    document.getElementById('heroImage').value = config.hero?.backgroundImage || '';
    document.getElementById('button1Text').value = config.hero?.button1Text || '';
    document.getElementById('button2Text').value = config.hero?.button2Text || '';

    // Dynamic sections
    populateServices();
    populateDestinations();
    populateTestimonials();
}

// Services functions
function populateServices() {
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = '';
    
    if (config.services && config.services.length > 0) {
        config.services.forEach((service, index) => {
            const serviceHTML = createServiceHTML(service, index);
            servicesList.insertAdjacentHTML('beforeend', serviceHTML);
        });
    }
}

function createServiceHTML(service, index) {
    return `
        <div class="service-item" data-index="${index}">
            <div class="item-header">
                <h4>Service ${index + 1}</h4>
                <button type="button" class="remove-btn" onclick="removeService(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
            <div class="form-group">
                <label>Font Awesome Icon Class</label>
                <input type="text" class="service-icon" value="${service.icon}" placeholder="e.g., fas fa-plane">
                <small style="color: #6b7280; display: block; margin-top: 5px;">
                    💡 Find icons at <a href="https://fontawesome.com/icons" target="_blank">fontawesome.com/icons</a>
                </small>
            </div>
            <div class="form-group">
                <label>Service Title</label>
                <input type="text" class="service-title" value="${service.title}" placeholder="e.g., Flight Booking">
            </div>
            <div class="form-group">
                <label>Service Description</label>
                <textarea class="service-description" placeholder="Brief description of the service...">${service.description}</textarea>
            </div>
        </div>
    `;
}

function addService() {
    const newService = {
        icon: "fas fa-star",
        title: "New Service",
        description: "Description of your new service."
    };
    
    if (!config.services) {
        config.services = [];
    }
    
    config.services.push(newService);
    populateServices();
    showNotification('New service added! Remember to save your changes.', 'success');
}

function removeService(index) {
    if (confirm('Are you sure you want to remove this service?')) {
        config.services.splice(index, 1);
        populateServices();
        showNotification('Service removed! Remember to save your changes.', 'success');
    }
}

// Destinations functions
function populateDestinations() {
    const destinationsList = document.getElementById('destinationsList');
    destinationsList.innerHTML = '';
    
    if (config.destinations && config.destinations.length > 0) {
        config.destinations.forEach((destination, index) => {
            const destinationHTML = createDestinationHTML(destination, index);
            destinationsList.insertAdjacentHTML('beforeend', destinationHTML);
        });
    }
}

function createDestinationHTML(destination, index) {
    return `
        <div class="destination-item" data-index="${index}">
            <div class="item-header">
                <h4>Destination ${index + 1}</h4>
                <button type="button" class="remove-btn" onclick="removeDestination(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Destination Name</label>
                    <input type="text" class="destination-name" value="${destination.name}" placeholder="e.g., Bali, Indonesia">
                </div>
                <div class="form-group">
                    <label>Starting Price</label>
                    <input type="text" class="destination-price" value="${destination.price}" placeholder="e.g., $999">
                </div>
            </div>
            <div class="form-group">
                <label>Image Path</label>
                <input type="text" class="destination-image" value="${destination.image}" placeholder="images/destination-name.jpg">
                <small style="color: #6b7280; display: block; margin-top: 5px;">
                    💡 Place your image in the 'images' folder and reference it here
                </small>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="destination-description" placeholder="Brief description of the destination...">${destination.description}</textarea>
            </div>
        </div>
    `;
}

function addDestination() {
    const newDestination = {
        name: "New Destination",
        price: "$999",
        image: "images/new-destination.jpg",
        description: "Amazing destination description"
    };
    
    if (!config.destinations) {
        config.destinations = [];
    }
    
    config.destinations.push(newDestination);
    populateDestinations();
    showNotification('New destination added! Remember to save your changes.', 'success');
}

function removeDestination(index) {
    if (confirm('Are you sure you want to remove this destination?')) {
        config.destinations.splice(index, 1);
        populateDestinations();
        showNotification('Destination removed! Remember to save your changes.', 'success');
    }
}

// Testimonials functions
function populateTestimonials() {
    const testimonialsList = document.getElementById('testimonialsList');
    testimonialsList.innerHTML = '';
    
    if (config.testimonials && config.testimonials.length > 0) {
        config.testimonials.forEach((testimonial, index) => {
            const testimonialHTML = createTestimonialHTML(testimonial, index);
            testimonialsList.insertAdjacentHTML('beforeend', testimonialHTML);
        });
    }
}

function createTestimonialHTML(testimonial, index) {
    return `
        <div class="testimonial-item" data-index="${index}">
            <div class="item-header">
                <h4>Testimonial ${index + 1}</h4>
                <button type="button" class="remove-btn" onclick="removeTestimonial(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Customer Name</label>
                    <input type="text" class="testimonial-name" value="${testimonial.name}" placeholder="e.g., Sarah Johnson">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" class="testimonial-location" value="${testimonial.location}" placeholder="e.g., Los Angeles, CA">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Customer Photo</label>
                    <input type="text" class="testimonial-image" value="${testimonial.image}" placeholder="images/customer-photo.jpg">
                </div>
                <div class="form-group">
                    <label>Rating (1-5 stars)</label>
                    <select class="testimonial-rating">
                        <option value="5" ${testimonial.rating === 5 ? 'selected' : ''}>5 Stars</option>
                        <option value="4" ${testimonial.rating === 4 ? 'selected' : ''}>4 Stars</option>
                        <option value="3" ${testimonial.rating === 3 ? 'selected' : ''}>3 Stars</option>
                        <option value="2" ${testimonial.rating === 2 ? 'selected' : ''}>2 Stars</option>
                        <option value="1" ${testimonial.rating === 1 ? 'selected' : ''}>1 Star</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Testimonial Text</label>
                <textarea class="testimonial-text" placeholder="What did the customer say about your service?">${testimonial.text}</textarea>
            </div>
        </div>
    `;
}

function addTestimonial() {
    const newTestimonial = {
        name: "Happy Customer",
        location: "City, State",
        image: "images/customer-photo.jpg",
        rating: 5,
        text: "Amazing service and unforgettable experience!"
    };
    
    if (!config.testimonials) {
        config.testimonials = [];
    }
    
    config.testimonials.push(newTestimonial);
    populateTestimonials();
    showNotification('New testimonial added! Remember to save your changes.', 'success');
}

function removeTestimonial(index) {
    if (confirm('Are you sure you want to remove this testimonial?')) {
        config.testimonials.splice(index, 1);
        populateTestimonials();
        showNotification('Testimonial removed! Remember to save your changes.', 'success');
    }
}

// Save changes to config.json
async function saveChanges() {
    try {
        // Collect all form data
        collectFormData();
        
        // Create downloadable file
        const configBlob = new Blob([JSON.stringify(config, null, 2)], {
            type: 'application/json'
        });
        
        // Create download link
        const url = URL.createObjectURL(configBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Configuration saved! Replace your config.json file with the downloaded file and refresh your website.', 'success', 8000);
        
    } catch (error) {
        console.error('Error saving config:', error);
        showNotification('Error saving configuration. Please try again.', 'error');
    }
}

// Collect form data into config object
function collectFormData() {
    // Company Info
    config.companyInfo = {
        name: document.getElementById('companyName').value,
        tagline: document.getElementById('tagline').value,
        description: document.getElementById('description').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: {
            street: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            country: "US"
        },
        website: document.getElementById('website').value
    };

    // Social Media
    config.socialMedia = {
        facebook: document.getElementById('facebook').value,
        instagram: document.getElementById('instagram').value,
        twitter: document.getElementById('twitter').value,
        linkedin: document.getElementById('linkedin').value
    };

    // Theme
    config.theme = {
        primaryColor: document.getElementById('primaryColor').value,
        secondaryColor: document.getElementById('secondaryColor').value,
        accentColor: document.getElementById('accentColor').value,
        fontFamily: document.getElementById('fontFamily').value
    };

    // Hero
    config.hero = {
        title: document.getElementById('heroTitle').value,
        subtitle: document.getElementById('heroSubtitle').value,
        backgroundImage: document.getElementById('heroImage').value,
        button1Text: document.getElementById('button1Text').value,
        button2Text: document.getElementById('button2Text').value
    };

    // Services
    config.services = [];
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        config.services.push({
            icon: item.querySelector('.service-icon').value,
            title: item.querySelector('.service-title').value,
            description: item.querySelector('.service-description').value
        });
    });

    // Destinations
    config.destinations = [];
    const destinationItems = document.querySelectorAll('.destination-item');
    destinationItems.forEach(item => {
        config.destinations.push({
            name: item.querySelector('.destination-name').value,
            price: item.querySelector('.destination-price').value,
            image: item.querySelector('.destination-image').value,
            description: item.querySelector('.destination-description').value
        });
    });

    // Testimonials
    config.testimonials = [];
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    testimonialItems.forEach(item => {
        config.testimonials.push({
            name: item.querySelector('.testimonial-name').value,
            location: item.querySelector('.testimonial-location').value,
            image: item.querySelector('.testimonial-image').value,
            rating: parseInt(item.querySelector('.testimonial-rating').value),
            text: item.querySelector('.testimonial-text').value
        });
    });

    // SEO (keep existing or set defaults)
    if (!config.seo) {
        config.seo = {
            metaDescription: config.companyInfo.description,
            keywords: "travel agency, vacation packages, travel planning, destinations, tours, flights, hotels",
            ogImage: "images/og-image.jpg"
        };
    }
}

// Notification system
function showNotification(message, type = 'success', duration = 5000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Auto-save functionality (optional)
function setupAutoSave() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            // Could implement auto-save to localStorage here
            localStorage.setItem('travel-agency-config', JSON.stringify(collectFormData()));
        });
    });
}