// /userinfo.js

// Handle user info and logout
const userInfo = document.getElementById('user-info');
const logoutBtn = document.getElementById('logout-btn');
const backendMessage = document.getElementById('backend-message');  // Backend message element

// Check if the user is logged in
const user = localStorage.getItem('loggedInUser');
if (user) {
  userInfo.textContent = `Logged in as ${user}`;
  logoutBtn.style.display = 'inline';
} else {
  userInfo.innerHTML = `<a href="login.html">Log In</a>`;
}

// Log out logic
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  location.reload();
});


