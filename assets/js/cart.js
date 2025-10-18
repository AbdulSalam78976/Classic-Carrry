// Cart Management Utilities
class CartManager {
    constructor() {
        this.cartKey = 'cc_cart';
        this.init();
    }
    
    init() {
        this.updateCartBadge();
    }
    
    // Get cart from localStorage
    getCart() {
        try {
            const raw = localStorage.getItem(this.cartKey);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Error loading cart:', e);
            return [];
        }
    }
    
    // Save cart to localStorage
    setCart(items) {
        try {
            localStorage.setItem(this.cartKey, JSON.stringify(items));
            this.updateCartBadge();
        } catch (e) {
            console.error('Error saving cart:', e);
        }
    }
    
    // Add item to cart
    addToCart(product) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.qty = (existingItem.qty || 1) + 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.img,
                qty: 1
            });
        }
        
        this.setCart(cart);
        return cart;
    }
    
    // Remove item from cart
    removeFromCart(productId) {
        const cart = this.getCart().filter(item => item.id !== productId);
        this.setCart(cart);
        return cart;
    }
    
    // Update item quantity
    updateQuantity(productId, newQty) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            if (newQty <= 0) {
                return this.removeFromCart(productId);
            } else {
                item.qty = newQty;
                this.setCart(cart);
            }
        }
        
        return cart;
    }
    
    // Get total items in cart
    getTotalItems() {
        return this.getCart().reduce((total, item) => total + (item.qty || 1), 0);
    }
    
    // Get cart total
    getCartTotal() {
        return this.getCart().reduce((total, item) => {
            return total + (item.price * (item.qty || 1));
        }, 0);
    }
    
    // Update cart badge in UI
    updateCartBadge() {
        const count = this.getTotalItems();
        console.log('Updating cart badge with count:', count); // Debug log
        
        // Update all possible cart badge elements
        const badgeSelectors = [
            '.fa-shopping-cart + span',
            '#cart-badge', 
            '#mobile-cart-count', 
            '#desktop-cart-count',
            'span[id*="cart-count"]',
            'span[class*="cart"]'
        ];
        
        badgeSelectors.forEach(selector => {
            const badges = document.querySelectorAll(selector);
            badges.forEach(badge => {
                if (badge) {
                    badge.textContent = count.toString();
                    console.log('Updated badge:', selector, badge); // Debug log
                }
            });
        });
    }
    
    // Clear entire cart
    clearCart() {
        this.setCart([]);
        console.log('Cart cleared');
    }
    
    // Debug function to log cart state
    debugCart() {
        console.log('Current cart:', this.getCart());
        console.log('Total items:', this.getTotalItems());
        console.log('Cart total:', this.getCartTotal());
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Export for use in other files
window.cartManager = cartManager;
