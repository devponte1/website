// Handle user display and logout
const userInfo = document.getElementById('user-info');
const logoutBtn = document.getElementById('logout-btn');
const profileLinkContainer = document.getElementById('profile-link-container');

const user = localStorage.getItem('loggedInUser');
if (user) {
  userInfo.textContent = `Logged in as ${user}`;
  logoutBtn.style.display = 'inline';

  // Display the profile link
  profileLinkContainer.innerHTML = `<a href="/users/${user}/profile">View Profile</a>`;
} else {
  userInfo.innerHTML = `<a href="login.html">Log In</a>`;
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  location.reload(); // Reload the page after logging out
});

// Fetch backend test message
fetch('https://website.loca.lt/api/hello')
  .then(res => res.text())
  .then(data => {
    document.getElementById('backend-message').textContent = data;
  })
  .catch(() => {
    document.getElementById('backend-message').textContent = 'Backend not reachable - Server might be offline.';
  });

// Fetch users for userboard 
fetch('https://website.loca.lt/api/users')
  .then(res => res.json())
  .then(data => {
    console.log('Received data:', data);

    if (data.success) {
      const board = document.getElementById('userboard');
      board.innerHTML = '';

      if (data.users && Array.isArray(data.users)) {
        data.users.forEach((user, index) => {
          const li = document.createElement('li');
          li.textContent = `${index + 1}. ${user.username}`;
          board.appendChild(li);
        });
      } else {
        console.error('No users found or invalid data format.');
        board.textContent = 'No users found.';
      }
    } else {
      console.error('Failed to load users');
      document.getElementById('userboard').textContent = 'Failed to load users.';
    }
  })
  .catch(err => {
    console.error('Fetch error:', err);
    document.getElementById('userboard').textContent = 'Error fetching users. - Server might be offline.';
  });
