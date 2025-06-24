document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const clearCartButton = document.getElementById('clear-cart');
    const checkoutButton = document.querySelector('.checkout-btn'); 

   
    function getCart() {
        const cartString = localStorage.getItem('coffeeCart');
        
        return cartString ? JSON.parse(cartString) : [];
    }

    
    function saveCart(cart) {
        localStorage.setItem('coffeeCart', JSON.stringify(cart));
        renderCart(); 
        
    }

    
    function renderCart() {
        const cart = getCart();
        cartItemsContainer.innerHTML = ''; 
        let total = 0;

        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Ваш кошик порожній.</p>';
            cartTotalElement.textContent = '0.00 грн';
            clearCartButton.style.display = 'none'; 
            checkoutButton.disabled = true; 
            checkoutButton.classList.add('disabled-btn'); 
            return;
        } else {
            
            clearCartButton.style.display = 'block';
            checkoutButton.disabled = false;
            checkoutButton.classList.remove('disabled-btn');
        }

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');

           
            const extrasText = (item.extras && item.extras.length > 0)
                ? `<span class="item-option">Додатково: ${item.extras.join(', ')}</span>`
                : '';
            const sugarText = item.sugarOption
                ? `<span class="item-option">Цукор: ${item.sugarOption}</span>`
                : '';
            const sizeText = item.size
                ? `<span class="item-option">Розмір: ${item.size}</span>`
                : '';

            
            const itemPriceValue = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace('грн', '').replace(',', '.'));
            
            
            const validatedItemPrice = isNaN(itemPriceValue) ? 0 : itemPriceValue;

            const itemTotalPrice = validatedItemPrice * item.quantity;
            total += itemTotalPrice;

            itemElement.innerHTML = `
                <div class="item-details">
                    <span class="item-name">${item.name}</span>
                    ${sizeText}
                    ${sugarText}
                    ${extrasText}
                    <span class="item-price">Ціна: ${validatedItemPrice.toFixed(2)} грн / шт.</span>
                </div>
                <div class="item-quantity-controls">
                    <button class="quantity-btn decrease-quantity" data-index="${index}">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn increase-quantity" data-index="${index}">+</button>
                    <button class="remove-item-btn" data-index="${index}">Видалити</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalElement.textContent = total.toFixed(2) + ' грн'; 
    }

   
    function updateCartItemQuantity(index, change) {
        const cart = getCart();
        if (cart[index]) {
            cart[index].quantity += change;
            if (cart[index].quantity <= 0) {
                
                cart.splice(index, 1);
            }
            saveCart(cart); 
        }
    }

   
    function removeItemFromCart(index) {
        const cart = getCart();
        if (cart[index]) {
           
            if (confirm(`Ви впевнені, що хочете видалити "${cart[index].name}" з кошика?`)) {
                cart.splice(index, 1);
                saveCart(cart); 
            }
        }
    }

    
    function clearCart() {
        if (confirm('Ви впевнені, що хочете очистити весь кошик?')) {
            localStorage.removeItem('coffeeCart');
            renderCart();
        }
    }

    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        const index = parseInt(target.dataset.index); 

        if (!isNaN(index)) { 
            if (target.classList.contains('increase-quantity')) {
                updateCartItemQuantity(index, 1);
            } else if (target.classList.contains('decrease-quantity')) {
                updateCartItemQuantity(index, -1);
            } else if (target.classList.contains('remove-item-btn')) {
                removeItemFromCart(index);
            }
        }
    });

    
    clearCartButton.addEventListener('click', clearCart);

   
    renderCart();
});