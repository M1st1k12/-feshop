document.addEventListener('DOMContentLoaded', () => {
    const cartItemsSummary = document.getElementById('cart-items-summary');
    const summaryTotalPrice = document.getElementById('summary-total-price');
    const cardNumberInput = document.getElementById('card-number');
    const expiryMonthInput = document.getElementById('expiry-month');
    const expiryYearInput = document.getElementById('expiry-year');
    const paymentForm = document.querySelector('.payment-form');
    const cardIcons = document.querySelectorAll('.card-icons i');
    const payButton = document.querySelector('.pay-button');


    function getCart() {
        const cartString = localStorage.getItem('coffeeCart');
        return cartString ? JSON.parse(cartString) : [];
    }


    function displayOrderSummary() {
        const cart = getCart();
        let totalSum = 0;

        cartItemsSummary.innerHTML = ''; 

        if (cart.length === 0) {
            cartItemsSummary.innerHTML = '<p>Ваш кошик порожній. Будь ласка, <a href="towar.html">оберіть напої</a>.</p>';
            payButton.disabled = true; 
            payButton.style.backgroundColor = '#ccc'; 
            payButton.style.cursor = 'not-allowed';
            summaryTotalPrice.textContent = '0.00 грн';
            return;
        } else {
            payButton.disabled = false; 
            payButton.style.backgroundColor = '#8B4513'; 
            payButton.style.cursor = 'pointer';
        }

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item-summary');

        
            const extrasText = (item.extras && item.extras.length > 0)
                ? `<span class="item-details-line">Додатково: ${item.extras.join(', ')}</span>`
                : '';
            const sugarText = item.sugarOption
                ? `<span class="item-details-line">Цукор: ${item.sugarOption}</span>`
                : '';
            const sizeText = item.size
                ? `<span class="item-details-line">Розмір: ${item.size}</span>`
                : '';
            const quantityText = item.quantity ? ` (${item.quantity} шт.)` : '';

         
            const itemPriceValue = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace('грн', '').replace(',', '.'));
            const validatedItemPrice = isNaN(itemPriceValue) ? 0 : itemPriceValue;

            const itemTotalPrice = validatedItemPrice * item.quantity;
            totalSum += itemTotalPrice;

            itemElement.innerHTML = `
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    ${sizeText}
                    ${sugarText}
                    ${extrasText}
                </div>
                <span class="item-price">${itemTotalPrice.toFixed(2)} грн</span>
            `;
            cartItemsSummary.appendChild(itemElement);
        });

        summaryTotalPrice.textContent = `${totalSum.toFixed(2)} грн`;
    }

   
    cardNumberInput.addEventListener('input', () => {
        let cardNumber = cardNumberInput.value.replace(/\s/g, ''); 
      
        cardNumber = cardNumber.replace(/(\d{4})/g, '$1 ').trim();
        cardNumberInput.value = cardNumber;

  
        if (cardNumber.length > 23) { 
            cardNumberInput.value = cardNumber.substring(0, 23);
        }

       
        cardIcons.forEach(icon => icon.classList.remove('active'));

       
        const firstDigit = cardNumber.charAt(0);
        const firstTwoDigits = cardNumber.substring(0, 2);
        const firstFourDigits = cardNumber.substring(0, 4);

        if (firstDigit === '4') { // Visa
            document.querySelector('[data-card-type="visa"]').classList.add('active');
        } else if (firstDigit === '5' && parseInt(firstTwoDigits) >= 51 && parseInt(firstTwoDigits) <= 55) { // Mastercard (51-55)
            document.querySelector('[data-card-type="mastercard"]').classList.add('active');
        } else if (firstTwoDigits === '34' || firstTwoDigits === '37') { // Amex
            document.querySelector('[data-card-type="amex"]').classList.add('active');
        } else if (firstFourDigits === '6011' || firstTwoDigits === '65' || (parseInt(firstFourDigits) >= 6440 && parseInt(firstFourDigits) <= 6499)) { // Discover
             document.querySelector('[data-card-type="discover"]').classList.add('active');
        } else if (parseInt(firstFourDigits) >= 3528 && parseInt(firstFourDigits) <= 3589) { // JCB
             document.querySelector('[data-card-type="jcb"]').classList.add('active');
        }
    });

    // --- 4. Валідація терміну дії картки ---
    const validateExpiryDate = () => {
        const currentYear = new Date().getFullYear() % 100; 
        const currentMonth = new Date().getMonth() + 1; 

        const inputMonth = parseInt(expiryMonthInput.value, 10);
        const inputYear = parseInt(expiryYearInput.value, 10);

        if (isNaN(inputMonth) || isNaN(inputYear) || inputMonth < 1 || inputMonth > 12) {
            expiryMonthInput.setCustomValidity('Некоректний місяць (MM)');
            return false;
        } else if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
            expiryYearInput.setCustomValidity('Термін дії картки минув');
            return false;
        } else {
            expiryMonthInput.setCustomValidity('');
            expiryYearInput.setCustomValidity('');
            return true;
        }
    };

    expiryMonthInput.addEventListener('input', () => {
        
        if (expiryMonthInput.value.length === 1 && parseInt(expiryMonthInput.value, 10) > 1) {
            expiryMonthInput.value = '0' + expiryMonthInput.value;
        }
        validateExpiryDate();
    });
    expiryYearInput.addEventListener('input', validateExpiryDate);


    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

       
        if (!paymentForm.checkValidity() || !validateExpiryDate()) {
            alert('Будь ласка, заповніть усі обов\'язкові поля коректно.');
            return;
        }

        
        const cardNumber = cardNumberInput.value.replace(/\s/g, '');
        const cardHolder = document.getElementById('card-holder').value;
        const expiryMonth = expiryMonthInput.value;
        const expiryYear = expiryYearInput.value;
        const cvv = document.getElementById('cvv').value;
        const email = document.getElementById('email').value;

        
        console.log('Дані для оплати (демо):', {
            cardNumber: '************' + cardNumber.slice(-4), 
            cardHolder,
            expiryMonth,
            expiryYear,
            cvv: '***', 
            email,
            totalPrice: summaryTotalPrice.textContent
        });

        alert('Оплата успішна!');

        
        localStorage.removeItem('coffeeCart'); 
        window.location.href = 'order-confirmation.html'; 
    });

    
    displayOrderSummary(); 
});