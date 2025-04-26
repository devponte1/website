window.onload = function () {
    const profileContent = document.getElementById("profile-content");
    const usernameElement = document.getElementById("username");
    const descriptionElement = document.getElementById("description");

    // Function to extract username from URL
    function getUsernameFromURL() {
        const path = window.location.pathname; // e.g. /profile.html/johndoe
        const parts = path.split('/');  // Split the path into parts
        return parts[parts.length - 1]; // Get the last part, which is the username
    }

    // Function to fetch profile data
    function fetchProfileData(username) {
        fetch(`https://api.example.com/users/${username}/profile`)
            .then(response => response.json())
            .then(data => {
                if (data.username) {
                    usernameElement.innerText = data.username;
                    descriptionElement.value = data.description || "No description provided";
                } else {
                    profileContent.innerHTML = "Profile not found!";
                }
            })
            .catch(error => {
                console.error("Error fetching profile:", error);
                profileContent.innerHTML = "Error loading profile!";
            });
    }

    // Set the username from the URL and load the profile
    const username = getUsernameFromURL();
    if (username) {
        fetchProfileData(username);
    }

    // Handle the Save Description button
    document.getElementById("save-description").addEventListener("click", () => {
        const newDescription = descriptionElement.value;
        fetch(`https://api.example.com/users/${username}/update-description`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ description: newDescription })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Description updated!");
            } else {
                alert("Error updating description.");
            }
        })
        .catch(error => console.error("Error saving description:", error));
    });
};
