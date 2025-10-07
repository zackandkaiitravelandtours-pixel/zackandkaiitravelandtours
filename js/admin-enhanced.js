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
    if (actionsDiv) {
        // Add GitHub-specific buttons
        const githubSection = document.createElement('div');
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

// Enhanced initialization
document.addEventListener('DOMContentLoaded', function() {
    detectGitHubPages();
    setupGitHubIntegration();
    checkForSharedConfig();
    setupWebsiteSync();
    loadConfig();
});

// Add all the existing functions (keeping them as they are)
// ... [All the existing admin.js functions remain the same] ...