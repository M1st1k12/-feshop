document.addEventListener('DOMContentLoaded', () => {
    const coffeeNameElement = document.getElementById('coffeeName');
    const baseCoffeePriceElement = document.getElementById('baseCoffeePrice');
    const totalCoffeePriceElement = document.getElementById('totalCoffeePrice');
    const addToCartButton = document.getElementById('addToCartWithSettings');

  
    const coffeeName = coffeeNameElement.dataset.baseName || coffeeNameElement.textContent; 
    const basePrice = parseFloat(baseCoffeePriceElement.textContent);

    let currentPrice = basePrice;

   
    function updateTotalPrice() {
        let newPrice = basePrice;

     
        const selectedSizeInput = document.querySelector('input[name="size"]:checked');
        if (selectedSizeInput) {
            newPrice += parseFloat(selectedSizeInput.dataset.priceMod || 0);
        }

      
        document.querySelectorAll('input[name="extra"]:checked').forEach(checkbox => {
            newPrice += parseFloat(checkbox.dataset.priceMod || 0);
        });

        totalCoffeePriceElement.textContent = newPrice.toFixed(2);
        currentPrice = newPrice;
    }

  
    updateTotalPrice();

   
    document.querySelectorAll('input[name="size"], input[name="extra"]').forEach(input => {
        input.addEventListener('change', updateTotalPrice);
    });

   
    function getCart() {
        const cartString = localStorage.getItem('coffeeCart');
        return cartString ? JSON.parse(cartString) : [];
    }

    
    function saveCart(cart) {
        localStorage.setItem('coffeeCart', JSON.stringify(cart));
    }

   
    addToCartButton.addEventListener('click', () => {
        let cart = getCart();

        const selectedSize = document.querySelector('input[name="size"]:checked').value;
        const selectedSugar = document.querySelector('input[name="sugar"]:checked').value;
        const selectedExtras = Array.from(document.querySelectorAll('input[name="extra"]:checked'))
                                     .map(checkbox => checkbox.value);

        
        let itemFullName = `${coffeeName} (${selectedSize}, ${selectedSugar}`;
        if (selectedExtras.length > 0) {
            itemFullName += `, ${selectedExtras.join(', ')}`;
        }
        itemFullName += `)`;

        const itemToAdd = {
            name: itemFullName,
            baseName: coffeeName, 
            price: currentPrice,
            quantity: 1,
            options: {
                size: selectedSize,
                sugar: selectedSugar,
                extras: selectedExtras
            }
        };

      
        const existingItem = cart.find(item =>
            item.baseName === itemToAdd.baseName &&
            item.options.size === itemToAdd.options.size &&
            item.options.sugar === itemToAdd.options.sugar &&
            
            JSON.stringify(item.options.extras.sort()) === JSON.stringify(itemToAdd.options.extras.sort())
        );

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push(itemToAdd);
        }

        saveCart(cart); 
        alert(`"${itemFullName}" додано до кошика за ${currentPrice.toFixed(2)} грн!`);
        window.location.href = 'towar.html'; 
    });
});