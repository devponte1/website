window.onload = function () {
    const profileContainer = document.getElementById("profile-container");
    const usernameElement = document.getElementById("username");
    const descriptionElement = document.getElementById("description");

    // Function to get the username from the URL path
    function getUsernameFromPath() {
        const path = window.location.pathname; // Gets the full path e.g. '/profile.html/johndoe'
        const username = path.split('/').pop(); // Gets the last part of the path, which will be the username
        return username;
    }

    const username = getUsernameFromPath();

    if (username) {
        usernameElement.innerText = username; // Display the username in the profile

        // Fetch user profile data based on username
        fetch(`https://website.loca.lt/api/users/${username}/profile`)
            .then(response => response.json())
            .then(data => {
                if (data.username) {
                    descriptionElement.value = data.description || "";
                } else {
                    profileContainer.innerHTML = "User not found!";
                }
            })
            .catch(error => {
                console.error("Error fetching profile:", error);
                profileContainer.innerHTML = "Error loading profile!";
            });

        // Save the description when the user clicks the button
        document.getElementById("save-description").addEventListener("click", () => {
            const newDescription = descriptionElement.value;

            fetch(`https://website.loca.lt/api/profile/${username}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ description: newDescription }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Description updated!");
                } else {
                    alert("Error updating description.");
                }
            });
        });
    } else {
        profileContainer.innerHTML = "No username provided!";
    }
};
