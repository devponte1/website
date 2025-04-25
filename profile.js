// profile.js
window.onload = function () {
    const profileContainer = document.getElementById("profile-container");
    const usernameElement = document.getElementById("username");
    const descriptionElement = document.getElementById("description");
    
    // Get the username from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");
  
    if (!username) {
      alert("No username provided in URL.");
      return;
    }
  
    // Fetch the user data from the API
    fetch(`/api/users/${username}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          profileContainer.innerHTML = `<p>Error: ${data.error}</p>`;
        } else {
          // Populate the HTML with the user data
          usernameElement.textContent = data.username;
          descriptionElement.textContent = data.description || "No description provided.";
        }
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        profileContainer.innerHTML = `<p>Failed to load profile.</p>`;
      });
  };
  