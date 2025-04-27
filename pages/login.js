// Handle user login
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = usernameInput.value;
  const password = passwordInput.value;

  fetch('https://website.loca.lt/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem('loggedInUser', username); // Store the username
      window.location.href = 'index.html'; // Redirect to home page
    } else {
      errorMessage.textContent = data.error || 'Login failed';
    }
  })
  .catch(err => {
    console.error('Login error:', err);
    errorMessage.textContent = 'Server error. Please try again later.';
  });
});
