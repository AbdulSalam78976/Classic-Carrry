// Component Loader
class ComponentLoader {
    constructor() {
        this.componentsLoaded = false;
        this.init();
    }

    async init() {
        await this.loadComponents();
        this.componentsLoaded = true;

        // Dispatch custom event when components are loaded
        window.dispatchEvent(new CustomEvent('componentsLoaded'));
    }

    async loadComponents() {
        try {
            console.log('Loading components...');

            // Load header and footer in parallel
            const [headerResponse, footerResponse] = await Promise.all([
                fetch('components/header.html'),
                fetch('components/footer.html')
            ]);

            const [headerHtml, footerHtml] = await Promise.all([
                headerResponse.text(),
                footerResponse.text()
            ]);

            // Insert header
            const headerComponent = document.getElementById('header-component');
            if (headerComponent) {
                headerComponent.innerHTML = headerHtml;
                console.log('Header component loaded successfully');
            }

            // Insert footer
            const footerComponent = document.getElementById('footer-component');
            if (footerComponent) {
                footerComponent.innerHTML = footerHtml;
                console.log('Footer component loaded successfully');
            }

            // Setup mobile menu after components are loaded
            setTimeout(() => this.setupMobileMenu(), 100);

            // Update current year in footer
            setTimeout(() => this.updateCurrentYear(), 200);

        } catch (error) {
            console.error('Error loading components:', error);
            // Fallback - try again after a delay
            setTimeout(() => this.loadComponents(), 1000);
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

    updateCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
            console.log('Current year updated to:', new Date().getFullYear());
        } else {
            console.log('Current year element not found');
        }
    }
}

// Initialize component loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
});
