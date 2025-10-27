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
        card.className = 'card group relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl';
        card.setAttribute('data-id', product.id);
        
        if (product.category) {
            card.setAttribute('data-category', product.category);
        }

        // Make entire card clickable
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking on the add to cart button
            if (!e.target.closest('.add-to-cart')) {
                window.location.href = `product.html?id=${encodeURIComponent(product.id)}`;
            }
        });

        // Image container
        const imgContainer = document.createElement('div');
        imgContainer.className = 'flex justify-center mb-4 relative overflow-hidden rounded-2xl';
        
        // Product image
        const img = document.createElement('img');
        img.src = product.getMainImage ? product.getMainImage() : product.img;
        img.alt = product.name;
        img.className = 'foto w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110';

        // Tag if exists
        if (product.tag) {
            const tag = document.createElement('span');
            tag.className = 'absolute top-2 left-2 bg-[#D2C1B6] text-gray-900 px-2 py-1 rounded-full text-xs font-semibold shadow-lg z-10';
            tag.textContent = product.tag;
            imgContainer.appendChild(tag);
        }

        imgContainer.appendChild(img);

        // Product info
        const info = document.createElement('div');
        info.className = 'text-center space-y-3 p-4';
        
        // Product name
        const h1 = document.createElement('h1');
        h1.className = 'text-lg font-semibold text-white mb-2 group-hover:text-[#D2C1B6] transition-colors duration-300 line-clamp-2';
        h1.textContent = product.name;
        
        // Price
        const price = document.createElement('div');
        price.className = 'text-xl font-bold text-[#D2C1B6] mb-3';
        price.textContent = `Rs ${product.price.toLocaleString()}`;
        
        // Add to cart button
        const btn = document.createElement('button');
        btn.className = 'add-to-cart bg-[#D2C1B6] text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-[#e2c9b8] transition-all duration-200 shadow-sm hover:shadow-md w-full z-10 relative';
        btn.textContent = 'Add to Cart';
        btn.setAttribute('data-product-id', product.id);

        info.appendChild(h1);
        info.appendChild(price);
        info.appendChild(btn);
        
        card.appendChild(imgContainer);
        card.appendChild(info);
        
        return card;
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
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                
                // Filter products
                const category = pill.getAttribute('data-category');
                const filteredProducts = category === 'all' 
                    ? products 
                    : products.filter(p => p.category === category);
                
                this.renderProductGrid(gridId, filteredProducts);
                
                // Update product count
                this.updateProductCount(filteredProducts.length);
            });
        });
    }
    
    // Update product count display
    updateProductCount(count) {
        const countElement = document.getElementById('product-count');
        if (countElement) {
            countElement.textContent = count;
        }
    }
    
    // Render product grid with empty state handling
    renderProductGrid(containerId, products) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        if (products.length === 0) {
            // Show empty state message
            const emptyState = document.createElement('div');
            emptyState.className = 'col-span-full text-center py-12';
            emptyState.innerHTML = `
                <div class="text-gray-400 mb-4">
                    <i class="fas fa-search text-4xl mb-4"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-300 mb-2">No products found</h3>
                <p class="text-gray-400 mb-6">We couldn't find any products in this category. Try selecting a different category.</p>
                <button onclick="location.reload()" class="bg-[#D2C1B6] text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-[#e2c9b8] transition-all duration-200">
                    View All Products
                </button>
            `;
            container.appendChild(emptyState);
            return;
        }
        
        products.forEach(product => {
            container.appendChild(this.createProductCard(product));
        });
    }
    
    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl transition-all duration-500 transform translate-x-full ${type}`;
        
        // Add icon based on type
        const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="${icon} text-xl"></i>
                <span class="font-medium">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
            notification.classList.add('translate-x-0');
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('translate-x-0');
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 4000);
    }
}

// Initialize UI manager
const uiManager = new UIManager();

// Export for use in other files
window.uiManager = uiManager;
