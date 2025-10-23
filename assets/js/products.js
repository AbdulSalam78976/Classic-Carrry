// Product Class Definition
class Product {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.price = data.price;
        this.description = data.description || '';
        this.category = data.category;
        this.tag = data.tag || '';
        
        // Image handling
        this.mainImage = data.img || data.mainImage;
        this.images = data.images || [this.mainImage];
        
        // Ensure main image is first in images array
        if (this.images[0] !== this.mainImage) {
            this.images = [this.mainImage, ...this.images.filter(img => img !== this.mainImage)];
        }
        
        // Features and specifications
        this.features = data.features || [];
        this.specifications = data.specifications || {};
        this.rating = data.rating || 4.5;
        this.reviewCount = data.reviewCount || 128;
        this.inStock = data.inStock !== false; // Default to true unless explicitly false
        this.stockCount = data.stockCount || null;
    }
    
    // Get main image
    getMainImage() {
        return this.mainImage;
    }
    
    // Get all images
    getAllImages() {
        return this.images;
    }
    
    // Get additional images (excluding main)
    getAdditionalImages() {
        return this.images.slice(1);
    }
    
    // Add image to product
    addImage(imageUrl) {
        if (!this.images.includes(imageUrl)) {
            this.images.push(imageUrl);
        }
    }
    
    // Set main image
    setMainImage(imageUrl) {
        this.mainImage = imageUrl;
        // Remove from current position and add to front
        this.images = this.images.filter(img => img !== imageUrl);
        this.images.unshift(imageUrl);
    }
    
    // Get formatted price
    getFormattedPrice() {
        return `Rs ${this.price.toLocaleString()}`;
    }
    
    // Check if product has multiple images
    hasMultipleImages() {
        return this.images.length > 1;
    }
    
    // Get product for cart (simplified version)
    getCartData() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            img: this.mainImage
        };
    }
    
    // Check stock status
    isInStock() {
        return this.inStock && (this.stockCount === null || this.stockCount > 0);
    }
    
    // Get stock status text
    getStockStatus() {
        if (!this.inStock) return 'Out of Stock';
        if (this.stockCount === null) return 'In Stock';
        if (this.stockCount <= 5) return `Only ${this.stockCount} left`;
        return 'In Stock';
    }
    
    // Get stock status class for styling
    getStockStatusClass() {
        if (!this.inStock) return 'text-red-400';
        if (this.stockCount !== null && this.stockCount <= 5) return 'text-yellow-400';
        return 'text-green-400';
    }

    // Get product JSON (for compatibility with existing code)
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            img: this.mainImage,
            images: this.images,
            description: this.description,
            category: this.category,
            tag: this.tag,
            features: this.features,
            specifications: this.specifications,
            rating: this.rating,
            reviewCount: this.reviewCount,
            inStock: this.inStock,
            stockCount: this.stockCount
        };
    }
}

// Product Data and Management
class ProductManager {
    constructor() {
        this.hotProducts = [
            new Product({ 
                id: 'hot-1', 
                name: 'Classic Baseball Cap', 
                price: 2999, 
                mainImage: 'assets/images/c-1.png',
                images: [
                    'assets/images/c-1.png',
                    'assets/images/c-2.png',
                    'assets/images/c-3.png',
                    'assets/images/caps/1.png'
                ],
                tag: 'Fast Shipping',
                description: 'Premium cotton blend with embroidered logo. Features adjustable strap and breathable fabric.',
                category: 'male',
                features: ['Premium Cotton Blend', 'Embroidered Logo', 'Adjustable Strap', 'Breathable Fabric'],
                specifications: {
                    'Material': 'Cotton Blend',
                    'Size': 'One Size Fits All',
                    'Color': 'Multiple Available',
                    'Care': 'Hand Wash Only'
                }
            }),
            new Product({ 
                id: 'hot-2', 
                name: 'Leather Bi-Fold Wallet', 
                price: 4999, 
                mainImage: 'assets/images/w-1.png',
                images: [
                    'assets/images/w-1.png',
                    'assets/images/w-2.png',
                    'assets/images/wallets/1.png',
                    'assets/images/wallets/2.png'
                ],
                tag: 'Premium Leather',
                description: 'Genuine full-grain leather with RFID protection. Multiple card slots and bill compartment.',
                category: 'male',
                features: ['Genuine Leather', 'RFID Protection', '8 Card Slots', 'Bill Compartment'],
                specifications: {
                    'Material': 'Full-Grain Leather',
                    'Dimensions': '11cm x 9cm x 2cm',
                    'Card Slots': '8',
                    'RFID Protection': 'Yes'
                }
            }),
            new Product({ 
                id: 'hot-3', 
                name: 'Snapback Cap', 
                price: 3499, 
                mainImage: 'assets/images/c-2.png',
                images: [
                    'assets/images/c-2.png',
                    'assets/images/c-1.png',
                    'assets/images/c-3.png',
                    'assets/images/caps/2.png'
                ],
                tag: 'Best Seller',
                description: 'Adjustable fit with premium embroidery. Perfect for casual and sports activities.',
                category: 'sports',
                features: ['Snapback Design', 'Premium Embroidery', 'Flat Brim', 'Structured Crown'],
                specifications: {
                    'Style': 'Snapback',
                    'Brim': 'Flat',
                    'Crown': 'Structured',
                    'Closure': 'Snapback'
                }
            }),
            new Product({ 
                id: 'hot-4', 
                name: 'Minimalist Card Holder', 
                price: 2499, 
                mainImage: 'assets/images/w-2.png',
                images: [
                    'assets/images/w-2.png',
                    'assets/images/wallets/4.png',
                    'assets/images/w-1.png'
                ],
                tag: 'Slim Design',
                description: 'Slim design with premium metal finish. Perfect for minimalist lifestyle.',
                category: 'cardholder',
                features: ['Slim Profile', 'Metal Construction', 'RFID Blocking', 'Quick Access'],
                specifications: {
                    'Material': 'Aluminum Alloy',
                    'Capacity': '6-8 Cards',
                    'Thickness': '8mm',
                    'Weight': '45g'
                }
            })
        ];

        this.caps = [
            new Product({ 
                id: 'cap-1', 
                name: 'Summer Breeze Cap', 
                price: 2799, 
                category: 'summer', 
                mainImage: 'assets/images/caps/1.png',
                images: [
                    'assets/images/caps/1.png',
                    'assets/images/c-1.png',
                    'assets/images/c-3.png'
                ],
                description: 'Breathable straw material perfect for summer activities and beach outings.',
                tag: 'Summer Special',
                features: ['Breathable Straw Material', 'UV Protection', 'Lightweight', 'Adjustable Size'],
                specifications: {
                    'Material': 'Natural Straw',
                    'UV Protection': 'UPF 50+',
                    'Weight': '85g',
                    'Season': 'Summer'
                }
            }),
            new Product({ 
                id: 'cap-2', 
                name: 'Wool Blend Beanie', 
                price: 3299, 
                category: 'winter', 
                mainImage: 'assets/images/caps/2.png',
                images: [
                    'assets/images/caps/2.png',
                    'assets/images/caps/3.png',
                    'assets/images/c-2.png'
                ],
                description: 'Warm wool blend for cold weather. Soft and comfortable fit.',
                tag: 'Winter Essential',
                features: ['Wool Blend Material', 'Thermal Insulation', 'Soft Interior', 'Stretchable Fit'],
                specifications: {
                    'Material': '70% Wool, 30% Acrylic',
                    'Warmth Rating': 'Cold Weather',
                    'Fit': 'Stretchable',
                    'Season': 'Winter'
                }
            }),
            new Product({ 
                id: 'cap-3', 
                name: 'Performance Sport Cap', 
                price: 3599, 
                category: 'sports', 
                mainImage: 'assets/images/caps/3.png',
                images: [
                    'assets/images/caps/3.png',
                    'assets/images/c-2.png',
                    'assets/images/caps/1.png'
                ],
                description: 'Moisture-wicking fabric for active lifestyle. Perfect for workouts and sports.',
                tag: 'Athletic',
                features: ['Moisture-Wicking', 'Quick Dry', 'Breathable Mesh', 'Sweat-Resistant'],
                specifications: {
                    'Material': 'Polyester Blend',
                    'Technology': 'Moisture-Wicking',
                    'Ventilation': 'Mesh Panels',
                    'Activity': 'Sports & Fitness'
                }
            }),
            new Product({ 
                id: 'cap-4', 
                name: 'Floral Embroidered Cap', 
                price: 3199, 
                category: 'female', 
                mainImage: 'assets/images/c-1.png',
                images: [
                    'assets/images/c-1.png',
                    'assets/images/caps/1.png',
                    'assets/images/c-3.png'
                ],
                description: 'Elegant floral design for women. Beautiful embroidery with premium finish.',
                tag: 'Elegant',
                features: ['Floral Embroidery', 'Premium Cotton', 'Feminine Design', 'Adjustable Strap'],
                specifications: {
                    'Design': 'Floral Embroidered',
                    'Target': 'Women',
                    'Material': 'Premium Cotton',
                    'Closure': 'Adjustable Strap'
                }
            }),
            new Product({ 
                id: 'cap-5', 
                name: 'Urban Street Cap', 
                price: 2999, 
                category: 'male', 
                mainImage: 'assets/images/c-2.png',
                images: [
                    'assets/images/c-2.png',
                    'assets/images/c-1.png',
                    'assets/images/caps/2.png'
                ],
                description: 'Modern street style for urban fashion. Perfect for casual everyday wear.',
                tag: 'Trendy',
                features: ['Street Style Design', 'Urban Fashion', 'Durable Construction', 'Versatile Look'],
                specifications: {
                    'Style': 'Urban Street',
                    'Target': 'Men',
                    'Occasion': 'Casual',
                    'Durability': 'High'
                }
            }),
            new Product({ 
                id: 'cap-6', 
                name: 'Beach Visor', 
                price: 2599, 
                category: 'summer', 
                mainImage: 'assets/images/c-3.png',
                images: [
                    'assets/images/c-3.png',
                    'assets/images/caps/1.png',
                    'assets/images/c-1.png'
                ],
                description: 'Lightweight visor for beach and outdoor activities. Maximum sun protection.',
                tag: 'Beach Ready',
                features: ['Lightweight Design', 'Sun Protection', 'Quick Dry', 'Adjustable Fit'],
                specifications: {
                    'Type': 'Visor',
                    'Weight': '45g',
                    'UV Protection': 'UPF 30+',
                    'Activity': 'Beach & Outdoor'
                }
            })
        ];

        this.wallets = [
            new Product({ 
                id: 'wal-1', 
                name: 'Executive Bi-Fold', 
                price: 4999, 
                category: 'male', 
                mainImage: 'assets/images/wallets/1.png',
                images: [
                    'assets/images/wallets/1.png',
                    'assets/images/w-1.png',
                    'assets/images/wallets/3.png'
                ],
                description: 'Professional bi-fold wallet for business. Premium leather with executive styling.',
                tag: 'Executive',
                features: ['Premium Leather', 'Bi-Fold Design', 'Multiple Card Slots', 'Professional Look'],
                specifications: {
                    'Style': 'Bi-Fold',
                    'Material': 'Genuine Leather',
                    'Card Slots': '10',
                    'Target': 'Business Professional'
                }
            }),
            new Product({ 
                id: 'wal-2', 
                name: 'Elegant Clutch Wallet', 
                price: 5499, 
                category: 'female', 
                mainImage: 'assets/images/wallets/2.png',
                images: [
                    'assets/images/wallets/2.png',
                    'assets/images/w-1.png',
                    'assets/images/wallets/4.png'
                ],
                description: 'Elegant design with chain strap. Perfect for evening events and daily use.',
                tag: 'Luxury',
                features: ['Chain Strap', 'Elegant Design', 'Multiple Compartments', 'Premium Finish'],
                specifications: {
                    'Style': 'Clutch',
                    'Strap': 'Detachable Chain',
                    'Compartments': '6',
                    'Target': 'Women'
                }
            }),
            new Product({ 
                id: 'wal-3', 
                name: 'Travel Organizer', 
                price: 6299, 
                category: 'long', 
                mainImage: 'assets/images/wallets/3.png',
                images: [
                    'assets/images/wallets/3.png',
                    'assets/images/wallets/1.png',
                    'assets/images/w-2.png'
                ],
                description: 'Large capacity wallet for travel. Organized compartments for documents and cards.',
                tag: 'Travel Ready',
                features: ['Large Capacity', 'Document Slots', 'Passport Holder', 'Zip Closure'],
                specifications: {
                    'Type': 'Travel Wallet',
                    'Capacity': 'Large',
                    'Features': 'Passport Holder',
                    'Closure': 'Zip Around'
                }
            }),
            new Product({ 
                id: 'wal-4', 
                name: 'Minimalist Cardholder', 
                price: 2499, 
                category: 'cardholder', 
                mainImage: 'assets/images/wallets/4.png',
                images: [
                    'assets/images/wallets/4.png',
                    'assets/images/w-2.png',
                    'assets/images/wallets/1.png'
                ],
                description: 'Slim design with security protection. Perfect for minimalist lifestyle.',
                tag: 'Minimalist',
                features: ['Slim Profile', 'RFID Blocking', 'Quick Access', 'Durable Material'],
                specifications: {
                    'Type': 'Card Holder',
                    'Capacity': '6-8 Cards',
                    'Protection': 'RFID Blocking',
                    'Profile': 'Ultra Slim'
                }
            }),
            new Product({ 
                id: 'wal-5', 
                name: 'Designer Bifold', 
                price: 5899, 
                category: 'female', 
                mainImage: 'assets/images/w-1.png',
                images: [
                    'assets/images/w-1.png',
                    'assets/images/wallets/2.png',
                    'assets/images/wallets/4.png'
                ],
                description: 'Luxury designer wallet for women. Premium materials with sophisticated design.',
                tag: 'Designer',
                features: ['Designer Brand', 'Premium Materials', 'Sophisticated Design', 'Multiple Colors'],
                specifications: {
                    'Style': 'Designer Bifold',
                    'Material': 'Premium Leather',
                    'Brand': 'Designer',
                    'Target': 'Women'
                }
            }),
            new Product({ 
                id: 'wal-6', 
                name: 'Smart Money Clip', 
                price: 3999, 
                category: 'male', 
                mainImage: 'assets/images/w-2.png',
                images: [
                    'assets/images/w-2.png',
                    'assets/images/wallets/4.png',
                    'assets/images/wallets/1.png'
                ],
                description: 'Modern money clip with card slots. Smart design for the modern man.',
                tag: 'Smart',
                features: ['Money Clip Design', 'Card Slots', 'Compact Size', 'Modern Style'],
                specifications: {
                    'Type': 'Money Clip',
                    'Card Slots': '4-6',
                    'Material': 'Metal & Leather',
                    'Target': 'Men'
                }
            })
        ];
    }
    
    // Get all products
    getAllProducts() {
        return [...this.hotProducts, ...this.caps, ...this.wallets];
    }
    
    // Find product by ID
    findProductById(id) {
        return this.getAllProducts().find(product => product.id === id);
    }
    
    // Get product in legacy format (for backward compatibility)
    getProductLegacyFormat(id) {
        const product = this.findProductById(id);
        if (product) {
            return {
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.mainImage,
                description: product.description,
                category: product.category,
                tag: product.tag
            };
        }
        return null;
    }
    
    // Get products by category
    getProductsByCategory(category, type = 'all') {
        let products = [];
        
        switch (type) {
            case 'caps':
                products = this.caps;
                break;
            case 'wallets':
                products = this.wallets;
                break;
            default:
                products = this.getAllProducts();
        }
        
        if (category === 'all') {
            return products;
        }
        
        return products.filter(product => product.category === category);
    }
    
    // Get hot products
    getHotProducts() {
        return this.hotProducts;
    }
    
    // Get caps
    getCaps() {
        return this.caps;
    }
    
    // Get wallets
    getWallets() {
        return this.wallets;
    }
    
    // Add new product to appropriate category
    addProduct(productData, category = 'hot') {
        const product = new Product(productData);
        
        switch (category.toLowerCase()) {
            case 'cap':
            case 'caps':
                this.caps.push(product);
                break;
            case 'wallet':
            case 'wallets':
                this.wallets.push(product);
                break;
            case 'hot':
            default:
                this.hotProducts.push(product);
                break;
        }
        
        return product;
    }
    
    // Update existing product
    updateProduct(id, updates) {
        const product = this.findProductById(id);
        if (product) {
            Object.assign(product, updates);
            return product;
        }
        return null;
    }
    
    // Remove product by ID
    removeProduct(id) {
        const removeFromArray = (arr) => {
            const index = arr.findIndex(p => p.id === id);
            if (index > -1) {
                return arr.splice(index, 1)[0];
            }
            return null;
        };
        
        return removeFromArray(this.hotProducts) || 
               removeFromArray(this.caps) || 
               removeFromArray(this.wallets);
    }
}

// Initialize product manager
const productManager = new ProductManager();

// Export for use in other files
window.productManager = productManager;
