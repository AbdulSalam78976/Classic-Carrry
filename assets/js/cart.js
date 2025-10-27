// Cart Management Utilities
class CartManager {
    constructor() {
        this.cartKey = 'cc_cart';
        this.deliveryCharge = 300; // Fixed delivery charge in Rs
        this.init();
    }
    
    init() {
        // Check and fix cart data on initialization
        this.fixCart();
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
        try {
            const cart = this.getCart();
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.qty = (existingItem.qty || 1) + 1;
                console.log(`Increased quantity for ${product.name} to ${existingItem.qty}`);
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    img: product.img,
                    qty: 1
                });
                console.log(`Added new item to cart: ${product.name}`);
            }
            
            this.setCart(cart);
            return cart;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return this.getCart();
        }
    }
    
    // Remove item from cart
    removeFromCart(productId) {
        const cart = this.getCart().filter(item => item.id !== productId);
        this.setCart(cart);
        return cart;
    }
    
    // Update item quantity
    updateQuantity(productId, newQty) {
        try {
            const cart = this.getCart();
            const item = cart.find(item => item.id === productId);
            
            if (item) {
                if (newQty <= 0) {
                    return this.removeFromCart(productId);
                } else {
                    item.qty = Math.max(1, parseInt(newQty) || 1);
                    this.setCart(cart);
                    console.log(`Updated quantity for ${productId} to ${item.qty}`);
                }
            } else {
                console.warn(`Item ${productId} not found in cart`);
            }
            
            return cart;
        } catch (error) {
            console.error('Error updating quantity:', error);
            return this.getCart();
        }
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
    
    // Get delivery charge (free if order total >= 4000)
    getDeliveryCharge() {
        if (this.getCart().length === 0) return 0;
        const cartTotal = this.getCartTotal();
        return cartTotal >= 4000 ? 0 : this.deliveryCharge;
    }
    
    // Check if order qualifies for free delivery
    qualifiesForFreeDelivery() {
        return this.getCartTotal() >= 4000;
    }
    
    // Get total including delivery
    getTotalWithDelivery() {
        return this.getCartTotal() + this.getDeliveryCharge();
    }
    
    // Update cart badge in UI
    updateCartBadge() {
        const count = this.getTotalItems();
        console.log('Updating cart badge with count:', count);
        
        // Wait a bit for DOM to be ready
        setTimeout(() => {
            // Update cart badge
            const cartBadge = document.getElementById('cart-badge');
            if (cartBadge) {
                cartBadge.textContent = count.toString();
                if (count > 0) {
                    cartBadge.classList.remove('hidden');
                    cartBadge.classList.add('added');
                    setTimeout(() => cartBadge.classList.remove('added'), 600);
                } else {
                    cartBadge.classList.add('hidden');
                }
                console.log('Cart badge updated:', count);
            } else {
                console.log('Cart badge element not found');
            }
            
            // Update any other cart count elements
            const otherBadges = document.querySelectorAll('[id*="cart-count"], [class*="cart-count"]');
            otherBadges.forEach(badge => {
                badge.textContent = count.toString();
            });
        }, 100);
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
        console.log('Raw localStorage:', localStorage.getItem(this.cartKey));
    }
    
    // Fix corrupted cart data
    fixCart() {
        try {
            const rawCart = localStorage.getItem(this.cartKey);
            console.log('Raw cart data:', rawCart);
            
            if (!rawCart) {
                console.log('No cart data found, initializing empty cart');
                this.setCart([]);
                return;
            }
            
            const cart = JSON.parse(rawCart);
            if (!Array.isArray(cart)) {
                console.log('Cart data is not an array, resetting');
                this.setCart([]);
                return;
            }
            
            // Validate each item
            const validCart = cart.filter(item => {
                return item && 
                       typeof item.id === 'string' && 
                       typeof item.name === 'string' && 
                       typeof item.price === 'number' && 
                       typeof item.img === 'string';
            });
            
            if (validCart.length !== cart.length) {
                console.log('Found invalid cart items, cleaning up');
                this.setCart(validCart);
            }
            
            console.log('Cart validation complete, valid items:', validCart.length);
            
        } catch (error) {
            console.error('Error fixing cart:', error);
            this.setCart([]);
        }
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Export for use in other files
window.cartManager = cartManager;
