// Handle user signup
const signupForm = document.getElementById('signup-form');
const signupUsernameInput = document.getElementById('signup-username');
const signupPasswordInput = document.getElementById('signup-password');
const signupErrorMessage = document.getElementById('signup-error-message');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = signupUsernameInput.value;
  const password = signupPasswordInput.value;

  fetch('https://website.loca.lt/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      window.location.href = 'login.html'; // Redirect to login page after signup
    } else {
      signupErrorMessage.textContent = data.error || 'Signup failed';
    }
  })
  .catch(err => {
    console.error('Signup error:', err);
    signupErrorMessage.textContent = 'Server error. Please try again later.';
  });
});
