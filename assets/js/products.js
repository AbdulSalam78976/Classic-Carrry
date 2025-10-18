// Product Data and Management
class ProductManager {
    constructor() {
        this.hotProducts = [
            { 
                id: 'hot-1', 
                name: 'Classic Baseball Cap', 
                price: 29.99, 
                img: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop', 
                tag: 'Fast Shipping',
                description: 'Premium cotton blend with embroidered logo'
            },
            { 
                id: 'hot-2', 
                name: 'Leather Bi-Fold Wallet', 
                price: 49.99, 
                img: 'https://images.unsplash.com/photo-1549082984-1323b94df9bd?q=80&w=1200&auto=format&fit=crop', 
                tag: 'Premium Leather',
                description: 'Genuine full-grain leather with RFID protection'
            },
            { 
                id: 'hot-3', 
                name: 'Snapback Cap', 
                price: 34.99, 
                img: 'https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=1200&auto=format&fit=crop', 
                tag: 'Best Seller',
                description: 'Adjustable fit with premium embroidery'
            },
            { 
                id: 'hot-4', 
                name: 'Minimalist Card Holder', 
                price: 24.99, 
                img: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1200&auto=format&fit=crop', 
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
                img: 'https://images.unsplash.com/photo-1543363136-63d3d66d1c00?q=80&w=1200&auto=format&fit=crop',
                description: 'Breathable straw material perfect for summer'
            },
            { 
                id: 'cap-2', 
                name: 'Wool Blend Beanie', 
                price: 32.99, 
                category: 'winter', 
                img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop',
                description: 'Warm wool blend for cold weather'
            },
            { 
                id: 'cap-3', 
                name: 'Performance Sport Cap', 
                price: 35.99, 
                category: 'sports', 
                img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
                description: 'Moisture-wicking fabric for active lifestyle'
            },
            { 
                id: 'cap-4', 
                name: 'Floral Embroidered Cap', 
                price: 31.99, 
                category: 'female', 
                img: 'https://images.unsplash.com/photo-1503342331086-4ff3c3c5b392?q=80&w=1200&auto=format&fit=crop',
                description: 'Elegant floral design for women'
            },
            { 
                id: 'cap-5', 
                name: 'Urban Street Cap', 
                price: 29.99, 
                category: 'male', 
                img: 'https://images.unsplash.com/photo-1520975922325-24baf7601c31?q=80&w=1200&auto=format&fit=crop',
                description: 'Modern street style for urban fashion'
            },
            { 
                id: 'cap-6', 
                name: 'Beach Visor', 
                price: 25.99, 
                category: 'summer', 
                img: 'https://images.unsplash.com/photo-1520975618319-8bdfb3f3f1e5?q=80&w=1200&auto=format&fit=crop',
                description: 'Lightweight visor for beach and outdoor activities'
            }
        ];

        this.wallets = [
            { 
                id: 'wal-1', 
                name: 'Executive Bi-Fold', 
                price: 49.99, 
                category: 'male', 
                img: 'https://images.unsplash.com/photo-1599050751795-5f3e89c4b2ba?q=80&w=1200&auto=format&fit=crop',
                description: 'Professional bi-fold wallet for business'
            },
            { 
                id: 'wal-2', 
                name: 'Elegant Clutch Wallet', 
                price: 54.99, 
                category: 'female', 
                img: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop',
                description: 'Elegant design with chain strap'
            },
            { 
                id: 'wal-3', 
                name: 'Travel Organizer', 
                price: 62.99, 
                category: 'long', 
                img: 'https://images.unsplash.com/photo-1520785643438-5bf77931f493?q=80&w=1200&auto=format&fit=crop',
                description: 'Large capacity wallet for travel'
            },
            { 
                id: 'wal-4', 
                name: 'Minimalist Cardholder', 
                price: 24.99, 
                category: 'cardholder', 
                img: 'https://images.unsplash.com/photo-1606313564200-2b2f3b8c1b63?q=80&w=1200&auto=format&fit=crop',
                description: 'Slim design with security protection'
            },
            { 
                id: 'wal-5', 
                name: 'Designer Bifold', 
                price: 58.99, 
                category: 'female', 
                img: 'https://images.unsplash.com/photo-1547149609-1bd8f7e64494?q=80&w=1200&auto=format&fit=crop',
                description: 'Luxury designer wallet for women'
            },
            { 
                id: 'wal-6', 
                name: 'Smart Money Clip', 
                price: 39.99, 
                category: 'male', 
                img: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020b?q=80&w=1200&auto=format&fit=crop',
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
