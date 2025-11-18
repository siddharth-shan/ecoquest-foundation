# EcoQuest Foundation Website

The official website for EcoQuest Foundation - inspiring and educating youth about environmental conservation through interactive digital experiences and community action.

## 🌍 About EcoQuest Foundation

EcoQuest Foundation's mission is to inspire and educate youth and the broader public about environmental conservation and sustainability through innovative, interactive, and engaging digital experiences. We design educational games, host conservation events, and provide resources aligned with environmental science standards.

## 🚀 Website Features

### Pages
- **Home** - Hero section, mission statement, impact statistics, and featured programs
- **About** - Mission, vision, achievements, approach, values, and team information
- **Programs** - Detailed information about:
  - EcoQuest: Guardians of the Green (flagship game)
  - EcoChallenge (monthly missions)
  - Digital Learning Hub
  - Community Conservation Events
- **Events** - Upcoming and past conservation events, cleanups, and workshops
- **Resources** - Educational videos, infographics, activity guides, and student blog posts
- **Get Involved** - Volunteer opportunities, partnership information, and donation options
- **Contact** - Contact form, FAQs, and organization information

### Key Features
- **Responsive Design** - Fully mobile-friendly and accessible on all devices
- **Modern UI/UX** - Clean, youth-friendly design with smooth animations
- **Interactive Elements** - Animated counters, filterable resources, smooth scrolling
- **WCAG Accessibility** - Skip links, proper ARIA labels, keyboard navigation
- **Performance Optimized** - Lazy loading, optimized CSS/JS, fast page loads

## 📋 Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **JavaScript (Vanilla)** - No dependencies, pure JS for interactivity
- **Google Fonts** - Poppins and Montserrat font families
- **SVG Icons** - Scalable social media icons

## 🛠️ Setup Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional but recommended)

### Installation

1. **Clone or download this repository:**
   ```bash
   git clone https://github.com/siddharth-shan/ecoquest-foundation.git
   cd ecoquest-foundation
   ```

2. **No build process required!** This is a static website with no dependencies.

3. **View the website:**

   **Option A: Using Python's built-in server (Recommended)**
   ```bash
   # Python 3
   python3 -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   Then open `http://localhost:8000` in your browser.

   **Option B: Using Node.js http-server**
   ```bash
   # Install http-server globally (one time)
   npm install -g http-server

   # Run server
   http-server
   ```
   Then open `http://localhost:8080` in your browser.

   **Option C: Using VS Code Live Server**
   - Install the "Live Server" extension in VS Code
   - Right-click on `index.html` and select "Open with Live Server"

   **Option D: Direct file access**
   - Simply open `index.html` in your browser
   - Note: Some features may not work properly without a local server

## 📁 Project Structure

```
ecoquest-foundation/
│
├── index.html              # Homepage
├── about.html              # About page
├── programs.html           # Programs page
├── events.html             # Events page
├── resources.html          # Resources page
├── get-involved.html       # Get Involved page
├── contact.html            # Contact page
│
├── css/
│   └── styles.css          # Main stylesheet
│
├── js/
│   └── main.js             # Main JavaScript file
│
├── images/                 # Images directory
│   └── .gitkeep            # (Add your images here)
│
├── assets/                 # Additional assets (if needed)
│
└── README.md               # This file
```

## 🎨 Customization Guide

### Colors
The website uses CSS variables for easy color customization. Edit these in `css/styles.css`:

```css
:root {
    --primary-green: #34a853;
    --primary-green-dark: #137333;
    --primary-blue: #00a8e1;
    --accent-yellow: #fbbc04;
    --accent-orange: #f57c00;
    /* ... more colors */
}
```

### Images
1. Add your images to the `images/` folder
2. Update the `src` attributes in the HTML files
3. See `images/.gitkeep` for recommended image names and sizes

### Content
- Edit HTML files directly to update text content
- All content is easily accessible and well-commented
- No template engine or complex build process

### Fonts
To change fonts, update the Google Fonts import in the `<head>` of each HTML file:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;600;700&display=swap" rel="stylesheet">
```

## 🌟 Features Implementation

### Mobile Menu
- Hamburger menu for mobile devices
- Smooth animations
- Click outside to close

### Impact Counter
- Animated numbers on homepage
- Triggers when scrolling into view
- Uses Intersection Observer API

### Resource Filtering
- Filter resources by category
- Smooth transitions
- No page reload required

### Form Handling
- Client-side validation
- Success messages
- Newsletter signup

### Smooth Scrolling
- Anchor link navigation
- Accounts for fixed navbar
- Smooth scroll behavior

### Back to Top Button
- Appears after scrolling down
- Smooth scroll to top
- Hover animations

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility

The website follows WCAG 2.1 guidelines:
- Semantic HTML5 markup
- ARIA labels where appropriate
- Keyboard navigation support
- Skip to main content link
- Sufficient color contrast
- Responsive text sizing
- Alt text for images

## 🔧 Maintenance

### Adding New Events
1. Open `events.html`
2. Copy an existing event card
3. Update the details (date, title, description, location)
4. Add to the appropriate section (upcoming or past events)

### Adding New Programs
1. Open `programs.html`
2. Add a new section using existing program sections as templates
3. Update images, text, and links

### Adding Blog Posts
1. Open `resources.html`
2. Add a new resource card with `data-category="blog"`
3. Update the content and author information

## 📊 SEO Optimization

- Semantic HTML structure
- Meta descriptions on all pages
- Descriptive page titles
- Alt text for images
- Clean URL structure
- Fast page load times

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Go to repository Settings > Pages
3. Select branch (usually `main`) and folder (`/` root)
4. Save and wait for deployment

### Netlify
1. Connect your GitHub repository
2. Set build command: (none needed)
3. Set publish directory: `/`
4. Deploy

### Vercel
1. Import your GitHub repository
2. No build configuration needed
3. Deploy

### Traditional Web Hosting
1. Upload all files via FTP/SFTP
2. Ensure `index.html` is in the root directory
3. No server-side configuration needed

## 🤝 Contributing

We welcome contributions! If you'd like to improve the website:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add some improvement'`)
6. Push to the branch (`git push origin feature/improvement`)
7. Open a Pull Request

## 📞 Contact

**EcoQuest Foundation**
- Email: info@ecoquestfoundation.org
- Phone: (555) 555-1234
- Website: www.ecoquestfoundation.com

## 📄 License

Copyright © 2024 EcoQuest Foundation. All rights reserved.

## 🙏 Acknowledgments

- Google Fonts for Poppins and Montserrat fonts
- All the volunteers, students, and partners who make our mission possible
- The open-source community for inspiration and best practices

---

**Built with 💚 for the planet by EcoQuest Foundation**

For questions about the website, please contact our web team at info@ecoquestfoundation.org
