// Product Data and Management
class ProductManager {
    constructor() {
        this.hotProducts = [
            { 
                id: 'hot-1', 
                name: 'Classic Baseball Cap', 
                price: 2999, 
                img: 'assets/images/c-1.png', 
                tag: 'Fast Shipping',
                description: 'Premium cotton blend with embroidered logo',
                category: 'male'
            },
            { 
                id: 'hot-2', 
                name: 'Leather Bi-Fold Wallet', 
                price: 4999, 
                img: 'assets/images/w-1.png', 
                tag: 'Premium Leather',
                description: 'Genuine full-grain leather with RFID protection',
                category: 'male'
            },
            { 
                id: 'hot-3', 
                name: 'Snapback Cap', 
                price: 3499, 
                img: 'assets/images/c-2.png', 
                tag: 'Best Seller',
                description: 'Adjustable fit with premium embroidery',
                category: 'sports'
            },
            { 
                id: 'hot-4', 
                name: 'Minimalist Card Holder', 
                price: 2499, 
                img: 'assets/images/w-2.png', 
                tag: 'Slim Design',
                description: 'Slim design with premium metal finish',
                category: 'cardholder'
            }
        ];

        this.caps = [
            { 
                id: 'cap-1', 
                name: 'Summer Breeze Cap', 
                price: 2799, 
                category: 'summer', 
                img: 'assets/images/caps/1.png',
                description: 'Breathable straw material perfect for summer',
                tag: 'Summer Special'
            },
            { 
                id: 'cap-2', 
                name: 'Wool Blend Beanie', 
                price: 3299, 
                category: 'winter', 
                img: 'assets/images/caps/2.png',
                description: 'Warm wool blend for cold weather',
                tag: 'Winter Essential'
            },
            { 
                id: 'cap-3', 
                name: 'Performance Sport Cap', 
                price: 3599, 
                category: 'sports', 
                img: 'assets/images/caps/3.png',
                description: 'Moisture-wicking fabric for active lifestyle',
                tag: 'Athletic'
            },
            { 
                id: 'cap-4', 
                name: 'Floral Embroidered Cap', 
                price: 3199, 
                category: 'female', 
                img: 'assets/images/c-1.png',
                description: 'Elegant floral design for women',
                tag: 'Elegant'
            },
            { 
                id: 'cap-5', 
                name: 'Urban Street Cap', 
                price: 2999, 
                category: 'male', 
                img: 'assets/images/c-2.png',
                description: 'Modern street style for urban fashion',
                tag: 'Trendy'
            },
            { 
                id: 'cap-6', 
                name: 'Beach Visor', 
                price: 2599, 
                category: 'summer', 
                img: 'assets/images/c-3.png',
                description: 'Lightweight visor for beach and outdoor activities',
                tag: 'Beach Ready'
            }
        ];

        this.wallets = [
            { 
                id: 'wal-1', 
                name: 'Executive Bi-Fold', 
                price: 4999, 
                category: 'male', 
                img: 'assets/images/wallets/1.png',
                description: 'Professional bi-fold wallet for business',
                tag: 'Executive'
            },
            { 
                id: 'wal-2', 
                name: 'Elegant Clutch Wallet', 
                price: 5499, 
                category: 'female', 
                img: 'assets/images/wallets/2.png',
                description: 'Elegant design with chain strap',
                tag: 'Luxury'
            },
            { 
                id: 'wal-3', 
                name: 'Travel Organizer', 
                price: 6299, 
                category: 'long', 
                img: 'assets/images/wallets/3.png',
                description: 'Large capacity wallet for travel',
                tag: 'Travel Ready'
            },
            { 
                id: 'wal-4', 
                name: 'Minimalist Cardholder', 
                price: 2499, 
                category: 'cardholder', 
                img: 'assets/images/wallets/4.png',
                description: 'Slim design with security protection',
                tag: 'Minimalist'
            },
            { 
                id: 'wal-5', 
                name: 'Designer Bifold', 
                price: 5899, 
                category: 'female', 
                img: 'assets/images/w-1.png',
                description: 'Luxury designer wallet for women',
                tag: 'Designer'
            },
            { 
                id: 'wal-6', 
                name: 'Smart Money Clip', 
                price: 3999, 
                category: 'male', 
                img: 'assets/images/w-2.png',
                description: 'Modern money clip with card slots',
                tag: 'Smart'
            }
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
}

// Initialize product manager
const productManager = new ProductManager();

// Export for use in other files
window.productManager = productManager;
