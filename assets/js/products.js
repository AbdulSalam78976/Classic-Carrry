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

        // Color options
        this.colors = data.colors || ['Black', 'Brown', 'Navy'];
        this.selectedColor = data.selectedColor || this.colors[0];

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
        return `Rs ${this.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
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

    // Get available colors
    getAvailableColors() {
        return this.colors;
    }

    // Set selected color
    setSelectedColor(colorName) {
        if (this.colors.includes(colorName)) {
            this.selectedColor = colorName;
            return true;
        }
        return false;
    }

    // Get selected color
    getSelectedColor() {
        return this.selectedColor;
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
            // Hot Selling Caps
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
                tag: '🔥 Best Seller',
                description: 'Timeless baseball cap design. Perfect for casual everyday wear with premium cotton construction.',
                category: 'male',
                colors: ['Black', 'Navy Blue', 'Forest Green', 'Burgundy', 'Charcoal'],
                features: ['Cotton Twill', 'Curved Brim', 'Adjustable Strap', 'Embroidered Logo'],
                specifications: {
                    'Style': 'Baseball',
                    'Material': 'Cotton Twill',
                    'Brim': 'Curved',
                    'Closure': 'Adjustable Strap'
                }
            }),
            new Product({
                id: 'hot-2',
                name: 'Urban Street Cap',
                price: 3299,
                category: 'male',
                mainImage: 'assets/images/c-2.png',
                images: [
                    'assets/images/c-2.png',
                    'assets/images/c-1.png',
                    'assets/images/caps/2.png'
                ],
                tag: '⭐ Trending',
                description: 'Modern street style for urban fashion. Perfect for casual everyday wear with contemporary design.',
                features: ['Street Style Design', 'Urban Fashion', 'Durable Construction', 'Versatile Look'],
                specifications: {
                    'Style': 'Urban Street',
                    'Target': 'Men',
                    'Occasion': 'Casual',
                    'Durability': 'High'
                }
            }),
            new Product({
                id: 'hot-3',
                name: 'Floral Embroidered Cap',
                price: 3199,
                category: 'female',
                mainImage: 'assets/images/c-1.png',
                images: [
                    'assets/images/c-1.png',
                    'assets/images/caps/1.png',
                    'assets/images/c-3.png'
                ],
                tag: '💖 Popular',
                description: 'Elegant floral design for women. Beautiful embroidery with premium finish and feminine charm.',
                colors: ['Blush Pink', 'Lavender', 'Mint Green', 'Cream', 'White'],
                features: ['Floral Embroidery', 'Premium Cotton', 'Feminine Design', 'Adjustable Strap'],
                specifications: {
                    'Design': 'Floral Embroidered',
                    'Target': 'Women',
                    'Material': 'Premium Cotton',
                    'Closure': 'Adjustable Strap'
                }
            }),
            new Product({
                id: 'hot-4',
                name: 'Summer Breeze Cap',
                price: 2799,
                category: 'summer',
                mainImage: 'assets/images/caps/1.png',
                images: [
                    'assets/images/caps/1.png',
                    'assets/images/c-1.png',
                    'assets/images/c-3.png'
                ],
                tag: '☀️ Summer Hit',
                description: 'Breathable straw material perfect for summer activities and beach outings with UV protection.',
                features: ['Breathable Straw Material', 'UV Protection', 'Lightweight', 'Adjustable Size'],
                specifications: {
                    'Material': 'Natural Straw',
                    'UV Protection': 'UPF 50+',
                    'Weight': '85g',
                    'Season': 'Summer'
                }
            }),

            // Hot Selling Wallets
            new Product({
                id: 'hot-5',
                name: 'Executive Bi-Fold',
                price: 4999,
                category: 'male',
                mainImage: 'assets/images/wallets/1.png',
                images: [
                    'assets/images/wallets/1.png',
                    'assets/images/w-1.png',
                    'assets/images/wallets/3.png'
                ],
                tag: '💼 Executive Choice',
                description: 'Professional bi-fold wallet for business. Premium leather with executive styling and superior craftsmanship.',
                colors: ['Black Leather', 'Brown Leather', 'Cognac', 'Navy Leather'],
                features: ['Premium Leather', 'Bi-Fold Design', 'Multiple Card Slots', 'Professional Look'],
                specifications: {
                    'Style': 'Bi-Fold',
                    'Material': 'Genuine Leather',
                    'Card Slots': '10',
                    'Target': 'Business Professional'
                }
            }),
            new Product({
                id: 'hot-6',
                name: 'Minimalist Cardholder',
                price: 2499,
                category: 'cardholder',
                mainImage: 'assets/images/wallets/4.png',
                images: [
                    'assets/images/wallets/4.png',
                    'assets/images/w-2.png',
                    'assets/images/wallets/1.png'
                ],
                tag: '✨ Minimalist',
                description: 'Slim design with security protection. Perfect for minimalist lifestyle with RFID blocking technology.',
                features: ['Slim Profile', 'RFID Blocking', 'Quick Access', 'Durable Material'],
                specifications: {
                    'Type': 'Card Holder',
                    'Capacity': '6-8 Cards',
                    'Protection': 'RFID Blocking',
                    'Profile': 'Ultra Slim'
                }
            }),
            new Product({
                id: 'hot-7',
                name: 'Elegant Clutch Wallet',
                price: 5499,
                category: 'female',
                mainImage: 'assets/images/wallets/2.png',
                images: [
                    'assets/images/wallets/2.png',
                    'assets/images/w-1.png',
                    'assets/images/wallets/4.png'
                ],
                tag: '👑 Luxury',
                description: 'Elegant design with chain strap. Perfect for evening events and daily use with sophisticated appeal.',
                features: ['Chain Strap', 'Elegant Design', 'Multiple Compartments', 'Premium Finish'],
                specifications: {
                    'Style': 'Clutch',
                    'Strap': 'Detachable Chain',
                    'Compartments': '6',
                    'Target': 'Women'
                }
            }),
            new Product({
                id: 'hot-8',
                name: 'Smart Money Clip',
                price: 3999,
                category: 'male',
                mainImage: 'assets/images/w-2.png',
                images: [
                    'assets/images/w-2.png',
                    'assets/images/wallets/4.png',
                    'assets/images/wallets/1.png'
                ],
                tag: '🚀 Smart Design',
                description: 'Modern money clip with card slots. Smart design for the modern man with innovative functionality.',
                features: ['Money Clip Design', 'Card Slots', 'Compact Size', 'Modern Style'],
                specifications: {
                    'Type': 'Money Clip',
                    'Card Slots': '4-6',
                    'Material': 'Metal & Leather',
                    'Target': 'Men'
                }
            })
        ];

        this.caps = [
            // Summer Collection
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
                colors: ['Natural', 'Light Brown', 'Beige', 'Cream'],
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
            }),
            new Product({
                id: 'cap-3',
                name: 'Mesh Trucker Cap',
                price: 3199,
                category: 'summer',
                mainImage: 'assets/images/c-2.png',
                images: [
                    'assets/images/c-2.png',
                    'assets/images/caps/3.png',
                    'assets/images/c-1.png'
                ],
                description: 'Classic trucker style with breathable mesh back. Perfect for hot summer days.',
                tag: 'Breathable',
                features: ['Mesh Back Panel', 'Foam Front', 'Snapback Closure', 'Curved Brim'],
                specifications: {
                    'Style': 'Trucker',
                    'Back': 'Mesh',
                    'Closure': 'Snapback',
                    'Season': 'Summer'
                }
            }),
            new Product({
                id: 'cap-4',
                name: 'Cotton Sun Hat',
                price: 3499,
                category: 'summer',
                mainImage: 'assets/images/caps/1.png',
                images: [
                    'assets/images/caps/1.png',
                    'assets/images/c-3.png',
                    'assets/images/c-1.png'
                ],
                description: 'Wide brim cotton hat for maximum sun protection. Stylish and functional.',
                tag: 'Sun Protection',
                features: ['Wide Brim', '100% Cotton', 'Chin Strap', 'Packable Design'],
                specifications: {
                    'Brim Width': '7cm',
                    'Material': '100% Cotton',
                    'UV Protection': 'UPF 40+',
                    'Features': 'Packable'
                }
            }),

            // Winter Collection
            new Product({
                id: 'cap-5',
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
                id: 'cap-6',
                name: 'Fleece Lined Cap',
                price: 3799,
                category: 'winter',
                mainImage: 'assets/images/c-1.png',
                images: [
                    'assets/images/c-1.png',
                    'assets/images/caps/2.png',
                    'assets/images/c-2.png'
                ],
                description: 'Insulated cap with fleece lining. Warm and comfortable for winter activities.',
                tag: 'Insulated',
                features: ['Fleece Lining', 'Water Resistant', 'Ear Flaps', 'Adjustable Fit'],
                specifications: {
                    'Lining': 'Fleece',
                    'Water Resistance': 'DWR Coating',
                    'Temperature': '-10°C to 5°C',
                    'Features': 'Ear Protection'
                }
            }),
            new Product({
                id: 'cap-7',
                name: 'Thermal Knit Beanie',
                price: 2899,
                category: 'winter',
                mainImage: 'assets/images/caps/3.png',
                images: [
                    'assets/images/caps/3.png',
                    'assets/images/caps/2.png',
                    'assets/images/c-1.png'
                ],
                description: 'Soft knit beanie with thermal properties. Perfect for everyday winter wear.',
                tag: 'Thermal',
                features: ['Thermal Knit', 'Soft Touch', 'Cuff Design', 'Machine Washable'],
                specifications: {
                    'Material': 'Acrylic Blend',
                    'Knit Type': 'Thermal',
                    'Care': 'Machine Washable',
                    'Style': 'Cuffed'
                }
            }),
            new Product({
                id: 'cap-8',
                name: 'Winter Sports Cap',
                price: 4199,
                category: 'winter',
                mainImage: 'assets/images/c-2.png',
                images: [
                    'assets/images/c-2.png',
                    'assets/images/caps/2.png',
                    'assets/images/caps/3.png'
                ],
                description: 'Technical winter cap for outdoor sports. Windproof and breathable.',
                tag: 'Technical',
                features: ['Windproof', 'Breathable', 'Reflective Details', 'Secure Fit'],
                specifications: {
                    'Technology': 'Windproof Membrane',
                    'Breathability': 'High',
                    'Visibility': 'Reflective Elements',
                    'Activity': 'Winter Sports'
                }
            }),

            // Male Collection
            new Product({
                id: 'cap-9',
                name: 'Classic Baseball Cap',
                price: 2999,
                category: 'male',
                mainImage: 'assets/images/c-1.png',
                images: [
                    'assets/images/c-1.png',
                    'assets/images/c-2.png',
                    'assets/images/caps/1.png'
                ],
                description: 'Timeless baseball cap design. Perfect for casual everyday wear.',
                tag: 'Classic',
                colors: ['Black', 'Navy Blue', 'Forest Green', 'Burgundy', 'Gray'],
                features: ['Cotton Twill', 'Curved Brim', 'Adjustable Strap', 'Embroidered Logo'],
                specifications: {
                    'Style': 'Baseball',
                    'Material': 'Cotton Twill',
                    'Brim': 'Curved',
                    'Closure': 'Adjustable Strap'
                }
            }),
            new Product({
                id: 'cap-10',
                name: 'Urban Street Cap',
                price: 3299,
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
                id: 'cap-11',
                name: 'Snapback Pro',
                price: 3599,
                category: 'male',
                mainImage: 'assets/images/caps/3.png',
                images: [
                    'assets/images/caps/3.png',
                    'assets/images/c-2.png',
                    'assets/images/c-1.png'
                ],
                description: 'Professional snapback with premium materials. Bold and confident style.',
                tag: 'Premium',
                features: ['Flat Brim', 'Structured Crown', 'Premium Fabric', 'Snapback Closure'],
                specifications: {
                    'Style': 'Snapback',
                    'Crown': 'Structured',
                    'Brim': 'Flat',
                    'Quality': 'Premium'
                }
            }),
            new Product({
                id: 'cap-12',
                name: 'Military Style Cap',
                price: 3799,
                category: 'male',
                mainImage: 'assets/images/c-3.png',
                images: [
                    'assets/images/c-3.png',
                    'assets/images/c-2.png',
                    'assets/images/caps/1.png'
                ],
                description: 'Tactical military inspired design. Durable and functional for outdoor activities.',
                tag: 'Tactical',
                features: ['Military Design', 'Durable Canvas', 'Velcro Patches', 'Adjustable Size'],
                specifications: {
                    'Style': 'Military',
                    'Material': 'Canvas',
                    'Features': 'Velcro Patches',
                    'Use': 'Outdoor/Tactical'
                }
            }),

            // Female Collection
            new Product({
                id: 'cap-13',
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
                id: 'cap-14',
                name: 'Pastel Baseball Cap',
                price: 2899,
                category: 'female',
                mainImage: 'assets/images/caps/1.png',
                images: [
                    'assets/images/caps/1.png',
                    'assets/images/c-1.png',
                    'assets/images/c-3.png'
                ],
                description: 'Soft pastel colors perfect for feminine style. Comfortable and stylish.',
                tag: 'Pastel',
                features: ['Pastel Colors', 'Soft Cotton', 'Curved Brim', 'Comfortable Fit'],
                specifications: {
                    'Colors': 'Pastel Range',
                    'Material': 'Soft Cotton',
                    'Style': 'Baseball',
                    'Target': 'Women'
                }
            }),
            new Product({
                id: 'cap-15',
                name: 'Bow Detail Cap',
                price: 3399,
                category: 'female',
                mainImage: 'assets/images/c-3.png',
                images: [
                    'assets/images/c-3.png',
                    'assets/images/caps/1.png',
                    'assets/images/c-1.png'
                ],
                description: 'Cute bow detail adds feminine charm. Perfect for casual and dressy occasions.',
                tag: 'Cute',
                features: ['Bow Detail', 'Feminine Style', 'Versatile Design', 'Quality Construction'],
                specifications: {
                    'Detail': 'Bow Accent',
                    'Style': 'Feminine',
                    'Occasion': 'Casual/Dressy',
                    'Target': 'Women'
                }
            }),
            new Product({
                id: 'cap-16',
                name: 'Rose Gold Cap',
                price: 3699,
                category: 'female',
                mainImage: 'assets/images/caps/2.png',
                images: [
                    'assets/images/caps/2.png',
                    'assets/images/c-1.png',
                    'assets/images/caps/1.png'
                ],
                description: 'Trendy rose gold accents with premium materials. Luxury meets comfort.',
                tag: 'Luxury',
                features: ['Rose Gold Accents', 'Premium Materials', 'Luxury Feel', 'Adjustable Fit'],
                specifications: {
                    'Accents': 'Rose Gold',
                    'Quality': 'Premium',
                    'Style': 'Luxury',
                    'Target': 'Women'
                }
            })
        ];

        this.wallets = [
            // Male Collection
            new Product({
                id: 'wal-1',
                name: 'Executive Bi-Fold',
                price: 4999,
                category: 'male',
                mainImage: 'assets/images/wallets/1/main.png',
                images: [
                    'assets/images/wallets/1.png',
                    'assets/images/w-1.png',
                    'assets/images/wallets/3.png'
                ],
                description: 'Professional bi-fold wallet for business. Premium leather with executive styling.',
                tag: 'Executive',
                colors: ['Black', 'Brown', 'Cognac', 'Navy'],
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
                name: 'Smart Money Clip',
                price: 3999,
                category: 'male',
                mainImage: 'assets/images/wallets/2/main.png',
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
            }),
            new Product({
                id: 'wal-3',
                name: 'Classic Leather Wallet',
                price: 4299,
                category: 'male',
                mainImage: 'assets/images/wallets/3/main.png',
                images: [
                    'assets/images/w-1.png',
                    'assets/images/wallets/1.png',
                    'assets/images/wallets/3.png'
                ],
                description: 'Timeless leather wallet with traditional craftsmanship. Built to last a lifetime.',
                tag: 'Classic',
                features: ['Full-Grain Leather', 'Hand Stitched', 'Vintage Style', 'Durable Construction'],
                specifications: {
                    'Material': 'Full-Grain Leather',
                    'Construction': 'Hand Stitched',
                    'Style': 'Classic',
                    'Warranty': '5 Years'
                }
            }),
            new Product({
                id: 'wal-4',
                name: 'RFID Blocking Wallet',
                price: 3799,
                category: 'male',
                mainImage: 'assets/images/wallets/4/main.png',
                images: [
                    'assets/images/wallets/3.png',
                    'assets/images/w-2.png',
                    'assets/images/wallets/1.png'
                ],
                description: 'Advanced RFID protection with modern design. Security meets style.',
                tag: 'Secure',
                features: ['RFID Blocking', 'Modern Design', 'Multiple Compartments', 'Slim Profile'],
                specifications: {
                    'Protection': 'RFID Blocking',
                    'Card Slots': '8',
                    'Technology': 'Advanced Security',
                    'Profile': 'Slim'
                }
            }),
            new Product({
                id: 'wal-5',
                name: 'Vintage Brown Wallet',
                price: 4599,
                category: 'male',
                mainImage: 'assets/images/wallets/5/main.png',
                images: [
                    'assets/images/wallets/1.png',
                    'assets/images/w-1.png',
                    'assets/images/w-2.png'
                ],
                description: 'Rich brown leather with vintage appeal. Perfect for the distinguished gentleman.',
                tag: 'Vintage',
                features: ['Vintage Leather', 'Rich Brown Color', 'Aged Finish', 'Premium Quality'],
                specifications: {
                    'Color': 'Rich Brown',
                    'Finish': 'Vintage Aged',
                    'Material': 'Premium Leather',
                    'Style': 'Distinguished'
                }
            }),
            new Product({
                id: 'wal-6',
                name: 'Sports Wallet',
                price: 3299,
                category: 'male',
                mainImage: 'assets/images/w-2.png',
                images: [
                    'assets/images/w-2.png',
                    'assets/images/wallets/4.png',
                    'assets/images/wallets/3.png'
                ],
                description: 'Durable wallet for active lifestyle. Water-resistant and lightweight.',
                tag: 'Active',
                features: ['Water Resistant', 'Lightweight', 'Durable Material', 'Secure Closure'],
                specifications: {
                    'Material': 'Synthetic',
                    'Water Resistance': 'IPX4',
                    'Weight': '65g',
                    'Activity': 'Sports & Outdoor'
                }
            }),

            // Female Collection
            new Product({
                id: 'wal-7',
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
                id: 'wal-8',
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
                id: 'wal-9',
                name: 'Rose Gold Wallet',
                price: 4799,
                category: 'female',
                mainImage: 'assets/images/wallets/4.png',
                images: [
                    'assets/images/wallets/4.png',
                    'assets/images/wallets/2.png',
                    'assets/images/w-1.png'
                ],
                description: 'Trendy rose gold hardware with soft leather. Modern femininity at its finest.',
                tag: 'Trendy',
                features: ['Rose Gold Hardware', 'Soft Leather', 'Modern Design', 'Compact Size'],
                specifications: {
                    'Hardware': 'Rose Gold',
                    'Material': 'Soft Leather',
                    'Style': 'Modern',
                    'Size': 'Compact'
                }
            }),
            new Product({
                id: 'wal-10',
                name: 'Floral Print Wallet',
                price: 3999,
                category: 'female',
                mainImage: 'assets/images/wallets/2.png',
                images: [
                    'assets/images/wallets/2.png',
                    'assets/images/w-1.png',
                    'assets/images/wallets/4.png'
                ],
                description: 'Beautiful floral patterns with feminine charm. Perfect for everyday elegance.',
                tag: 'Floral',
                features: ['Floral Print', 'Feminine Design', 'Multiple Pockets', 'Zip Closure'],
                specifications: {
                    'Pattern': 'Floral',
                    'Style': 'Feminine',
                    'Closure': 'Zip Around',
                    'Pockets': 'Multiple'
                }
            }),
            new Product({
                id: 'wal-11',
                name: 'Crossbody Wallet',
                price: 4399,
                category: 'female',
                mainImage: 'assets/images/w-1.png',
                images: [
                    'assets/images/w-1.png',
                    'assets/images/wallets/2.png',
                    'assets/images/wallets/4.png'
                ],
                description: 'Convertible wallet with crossbody strap. Hands-free convenience with style.',
                tag: 'Convertible',
                features: ['Crossbody Strap', 'Convertible Design', 'Phone Pocket', 'Secure Closure'],
                specifications: {
                    'Strap': 'Adjustable Crossbody',
                    'Phone Fit': 'Up to 6.5"',
                    'Style': 'Convertible',
                    'Security': 'Zip Closure'
                }
            }),
            new Product({
                id: 'wal-12',
                name: 'Vintage Leather Purse',
                price: 5299,
                category: 'female',
                mainImage: 'assets/images/wallets/4.png',
                images: [
                    'assets/images/wallets/4.png',
                    'assets/images/w-1.png',
                    'assets/images/wallets/2.png'
                ],
                description: 'Vintage-inspired leather purse with classic appeal. Timeless elegance for women.',
                tag: 'Vintage',
                features: ['Vintage Leather', 'Classic Design', 'Antique Hardware', 'Spacious Interior'],
                specifications: {
                    'Style': 'Vintage',
                    'Hardware': 'Antique Brass',
                    'Interior': 'Spacious',
                    'Era': 'Classic'
                }
            }),

            // Card Holder Collection
            new Product({
                id: 'wal-13',
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
                id: 'wal-14',
                name: 'Metal Card Case',
                price: 2999,
                category: 'cardholder',
                mainImage: 'assets/images/w-2.png',
                images: [
                    'assets/images/w-2.png',
                    'assets/images/wallets/4.png',
                    'assets/images/wallets/3.png'
                ],
                description: 'Sleek metal construction with modern appeal. Durable and stylish protection.',
                tag: 'Modern',
                features: ['Metal Construction', 'Sleek Design', 'Scratch Resistant', 'Compact Size'],
                specifications: {
                    'Material': 'Aluminum Alloy',
                    'Finish': 'Anodized',
                    'Capacity': '5-7 Cards',
                    'Durability': 'High'
                }
            }),
            new Product({
                id: 'wal-15',
                name: 'Leather Card Wallet',
                price: 2799,
                category: 'cardholder',
                mainImage: 'assets/images/wallets/1.png',
                images: [
                    'assets/images/wallets/1.png',
                    'assets/images/wallets/4.png',
                    'assets/images/w-2.png'
                ],
                description: 'Premium leather card wallet with traditional craftsmanship. Classic meets modern.',
                tag: 'Premium',
                features: ['Premium Leather', 'Traditional Craft', 'Multiple Slots', 'Compact Design'],
                specifications: {
                    'Material': 'Premium Leather',
                    'Slots': '8',
                    'Craft': 'Traditional',
                    'Size': 'Compact'
                }
            }),
            new Product({
                id: 'wal-16',
                name: 'Pop-Up Card Holder',
                price: 3299,
                category: 'cardholder',
                mainImage: 'assets/images/wallets/3.png',
                images: [
                    'assets/images/wallets/3.png',
                    'assets/images/w-2.png',
                    'assets/images/wallets/4.png'
                ],
                description: 'Innovative pop-up mechanism for easy access. Modern technology meets convenience.',
                tag: 'Innovative',
                features: ['Pop-Up Mechanism', 'Easy Access', 'RFID Protection', 'Modern Design'],
                specifications: {
                    'Mechanism': 'Pop-Up',
                    'Access': 'One-Touch',
                    'Protection': 'RFID Blocking',
                    'Innovation': 'High-Tech'
                }
            }),

            // Long Wallet Collection
            new Product({
                id: 'wal-17',
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
                id: 'wal-18',
                name: 'Executive Organizer',
                price: 5799,
                category: 'long',
                mainImage: 'assets/images/wallets/1.png',
                images: [
                    'assets/images/wallets/1.png',
                    'assets/images/wallets/3.png',
                    'assets/images/w-1.png'
                ],
                description: 'Professional organizer for business documents. Executive-level organization.',
                tag: 'Executive',
                features: ['Business Card Slots', 'Document Pockets', 'Pen Holder', 'Premium Leather'],
                specifications: {
                    'Type': 'Business Organizer',
                    'Card Slots': '20+',
                    'Documents': 'Multiple Pockets',
                    'Extras': 'Pen Holder'
                }
            }),
            new Product({
                id: 'wal-19',
                name: 'Family Wallet',
                price: 4999,
                category: 'long',
                mainImage: 'assets/images/w-1.png',
                images: [
                    'assets/images/w-1.png',
                    'assets/images/wallets/3.png',
                    'assets/images/wallets/1.png'
                ],
                description: 'Spacious wallet for family needs. Multiple compartments for everyone\'s cards.',
                tag: 'Family',
                features: ['Multiple Compartments', 'Family Size', 'Organized Layout', 'Durable Build'],
                specifications: {
                    'Size': 'Family',
                    'Compartments': 'Multiple',
                    'Capacity': 'High',
                    'Organization': 'Advanced'
                }
            }),
            new Product({
                id: 'wal-20',
                name: 'Checkbook Wallet',
                price: 4599,
                category: 'long',
                mainImage: 'assets/images/wallets/2.png',
                images: [
                    'assets/images/wallets/2.png',
                    'assets/images/wallets/3.png',
                    'assets/images/w-1.png'
                ],
                description: 'Traditional checkbook wallet with modern features. Classic functionality updated.',
                tag: 'Traditional',
                features: ['Checkbook Holder', 'Card Slots', 'Bill Compartment', 'Classic Design'],
                specifications: {
                    'Type': 'Checkbook Wallet',
                    'Checkbook': 'Standard Size',
                    'Style': 'Traditional',
                    'Features': 'Complete'
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
