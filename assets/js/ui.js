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
        card.className = 'card group transition-all duration-500 transform hover:scale-105 relative p-6';
        card.setAttribute('data-id', product.id);
        
        if (product.category) {
            card.setAttribute('data-category', product.category);
        }

        // Floating circular image container
        const imgContainer = document.createElement('div');
        imgContainer.className = 'flex justify-center mb-4 relative';
        
        // Product image (floating circular)
        const img = document.createElement('img');
        img.src = product.img;
        img.alt = product.name;
        img.className = 'foto w-40 h-40 object-cover rounded-full transition-all duration-500 hover:scale-110 shadow-2xl hover:shadow-3xl';

        imgContainer.appendChild(img);

        // Floating product info
        const info = document.createElement('div');
        info.className = 'text-center relative';
        
        // Product name
        const h1 = document.createElement('h1');
        h1.className = 'text-xl font-bold text-white mb-2 cursor-pointer hover:text-[#D2C1B6] transition-colors duration-300 drop-shadow-lg';
        h1.textContent = product.name;
        h1.addEventListener('click', () => {
            window.location.href = `product.html?id=${encodeURIComponent(product.id)}`;
        });
        
        // Price
        const price = document.createElement('div');
        price.className = 'text-2xl font-bold text-white mb-4 drop-shadow-lg';
        price.textContent = `$${product.price.toFixed(2)}`;
        
        // Add to cart button (floating)
        const btn = document.createElement('button');
        btn.className = 'add-to-cart bg-gradient-to-r from-[#456882] to-[#D2C1B6] text-white px-8 py-3 rounded-full font-semibold hover:from-[#D2C1B6] hover:to-[#456882] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105';
        btn.textContent = 'Add to Cart';
        btn.setAttribute('data-product-id', product.id);

        info.appendChild(h1);
        info.appendChild(price);
        info.appendChild(btn);
        
        card.appendChild(imgContainer);
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
