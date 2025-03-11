document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.querySelector('#login-btn');
  const emailInput = document.querySelector('#email');
  const passwordInput = document.querySelector('#password');
  const errorMessage = document.querySelector('#error-message');
  const cancelBtn = document.querySelector('#cancel');
  const registerBtn = document.querySelector('#register');

  registerBtn.addEventListener('click', () => {
    window.location.href = '/register'
  });

  cancelBtn.addEventListener('click', () => {
    window.location.href = '/'
  });

  loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const username = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      errorMessage.classList.remove('hidden');
      errorMessage.textContent = 'Ange både användarnamn och lösenord';
      return;
    }

    const credentials = btoa(`${username}:${password}`);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('authToken', data.token);
        window.location.href = '/';
      } else {
        throw new Error('Felaktiga inloggningsuppgifter');
      }
    } catch (error) {
      console.warn(error.message);
      errorMessage.textContent = 'Lösenord eller E-postadress fel';
      errorMessage.classList.remove('hidden');
    }
  });
});
