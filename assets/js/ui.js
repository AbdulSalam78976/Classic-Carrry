// UI Utilities and Components
class UIManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupFadeInAnimations();
    }
    
    // Mobile menu functionality
    setupMobileMenu() {
        const openBtn = document.getElementById('mobile-menu-open');
        const closeBtn = document.getElementById('mobile-menu-close');
        
        if (openBtn) {
            openBtn.addEventListener('click', this.toggleMobileMenu);
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', this.toggleMobileMenu);
        }
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', this.toggleMobileMenu);
        });
    }
    
    toggleMobileMenu() {
        const menu = document.querySelector('.mobile-menu');
        if (!menu) return;
        menu.classList.toggle('active');
    }
    
    // Smooth scrolling for anchor links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (!href) return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            });
        });
    }
    
    // Fade in animations on scroll
    setupFadeInAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Create product card element
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card bg-white rounded-2xl shadow-xl overflow-hidden group';
        card.setAttribute('data-id', product.id);
        
        if (product.category) {
            card.setAttribute('data-category', product.category);
        }

        // Image container
        const imgDiv = document.createElement('div');
        imgDiv.className = 'h-64 bg-gray-100 flex items-center justify-center overflow-hidden relative';
        
        const img = document.createElement('img');
        img.src = product.img;
        img.alt = product.name;
        img.className = 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300';
        imgDiv.appendChild(img);

        // Product info
        const info = document.createElement('div');
        info.className = 'p-6';
        
        // Tag
        if (product.tag) {
            const tag = document.createElement('span');
            tag.className = 'inline-block bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full mb-2';
            tag.textContent = product.tag;
            info.appendChild(tag);
        } else if (product.category) {
            const tag = document.createElement('span');
            tag.className = 'inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full mb-2';
            tag.textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
            info.appendChild(tag);
        }

        // Product name
        const h3 = document.createElement('h3');
        h3.className = 'font-semibold text-lg mb-2 cursor-pointer hover:text-purple-600 transition-colors';
        h3.textContent = product.name;
        h3.addEventListener('click', () => {
            window.location.href = `product.html?id=${encodeURIComponent(product.id)}`;
        });
        
        // Description
        const p = document.createElement('p');
        p.className = 'text-gray-600 text-sm mb-4';
        p.textContent = product.description || '';
        
        // Bottom section with price and button
        const bottom = document.createElement('div');
        bottom.className = 'flex items-center justify-between';
        
        const price = document.createElement('span');
        price.className = 'text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent';
        price.textContent = `$${product.price.toFixed(2)}`;
        
        const btn = document.createElement('button');
        btn.className = 'add-to-cart bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300 transform hover:scale-105';
        btn.textContent = 'Add to Cart';
        btn.setAttribute('data-product-id', product.id);

        bottom.appendChild(price);
        bottom.appendChild(btn);
        
        info.appendChild(h3);
        info.appendChild(p);
        info.appendChild(bottom);

        card.appendChild(imgDiv);
        card.appendChild(info);
        
        return card;
    }
    
    // Render product grid
    renderProductGrid(containerId, products) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        products.forEach(product => {
            container.appendChild(this.createProductCard(product));
        });
    }
    
    // Setup category filtering
    setupCategoryFiltering(sectionId, gridId, products) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        const grid = document.getElementById(gridId);
        if (!grid) return;
        
        const pills = section.querySelectorAll('.category-pill');
        
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                // Update active state
                pills.forEach(p => {
                    p.classList.remove('bg-purple-600', 'text-white');
                    p.classList.add('bg-white', 'text-gray-700');
                });
                
                pill.classList.remove('bg-white', 'text-gray-700');
                pill.classList.add('bg-purple-600', 'text-white');
                
                // Filter products
                const category = pill.textContent.toLowerCase();
                const filteredProducts = category === 'all' 
                    ? products 
                    : products.filter(p => p.category === category);
                
                this.renderProductGrid(gridId, filteredProducts);
            });
        });
    }
    
    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        if (type === 'success') {
            notification.classList.add('bg-green-500', 'text-white');
        } else if (type === 'error') {
            notification.classList.add('bg-red-500', 'text-white');
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize UI manager
const uiManager = new UIManager();

// Export for use in other files
window.uiManager = uiManager;
