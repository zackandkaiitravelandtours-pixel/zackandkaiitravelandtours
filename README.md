# Wanderlust Travel Agency Website

A modern, responsive travel agency website built with HTML5, CSS3, and JavaScript. Features mobile-first design, SEO optimization, and accessibility best practices.

## 🌟 Features

- **Responsive Design**: Mobile-first approach with breakpoints for all device sizes
- **SEO Optimized**: Semantic HTML, meta tags, structured data, and optimized images
- **Accessibility**: ARIA labels, proper heading structure, keyboard navigation support
- **Interactive Elements**: Mobile navigation, smooth scrolling, form validation
- **Modern UI**: Clean design with animations and hover effects
- **Performance**: Optimized images, efficient CSS, and JavaScript best practices

## 📁 Project Structure

```
TravelAgency/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Main stylesheet with responsive design
├── js/
│   └── script.js       # Interactive functionality
├── images/             # Image assets directory
└── README.md          # This file
```

## 🚀 Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in your web browser
3. **For development**: Use a local server like Live Server (VS Code extension) or `python -m http.server`

## 🎨 Customization Guide

### Colors and Branding

Edit the CSS custom properties in `css/styles.css`:

```css
:root {
    --primary-color: #2563eb;     /* Main brand color */
    --secondary-color: #f59e0b;   /* Accent color */
    --text-dark: #1f2937;         /* Dark text */
    --text-light: #6b7280;        /* Light text */
}
```

### Content Customization

#### Company Information
- Update company name, contact details in `index.html`
- Modify the structured data section for SEO
- Replace social media links in the footer

#### Services
Edit the services section in `index.html`:
```html
<article class="service-card">
    <div class="service-icon">
        <i class="fas fa-plane"></i> <!-- Change icon -->
    </div>
    <h3 class="service-title">Your Service</h3>
    <p class="service-description">Your description</p>
</article>
```

#### Destinations
Replace destination images and information:
```html
<article class="destination-card">
    <div class="destination-image">
        <img src="your-image-url" alt="Destination description">
        <div class="destination-overlay">
            <div class="destination-info">
                <h3 class="destination-title">Your Destination</h3>
                <p class="destination-price">Starting from $XXX</p>
            </div>
        </div>
    </div>
</article>
```

### Images

#### Hero Image
Replace the hero image URL in `index.html`:
```html
<img src="https://your-hero-image-url.jpg" alt="Your description">
```

#### Destination Images
Use high-quality images (recommended: 800x600px) from:
- [Unsplash](https://unsplash.com) (free)
- [Pexels](https://pexels.com) (free)
- Your own photography

#### Image Optimization Tips
- Use WebP format for better compression
- Optimize images for web (compress to 100-200KB)
- Use appropriate `alt` attributes for SEO and accessibility

### Typography

#### Fonts
Current font: Poppins (Google Fonts)
To change fonts, update the Google Fonts link in `index.html` and CSS:

```css
--font-family: 'Your-Font', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

#### Font Sizes
Adjust font sizes in the CSS custom properties:
```css
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
```

### Forms

#### Contact Form
The contact form includes validation. To connect to a backend:

1. Replace the `handleContactForm` function in `js/script.js`
2. Add your form submission endpoint
3. Update form fields as needed

Example with backend integration:
```javascript
async function handleContactForm(e) {
    e.preventDefault();
    
    if (!validateForm(elements.contactForm)) {
        return;
    }

    const formData = new FormData(elements.contactForm);
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showNotification('Message sent successfully!', 'success');
            elements.contactForm.reset();
        }
    } catch (error) {
        showNotification('Error sending message. Please try again.', 'error');
    }
}
```

## 📱 Responsive Breakpoints

- **Mobile**: up to 768px
- **Tablet**: 769px to 1024px
- **Desktop**: 1025px and up

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11+ (with polyfills)

## ⚡ Performance Tips

1. **Optimize Images**: Compress and use appropriate formats
2. **Minify CSS/JS**: Use build tools for production
3. **Enable Gzip**: Configure server compression
4. **CDN**: Use CDN for external resources
5. **Lazy Loading**: Already implemented for images

## 🔍 SEO Features

- Semantic HTML structure
- Meta tags for social sharing
- Structured data (JSON-LD)
- Optimized images with alt attributes
- Clean URLs and navigation
- Sitemap ready structure

## ♿ Accessibility Features

- ARIA labels and roles
- Keyboard navigation support
- High contrast mode support
- Screen reader friendly
- Focus indicators
- Reduced motion support

## 🎯 Testing Checklist

- [ ] Test on mobile devices (Chrome DevTools)
- [ ] Test all interactive elements
- [ ] Validate HTML and CSS
- [ ] Check form submissions
- [ ] Test keyboard navigation
- [ ] Verify loading performance
- [ ] Check SEO with Google PageSpeed Insights

## 📝 Customization Examples

### Adding a New Section

1. Add HTML structure:
```html
<section id="new-section" class="new-section">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">New Section</h2>
            <p class="section-subtitle">Section description</p>
        </div>
        <!-- Your content here -->
    </div>
</section>
```

2. Add CSS styling:
```css
.new-section {
    padding: var(--spacing-3xl) 0;
    background-color: var(--light-gray);
}
```

3. Add navigation link:
```html
<li class="nav-item">
    <a href="#new-section" class="nav-link">New Section</a>
</li>
```

### Changing Color Scheme

For a blue and orange theme:
```css
:root {
    --primary-color: #1e40af;
    --secondary-color: #ea580c;
    --accent-color: #0ea5e9;
}
```

### Adding Animation

```css
.your-element {
    animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

## 🆘 Support

For customization help or questions:
1. Check the code comments in the files
2. Refer to CSS and JavaScript documentation
3. Use browser developer tools for debugging

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy customizing! 🎉**

Remember to test your changes across different devices and browsers to ensure the best user experience.