// Main Application Controller
class AppController {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for all modules to load
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeApp();
        });
    }
    
    initializeApp() {
        this.setupProductGrids();
        this.setupCategoryFiltering();
        this.setupCartFunctionality();
        this.setupPageSpecificFeatures();
    }
    
    // Setup product grids on homepage
    setupProductGrids() {
        if (!window.productManager) return;
        
        // Render hot products
        const hotProducts = productManager.getHotProducts();
        if (window.uiManager) {
            uiManager.renderProductGrid('hot-grid', hotProducts);
        }
        
        // Render caps
        const caps = productManager.getCaps();
        if (window.uiManager) {
            uiManager.renderProductGrid('caps-grid', caps);
        }
        
        // Render wallets
        const wallets = productManager.getWallets();
        if (window.uiManager) {
            uiManager.renderProductGrid('wallets-grid', wallets);
        }
    }
    
    // Setup category filtering
    setupCategoryFiltering() {
        if (!window.productManager || !window.uiManager) return;
        
        const caps = productManager.getCaps();
        const wallets = productManager.getWallets();
        
        uiManager.setupCategoryFiltering('caps', 'caps-grid', caps);
        uiManager.setupCategoryFiltering('wallets', 'wallets-grid', wallets);
    }
    
    // Setup cart functionality
    setupCartFunctionality() {
        if (!window.cartManager) return;
        
        // Add to cart functionality
        document.body.addEventListener('click', (e) => {
            const target = e.target;
            
            if (target.classList.contains('add-to-cart')) {
                e.preventDefault();
                this.handleAddToCart(target);
            }
        });
        
        // Cart button navigation
        const cartButton = document.getElementById('cart-button');
        if (cartButton) {
            cartButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'checkout.html';
            });
        }
    }
    
    // Handle add to cart
    handleAddToCart(button) {
        const productId = button.getAttribute('data-product-id');
        const product = productManager.findProductById(productId);
        
        if (!product) return;
        
        cartManager.addToCart(product);
        
        // Visual feedback
        const originalText = button.textContent;
        button.textContent = '✓ Added';
        button.classList.add('bg-green-600');
        button.classList.remove('bg-purple-600');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-green-600');
            button.classList.add('bg-purple-600');
        }, 1500);
        
        // Show notification
        if (window.uiManager) {
            uiManager.showNotification('Product added to cart!');
        }
    }
    
    // Setup page-specific features
    setupPageSpecificFeatures() {
        const currentPage = window.location.pathname;
        
        if (currentPage.endsWith('product.html')) {
            this.setupProductPage();
        } else if (currentPage.endsWith('checkout.html')) {
            this.setupCheckoutPage();
        }
    }
    
    // Setup product page
    setupProductPage() {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        
        if (!productId || !window.productManager) return;
        
        const product = productManager.findProductById(productId);
        const container = document.getElementById('product-container');
        
        if (!product || !container) return;
        
        container.innerHTML = '';
        
        // Product image
        const leftDiv = document.createElement('div');
        leftDiv.className = 'bg-white rounded-xl shadow overflow-hidden';
        const img = document.createElement('img');
        img.src = product.img;
        img.alt = product.name;
        img.className = 'w-full h-full object-cover';
        leftDiv.appendChild(img);
        
        // Product details
        const rightDiv = document.createElement('div');
        rightDiv.className = 'bg-white rounded-xl shadow p-6';
        
        const title = document.createElement('h1');
        title.className = 'font-display text-3xl font-bold mb-4 text-gray-800';
        title.textContent = product.name;
        
        const price = document.createElement('div');
        price.className = 'text-3xl font-bold text-purple-600 mb-6';
        price.textContent = `$${product.price.toFixed(2)}`;
        
        const description = document.createElement('p');
        description.className = 'text-gray-600 mb-6';
        description.textContent = product.description || 'Premium quality product from Classic Carry.';
        
        const actions = document.createElement('div');
        actions.className = 'flex gap-4';
        
        const addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'add-to-cart bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition';
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.setAttribute('data-product-id', product.id);
        
        const buyNowBtn = document.createElement('a');
        buyNowBtn.href = 'checkout.html';
        buyNowBtn.className = 'bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition';
        buyNowBtn.textContent = 'Buy Now';
        
        actions.appendChild(addToCartBtn);
        actions.appendChild(buyNowBtn);
        
        rightDiv.appendChild(title);
        rightDiv.appendChild(price);
        rightDiv.appendChild(description);
        rightDiv.appendChild(actions);
        
        container.appendChild(leftDiv);
        container.appendChild(rightDiv);
    }
    
    // Setup checkout page
    setupCheckoutPage() {
        if (!window.cartManager) return;
        
        const cartItemsContainer = document.getElementById('cart-items');
        const subtotalElement = document.getElementById('subtotal');
        const whatsappBtn = document.getElementById('whatsapp-order');
        
        if (!cartItemsContainer || !subtotalElement) return;
        
        this.renderCart();
        
        // Quantity controls
        document.body.addEventListener('click', (e) => {
            const target = e.target;
            
            if (target.classList.contains('qty-plus')) {
                const productId = target.getAttribute('data-id');
                const cart = cartManager.getCart();
                const item = cart.find(i => i.id === productId);
                if (item) {
                    cartManager.updateQuantity(productId, (item.qty || 1) + 1);
                    this.renderCart();
                }
            }
            
            if (target.classList.contains('qty-minus')) {
                const productId = target.getAttribute('data-id');
                const cart = cartManager.getCart();
                const item = cart.find(i => i.id === productId);
                if (item && item.qty > 1) {
                    cartManager.updateQuantity(productId, item.qty - 1);
                    this.renderCart();
                }
            }
            
            if (target.classList.contains('remove-item')) {
                const productId = target.getAttribute('data-id');
                cartManager.removeFromCart(productId);
                this.renderCart();
            }
        });
        
        // WhatsApp order
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', () => {
                this.handleWhatsAppOrder();
            });
        }
    }
    
    // Render cart items
    renderCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const subtotalElement = document.getElementById('subtotal');
        
        if (!cartItemsContainer || !subtotalElement) return;
        
        const cart = cartManager.getCart();
        cartItemsContainer.innerHTML = '';
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const row = document.createElement('div');
            row.className = 'flex items-center bg-white rounded-xl shadow p-4 gap-4';
            
            const img = document.createElement('img');
            img.src = item.img;
            img.alt = item.name;
            img.className = 'w-20 h-20 object-cover rounded-lg';
            
            const info = document.createElement('div');
            info.className = 'flex-1';
            
            const name = document.createElement('div');
            name.className = 'font-semibold';
            name.textContent = item.name;
            
            const meta = document.createElement('div');
            meta.className = 'text-sm text-gray-600';
            meta.textContent = `$${item.price.toFixed(2)}`;
            
            const qtyWrap = document.createElement('div');
            qtyWrap.className = 'flex items-center gap-2 mt-2';
            
            const minusBtn = document.createElement('button');
            minusBtn.className = 'qty-minus px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition';
            minusBtn.textContent = '-';
            minusBtn.setAttribute('data-id', item.id);
            
            const qty = document.createElement('span');
            qty.textContent = String(item.qty || 1);
            
            const plusBtn = document.createElement('button');
            plusBtn.className = 'qty-plus px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition';
            plusBtn.textContent = '+';
            plusBtn.setAttribute('data-id', item.id);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-item ml-4 text-red-600 hover:text-red-800 transition';
            removeBtn.textContent = 'Remove';
            removeBtn.setAttribute('data-id', item.id);
            
            qtyWrap.appendChild(minusBtn);
            qtyWrap.appendChild(qty);
            qtyWrap.appendChild(plusBtn);
            qtyWrap.appendChild(removeBtn);
            
            info.appendChild(name);
            info.appendChild(meta);
            info.appendChild(qtyWrap);
            
            const lineTotal = (item.qty || 1) * item.price;
            subtotal += lineTotal;
            
            const linePrice = document.createElement('div');
            linePrice.className = 'font-semibold';
            linePrice.textContent = `$${lineTotal.toFixed(2)}`;
            
            row.appendChild(img);
            row.appendChild(info);
            row.appendChild(linePrice);
            
            cartItemsContainer.appendChild(row);
        });
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    // Handle WhatsApp order
    handleWhatsAppOrder() {
        const cart = cartManager.getCart();
        
        if (!cart.length) {
            alert('Your cart is empty.');
            return;
        }
        
        const phone = '1234567890'; // TODO: Set your WhatsApp number
        const lines = cart.map((item, index) => {
            return `${index + 1}. ${item.name} x${item.qty || 1} - $${(item.price * (item.qty || 1)).toFixed(2)}`;
        });
        
        const total = cart.reduce((sum, item) => {
            return sum + (item.price * (item.qty || 1));
        }, 0);
        
        const message = `Hello Classic Carry!%0A%0AI would like to place an order:%0A${lines.join('%0A')}%0A%0ATotal: $${total.toFixed(2)}%0A%0AShipping Address:%0A`;
        const url = `https://wa.me/${phone}?text=${message}`;
        
        window.open(url, '_blank');
    }
}

// Initialize the application
const app = new AppController();