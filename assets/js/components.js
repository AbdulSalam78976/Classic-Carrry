// Component Loader
class ComponentLoader {
    constructor() {
        this.init();
    }
    
    async init() {
        await this.loadComponents();
    }
    
    async loadComponents() {
        try {
            // Load header
            const headerResponse = await fetch('components/header.html');
            const headerHtml = await headerResponse.text();
            const headerComponent = document.getElementById('header-component');
            if (headerComponent) {
                headerComponent.innerHTML = headerHtml;
                console.log('Header component loaded successfully');
            }
            
            // Load footer
            const footerResponse = await fetch('components/footer.html');
            const footerHtml = await footerResponse.text();
            const footerComponent = document.getElementById('footer-component');
            if (footerComponent) {
                footerComponent.innerHTML = footerHtml;
                console.log('Footer component loaded successfully');
            }
            
            // Setup mobile menu after components are loaded
            this.setupMobileMenu();
            
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }
    
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('open');
                mobileMenuBtn.classList.toggle('open');
            });
        }
    }
}

// Initialize component loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
});
