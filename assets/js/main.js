// Main Application Controller
class AppController {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.waitForManagers());
        } else {
            this.waitForManagers();
        }
    }

    waitForManagers() {
        // Check if managers are available, retry if not
        const checkManagers = () => {
            if (window.cartManager && window.productManager && window.uiManager) {
                this.initializeApp();
            } else {
                console.log('Waiting for managers to load...');
                setTimeout(checkManagers, 50);
            }
        };
        checkManagers();
    }

    async initializeApp() {
        console.log('Initializing app...');

        // Load components first
        await this.loadComponents();

        // Setup functionality
        this.setupCartFunctionality();
        this.setupProductGrids();
        this.setupCategoryFiltering();
        this.setupPageSpecificFeatures();

        // Update cart badge on page load
        if (window.cartManager) {
            cartManager.updateCartBadge();
        }

        console.log('App initialized successfully');
    }

    // Load header and footer components synchronously
    async loadComponents() {
        return new Promise((resolve) => {
            // Check if components are already loaded
            const checkComponents = () => {
                const headerComponent = document.getElementById('header-component');
                const footerComponent = document.getElementById('footer-component');

                if (headerComponent && headerComponent.innerHTML.trim() !== '' &&
                    footerComponent && footerComponent.innerHTML.trim() !== '') {
                    console.log('Components are ready');
                    resolve();
                } else {
                    setTimeout(checkComponents, 50);
                }
            };

            // Also listen for the custom event
            window.addEventListener('componentsLoaded', () => {
                console.log('Components loaded event received');
                setTimeout(resolve, 100); // Small delay to ensure DOM is updated
            }, { once: true });

            checkComponents();
        });
    }

    // Setup product grids on homepage
    setupProductGrids() {
        if (!window.productManager) {
            console.log('ProductManager not available for grid setup');
            return;
        }

        console.log('Setting up product grids...');

        // Render hot products in scrollable rows (for homepage)
        if (document.getElementById('hot-caps-row') || document.getElementById('hot-wallets-row')) {
            this.renderHotProductsRows();
        }

        // Render caps (for caps page)
        const capsGrid = document.getElementById('caps-grid');
        if (capsGrid && window.uiManager) {
            const caps = productManager.getCaps();
            console.log('Rendering caps grid with', caps.length, 'products');
            uiManager.renderProductGrid('caps-grid', caps);
        }

        // Render wallets (for wallets page)
        const walletsGrid = document.getElementById('wallets-grid');
        if (walletsGrid && window.uiManager) {
            const wallets = productManager.getWallets();
            console.log('Rendering wallets grid with', wallets.length, 'products');
            uiManager.renderProductGrid('wallets-grid', wallets);
        }

        console.log('Product grids setup complete');
    }

    // Render hot products in scrollable rows
    renderHotProductsRows() {
        if (!window.productManager || !window.uiManager) {
            console.log('Managers not available for hot products rendering');
            return;
        }

        try {
            console.log('Rendering hot products...');

            const caps = productManager.getCaps();
            const wallets = productManager.getWallets();

            // Get hot caps (first 4 caps from caps array)
            const hotCaps = caps.slice(0, 4);

            // Get hot wallets (first 4 wallets from wallets array)
            const hotWallets = wallets.slice(0, 4);

            console.log('Hot caps:', hotCaps.length);
            console.log('Hot wallets:', hotWallets.length);

            // Render hot caps row
            const hotCapsRow = document.getElementById('hot-caps-row');
            if (hotCapsRow) {
                hotCapsRow.innerHTML = '';
                hotCaps.forEach(product => {
                    try {
                        const productCard = this.createScrollableProductCard(product);
                        hotCapsRow.appendChild(productCard);
                    } catch (error) {
                        console.error('Error creating cap card:', error, product);
                    }
                });
                console.log('Hot caps rendered successfully');
            } else {
                console.log('Hot caps row element not found');
            }

            // Render hot wallets row
            const hotWalletsRow = document.getElementById('hot-wallets-row');
            if (hotWalletsRow) {
                hotWalletsRow.innerHTML = '';
                hotWallets.forEach(product => {
                    try {
                        const productCard = this.createScrollableProductCard(product);
                        hotWalletsRow.appendChild(productCard);
                    } catch (error) {
                        console.error('Error creating wallet card:', error, product);
                    }
                });
                console.log('Hot wallets rendered successfully');
            } else {
                console.log('Hot wallets row element not found');
            }
        } catch (error) {
            console.error('Error rendering hot products:', error);
        }
    }

    // Create scrollable product card
    createScrollableProductCard(product) {
        const card = document.createElement('div');
        card.className = 'scroll-item card';
        card.setAttribute('data-id', product.id);

        if (product.category) {
            card.setAttribute('data-category', product.category);
        }

        // Image container
        const imgContainer = document.createElement('div');
        imgContainer.className = 'flex justify-center mb-4 relative';

        // Product image
        const img = document.createElement('img');
        img.src = product.img;
        img.alt = product.name;
        img.className = 'foto w-full h-48 object-cover';

        // Tag if exists
        if (product.tag) {
            const tag = document.createElement('span');
            tag.className = 'absolute top-2 left-2 bg-[#D2C1B6] text-gray-900 px-2 py-1 rounded-full text-xs font-semibold';
            tag.textContent = product.tag;
            imgContainer.appendChild(tag);
        }

        imgContainer.appendChild(img);

        // Product info
        const info = document.createElement('div');
        info.className = 'text-center space-y-3';

        // Product name
        const h1 = document.createElement('h1');
        h1.className = 'text-lg font-semibold text-white mb-2 cursor-pointer hover:text-[#D2C1B6] transition-colors duration-300 line-clamp-2';
        h1.textContent = product.name;
        h1.addEventListener('click', () => {
            window.location.href = `product.html?id=${encodeURIComponent(product.id)}`;
        });

        // Price
        const price = document.createElement('div');
        price.className = 'text-xl font-bold text-[#D2C1B6] mb-3';
        price.textContent = `Rs ${product.price.toLocaleString()}`;

        // Add to cart button
        const btn = document.createElement('button');
        btn.className = 'add-to-cart bg-[#D2C1B6] text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-[#e2c9b8] transition-all duration-200 shadow-sm hover:shadow-md w-full';
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
    setupCategoryFiltering() {
        if (!window.productManager || !window.uiManager) return;

        const caps = productManager.getCaps();
        const wallets = productManager.getWallets();

        uiManager.setupCategoryFiltering('caps', 'caps-grid', caps);
        uiManager.setupCategoryFiltering('wallets', 'wallets-grid', wallets);

        // Initialize product counts
        uiManager.updateProductCount(caps.length);
    }

    // Setup cart functionality
    setupCartFunctionality() {
        if (!window.cartManager) {
            console.log('CartManager not available for cart functionality');
            return;
        }

        console.log('Setting up cart functionality...');

        // Add to cart functionality with event delegation
        document.body.addEventListener('click', (e) => {
            const target = e.target;

            // Handle add to cart buttons
            if (target.classList.contains('add-to-cart') || target.closest('.add-to-cart')) {
                e.preventDefault();
                const button = target.classList.contains('add-to-cart') ? target : target.closest('.add-to-cart');
                this.handleAddToCart(button);
                return;
            }

            // Handle cart navigation
            if (target.closest('a[href="checkout.html"]') || target.closest('.cart-icon')) {
                // Let the default link behavior work
                return;
            }
        });

        console.log('Cart functionality setup complete');
    }

    // Handle add to cart
    handleAddToCart(button) {
        console.log('Add to cart clicked', button);

        const productId = button.getAttribute('data-product-id');
        console.log('Product ID:', productId);

        if (!productId) {
            console.error('No product ID found on button');
            return;
        }

        const product = productManager.findProductById(productId);
        console.log('Found product:', product);

        if (!product) {
            console.error('Product not found:', productId);
            return;
        }

        // Add to cart
        cartManager.addToCart(product);
        console.log('Product added to cart');

        // Visual feedback
        const originalText = button.textContent;
        const originalClasses = button.className;

        button.textContent = '✓ Added to Cart';
        button.className = originalClasses.replace('bg-[#D2C1B6]', 'bg-green-600').replace('hover:bg-[#e2c9b8]', 'hover:bg-green-700');
        button.disabled = true;

        // Animate cart icon
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('pulse');
            setTimeout(() => cartIcon.classList.remove('pulse'), 500);
        }

        // Reset button after delay
        setTimeout(() => {
            button.textContent = originalText;
            button.className = originalClasses;
            button.disabled = false;
        }, 2000);

        // Show notification
        if (window.uiManager) {
            uiManager.showNotification(`${product.name} added to cart!`, 'success');
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
        console.log('Setting up product page...');

        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');

        console.log('Product ID from URL:', productId);

        if (!productId) {
            console.error('No product ID in URL');
            this.showProductNotFound();
            return;
        }

        if (!window.productManager) {
            console.error('ProductManager not available');
            return;
        }

        const product = productManager.findProductById(productId);
        console.log('Found product:', product);

        const container = document.getElementById('product-container');

        if (!product) {
            console.error('Product not found:', productId);
            this.showProductNotFound();
            return;
        }

        if (!container) {
            console.error('Product container not found');
            return;
        }

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
        price.textContent = `Rs ${product.price.toLocaleString()}`;

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
        addToCartBtn.className = 'flex-1 bg-[#D2C1B6] text-gray-900 py-3 px-6 rounded-lg hover:bg-[#e2c9b8] transition duration-300 add-to-cart font-medium';
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.setAttribute('data-product-id', product.id);

        const whatsappBtn = document.createElement('button');
        whatsappBtn.className = 'bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 font-medium';
        whatsappBtn.innerHTML = '<i class="fab fa-whatsapp mr-2"></i> Buy on WhatsApp';
        whatsappBtn.onclick = () => {
            const quantity = parseInt(document.getElementById('quantity')?.value || 1);
            const total = product.price * quantity;
            const message = `Hello Classic Carry!%0A%0AI would like to buy:%0A${product.name} x${quantity} - Rs ${total.toLocaleString()}%0A%0ATotal: Rs ${total.toLocaleString()}%0A%0A`;
            window.open(`https://wa.me/923160928206?text=${message}`, '_blank');

            // Show success message for individual product order
            this.showProductOrderSuccessMessage(product.name);
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
            mobileMenu.addEventListener('click', function (e) {
                e.stopPropagation();
            });

            // Cart button functionality
            const cartButton = document.getElementById('cart-button');
            if (cartButton) {
                cartButton.addEventListener('click', function (e) {
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

        // Debug localStorage directly
        const rawCart = localStorage.getItem('cc_cart');
        console.log('Raw localStorage cart:', rawCart);
        
        const cart = cartManager.getCart();
        console.log('Rendering cart with items:', cart);
        console.log('Cart length:', cart.length);
        console.log('Cart manager total items:', cartManager.getTotalItems());
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
            card.className = 'bg-gray-700 rounded-2xl p-6 hover:bg-gray-600 transition-all duration-300';

            const row = document.createElement('div');
            row.className = 'flex items-center gap-6';

            // Product Image
            const imgContainer = document.createElement('div');
            imgContainer.className = 'flex-shrink-0';

            const img = document.createElement('img');
            img.src = item.img;
            img.alt = item.name;
            img.className = 'w-24 h-24 object-cover rounded-lg shadow-lg';

            imgContainer.appendChild(img);

            // Product Info
            const info = document.createElement('div');
            info.className = 'flex-1 min-w-0';

            const name = document.createElement('h3');
            name.className = 'font-semibold text-white text-lg mb-1 truncate';
            name.textContent = item.name;

            const price = document.createElement('p');
            price.className = 'text-gray-300 mb-3';
            price.textContent = `Rs ${item.price.toLocaleString()} each`;

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
                <div class="text-2xl font-bold text-white">Rs ${lineTotal.toLocaleString()}</div>
                <div class="text-sm text-gray-400">${item.qty || 1} × Rs ${item.price.toLocaleString()}</div>
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

        subtotalElement.textContent = `Rs ${subtotal.toLocaleString()}`;
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
            return `${index + 1}. ${item.name} x${item.qty || 1} - Rs ${(item.price * (item.qty || 1)).toLocaleString()}`;
        });

        const total = cart.reduce((sum, item) => {
            return sum + (item.price * (item.qty || 1));
        }, 0);

        const message = `Hello Classic Carry!%0A%0AI would like to place an order:%0A${lines.join('%0A')}%0A%0ATotal: Rs ${total.toLocaleString()}${deliveryInfo}`;
        const url = `https://wa.me/${phone}?text=${message}`;

        // Open WhatsApp
        window.open(url, '_blank');

        // Clear cart and show success message
        cartManager.clearCart();
        this.renderCart();

        // Show success notification
        this.showOrderSuccessMessage();
    }

    // Show order success message
    showOrderSuccessMessage() {
        // Create success modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl">
                <div class="text-green-500 text-6xl mb-4">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 class="text-2xl font-bold text-white mb-4">Order Placed Successfully!</h2>
                <p class="text-gray-300 mb-6">
                    Your order has been sent to WhatsApp. Our team will contact you shortly to confirm your order and arrange delivery.
                </p>
                <div class="flex flex-col sm:flex-row gap-3">
                    <button onclick="this.closest('.fixed').remove()" class="bg-[#D2C1B6] text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-[#e2c9b8] transition-all duration-200">
                        Continue Shopping
                    </button>
                    <a href="index.html" class="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200 text-center">
                        Back to Home
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Auto-remove modal after 10 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 10000);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Show product order success message
    showProductOrderSuccessMessage(productName) {
        // Create success modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl">
                <div class="text-green-500 text-6xl mb-4">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 class="text-2xl font-bold text-white mb-4">Order Request Sent!</h2>
                <p class="text-gray-300 mb-2">
                    Your request for <strong>${productName}</strong> has been sent to WhatsApp.
                </p>
                <p class="text-gray-300 mb-6">
                    Our team will contact you shortly to confirm your order and arrange delivery.
                </p>
                <div class="flex flex-col sm:flex-row gap-3">
                    <button onclick="this.closest('.fixed').remove()" class="bg-[#D2C1B6] text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-[#e2c9b8] transition-all duration-200">
                        Continue Shopping
                    </button>
                    <a href="index.html" class="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200 text-center">
                        Back to Home
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Auto-remove modal after 8 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 8000);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Show product not found page
    showProductNotFound() {
        const container = document.getElementById('product-container');
        if (!container) return;

        container.innerHTML = `
            <div class="col-span-2 text-center py-16">
                <div class="text-gray-400 mb-6">
                    <i class="fas fa-exclamation-triangle text-6xl"></i>
                </div>
                <h1 class="text-3xl font-bold text-white mb-4">Product Not Found</h1>
                <p class="text-gray-300 mb-8">Sorry, the product you're looking for doesn't exist or has been removed.</p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="index.html" class="bg-[#D2C1B6] text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-[#e2c9b8] transition-all duration-200">
                        Back to Home
                    </a>
                    <a href="caps.html" class="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200">
                        Browse Caps
                    </a>
                    <a href="wallets.html" class="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200">
                        Browse Wallets
                    </a>
                </div>
            </div>
        `;
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

function fixCart() {
    if (window.cartManager) {
        cartManager.fixCart();
        console.log('Cart fixed, reloading page...');
        window.location.reload();
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

function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Debug function to test functionality
function testApp() {
    console.log('=== APP TEST ===');
    console.log('CartManager:', !!window.cartManager);
    console.log('ProductManager:', !!window.productManager);
    console.log('UIManager:', !!window.uiManager);

    if (window.productManager) {
        console.log('Total products:', productManager.getAllProducts().length);
        console.log('Caps:', productManager.getCaps().length);
        console.log('Wallets:', productManager.getWallets().length);
    }

    if (window.cartManager) {
        console.log('Cart items:', cartManager.getTotalItems());
        console.log('Cart total:', cartManager.getCartTotal());
        console.log('Raw cart data:', localStorage.getItem('cc_cart'));
    }

    console.log('Current page:', window.location.pathname);
    console.log('===============');
}

// Make test function globally available
window.testApp = testApp;

// Initialize the application
const app = new AppController();

// Test after a delay
setTimeout(testApp, 2000);