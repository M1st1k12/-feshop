document.addEventListener('DOMContentLoaded', () => {
    const coffeeBoxes = document.querySelectorAll('.coffee-box');
    const cartCountDisplay = document.getElementById('cart-count-display');

   
    function getCart() {
        const cartString = localStorage.getItem('coffeeCart');
        return cartString ? JSON.parse(cartString) : [];
    }

    
    function updateCartCountDisplay() {
        const cart = getCart();
        let totalItems = 0;
        cart.forEach(item => {
            totalItems += item.quantity;
        });
        cartCountDisplay.textContent = totalItems;
    }

    
    coffeeBoxes.forEach(box => {
        box.addEventListener('click', () => {
           
            const settingsPage = box.dataset.settingsPage;
            if (settingsPage) {
                
                window.location.href = settingsPage;
            }
        });
    });

    
    updateCartCountDisplay();
});