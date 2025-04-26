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

// Fetch and display the backend message
fetch('https://website.loca.lt/api/hello')  // Make sure this API is correct for your backend
  .then(res => res.text())  // Assuming the backend message is a plain text response
  .then(data => {
    backendMessage.textContent = data;  // Display the backend message
  })
  .catch(() => {
    backendMessage.textContent = 'Backend not reachable - Server might be offline.';
  });
