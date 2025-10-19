# Classic Carry - Premium Caps & Wallets

A modern e-commerce website for premium caps and wallets with a clean, responsive design.

## Project Structure

```
Classic Carry/
├── assets/
│   ├── css/
│   │   └── styles.css          # Shared CSS styles
│   ├── js/
│   │   ├── components.js       # Component loader
│   │   ├── cart.js            # Cart management
│   │   ├── products.js        # Product data and management
│   │   ├── ui.js              # UI utilities and components
│   │   ├── hero-carousel.js   # Hero carousel functionality
│   │   └── main.js            # Main application controller
│   └── images/                # Local product images and assets
│       ├── caps/             # Cap product images
│       ├── wallets/          # Wallet product images
│       ├── hero/             # Hero carousel images
│       ├── logo.png          # Company logo
│       └── c-1.png, w-1.png, etc.  # Additional product images
├── components/
│   ├── header.html            # Shared header component
│   └── footer.html            # Shared footer component
├── index.html                 # Homepage
├── caps.html                  # Caps collection page
├── wallets.html               # Wallets collection page
├── product.html               # Product detail page
├── checkout.html              # Checkout page
└── README.md                  # This file
```

## Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component-Based Architecture**: Shared header and footer components
- **Modular JavaScript**: Organized into separate files for better maintainability
- **Shopping Cart**: Local storage-based cart functionality
- **Product Management**: Dynamic product loading and filtering
- **Modern UI**: Glassmorphism effects, smooth animations, and hover states
- **WhatsApp Integration**: Direct ordering via WhatsApp

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom styles with CSS variables and animations
- **Tailwind CSS**: Utility-first CSS framework
- **JavaScript (ES6+)**: Modern JavaScript with classes and modules
- **Font Awesome**: Icons
- **Google Fonts**: Typography (Inter & Playfair Display)

## Setup Instructions

1. Clone or download the project files
2. Open `index.html` in a web browser
3. For local development, use a local server (e.g., Live Server extension in VS Code)

## File Organization

### CSS
- All styles are consolidated in `assets/css/styles.css`
- CSS variables are used for consistent theming
- Responsive design with mobile-first approach

### JavaScript
- **components.js**: Handles loading of header and footer components
- **cart.js**: Manages shopping cart functionality with localStorage
- **products.js**: Contains product data and management functions
- **ui.js**: UI utilities, animations, and component creation
- **hero-carousel.js**: Hero section carousel functionality
- **main.js**: Main application controller that coordinates all modules

### Components
- **header.html**: Shared navigation header with mobile menu
- **footer.html**: Shared footer with contact info and social links

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Features

- Lazy loading of components
- Optimized animations with CSS transforms
- Efficient event handling
- Minimal JavaScript footprint

## Customization

### Colors
Update CSS variables in `assets/css/styles.css`:
```css
:root {
    --primary: #D2C1B6;
    --primary-dark: #b8a599;
    --bg-dark: #0f172a;
    --bg-card: #1e293b;
    --text-light: #e2e8f0;
}
```

### Products
Add or modify products in `assets/js/products.js` in the ProductManager class.

### Contact Information
Update contact details in `components/footer.html` and throughout the site.

## License

This project is for educational and commercial use.
