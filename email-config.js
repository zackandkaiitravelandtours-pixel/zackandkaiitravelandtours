// Demo Email Configuration
// Replace these values with your actual EmailJS credentials

const EMAIL_CONFIG = {
    // EmailJS Configuration
    serviceID: 'service_xxxxxxx',  // Your EmailJS service ID
    publicKey: 'user_xxxxxxxxxx',  // Your EmailJS public key
    templates: {
        inquiry: 'template_inquiry',  // Template ID for general inquiries
        booking: 'template_booking'   // Template ID for booking requests
    },
    
    // Admin Email (where inquiries will be sent)
    adminEmail: 'admin@wanderlust-travel.com',
    
    // Company Information
    companyName: 'Wanderlust Travel Agency',
    
    // Fallback Configuration
    fallbackMethod: 'mailto' // 'php' or 'mailto'
};

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMAIL_CONFIG;
}