document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const messageDiv = document.getElementById('message');

   
    function displayMessage(text, isError = false) {
        messageDiv.textContent = text;
        messageDiv.style.color = isError ? 'red' : 'green';
        messageDiv.style.marginTop = '15px';
        messageDiv.style.fontWeight = 'bold';
    }

    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

       
        if (password.length < 6) {
            displayMessage('Пароль має бути не менше 6 символів.', true);
            return;
        }

        if (password !== confirmPassword) {
            displayMessage('Паролі не співпадають.', true);
            return;
        }

      
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const emailExists = existingUsers.some(user => user.email === email);

        if (emailExists) {
            displayMessage('Користувач з таким Email вже зареєстрований.', true);
            return;
        }

       
        const user = {
            name: name,
            email: email,
            password: password 
        };

        existingUsers.push(user);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
        
       
        localStorage.setItem('currentUser', JSON.stringify(user));

        displayMessage('Реєстрація успішна! Перенаправляємо на сторінку профілю...', false);

        
        setTimeout(() => {
            window.location.href = 'towar.html'; 
        }, 1500); 
    });
});