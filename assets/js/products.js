// Product Data and Management
class ProductManager {
    constructor() {
        this.hotProducts = [
            { 
                id: 'hot-1', 
                name: 'Classic Baseball Cap', 
                price: 29.99, 
                img: 'assets/images/c-1.png', 
                tag: 'Fast Shipping',
                description: 'Premium cotton blend with embroidered logo'
            },
            { 
                id: 'hot-2', 
                name: 'Leather Bi-Fold Wallet', 
                price: 49.99, 
                img: 'assets/images/w-1.png', 
                tag: 'Premium Leather',
                description: 'Genuine full-grain leather with RFID protection'
            },
            { 
                id: 'hot-3', 
                name: 'Snapback Cap', 
                price: 34.99, 
                img: 'assets/images/c-2.png', 
                tag: 'Best Seller',
                description: 'Adjustable fit with premium embroidery'
            },
            { 
                id: 'hot-4', 
                name: 'Minimalist Card Holder', 
                price: 24.99, 
                img: 'assets/images/w-2.png', 
                tag: 'Slim Design',
                description: 'Slim design with premium metal finish'
            }
        ];

        this.caps = [
            { 
                id: 'cap-1', 
                name: 'Summer Breeze Cap', 
                price: 27.99, 
                category: 'summer', 
                img: 'assets/images/caps/1.png',
                description: 'Breathable straw material perfect for summer'
            },
            { 
                id: 'cap-2', 
                name: 'Wool Blend Beanie', 
                price: 32.99, 
                category: 'winter', 
                img: 'assets/images/caps/2.png',
                description: 'Warm wool blend for cold weather'
            },
            { 
                id: 'cap-3', 
                name: 'Performance Sport Cap', 
                price: 35.99, 
                category: 'sports', 
                img: 'assets/images/caps/3.png',
                description: 'Moisture-wicking fabric for active lifestyle'
            },
            { 
                id: 'cap-4', 
                name: 'Floral Embroidered Cap', 
                price: 31.99, 
                category: 'female', 
                img: 'assets/images/c-1.png',
                description: 'Elegant floral design for women'
            },
            { 
                id: 'cap-5', 
                name: 'Urban Street Cap', 
                price: 29.99, 
                category: 'male', 
                img: 'assets/images/c-2.png',
                description: 'Modern street style for urban fashion'
            },
            { 
                id: 'cap-6', 
                name: 'Beach Visor', 
                price: 25.99, 
                category: 'summer', 
                img: 'assets/images/c-3.png',
                description: 'Lightweight visor for beach and outdoor activities'
            }
        ];

        this.wallets = [
            { 
                id: 'wal-1', 
                name: 'Executive Bi-Fold', 
                price: 49.99, 
                category: 'male', 
                img: 'assets/images/wallets/1.png',
                description: 'Professional bi-fold wallet for business'
            },
            { 
                id: 'wal-2', 
                name: 'Elegant Clutch Wallet', 
                price: 54.99, 
                category: 'female', 
                img: 'assets/images/wallets/2.png',
                description: 'Elegant design with chain strap'
            },
            { 
                id: 'wal-3', 
                name: 'Travel Organizer', 
                price: 62.99, 
                category: 'long', 
                img: 'assets/images/wallets/3.png',
                description: 'Large capacity wallet for travel'
            },
            { 
                id: 'wal-4', 
                name: 'Minimalist Cardholder', 
                price: 24.99, 
                category: 'cardholder', 
                img: 'assets/images/wallets/4.png',
                description: 'Slim design with security protection'
            },
            { 
                id: 'wal-5', 
                name: 'Designer Bifold', 
                price: 58.99, 
                category: 'female', 
                img: 'assets/images/w-1.png',
                description: 'Luxury designer wallet for women'
            },
            { 
                id: 'wal-6', 
                name: 'Smart Money Clip', 
                price: 39.99, 
                category: 'male', 
                img: 'assets/images/w-2.png',
                description: 'Modern money clip with card slots'
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
