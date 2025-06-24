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
        const slides = box.querySelectorAll('.card-slide');
        const prevButton = box.querySelector('.card-slide-prev');
        const nextButton = box.querySelector('.card-slide-next');
        let currentSlideIndex = 0; 

        
        const showCardSlide = (index) => {
            
            if (index >= slides.length) {
                currentSlideIndex = 0;
            } else if (index < 0) {
                currentSlideIndex = slides.length - 1; 
            } else {
                currentSlideIndex = index;
            }

          
            slides.forEach(slide => slide.classList.remove('active'));

            
            slides[currentSlideIndex].classList.add('active');
        };

        
        if (prevButton) {
            prevButton.addEventListener('click', (e) => {
                e.stopPropagation(); 
                showCardSlide(currentSlideIndex - 1);
            });
        }

       
        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.stopPropagation(); 
                showCardSlide(currentSlideIndex + 1);
            });
        }

        
        showCardSlide(0);

        
        box.addEventListener('click', (event) => {
           
            if (!event.target.closest('.card-slide-prev') && !event.target.closest('.card-slide-next')) {
                const settingsPage = box.dataset.settingsPage;
                if (settingsPage) {
                    window.location.href = settingsPage;
                }
            }
        });
    });

  
    updateCartCountDisplay();
});