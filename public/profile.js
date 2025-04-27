// Handle profile data and password change
const userProfile = document.getElementById('user-profile');
const passwordChangeForm = document.getElementById('password-change-form');
const currentPasswordInput = document.getElementById('current-password');
const newPasswordInput = document.getElementById('new-password');
const passwordChangeMessage = document.getElementById('password-change-message');

const username = localStorage.getItem('loggedInUser');
if (!username) {
  window.location.href = 'login.html'; // Redirect to login if not logged in
}

// Fetch user profile data (you can customize this to fetch more data)
fetch(`https://website.loca.lt/api/users/${username}/profile`)
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      userProfile.textContent = `Welcome, ${data.username}!`;
    } else {
      userProfile.textContent = 'Failed to load profile.';
    }
  })
  .catch(err => {
    console.error('Profile fetch error:', err);
    userProfile.textContent = 'Error loading profile data.';
  });

// Handle password change
passwordChangeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const currentPassword = currentPasswordInput.value;
  const newPassword = newPasswordInput.value;

  fetch(`https://website.loca.lt/api/profile/password/${username}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      passwordChangeMessage.textContent = 'Password updated successfully!';
    } else {
      passwordChangeMessage.textContent = data.error || 'Failed to update password';
    }
  })
  .catch(err => {
    console.error('Password change error:', err);
    passwordChangeMessage.textContent = 'Server error. Please try again later.';
  });
});
