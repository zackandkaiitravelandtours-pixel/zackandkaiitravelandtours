# Image Management Guide

## 📸 Easy Image Replacement System

This travel agency website uses a simple naming system that makes it easy to replace images without editing any code.

## 🗂️ Image File Organization

All images should be placed in the `images/` folder with these specific names:

### Required Image Files:

#### Hero Section:
- `hero-bg.jpg` - Main background image (1920x1080px recommended)

#### Destinations (6 images):
- `destination-bali.jpg`
- `destination-santorini.jpg` 
- `destination-maldives.jpg`
- `destination-tokyo.jpg`
- `destination-paris.jpg`
- `destination-dubai.jpg`

#### Testimonials (3 images):
- `testimonial-sarah.jpg`
- `testimonial-michael.jpg`
- `testimonial-emily.jpg`

#### SEO/Social Media:
- `og-image.jpg` - Social media preview image (1200x630px recommended)

## 📏 Recommended Image Sizes:

- **Hero Background**: 1920x1080px (landscape)
- **Destinations**: 800x600px (landscape)
- **Testimonial Photos**: 300x300px (square, people's faces)
- **Social Media Preview**: 1200x630px (landscape)

## 🔄 How to Replace Images:

### Method 1: Direct Replacement (Easiest)
1. Find the image you want to replace in the `images/` folder
2. Save your new image with the exact same filename
3. Replace the old file with your new one
4. Refresh your website - the new image will appear automatically!

### Method 2: Using the Admin Panel
1. Open `admin.html` in your browser
2. Go to the appropriate section (Hero, Destinations, etc.)
3. Update the image path to your new filename
4. Save your changes and download the new config.json
5. Replace your old config.json with the downloaded one

## 🎨 Image Tips:

### For Best Results:
- Use high-quality, professional photos
- Compress images for web (aim for 100-300KB per image)
- Use consistent lighting and style across all images
- Ensure faces in testimonial photos are clearly visible

### Free Image Sources:
- **Unsplash.com** - High-quality free photos
- **Pexels.com** - Free stock photos
- **Pixabay.com** - Free images and photos

### Tools for Image Editing:
- **Online**: Canva.com, Photopea.com (free Photoshop alternative)
- **Desktop**: GIMP (free), Adobe Photoshop (paid)
- **Mobile**: Snapseed, VSCO, Adobe Lightroom Mobile

## 🖼️ Custom Destinations:

If you want to add your own destinations (not in the default list):

1. Add your image to the `images/` folder with a descriptive name like:
   - `destination-hawaii.jpg`
   - `destination-iceland.jpg`
   - `destination-new-zealand.jpg`

2. Open the admin panel (`admin.html`)
3. Go to the "Destinations" tab
4. Click "Add New Destination"
5. Fill in the details and image path
6. Save your changes

## ⚠️ Important Notes:

- **Keep original filenames** if you want the simplest experience
- **Image format**: Use .jpg for photos, .png for graphics with transparency
- **File size**: Keep images under 1MB each for fast loading
- **Backup**: Always keep copies of your original images
- **Testing**: View your website after replacing images to ensure they display correctly

## 🔧 Troubleshooting:

**Image not showing?**
- Check the filename matches exactly (case-sensitive)
- Ensure the image is in the `images/` folder
- Try refreshing your browser (Ctrl+F5 or Cmd+Shift+R)
- Check the file format is supported (.jpg, .jpeg, .png, .webp)

**Image looks stretched or cropped?**
- Check the recommended dimensions above
- Use photo editing software to resize/crop appropriately
- Maintain the aspect ratio for best results

**Website loading slowly?**
- Compress your images using online tools like TinyPNG.com
- Aim for 100-300KB per image
- Consider using WebP format for better compression

---

Need help? The images that come with the template are high-quality examples that show the ideal size and style for each section!