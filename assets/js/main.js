// Main Application Controller
class AppController {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for all modules to load
        document.addEventListener('DOMContentLoaded', () => {
            // Ensure all managers are available
            if (window.cartManager && window.productManager && window.uiManager) {
                this.initializeApp();
            } else {
                // Retry after a short delay if managers aren't ready
                setTimeout(() => {
                    if (window.cartManager && window.productManager && window.uiManager) {
                        this.initializeApp();
                    }
                }, 100);
            }
        });
    }
    
    initializeApp() {
        this.setupProductGrids();
        this.setupCategoryFiltering();
        this.setupCartFunctionality();
        this.setupPageSpecificFeatures();
        
        // Update cart badge on page load
        if (window.cartManager) {
            cartManager.updateCartBadge();
        }
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
        
        // Also handle cart button if it's loaded dynamically
        document.body.addEventListener('click', (e) => {
            if (e.target.closest('#cart-button')) {
                e.preventDefault();
                window.location.href = 'checkout.html';
            }
        });
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
        
        // Setup mobile menu functionality (runs after header is loaded)
        this.setupMobileMenu();
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
        leftDiv.className = 'md:w-1/2';
        
        const mainImgDiv = document.createElement('div');
        mainImgDiv.className = 'bg-gray-700 rounded-xl shadow-lg overflow-hidden mb-4';
        
        const img = document.createElement('img');
        img.id = 'main-product-image';
        img.src = product.img;
        img.alt = product.name;
        img.className = 'w-full h-96 object-cover';
        mainImgDiv.appendChild(img);
        
        // Thumbnail images (using the same image for now)
        const thumbnailsDiv = document.createElement('div');
        thumbnailsDiv.className = 'grid grid-cols-4 gap-4';
        
        for (let i = 0; i < 4; i++) {
            const thumbDiv = document.createElement('div');
            thumbDiv.className = 'bg-gray-700 rounded-lg shadow cursor-pointer hover:shadow-md transition';
            thumbDiv.onclick = () => changeImage(product.img);
            
            const thumbImg = document.createElement('img');
            thumbImg.src = product.img;
            thumbImg.alt = `${product.name} - View ${i + 1}`;
            thumbImg.className = 'w-full h-24 object-cover rounded-lg';
            thumbDiv.appendChild(thumbImg);
            thumbnailsDiv.appendChild(thumbDiv);
        }
        
        leftDiv.appendChild(mainImgDiv);
        leftDiv.appendChild(thumbnailsDiv);
        
        // Product details
        const rightDiv = document.createElement('div');
        rightDiv.className = 'md:w-1/2';
        
        const title = document.createElement('h1');
        title.className = 'font-display text-3xl font-bold mb-4 text-gray-200';
        title.textContent = product.name;
        
        // Star rating
        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'flex items-center mb-4';
        
        const starsDiv = document.createElement('div');
        starsDiv.className = 'flex text-yellow-400';
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('i');
            star.className = i < 4 ? 'fas fa-star' : 'fas fa-star-half-alt';
            starsDiv.appendChild(star);
        }
        
        const ratingText = document.createElement('span');
        ratingText.className = 'text-gray-300 ml-2';
        ratingText.textContent = '4.5 (128 reviews)';
        
        ratingDiv.appendChild(starsDiv);
        ratingDiv.appendChild(ratingText);
        
        const price = document.createElement('div');
        price.className = 'text-3xl font-bold text-gray-200 mb-6';
        price.textContent = `$${product.price.toFixed(2)}`;
        
        const description = document.createElement('p');
        description.className = 'text-gray-300 mb-6';
        description.textContent = product.description || 'Premium quality product from Classic Carry.';
        
        // Quantity selector
        const quantityDiv = document.createElement('div');
        quantityDiv.className = 'mb-8';
        
        const quantityLabel = document.createElement('h3');
        quantityLabel.className = 'text-lg font-semibold mb-3 text-gray-200';
        quantityLabel.textContent = 'Quantity';
        
        const quantityControls = document.createElement('div');
        quantityControls.className = 'flex items-center';
        
        const decreaseBtn = document.createElement('button');
        decreaseBtn.id = 'decrease-quantity';
        decreaseBtn.className = 'px-3 py-1 border border-gray-600 rounded-l-md hover:bg-gray-700 text-gray-200';
        decreaseBtn.textContent = '-';
        
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.id = 'quantity';
        quantityInput.value = '1';
        quantityInput.min = '1';
        quantityInput.className = 'w-16 px-3 py-1 border-t border-b border-gray-600 text-center focus:outline-none bg-gray-700 text-gray-200';
        
        const increaseBtn = document.createElement('button');
        increaseBtn.id = 'increase-quantity';
        increaseBtn.className = 'px-3 py-1 border border-gray-600 rounded-r-md hover:bg-gray-700 text-gray-200';
        increaseBtn.textContent = '+';
        
        quantityControls.appendChild(decreaseBtn);
        quantityControls.appendChild(quantityInput);
        quantityControls.appendChild(increaseBtn);
        
        quantityDiv.appendChild(quantityLabel);
        quantityDiv.appendChild(quantityControls);
        
        // Action buttons
        const actions = document.createElement('div');
        actions.className = 'flex space-x-4 mb-8';
        
        const addToCartBtn = document.createElement('button');
        addToCartBtn.id = 'add-to-cart-btn';
        addToCartBtn.className = 'flex-1 bg-[#456882] text-white py-3 px-6 rounded-lg hover:bg-[#D2C1B6] hover:text-gray-800 transition duration-300 add-to-cart';
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.setAttribute('data-product-id', product.id);
        
        const whatsappBtn = document.createElement('button');
        whatsappBtn.className = 'bg-[#456882] text-white py-3 px-6 rounded-lg hover:bg-[#D2C1B6] hover:text-gray-800 transition duration-300';
        whatsappBtn.innerHTML = '<i class="fab fa-whatsapp mr-2"></i> Buy on WhatsApp';
        whatsappBtn.onclick = () => {
            const message = `Hello Classic Carry!%0A%0AI would like to buy: ${product.name} - $${product.price.toFixed(2)}%0A%0A`;
            window.open(`https://wa.me/923160928206?text=${message}`, '_blank');
        };
        
        actions.appendChild(addToCartBtn);
        actions.appendChild(whatsappBtn);
        
        // Features section
        const featuresDiv = document.createElement('div');
        featuresDiv.className = 'mt-8';
        
        const featuresTitle = document.createElement('h3');
        featuresTitle.className = 'text-lg font-semibold mb-3 text-gray-200';
        featuresTitle.textContent = 'Features';
        
        const featuresList = document.createElement('ul');
        featuresList.className = 'space-y-2';
        
        const features = [
            'Premium Quality Materials',
            'Durable Construction',
            'Modern Design',
            'Comfortable Fit'
        ];
        
        features.forEach(feature => {
            const li = document.createElement('li');
            li.className = 'flex items-center';
            
            const icon = document.createElement('i');
            icon.className = 'fas fa-check text-green-400 mr-2';
            
            const text = document.createElement('span');
            text.className = 'text-gray-300';
            text.textContent = feature;
            
            li.appendChild(icon);
            li.appendChild(text);
            featuresList.appendChild(li);
        });
        
        featuresDiv.appendChild(featuresTitle);
        featuresDiv.appendChild(featuresList);
        
        rightDiv.appendChild(title);
        rightDiv.appendChild(ratingDiv);
        rightDiv.appendChild(price);
        rightDiv.appendChild(description);
        rightDiv.appendChild(quantityDiv);
        rightDiv.appendChild(actions);
        rightDiv.appendChild(featuresDiv);
        
        container.appendChild(leftDiv);
        container.appendChild(rightDiv);
        
        // Add quantity control event listeners
        this.setupQuantityControls();
    }
    
    // Setup mobile menu functionality
    setupMobileMenu() {
        // Wait a bit for header to load, then setup mobile menu
        setTimeout(() => {
            const mobileMenuOpen = document.getElementById('mobile-menu-open');
            const mobileMenuClose = document.getElementById('mobile-menu-close');
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
            
            console.log('Setting up mobile menu:', {
                mobileMenuOpen: !!mobileMenuOpen,
                mobileMenuClose: !!mobileMenuClose,
                mobileMenu: !!mobileMenu,
                mobileMenuBackdrop: !!mobileMenuBackdrop
            });
            
            if (!mobileMenuOpen || !mobileMenuClose || !mobileMenu || !mobileMenuBackdrop) {
                console.log('Mobile menu elements not found, retrying...');
                setTimeout(() => this.setupMobileMenu(), 100);
                return;
            }
            
            function openMobileMenu() {
                if (mobileMenu && mobileMenuBackdrop) {
                    mobileMenu.style.right = '0';
                    mobileMenuBackdrop.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                    console.log('Mobile menu opened');
                }
            }
            
            function closeMobileMenu() {
                if (mobileMenu && mobileMenuBackdrop) {
                    mobileMenu.style.right = '-100%';
                    mobileMenuBackdrop.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                    console.log('Mobile menu closed');
                }
            }
            
            // Mobile menu open
            mobileMenuOpen.addEventListener('click', (e) => {
                e.preventDefault();
                openMobileMenu();
            });
            
            // Mobile menu close
            mobileMenuClose.addEventListener('click', (e) => {
                e.preventDefault();
                closeMobileMenu();
            });
            
            // Close menu when clicking backdrop
            mobileMenuBackdrop.addEventListener('click', closeMobileMenu);
            
            // Close menu when clicking on links
            const mobileLinks = document.querySelectorAll('.mobile-link');
            mobileLinks.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
            
            // Prevent menu from closing when clicking inside menu
            mobileMenu.addEventListener('click', function(e) {
                e.stopPropagation();
            });
            
            // Cart button functionality
            const cartButton = document.getElementById('cart-button');
            if (cartButton) {
                cartButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = 'checkout.html';
                });
            }
            
            console.log('Mobile menu setup complete');
        }, 100);
    }
    
    // Setup checkout page
    setupCheckoutPage() {
        if (!window.cartManager) {
            console.log('CartManager not available, retrying...');
            setTimeout(() => this.setupCheckoutPage(), 100);
            return;
        }
        
        const cartItemsContainer = document.getElementById('cart-items');
        const subtotalElement = document.getElementById('subtotal');
        const whatsappBtn = document.getElementById('whatsapp-order');
        
        if (!cartItemsContainer || !subtotalElement) {
            console.log('Cart elements not found, retrying...', {
                cartItemsContainer: !!cartItemsContainer,
                subtotalElement: !!subtotalElement
            });
            setTimeout(() => this.setupCheckoutPage(), 100);
            return;
        }
        
        console.log('Setting up checkout page, current cart:', cartManager.getCart());
        console.log('Cart total items:', cartManager.getTotalItems());
        this.renderCart();
        
        // Quantity controls and cart actions
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
            
            // Clear cart functionality
            if (target.id === 'clear-cart') {
                if (confirm('Are you sure you want to clear your entire cart?')) {
                    cartManager.clearCart();
                    this.renderCart();
                }
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
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartActions = document.getElementById('cart-actions');
        const totalItemsElement = document.getElementById('total-items');
        
        console.log('renderCart called, elements found:', {
            cartItemsContainer: !!cartItemsContainer,
            subtotalElement: !!subtotalElement,
            emptyCartMessage: !!emptyCartMessage,
            cartActions: !!cartActions,
            totalItemsElement: !!totalItemsElement
        });
        
        if (!cartItemsContainer || !subtotalElement) {
            console.log('Cart container elements not found');
            return;
        }
        
        const cart = cartManager.getCart();
        console.log('Rendering cart with items:', cart);
        console.log('Cart length:', cart.length);
        cartItemsContainer.innerHTML = '';
        
        // Update total items count
        if (totalItemsElement) {
            totalItemsElement.textContent = cartManager.getTotalItems();
        }
        
        // Show/hide empty cart message and cart actions
        if (emptyCartMessage && cartActions) {
            if (cart.length === 0) {
                emptyCartMessage.classList.remove('hidden');
                cartActions.classList.add('hidden');
                console.log('Showing empty cart message');
            } else {
                emptyCartMessage.classList.add('hidden');
                cartActions.classList.remove('hidden');
                console.log('Hiding empty cart message, rendering', cart.length, 'items');
            }
        }
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const card = document.createElement('div');
            card.className = 'bg-gray-700 rounded-2xl p-6 hover:bg-gray-600 transition-all duration-300 transform hover:scale-[1.02]';
            
            const row = document.createElement('div');
            row.className = 'flex items-center gap-6';
            
            // Product Image
            const imgContainer = document.createElement('div');
            imgContainer.className = 'flex-shrink-0';
            
            const img = document.createElement('img');
            img.src = item.img;
            img.alt = item.name;
            img.className = 'w-24 h-24 object-cover rounded-xl shadow-lg';
            
            imgContainer.appendChild(img);
            
            // Product Info
            const info = document.createElement('div');
            info.className = 'flex-1 min-w-0';
            
            const name = document.createElement('h3');
            name.className = 'font-semibold text-white text-lg mb-1 truncate';
            name.textContent = item.name;
            
            const price = document.createElement('p');
            price.className = 'text-gray-300 mb-3';
            price.textContent = `$${item.price.toFixed(2)} each`;
            
            // Quantity Controls
            const qtyContainer = document.createElement('div');
            qtyContainer.className = 'flex items-center gap-3';
            
            const minusBtn = document.createElement('button');
            minusBtn.className = 'qty-minus w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-500 transition-all duration-200 flex items-center justify-center font-bold text-lg';
            minusBtn.innerHTML = '<i class="fas fa-minus text-sm"></i>';
            minusBtn.setAttribute('data-id', item.id);
            
            const qty = document.createElement('span');
            qty.className = 'text-white font-semibold text-lg min-w-[2rem] text-center';
            qty.textContent = String(item.qty || 1);
            
            const plusBtn = document.createElement('button');
            plusBtn.className = 'qty-plus w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-500 transition-all duration-200 flex items-center justify-center font-bold text-lg';
            plusBtn.innerHTML = '<i class="fas fa-plus text-sm"></i>';
            plusBtn.setAttribute('data-id', item.id);
            
            qtyContainer.appendChild(minusBtn);
            qtyContainer.appendChild(qty);
            qtyContainer.appendChild(plusBtn);
            
            info.appendChild(name);
            info.appendChild(price);
            info.appendChild(qtyContainer);
            
            // Price and Remove Section
            const priceRemoveContainer = document.createElement('div');
            priceRemoveContainer.className = 'flex flex-col items-end gap-3';
            
            const lineTotal = (item.qty || 1) * item.price;
            subtotal += lineTotal;
            
            const linePrice = document.createElement('div');
            linePrice.className = 'text-right';
            linePrice.innerHTML = `
                <div class="text-2xl font-bold text-white">$${lineTotal.toFixed(2)}</div>
                <div class="text-sm text-gray-400">${item.qty || 1} × $${item.price.toFixed(2)}</div>
            `;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-item flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-medium';
            removeBtn.innerHTML = '<i class="fas fa-trash"></i> Remove';
            removeBtn.setAttribute('data-id', item.id);
            
            priceRemoveContainer.appendChild(linePrice);
            priceRemoveContainer.appendChild(removeBtn);
            
            row.appendChild(imgContainer);
            row.appendChild(info);
            row.appendChild(priceRemoveContainer);
            
            card.appendChild(row);
            cartItemsContainer.appendChild(card);
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
        
        // Get delivery form data
        const deliveryForm = document.getElementById('delivery-form');
        let deliveryInfo = '';
        
        if (deliveryForm) {
            const formData = new FormData(deliveryForm);
            const firstName = formData.get('firstName') || '';
            const lastName = formData.get('lastName') || '';
            const phone = formData.get('phone') || '';
            const address = formData.get('address') || '';
            const city = formData.get('city') || '';
            const province = formData.get('province') || '';
            const postalCode = formData.get('postalCode') || '';
            const deliveryNotes = formData.get('deliveryNotes') || '';
            
            if (firstName || lastName || phone || address) {
                deliveryInfo = `%0A%0ADelivery Information:%0A`;
                if (firstName || lastName) deliveryInfo += `Name: ${firstName} ${lastName}%0A`;
                if (phone) deliveryInfo += `Phone: ${phone}%0A`;
                if (address) deliveryInfo += `Address: ${address}%0A`;
                if (city) deliveryInfo += `City: ${city}%0A`;
                if (province) deliveryInfo += `Province: ${province}%0A`;
                if (postalCode) deliveryInfo += `Postal Code: ${postalCode}%0A`;
                if (deliveryNotes) deliveryInfo += `Delivery Notes: ${deliveryNotes}%0A`;
            }
        }
        
        const phone = '923160928206';
        const lines = cart.map((item, index) => {
            return `${index + 1}. ${item.name} x${item.qty || 1} - $${(item.price * (item.qty || 1)).toFixed(2)}`;
        });
        
        const total = cart.reduce((sum, item) => {
            return sum + (item.price * (item.qty || 1));
        }, 0);
        
        const message = `Hello Classic Carry!%0A%0AI would like to place an order:%0A${lines.join('%0A')}%0A%0ATotal: $${total.toFixed(2)}${deliveryInfo}`;
        const url = `https://wa.me/${phone}?text=${message}`;
        
        window.open(url, '_blank');
    }
    
    // Setup quantity controls for product page
    setupQuantityControls() {
        const decreaseBtn = document.getElementById('decrease-quantity');
        const increaseBtn = document.getElementById('increase-quantity');
        const quantityInput = document.getElementById('quantity');
        
        if (decreaseBtn && increaseBtn && quantityInput) {
            decreaseBtn.addEventListener('click', () => {
                const currentValue = parseInt(quantityInput.value) || 1;
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            });
            
            increaseBtn.addEventListener('click', () => {
                const currentValue = parseInt(quantityInput.value) || 1;
                quantityInput.value = currentValue + 1;
            });
            
            quantityInput.addEventListener('change', () => {
                const value = parseInt(quantityInput.value) || 1;
                quantityInput.value = Math.max(1, value);
            });
        }
    }
}

// Global function for changing product images
function changeImage(imageSrc) {
    const mainImg = document.getElementById('main-product-image');
    if (mainImg) {
        mainImg.src = imageSrc;
    }
}

// Global debug functions
function clearCart() {
    if (window.cartManager) {
        cartManager.clearCart();
        console.log('Cart cleared via global function');
    }
}

function debugCart() {
    if (window.cartManager) {
        cartManager.debugCart();
    }
}

function debugCheckout() {
    console.log('=== CHECKOUT DEBUG ===');
    console.log('CartManager available:', !!window.cartManager);
    if (window.cartManager) {
        console.log('Current cart:', cartManager.getCart());
        console.log('Total items:', cartManager.getTotalItems());
        console.log('Local storage cart:', localStorage.getItem('cc_cart'));
    }
    console.log('Cart elements:');
    console.log('- cart-items:', !!document.getElementById('cart-items'));
    console.log('- subtotal:', !!document.getElementById('subtotal'));
    console.log('- empty-cart-message:', !!document.getElementById('empty-cart-message'));
    console.log('=====================');
}

function addTestItem() {
    if (window.cartManager) {
        const testProduct = {
            id: 'test-item',
            name: 'Test Product',
            price: 99.99,
            img: 'https://via.placeholder.com/300x300'
        };
        cartManager.addToCart(testProduct);
        console.log('Added test item to cart');
        debugCheckout();
    }
}

// Initialize the application
const app = new AppController();