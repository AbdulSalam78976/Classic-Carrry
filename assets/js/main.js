// Utility function for safe number formatting
function formatPrice(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Color mapping for visual swatches
function getColorValue(colorName) {
    const colorMap = {
        'Black': '#000000',
        'Brown': '#8B4513',
        'Navy': '#000080',
        'Navy Blue': '#1e3a8a',
        'Forest Green': '#166534',
        'Burgundy': '#7c2d12',
        'Charcoal': '#374151',
        'Gray': '#6b7280',
        'White': '#ffffff',
        'Blush Pink': '#f9a8d4',
        'Lavender': '#a78bfa',
        'Mint Green': '#6ee7b7',
        'Cream': '#fef3c7',
        'Natural': '#d4a574',
        'Light Brown': '#cd853f',
        'Beige': '#f5f5dc',
        'Black Leather': '#1f2937',
        'Brown Leather': '#92400e',
        'Cognac': '#d97706',
        'Navy Leather': '#1e40af'
    };
    return colorMap[colorName] || '#6b7280';
}

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

        // Additional fallback for product page
        if (window.location.pathname.endsWith('product.html')) {
            setTimeout(() => {
                const loadingMessage = document.getElementById('loading-message');
                if (loadingMessage) {
                    console.log('Product page still loading, attempting setup again...');
                    this.setupProductPage();
                }
            }, 500);
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

            // Get hot products and separate by type
            const allHotProducts = productManager.getHotProducts();
            const hotCaps = allHotProducts.filter(product =>
                ['male', 'female', 'summer', 'winter'].includes(product.category) &&
                product.id.startsWith('hot-') &&
                parseInt(product.id.split('-')[1]) <= 4
            );
            const hotWallets = allHotProducts.filter(product =>
                ['male', 'female', 'cardholder', 'long'].includes(product.category) &&
                product.id.startsWith('hot-') &&
                parseInt(product.id.split('-')[1]) >= 5
            );

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
        card.className = 'scroll-item card group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl';
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
        price.textContent = `Rs ${formatPrice(product.price)}`;

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

        // Add to cart (convert Product to cart format)
        const cartProduct = product.getCartData ? product.getCartData() : {
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.getMainImage ? product.getMainImage() : product.img
        };
        cartManager.addToCart(cartProduct);
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
        console.log('Setting up page-specific features for:', currentPage);

        if (currentPage.endsWith('product.html')) {
            console.log('Detected product page, setting up...');
            // Add a small delay to ensure all managers are ready
            setTimeout(() => {
                this.setupProductPage();
            }, 100);
        } else if (currentPage.endsWith('checkout.html')) {
            console.log('Detected checkout page, setting up...');
            this.setupCheckoutPage();
        } else {
            console.log('No specific page setup needed for:', currentPage);
        }

        // Setup mobile menu functionality (runs after header is loaded)
        this.setupMobileMenu();
    }

    // Setup product page
    setupProductPage() {
        console.log('=== SETTING UP PRODUCT PAGE ===');
        console.log('Current URL:', window.location.href);
        console.log('Search params:', window.location.search);
        console.log('ProductManager available:', !!window.productManager);

        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');

        console.log('Product ID from URL:', productId);
        console.log('All URL params:', Object.fromEntries(params));

        if (!productId) {
            console.error('No product ID in URL');
            this.showProductNotFound();
            return;
        }

        if (!window.productManager) {
            console.error('ProductManager not available, retrying in 100ms...');
            setTimeout(() => this.setupProductPage(), 100);
            return;
        }

        // Check if ProductManager has products loaded
        const allProducts = productManager.getAllProducts();
        console.log('Total products available:', allProducts.length);

        if (allProducts.length === 0) {
            console.error('No products loaded in ProductManager, retrying...');
            setTimeout(() => this.setupProductPage(), 100);
            return;
        }

        const product = productManager.findProductById(productId);
        console.log('Found product:', product);

        const container = document.getElementById('product-container');

        if (!product) {
            console.error('Product not found:', productId);
            console.log('Available product IDs:', allProducts.map(p => p.id));
            this.showProductNotFound();
            return;
        }

        if (!container) {
            console.error('Product container not found');
            console.log('Available elements:', {
                'product-container': !!document.getElementById('product-container'),
                'body': !!document.body,
                'main': !!document.querySelector('main')
            });
            return;
        }

        console.log('Product container found, rendering product...');

        // Remove loading message
        const loadingMessage = document.getElementById('loading-message');
        if (loadingMessage) {
            loadingMessage.remove();
        }

        container.innerHTML = '';
        container.className = 'max-w-7xl mx-auto px-4 py-8';

        // Modern product container layout
        const productWrapper = document.createElement('div');
        productWrapper.className = 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-start';

        // Modern image gallery
        const leftDiv = document.createElement('div');
        leftDiv.className = 'space-y-6';

        const mainImgDiv = document.createElement('div');
        mainImgDiv.className = 'bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl overflow-hidden';

        const img = document.createElement('img');
        img.id = 'main-product-image';
        img.src = product.getMainImage();
        img.alt = product.name;
        img.className = 'w-full h-96 sm:h-[500px] object-cover cursor-zoom-in transition-all duration-500 hover:scale-110';

        // Add click event for image zoom
        img.addEventListener('click', () => {
            this.showImageModal(product.getMainImage(), product.name);
        });

        mainImgDiv.appendChild(img);

        // Enhanced thumbnail images
        const thumbnailsDiv = document.createElement('div');
        const allImages = product.getAllImages();
        const maxThumbnails = Math.min(allImages.length, 4);

        if (maxThumbnails > 1) {
            thumbnailsDiv.className = `grid grid-cols-${maxThumbnails} gap-4`;

            allImages.slice(0, maxThumbnails).forEach((imageUrl, index) => {
                const thumbDiv = document.createElement('div');
                thumbDiv.className = 'bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:ring-2 hover:ring-[#D2C1B6] hover:scale-105';

                // Change main image on click
                thumbDiv.onclick = () => {
                    changeImage(imageUrl);
                    // Update main image click event for zoom
                    const mainImg = document.getElementById('main-product-image');
                    if (mainImg) {
                        mainImg.onclick = () => this.showImageModal(imageUrl, product.name);
                    }
                };

                const thumbImg = document.createElement('img');
                thumbImg.src = imageUrl;
                thumbImg.alt = `${product.name} - View ${index + 1}`;
                thumbImg.className = 'w-full h-24 object-cover rounded-xl';
                thumbDiv.appendChild(thumbImg);
                thumbnailsDiv.appendChild(thumbDiv);
            });
        } else {
            // If only one image, show a single larger thumbnail
            thumbnailsDiv.className = 'grid grid-cols-1 gap-4';
            const thumbDiv = document.createElement('div');
            thumbDiv.className = 'bg-gray-700 rounded-lg shadow';

            const thumbImg = document.createElement('img');
            thumbImg.src = product.getMainImage();
            thumbImg.alt = `${product.name} - Main View`;
            thumbImg.className = 'w-full h-24 object-cover rounded-lg opacity-50';
            thumbDiv.appendChild(thumbImg);
            thumbnailsDiv.appendChild(thumbDiv);
        }

        leftDiv.appendChild(mainImgDiv);
        leftDiv.appendChild(thumbnailsDiv);

        // Clean product details section
        const rightDiv = document.createElement('div');
        rightDiv.className = 'space-y-6';

        // Product title and tag
        const titleSection = document.createElement('div');
        titleSection.className = 'space-y-3';

        const title = document.createElement('h1');
        title.className = 'font-display text-3xl font-bold text-white leading-tight';
        title.textContent = product.name;

        // Product tag
        if (product.tag) {
            const tagElement = document.createElement('div');
            tagElement.className = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#D2C1B6] text-gray-900 shadow-sm';
            tagElement.innerHTML = `<i class="fas fa-star mr-2"></i>${product.tag}`;
            titleSection.appendChild(tagElement);
        }

        titleSection.appendChild(title);

        // Simple price section
        const priceSection = document.createElement('div');
        priceSection.className = 'space-y-2';

        const price = document.createElement('div');
        price.className = 'text-4xl font-bold text-[#D2C1B6] price-text';
        price.textContent = `Rs ${formatPrice(product.price)}`;

        const priceNote = document.createElement('div');
        priceNote.className = 'text-sm text-gray-400';
        priceNote.innerHTML = '<i class="fas fa-truck mr-2"></i>Free shipping on orders over Rs 4,000';

        priceSection.appendChild(price);
        priceSection.appendChild(priceNote);

        // Stock status
        const stockDiv = document.createElement('div');
        stockDiv.className = 'flex items-center gap-3';

        const stockIcon = document.createElement('i');
        stockIcon.className = `fas ${product.isInStock && product.isInStock() ? 'fa-check-circle text-green-400' : 'fa-times-circle text-red-400'} text-lg`;

        const stockStatus = document.createElement('span');
        stockStatus.className = `font-semibold ${product.getStockStatusClass ? product.getStockStatusClass() : 'text-green-400'}`;
        stockStatus.textContent = product.getStockStatus ? product.getStockStatus() : 'In Stock';

        stockDiv.appendChild(stockIcon);
        stockDiv.appendChild(stockStatus);

        // Simple description
        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'space-y-2';

        const descriptionLabel = document.createElement('h3');
        descriptionLabel.className = 'text-lg font-semibold text-white';
        descriptionLabel.textContent = 'Description';

        const description = document.createElement('p');
        description.className = 'text-gray-300 leading-relaxed text-base';
        description.textContent = product.description || 'Premium quality product from Classic Carry.';

        descriptionDiv.appendChild(descriptionLabel);
        descriptionDiv.appendChild(description);

        // Quantity selector
        const quantityDiv = document.createElement('div');
        quantityDiv.className = 'space-y-3';

        const quantityLabel = document.createElement('h3');
        quantityLabel.className = 'text-lg font-semibold text-white';
        quantityLabel.textContent = 'Quantity';

        const quantityControls = document.createElement('div');
        quantityControls.className = 'flex items-center gap-4';

        const decreaseBtn = document.createElement('button');
        decreaseBtn.id = 'decrease-quantity';
        decreaseBtn.className = 'w-12 h-12 flex items-center justify-center rounded-xl bg-gray-700 hover:bg-[#D2C1B6] hover:text-gray-900 text-gray-200 transition-all duration-200 font-bold shadow-lg';
        decreaseBtn.innerHTML = '<i class="fas fa-minus"></i>';

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.id = 'quantity';
        quantityInput.value = '1';
        quantityInput.min = '1';
        quantityInput.className = 'w-20 h-12 text-center text-xl font-bold bg-gray-700 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D2C1B6] focus:border-[#D2C1B6]';

        const increaseBtn = document.createElement('button');
        increaseBtn.id = 'increase-quantity';
        increaseBtn.className = 'w-12 h-12 flex items-center justify-center rounded-xl bg-gray-700 hover:bg-[#D2C1B6] hover:text-gray-900 text-gray-200 transition-all duration-200 font-bold shadow-lg';
        increaseBtn.innerHTML = '<i class="fas fa-plus"></i>';

        quantityControls.appendChild(decreaseBtn);
        quantityControls.appendChild(quantityInput);
        quantityControls.appendChild(increaseBtn);

        quantityDiv.appendChild(quantityLabel);
        quantityDiv.appendChild(quantityControls);

        // Visual color selection
        const colorDiv = document.createElement('div');
        colorDiv.className = 'space-y-4';

        const colorLabel = document.createElement('h3');
        colorLabel.className = 'text-lg font-semibold text-white';
        colorLabel.textContent = 'Color';

        const colorOptions = document.createElement('div');
        colorOptions.className = 'flex flex-wrap gap-3';

        const availableColors = product.getAvailableColors ? product.getAvailableColors() : product.colors || [];
        const selectedColor = product.getSelectedColor ? product.getSelectedColor() : availableColors[0];

        availableColors.forEach(color => {
            const colorContainer = document.createElement('div');
            colorContainer.className = 'relative group';

            const colorSwatch = document.createElement('button');
            const isSelected = selectedColor === color;
            const colorValue = getColorValue(color);

            colorSwatch.className = `w-12 h-12 rounded-full border-3 transition-all duration-200 ${
                isSelected 
                    ? 'border-[#D2C1B6] ring-2 ring-[#D2C1B6] ring-opacity-50 scale-110' 
                    : 'border-gray-600 hover:border-[#D2C1B6] hover:scale-105'
            }`;
            colorSwatch.style.backgroundColor = colorValue;
            colorSwatch.setAttribute('data-color', color);
            colorSwatch.title = color;

            // Add white border for light colors
            if (colorValue === '#ffffff' || colorValue === '#fef3c7' || colorValue === '#f5f5dc') {
                colorSwatch.style.border = '3px solid #374151';
            }

            // Add checkmark for selected color
            if (isSelected) {
                const checkmark = document.createElement('i');
                checkmark.className = 'fas fa-check absolute inset-0 flex items-center justify-center text-white text-sm pointer-events-none';
                checkmark.style.textShadow = '0 0 3px rgba(0,0,0,0.8)';
                colorSwatch.appendChild(checkmark);
            }

            colorSwatch.addEventListener('click', () => {
                // Update selected color
                if (product.setSelectedColor) {
                    product.setSelectedColor(color);
                }

                // Update UI - remove selection from all buttons
                document.querySelectorAll('[data-color]').forEach(btn => {
                    btn.className = 'w-12 h-12 rounded-full border-3 transition-all duration-200 border-gray-600 hover:border-[#D2C1B6] hover:scale-105';
                    // Remove existing checkmarks
                    const existingCheck = btn.querySelector('.fa-check');
                    if (existingCheck) {
                        existingCheck.remove();
                    }
                });

                // Add selection to clicked button
                colorSwatch.className = 'w-12 h-12 rounded-full border-3 transition-all duration-200 border-[#D2C1B6] ring-2 ring-[#D2C1B6] ring-opacity-50 scale-110';

                // Add checkmark to selected color
                const checkmark = document.createElement('i');
                checkmark.className = 'fas fa-check absolute inset-0 flex items-center justify-center text-white text-sm pointer-events-none';
                checkmark.style.textShadow = '0 0 3px rgba(0,0,0,0.8)';
                colorSwatch.appendChild(checkmark);

                // Update selected color display
                const selectedColorText = document.getElementById('selected-color-text');
                if (selectedColorText) {
                    selectedColorText.textContent = color;
                }
            });

            colorContainer.appendChild(colorSwatch);
            colorOptions.appendChild(colorContainer);
        });

        // Selected color display
        const selectedColorDisplay = document.createElement('div');
        selectedColorDisplay.className = 'flex items-center gap-3';
        selectedColorDisplay.innerHTML = `
            <span class="text-gray-300">Selected:</span>
            <span id="selected-color-text" class="font-medium text-white">${selectedColor || 'None'}</span>
        `;

        colorDiv.appendChild(colorLabel);
        colorDiv.appendChild(colorOptions);
        colorDiv.appendChild(selectedColorDisplay);




        // Clean action buttons
        const actions = document.createElement('div');
        actions.className = 'space-y-3';

        const addToCartBtn = document.createElement('button');
        addToCartBtn.id = 'add-to-cart-btn';
        addToCartBtn.className = 'w-full bg-[#D2C1B6] text-gray-900 py-4 px-6 rounded-xl hover:bg-[#e2c9b8] transition-all duration-200 add-to-cart font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center';
        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart mr-3"></i>Add to Cart';
        addToCartBtn.setAttribute('data-product-id', product.id);

        // Override the default add to cart behavior to include color
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const quantity = parseInt(document.getElementById('quantity')?.value || 1);
            const selectedColor = product.getSelectedColor ? product.getSelectedColor() : null;

            const cartData = {
                ...product.getCartData(),
                selectedColor: selectedColor,
                quantity: quantity
            };

            // Add to cart with specified quantity and color
            for (let i = 0; i < quantity; i++) {
                cartManager.addToCart(cartData);
            }

            // Show success feedback
            this.showAddToCartSuccess(product.name, selectedColor);
        });

        const buyNowBtn = document.createElement('button');
        buyNowBtn.className = 'w-full bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center';
        buyNowBtn.innerHTML = '<i class="fas fa-bolt mr-3"></i>Buy Now';
        buyNowBtn.onclick = () => {
            const quantity = parseInt(document.getElementById('quantity')?.value || 1);
            const selectedColor = product.getSelectedColor ? product.getSelectedColor() : null;

            const cartData = {
                ...product.getCartData(),
                selectedColor: selectedColor,
                quantity: quantity
            };

            // Add to cart with specified quantity and color
            for (let i = 0; i < quantity; i++) {
                cartManager.addToCart(cartData);
            }

            // Redirect to checkout
            window.location.href = 'checkout.html';
        };

        actions.appendChild(addToCartBtn);
        actions.appendChild(buyNowBtn);

        // Organize sections in the right div
        rightDiv.appendChild(titleSection);
        rightDiv.appendChild(priceSection);
        rightDiv.appendChild(stockDiv);
        rightDiv.appendChild(descriptionDiv);
        rightDiv.appendChild(colorDiv);
        rightDiv.appendChild(quantityDiv);
        rightDiv.appendChild(actions);

        // Add to product wrapper
        productWrapper.appendChild(leftDiv);
        productWrapper.appendChild(rightDiv);

        // Add wrapper to container
        container.appendChild(productWrapper);

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

        // Debounce function to prevent rapid clicking
        let debounceTimer = null;
        const debounce = (func, delay) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(func, delay);
        };

        // Quantity controls and cart actions
        document.body.addEventListener('click', (e) => {
            const target = e.target;

            if (target.classList.contains('qty-plus') || target.closest('.qty-plus')) {
                e.preventDefault();
                e.stopPropagation();

                const button = target.classList.contains('qty-plus') ? target : target.closest('.qty-plus');
                const productId = button.getAttribute('data-id');
                console.log('Plus button clicked for product:', productId);

                if (productId && !button.disabled) {
                    button.disabled = true;
                    const cart = cartManager.getCart();
                    const item = cart.find(i => i.id === productId);
                    if (item) {
                        cartManager.updateQuantity(productId, (item.qty || 1) + 1);
                        this.renderCart();
                    }

                    // Re-enable button after short delay
                    setTimeout(() => {
                        button.disabled = false;
                    }, 200);
                }
                return;
            }

            if (target.classList.contains('qty-minus') || target.closest('.qty-minus')) {
                e.preventDefault();
                e.stopPropagation();

                const button = target.classList.contains('qty-minus') ? target : target.closest('.qty-minus');
                const productId = button.getAttribute('data-id');
                console.log('Minus button clicked for product:', productId);

                if (productId && !button.disabled) {
                    button.disabled = true;
                    const cart = cartManager.getCart();
                    const item = cart.find(i => i.id === productId);
                    if (item && item.qty > 1) {
                        cartManager.updateQuantity(productId, item.qty - 1);
                        this.renderCart();
                    }

                    // Re-enable button after short delay
                    setTimeout(() => {
                        button.disabled = false;
                    }, 200);
                }
                return;
            }

            if (target.classList.contains('remove-item') || target.closest('.remove-item')) {
                e.preventDefault();
                e.stopPropagation();

                const button = target.classList.contains('remove-item') ? target : target.closest('.remove-item');
                const productId = button.getAttribute('data-id');
                console.log('Remove button clicked for product:', productId);

                if (productId) {
                    cartManager.removeFromCart(productId);
                    this.renderCart();
                }
                return;
            }

            // Clear cart functionality
            if (target.id === 'clear-cart') {
                e.preventDefault();
                if (confirm('Are you sure you want to clear your entire cart?')) {
                    cartManager.clearCart();
                    this.renderCart();
                }
                return;
            }
        });

        // Form submission handling
        const placeOrderBtn = document.getElementById('place-order');
        const deliveryForm = document.getElementById('delivery-form');

        if (placeOrderBtn && deliveryForm) {
            placeOrderBtn.addEventListener('click', (e) => {
                this.handleOrderSubmission(e, deliveryForm);
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

                // Hide delivery charge section when cart is empty
                const deliveryChargeRow = document.querySelector('#delivery-charge')?.closest('.flex');
                const totalRow = document.querySelector('#total-amount')?.closest('.flex');
                if (deliveryChargeRow) deliveryChargeRow.style.display = 'none';
                if (totalRow) totalRow.style.display = 'none';
            } else {
                emptyCartMessage.classList.add('hidden');
                cartActions.classList.remove('hidden');
                console.log('Hiding empty cart message, rendering', cart.length, 'items');

                // Show delivery charge section when cart has items
                const deliveryChargeRow = document.querySelector('#delivery-charge')?.closest('.flex');
                const totalRow = document.querySelector('#total-amount')?.closest('.flex');
                if (deliveryChargeRow) deliveryChargeRow.style.display = 'flex';
                if (totalRow) totalRow.style.display = 'flex';
            }
        }

        let subtotal = 0;

        cart.forEach(item => {
            const card = document.createElement('div');
            card.className = 'bg-gray-700 rounded-2xl p-4 sm:p-6 hover:bg-gray-600 transition-all duration-300';

            // Mobile-first responsive layout
            const row = document.createElement('div');
            row.className = 'flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6';

            // Product Image and Basic Info (Mobile: horizontal, Desktop: part of row)
            const topSection = document.createElement('div');
            topSection.className = 'flex items-center gap-4 sm:gap-6';

            // Product Image
            const imgContainer = document.createElement('div');
            imgContainer.className = 'flex-shrink-0';

            const img = document.createElement('img');
            img.src = item.img;
            img.alt = item.name;
            img.className = 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg shadow-lg';

            imgContainer.appendChild(img);

            // Product Info (Mobile: takes remaining space)
            const info = document.createElement('div');
            info.className = 'flex-1 min-w-0';

            const name = document.createElement('h3');
            name.className = 'font-semibold text-white text-base sm:text-lg mb-1 line-clamp-2';
            name.textContent = item.name;

            const price = document.createElement('p');
            price.className = 'text-gray-300 text-sm sm:text-base mb-2 sm:mb-3 price-text';
            price.textContent = `Rs ${formatPrice(item.price)} each`;

            // Show selected color if available
            if (item.selectedColor) {
                const colorInfo = document.createElement('p');
                colorInfo.className = 'text-xs text-gray-400 mb-2';
                colorInfo.innerHTML = `<i class="fas fa-palette mr-1"></i>Color: ${item.selectedColor}`;
                info.appendChild(colorInfo);
            }

            info.appendChild(name);
            info.appendChild(price);

            topSection.appendChild(imgContainer);
            topSection.appendChild(info);

            // Bottom section for mobile (Quantity, Price, Remove)
            const bottomSection = document.createElement('div');
            bottomSection.className = 'flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6';

            // Quantity Controls
            const qtyContainer = document.createElement('div');
            qtyContainer.className = 'flex items-center justify-center sm:justify-start gap-3';

            const qtyLabel = document.createElement('span');
            qtyLabel.className = 'text-gray-300 text-sm font-medium sm:hidden';
            qtyLabel.textContent = 'Qty:';

            const minusBtn = document.createElement('button');
            minusBtn.className = 'qty-minus w-8 h-8 sm:w-10 sm:h-10 bg-gray-600 text-white rounded-full hover:bg-gray-500 transition-all duration-200 flex items-center justify-center font-bold';
            minusBtn.innerHTML = '<i class="fas fa-minus text-xs"></i>';
            minusBtn.setAttribute('data-id', item.id);

            const qty = document.createElement('span');
            qty.className = 'text-white font-semibold text-base sm:text-lg min-w-[2rem] text-center px-2';
            qty.textContent = String(item.qty || 1);

            const plusBtn = document.createElement('button');
            plusBtn.className = 'qty-plus w-8 h-8 sm:w-10 sm:h-10 bg-gray-600 text-white rounded-full hover:bg-gray-500 transition-all duration-200 flex items-center justify-center font-bold';
            plusBtn.innerHTML = '<i class="fas fa-plus text-xs"></i>';
            plusBtn.setAttribute('data-id', item.id);

            qtyContainer.appendChild(qtyLabel);
            qtyContainer.appendChild(minusBtn);
            qtyContainer.appendChild(qty);
            qtyContainer.appendChild(plusBtn);

            // Price and Remove Section
            const priceRemoveContainer = document.createElement('div');
            priceRemoveContainer.className = 'flex flex-col sm:flex-col items-center sm:items-end gap-2 sm:gap-3 flex-1';

            const lineTotal = (item.qty || 1) * item.price;
            subtotal += lineTotal;

            const linePrice = document.createElement('div');
            linePrice.className = 'text-center sm:text-right cart-item-price';
            linePrice.innerHTML = `
                <div class="text-xl sm:text-2xl font-bold text-white">Rs ${formatPrice(lineTotal)}</div>
                <div class="text-xs sm:text-sm text-gray-400">${item.qty || 1} × Rs ${formatPrice(item.price)}</div>
            `;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-item flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 text-xs sm:text-sm font-medium w-full sm:w-auto';
            removeBtn.innerHTML = '<i class="fas fa-trash"></i> Remove';
            removeBtn.setAttribute('data-id', item.id);

            priceRemoveContainer.appendChild(linePrice);
            priceRemoveContainer.appendChild(removeBtn);

            bottomSection.appendChild(qtyContainer);
            bottomSection.appendChild(priceRemoveContainer);

            // Assemble the card
            row.appendChild(topSection);
            row.appendChild(bottomSection);

            card.appendChild(row);
            cartItemsContainer.appendChild(card);
        });

        // Update subtotal
        subtotalElement.textContent = `Rs ${formatPrice(subtotal)}`;

        // Update delivery charge and total using CartManager methods
        const deliveryChargeElement = document.getElementById('delivery-charge');
        const totalAmountElement = document.getElementById('total-amount');
        const freeDeliveryNotice = document.getElementById('free-delivery-notice');
        const deliveryCharge = cartManager.getDeliveryCharge();
        const totalAmount = cartManager.getTotalWithDelivery();
        const qualifiesForFree = cartManager.qualifiesForFreeDelivery();

        if (deliveryChargeElement) {
            if (qualifiesForFree) {
                deliveryChargeElement.innerHTML = '<span class="line-through text-gray-500">Rs 200.00</span> <span class="text-green-400 font-bold">FREE</span>';
            } else {
                deliveryChargeElement.textContent = `Rs ${formatPrice(deliveryCharge)}`;
            }
        } else {
            console.log('Delivery charge element not found');
        }

        // Show/hide free delivery notice
        if (freeDeliveryNotice) {
            if (qualifiesForFree) {
                freeDeliveryNotice.classList.remove('hidden');
            } else {
                freeDeliveryNotice.classList.add('hidden');
            }
        }

        if (totalAmountElement) {
            totalAmountElement.textContent = `Rs ${formatPrice(totalAmount)}`;
        } else {
            console.log('Total amount element not found');
        }

        console.log('Cart rendered:', {
            items: cart.length,
            subtotal: subtotal,
            deliveryCharge: deliveryCharge,
            total: totalAmount
        });
    }

    // Handle order submission
    handleOrderSubmission(e, form) {
        e.preventDefault();

        const cart = cartManager.getCart();
        if (!cart.length) {
            this.showNotification('Your cart is empty. Please add items before placing an order.', 'error');
            return;
        }

        // Enhanced form validation
        const formData = new FormData(form);
        const validationErrors = [];

        // Get form values
        const email = formData.get('email')?.trim();
        const firstName = formData.get('firstName')?.trim();
        const lastName = formData.get('lastName')?.trim();
        const phone = formData.get('phone')?.trim();
        const address = formData.get('address')?.trim();
        const city = formData.get('city')?.trim();
        const province = formData.get('province')?.trim();

        // Validate required fields
        if (!email) validationErrors.push('Email address is required');
        if (!firstName) validationErrors.push('First name is required');
        if (!lastName) validationErrors.push('Last name is required');
        if (!phone) validationErrors.push('Phone number is required');
        if (!address) validationErrors.push('Full address is required');
        if (!city) validationErrors.push('City is required');
        if (!province) validationErrors.push('Province is required');

        // Validate email format
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            validationErrors.push('Please enter a valid email address');
        }

        // Validate phone number (basic Pakistani format)
        if (phone && !/^(\+92|0)?[0-9]{10,11}$/.test(phone.replace(/[\s-]/g, ''))) {
            validationErrors.push('Please enter a valid Pakistani phone number');
        }

        // Show validation errors
        if (validationErrors.length > 0) {
            this.showValidationErrors(validationErrors);
            return;
        }

        // Show loading state
        const submitBtn = document.getElementById('place-order');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin text-xl"></i> <span>Processing Order...</span>';
        }

        // Prepare order data
        const subtotal = cartManager.getCartTotal();
        const deliveryCharge = cartManager.getDeliveryCharge();
        const total = cartManager.getTotalWithDelivery();
        const orderDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Format order items for submission
        const orderItems = cart.map((item, index) => {
            return `${index + 1}. ${item.name} x${item.qty || 1} - Rs ${formatPrice(item.price * (item.qty || 1))}`;
        }).join('\n');

        // Prepare data for both forms
        const deliveryAddress = `${address}, ${city}, ${province}`;

        // 1. Fill Owner Notification Form
        document.getElementById('owner-customer-name').value = `${firstName} ${lastName}`;
        document.getElementById('owner-customer-email').value = email;
        document.getElementById('owner-customer-phone').value = phone;
        document.getElementById('owner-delivery-address').value = deliveryAddress;
        document.getElementById('owner-order-items').value = orderItems;
        document.getElementById('owner-order-total').value = `Rs ${formatPrice(total)}`;
        document.getElementById('owner-order-date').value = orderDate;

        // 2. Fill Customer Confirmation Form
        document.getElementById('customer-email-to').value = email;
        document.getElementById('customer-name').value = `${firstName} ${lastName}`;

        const customerOrderDetails = `
Order Date: ${orderDate}
Customer: ${firstName} ${lastName}
Phone: ${phone}
Delivery Address: ${deliveryAddress}

Items Ordered:
${orderItems}

Payment Summary:
Subtotal: Rs ${formatPrice(subtotal)}
Delivery: ${cartManager.qualifiesForFreeDelivery() ? 'FREE (Order above Rs 4,000)' : `Rs ${formatPrice(deliveryCharge)}`}
Total: Rs ${formatPrice(total)}
        `.trim();

        document.getElementById('customer-order-details').value = customerOrderDetails;

        const customerMessage = `
Dear ${firstName},

Thank you for your order with Classic Carry! 🛍️

Your order has been received and we're preparing it for delivery. Here are your order details:

${customerOrderDetails}

📞 What's Next?
• We'll contact you within 24 hours to confirm your order
• Our team will arrange delivery to your address
• You can pay cash on delivery

📱 Need Help?
If you have any questions, feel free to contact us:
• WhatsApp: +92 316 0928206
• Email: info@classiccarry.com

Thank you for choosing Classic Carry! ✨

Best regards,
The Classic Carry Team
        `.trim();

        document.getElementById('customer-message').value = customerMessage;

        // Clear cart
        cartManager.clearCart();

        // Submit both forms to Netlify
        this.submitDualForms()
            .then(() => {
                // Redirect to success page
                window.location.href = '/order-success.html';
            })
            .catch((error) => {
                console.error('Error submitting forms:', error);
                this.showNotification('Order submitted, but there was an issue with email notifications.', 'warning');
                // Still redirect to success page
                setTimeout(() => {
                    window.location.href = '/order-success.html';
                }, 2000);
            });
    }

    // Show validation errors with better UX
    showValidationErrors(errors) {
        // Create error modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';

        modal.innerHTML = `
            <div class="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-red-500 shadow-2xl">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-4">
                        <i class="fas fa-exclamation-triangle text-white text-xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white">Please Complete Required Fields</h3>
                </div>
                <div class="mb-6">
                    <ul class="space-y-2">
                        ${errors.map(error => `
                            <li class="flex items-center text-red-300">
                                <i class="fas fa-times-circle mr-2 text-red-400"></i>
                                ${error}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <button class="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200">
                    <i class="fas fa-check mr-2"></i>Got it, I'll fix these
                </button>
            </div>
        `;

        // Add click handler to close modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.closest('button')) {
                document.body.removeChild(modal);
                this.highlightEmptyFields();
            }
        });

        document.body.appendChild(modal);
    }

    // Highlight empty required fields
    highlightEmptyFields() {
        const requiredFields = ['email', 'first-name', 'last-name', 'phone', 'address', 'city', 'province'];

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && (!field.value || field.value.trim() === '')) {
                // Add error styling
                field.classList.add('border-red-500', 'bg-red-900/20');
                field.classList.remove('border-gray-600');

                // Remove error styling when user starts typing
                field.addEventListener('input', function () {
                    this.classList.remove('border-red-500', 'bg-red-900/20');
                    this.classList.add('border-gray-600');
                }, { once: true });
            }
        });
    }

    // Submit both owner and customer forms
    async submitDualForms() {
        const ownerForm = document.getElementById('owner-form');
        const customerForm = document.getElementById('customer-form');

        try {
            // Submit owner notification form
            const ownerFormData = new FormData(ownerForm);
            const ownerSubmission = fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(ownerFormData).toString()
            });

            // Submit customer confirmation form
            const customerFormData = new FormData(customerForm);
            const customerSubmission = fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(customerFormData).toString()
            });

            // Wait for both submissions to complete
            await Promise.all([ownerSubmission, customerSubmission]);

            console.log('Both forms submitted successfully');
            return true;

        } catch (error) {
            console.error('Error submitting forms:', error);
            throw error;
        }
    }

    // Show order success message
    showOrderSuccessMessage(email, total) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700 shadow-2xl">
                <div class="text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-check text-white text-2xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-4">Order Placed Successfully!</h3>
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Thank you for your order! We've sent a confirmation email to <strong class="text-[#D2C1B6]">${email}</strong> with your order details.
                    </p>
                    <div class="bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-lg p-4 mb-6">
                        <p class="text-sm text-gray-300">
                            <i class="fas fa-info-circle text-[#D2C1B6] mr-2"></i>
                            Order Total: <span class="font-bold text-[#D2C1B6]">Rs ${formatPrice(total)}</span>
                        </p>
                    </div>
                    <div class="flex flex-col gap-3">
                        <button onclick="window.location.href='index.html'" class="bg-[#D2C1B6] text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-[#e2c9b8] transition-all duration-200">
                            Continue Shopping
                        </button>
                        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white transition-colors duration-200">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 10000);
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

    // Show image modal for zoom
    showImageModal(imageSrc, productName) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="relative max-w-4xl max-h-full">
                <button class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center">
                    <i class="fas fa-times"></i>
                </button>
                <img src="${imageSrc}" alt="${productName}" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl">
                <div class="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
                    <p class="text-sm">${productName}</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal events
        const closeBtn = modal.querySelector('button');
        closeBtn.addEventListener('click', () => modal.remove());

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Close with escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
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

    // Show add to cart success feedback
    showAddToCartSuccess(productName, selectedColor) {
        let message = productName;
        if (selectedColor) {
            message += ` (${selectedColor})`;
        }
        message += ' added to cart!';

        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
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

        console.log('Setting up quantity controls:', {
            decreaseBtn: !!decreaseBtn,
            increaseBtn: !!increaseBtn,
            quantityInput: !!quantityInput
        });

        if (decreaseBtn && increaseBtn && quantityInput) {
            // Remove any existing listeners to prevent duplicates
            decreaseBtn.replaceWith(decreaseBtn.cloneNode(true));
            increaseBtn.replaceWith(increaseBtn.cloneNode(true));

            // Get fresh references after cloning
            const newDecreaseBtn = document.getElementById('decrease-quantity');
            const newIncreaseBtn = document.getElementById('increase-quantity');

            newDecreaseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const currentValue = parseInt(quantityInput.value) || 1;
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                    console.log('Quantity decreased to:', quantityInput.value);
                }
            });

            newIncreaseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const currentValue = parseInt(quantityInput.value) || 1;
                quantityInput.value = currentValue + 1;
                console.log('Quantity increased to:', quantityInput.value);
            });

            quantityInput.addEventListener('change', (e) => {
                const value = parseInt(quantityInput.value) || 1;
                quantityInput.value = Math.max(1, value);
                console.log('Quantity changed to:', quantityInput.value);
            });

            quantityInput.addEventListener('input', (e) => {
                const value = parseInt(quantityInput.value) || 1;
                if (value < 1) {
                    quantityInput.value = 1;
                }
            });
        } else {
            console.log('Quantity control elements not found, retrying...');
            setTimeout(() => this.setupQuantityControls(), 100);
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

// Make app controller globally available
window.appController = app;

// Test function for product page debugging
window.testProductPage = function() {
    console.log('=== PRODUCT PAGE DEBUG ===');
    console.log('Current URL:', window.location.href);
    console.log('ProductManager:', !!window.productManager);
    console.log('AppController:', !!window.appController);
    
    if (window.productManager) {
        const products = productManager.getAllProducts();
        console.log('Total products:', products.length);
        console.log('First few products:', products.slice(0, 3).map(p => ({id: p.id, name: p.name})));
    }
    
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    console.log('Product ID from URL:', productId);
    
    if (productId && window.productManager) {
        const product = productManager.findProductById(productId);
        console.log('Found product:', !!product, product?.name);
        
        // Try to manually setup the product page
        if (product && window.appController) {
            console.log('Manually triggering setupProductPage...');
            appController.setupProductPage();
        }
    }
    
    const container = document.getElementById('product-container');
    const loading = document.getElementById('loading-message');
    console.log('Container exists:', !!container);
    console.log('Loading message exists:', !!loading);
    
    // Force setup if everything is available
    if (window.appController && productId && !loading) {
        console.log('Force triggering product setup...');
        appController.setupProductPage();
    }
};

// Test after a delay
setTimeout(testApp, 2000);