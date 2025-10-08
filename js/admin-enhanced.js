// Enhanced Admin Panel with Browser Storage and GitHub Integration
let config = {};
let isGitHubPages = false;

// Check if we're running on GitHub Pages
function detectGitHubPages() {
    const hostname = window.location.hostname;
    isGitHubPages = hostname.includes('github.io') || hostname.includes('githubpages.com');
    return isGitHubPages;
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    detectGitHubPages();
    setupGitHubIntegration();
    checkForSharedConfig();
    setupWebsiteSync();
    loadConfig();
});

// Enhanced configuration loading with fallbacks
async function loadConfig() {
    try {
        // First try to load from browser storage (for GitHub Pages)
        const savedConfig = localStorage.getItem('travel-agency-config');
        if (savedConfig && isGitHubPages) {
            config = JSON.parse(savedConfig);
            populateForm();
            showNotification('Configuration loaded from browser storage!', 'success');
            return;
        }

        // Then try to load from config.json
        const response = await fetch('config.json');
        if (!response.ok) {
            throw new Error('Could not load configuration');
        }
        config = await response.json();
        
        // Save to browser storage for future use
        localStorage.setItem('travel-agency-config', JSON.stringify(config));
        
        populateForm();
        showNotification('Configuration loaded successfully!', 'success');
    } catch (error) {
        console.error('Error loading config:', error);
        
        // Try to load from browser storage as fallback
        const savedConfig = localStorage.getItem('travel-agency-config');
        if (savedConfig) {
            config = JSON.parse(savedConfig);
            populateForm();
            showNotification('Configuration loaded from browser storage!', 'info');
        } else {
            showNotification('Using default configuration. Start customizing!', 'info');
            loadDefaults();
        }
    }
}

// GitHub integration setup
function setupGitHubIntegration() {
    if (isGitHubPages) {
        // Add GitHub-specific UI elements
        addGitHubUI();
    }
}

function addGitHubUI() {
    const actionsDiv = document.querySelector('.actions');
    
    // Check if GitHub section already exists to prevent duplicates
    if (actionsDiv && !document.querySelector('.github-pages-section')) {
        // Add GitHub-specific buttons
        const githubSection = document.createElement('div');
        githubSection.className = 'github-pages-section'; // Add identifier class
        githubSection.innerHTML = `
            <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #0369a1; margin-bottom: 15px;">
                    <i class="fab fa-github"></i> GitHub Pages Detected
                </h3>
                <p style="color: #0369a1; margin-bottom: 15px;">
                    Your changes are automatically saved in your browser and will persist across sessions.
                    No need to upload files manually!
                </p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="btn" onclick="exportForGitHub()" style="background: #10b981;">
                        <i class="fas fa-download"></i> Export for Repository
                    </button>
                    <button class="btn" onclick="shareConfig()" style="background: #6366f1;">
                        <i class="fas fa-share-alt"></i> Share Configuration
                    </button>
                    <button class="btn" onclick="importConfig()" style="background: #f59e0b;">
                        <i class="fas fa-upload"></i> Import Configuration
                    </button>
                </div>
            </div>
        `;
        actionsDiv.parentNode.insertBefore(githubSection, actionsDiv);
    }
}

// Enhanced save function with browser storage
async function saveChanges() {
    try {
        // Collect all form data
        collectFormData();
        
        // Always save to browser storage first
        localStorage.setItem('travel-agency-config', JSON.stringify(config));
        
        if (isGitHubPages) {
            // For GitHub Pages, just save to localStorage
            showNotification('Configuration saved to browser storage! Changes are live immediately.', 'success', 6000);
            
            // Trigger a custom event to update the main website if it's open
            window.postMessage({
                type: 'CONFIG_UPDATED',
                config: config
            }, '*');
            
        } else {
            // For local/other hosting, provide download
            const configBlob = new Blob([JSON.stringify(config, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(configBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'config.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('Configuration saved! Replace your config.json file with the downloaded file.', 'success', 8000);
        }
        
    } catch (error) {
        console.error('Error saving config:', error);
        showNotification('Error saving configuration. Please try again.', 'error');
    }
}

// Export configuration for GitHub repository
function exportForGitHub() {
    collectFormData();
    
    const configBlob = new Blob([JSON.stringify(config, null, 2)], {
        type: 'application/json'
    });
    
    const url = URL.createObjectURL(configBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Configuration exported! You can commit this file to your GitHub repository if needed.', 'success', 10000);
}

// Share configuration via URL or code
function shareConfig() {
    collectFormData();
    
    const configString = JSON.stringify(config);
    const encodedConfig = btoa(configString);
    
    // Create shareable URL
    const shareUrl = `${window.location.origin}${window.location.pathname}?config=${encodedConfig}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
        showNotification('Shareable URL copied to clipboard! Others can use this link to import your configuration.', 'success', 8000);
    }).catch(() => {
        // Fallback: show the URL in a prompt
        prompt('Copy this URL to share your configuration:', shareUrl);
    });
}

// Import configuration from various sources
function importConfig() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; width: 90%;">
            <h3 style="margin-bottom: 20px;">Import Configuration</h3>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 10px;">Upload config.json file:</label>
                <input type="file" id="configFile" accept=".json" style="margin-bottom: 15px;">
                <button onclick="importFromFile()" class="btn" style="margin-right: 10px;">Import File</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 10px;">Or paste configuration JSON:</label>
                <textarea id="configText" rows="6" style="width: 100%; margin-bottom: 15px;" placeholder="Paste JSON configuration here..."></textarea>
                <button onclick="importFromText()" class="btn" style="margin-right: 10px;">Import Text</button>
            </div>
            
            <div style="text-align: center;">
                <button onclick="closeImportModal()" class="btn btn-secondary">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeImportModal();
        }
    });
    
    window.importModal = modal;
}

function importFromFile() {
    const fileInput = document.getElementById('configFile');
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('Please select a file.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedConfig = JSON.parse(e.target.result);
            config = importedConfig;
            localStorage.setItem('travel-agency-config', JSON.stringify(config));
            populateForm();
            closeImportModal();
            showNotification('Configuration imported successfully!', 'success');
        } catch (error) {
            showNotification('Invalid JSON file. Please check the format.', 'error');
        }
    };
    reader.readAsText(file);
}

function importFromText() {
    const textArea = document.getElementById('configText');
    const configText = textArea.value.trim();
    
    if (!configText) {
        showNotification('Please paste some configuration text.', 'error');
        return;
    }
    
    try {
        const importedConfig = JSON.parse(configText);
        config = importedConfig;
        localStorage.setItem('travel-agency-config', JSON.stringify(config));
        populateForm();
        closeImportModal();
        showNotification('Configuration imported successfully!', 'success');
    } catch (error) {
        showNotification('Invalid JSON format. Please check the text.', 'error');
    }
}

function closeImportModal() {
    if (window.importModal) {
        document.body.removeChild(window.importModal);
        delete window.importModal;
    }
}

// Check for shared configuration in URL
function checkForSharedConfig() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedConfig = urlParams.get('config');
    
    if (sharedConfig) {
        try {
            const decodedConfig = atob(sharedConfig);
            const importedConfig = JSON.parse(decodedConfig);
            
            if (confirm('This URL contains a shared configuration. Would you like to import it?')) {
                config = importedConfig;
                localStorage.setItem('travel-agency-config', JSON.stringify(config));
                populateForm();
                showNotification('Shared configuration imported successfully!', 'success');
                
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (error) {
            console.error('Error importing shared config:', error);
        }
    }
}

// Auto-sync with main website if both are open
function setupWebsiteSync() {
    window.addEventListener('message', (event) => {
        if (event.data.type === 'CONFIG_REQUEST') {
            // Main website is requesting current config
            window.postMessage({
                type: 'CONFIG_RESPONSE',
                config: config
            }, '*');
        }
    });
}

// Enhanced initialization (merged with main initialization)

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
        },
        emailjs: {
            serviceID: "",
            publicKey: "",
            templates: {
                inquiry: "",
                booking: ""
            }
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

    // EmailJS Configuration
    document.getElementById('emailServiceId').value = config.emailjs?.serviceID || '';
    document.getElementById('emailPublicKey').value = config.emailjs?.publicKey || '';
    document.getElementById('emailInquiryTemplate').value = config.emailjs?.templates?.inquiry || '';
    document.getElementById('emailBookingTemplate').value = config.emailjs?.templates?.booking || '';

    // Dynamic sections
    populateServices();
    populateDestinations();
    populateTestimonials();
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
        // Basic info
        const destination = {
            name: item.querySelector('.destination-name').value,
            price: item.querySelector('.destination-price').value,
            image: item.querySelector('.destination-image').value,
            description: item.querySelector('.destination-description').value,
            duration: item.querySelector('.destination-duration').value || ''
        };
        
        // Highlights
        const highlightInputs = item.querySelectorAll('.highlight-input');
        destination.highlights = Array.from(highlightInputs).map(input => input.value).filter(val => val.trim());
        
        // Included items
        const includedInputs = item.querySelectorAll('.included-input');
        destination.included = Array.from(includedInputs).map(input => input.value).filter(val => val.trim());
        
        // Itinerary
        destination.itinerary = [];
        const dayItems = item.querySelectorAll('.itinerary-day-item');
        dayItems.forEach((dayItem, dayIndex) => {
            const dayTitle = dayItem.querySelector('.day-title').value;
            const activityInputs = dayItem.querySelectorAll('.activity-input');
            const activities = Array.from(activityInputs).map(input => input.value).filter(val => val.trim());
            
            destination.itinerary.push({
                day: dayIndex + 1,
                title: dayTitle,
                activities: activities
            });
        });
        
        config.destinations.push(destination);
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

    // EmailJS Configuration
    config.emailjs = {
        serviceID: document.getElementById('emailServiceId').value,
        publicKey: document.getElementById('emailPublicKey').value,
        templates: {
            inquiry: document.getElementById('emailInquiryTemplate').value,
            booking: document.getElementById('emailBookingTemplate').value
        }
    };

    // SEO (keep existing or set defaults)
    if (!config.seo) {
        config.seo = {
            metaDescription: config.companyInfo.description,
            keywords: "travel agency, vacation packages, travel planning, destinations, tours, flights, hotels",
            ogImage: "images/og-image.jpg"
        };
    }
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
    const highlights = destination.highlights || [];
    const included = destination.included || [];
    const itinerary = destination.itinerary || [];
    
    return `
        <div class="destination-item" data-index="${index}">
            <div class="item-header">
                <h4>Destination ${index + 1}: ${destination.name}</h4>
                <button type="button" class="remove-btn" onclick="removeDestination(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
            
            <!-- Basic Information -->
            <div class="destination-section">
                <h5><i class="fas fa-info-circle"></i> Basic Information</h5>
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
                <div class="form-row">
                    <div class="form-group">
                        <label>Duration</label>
                        <input type="text" class="destination-duration" value="${destination.duration || ''}" placeholder="e.g., 7 Days / 6 Nights">
                    </div>
                    <div class="form-group">
                        <label>Image Path</label>
                        <input type="text" class="destination-image" value="${destination.image}" placeholder="images/destination-name.jpg">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="destination-description" placeholder="Brief description of the destination...">${destination.description}</textarea>
                </div>
            </div>
            
            <!-- Highlights -->
            <div class="destination-section">
                <h5><i class="fas fa-star"></i> Highlights</h5>
                <div class="highlights-container">
                    ${highlights.map((highlight, hIndex) => `
                        <div class="highlight-input-group">
                            <input type="text" class="highlight-input" value="${highlight}" placeholder="e.g., Visit ancient temples">
                            <button type="button" class="remove-highlight-btn" onclick="removeHighlight(${index}, ${hIndex})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <button type="button" class="add-highlight-btn" onclick="addHighlight(${index})">
                    <i class="fas fa-plus"></i> Add Highlight
                </button>
            </div>
            
            <!-- What's Included -->
            <div class="destination-section">
                <h5><i class="fas fa-check-circle"></i> What's Included</h5>
                <div class="included-container">
                    ${included.map((item, iIndex) => `
                        <div class="included-input-group">
                            <input type="text" class="included-input" value="${item}" placeholder="e.g., Round-trip flights">
                            <button type="button" class="remove-included-btn" onclick="removeIncluded(${index}, ${iIndex})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <button type="button" class="add-included-btn" onclick="addIncluded(${index})">
                    <i class="fas fa-plus"></i> Add Included Item
                </button>
            </div>
            
            <!-- Itinerary -->
            <div class="destination-section">
                <h5><i class="fas fa-calendar-alt"></i> Itinerary</h5>
                <div class="itinerary-container">
                    ${itinerary.map((day, dayIndex) => createItineraryDayHTML(day, index, dayIndex)).join('')}
                </div>
                <button type="button" class="add-day-btn" onclick="addItineraryDay(${index})">
                    <i class="fas fa-plus"></i> Add Day
                </button>
            </div>
        </div>
    `;
}

function createItineraryDayHTML(day, destIndex, dayIndex) {
    const activities = day.activities || [];
    return `
        <div class="itinerary-day-item">
            <div class="itinerary-day-header">
                <h6>Day ${day.day}</h6>
                <button type="button" class="remove-day-btn" onclick="removeItineraryDay(${destIndex}, ${dayIndex})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-group">
                <label>Day Title</label>
                <input type="text" class="day-title" value="${day.title}" placeholder="e.g., Arrival in Paradise">
            </div>
            <div class="form-group">
                <label>Activities</label>
                <div class="activities-container">
                    ${activities.map((activity, actIndex) => `
                        <div class="activity-input-group">
                            <input type="text" class="activity-input" value="${activity}" placeholder="e.g., Airport pickup">
                            <button type="button" class="remove-activity-btn" onclick="removeActivity(${destIndex}, ${dayIndex}, ${actIndex})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <button type="button" class="add-activity-btn" onclick="addActivity(${destIndex}, ${dayIndex})">
                    <i class="fas fa-plus"></i> Add Activity
                </button>
            </div>
        </div>
    `;
}

function addDestination() {
    const newDestination = {
        name: "New Destination",
        price: "$999",
        image: "images/new-destination.jpg",
        description: "Amazing destination description",
        duration: "5 Days / 4 Nights",
        highlights: ["Beautiful scenery", "Cultural experience", "Adventure activities"],
        included: ["Round-trip flights", "Hotel accommodation", "Daily breakfast", "Airport transfers"],
        itinerary: [
            {
                day: 1,
                title: "Arrival",
                activities: ["Airport pickup", "Hotel check-in", "Welcome dinner"]
            },
            {
                day: 2,
                title: "Exploration Day",
                activities: ["City tour", "Local attractions", "Traditional lunch"]
            }
        ]
    };
    
    if (!config.destinations) {
        config.destinations = [];
    }
    
    config.destinations.push(newDestination);
    populateDestinations();
    showNotification('New destination added! Remember to save your changes.', 'success');
}

// Highlight management functions
function addHighlight(destIndex) {
    if (!config.destinations[destIndex].highlights) {
        config.destinations[destIndex].highlights = [];
    }
    config.destinations[destIndex].highlights.push("New highlight");
    populateDestinations();
}

function removeHighlight(destIndex, highlightIndex) {
    config.destinations[destIndex].highlights.splice(highlightIndex, 1);
    populateDestinations();
}

// Included items management functions
function addIncluded(destIndex) {
    if (!config.destinations[destIndex].included) {
        config.destinations[destIndex].included = [];
    }
    config.destinations[destIndex].included.push("New included item");
    populateDestinations();
}

function removeIncluded(destIndex, includedIndex) {
    config.destinations[destIndex].included.splice(includedIndex, 1);
    populateDestinations();
}

// Itinerary management functions
function addItineraryDay(destIndex) {
    if (!config.destinations[destIndex].itinerary) {
        config.destinations[destIndex].itinerary = [];
    }
    
    const newDay = {
        day: config.destinations[destIndex].itinerary.length + 1,
        title: "New Day",
        activities: ["New activity"]
    };
    
    config.destinations[destIndex].itinerary.push(newDay);
    populateDestinations();
}

function removeItineraryDay(destIndex, dayIndex) {
    config.destinations[destIndex].itinerary.splice(dayIndex, 1);
    // Renumber the remaining days
    config.destinations[destIndex].itinerary.forEach((day, index) => {
        day.day = index + 1;
    });
    populateDestinations();
}

function addActivity(destIndex, dayIndex) {
    if (!config.destinations[destIndex].itinerary[dayIndex].activities) {
        config.destinations[destIndex].itinerary[dayIndex].activities = [];
    }
    config.destinations[destIndex].itinerary[dayIndex].activities.push("New activity");
    populateDestinations();
}

function removeActivity(destIndex, dayIndex, activityIndex) {
    config.destinations[destIndex].itinerary[dayIndex].activities.splice(activityIndex, 1);
    populateDestinations();
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