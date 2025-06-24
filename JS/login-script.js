document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageDiv = document.getElementById('message');

 
    function displayMessage(text, isError = false) {
        messageDiv.textContent = text;
        messageDiv.style.color = isError ? 'red' : 'green';
        messageDiv.style.marginTop = '15px';
        messageDiv.style.fontWeight = 'bold';
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        
        const foundUser = existingUsers.find(user => user.email === email && user.password === password);

        if (foundUser) {
           
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            displayMessage('Вхід успішний! Перенаправляємо на сторінку профілю...', false);
            
            setTimeout(() => {
                window.location.href = 'towar.html'; 
            }, 1500);
        } else {
            displayMessage('Невірний Email або пароль. Спробуйте ще раз.', true);
        }
    });
});