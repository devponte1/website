window.onload = function () {
    const profileContainer = document.getElementById("profile-container");
    const usernameElement = document.getElementById("username");
    const descriptionElement = document.getElementById("description");
    const usersListContainer = document.getElementById("users-list");

    const urlParams = new URLSearchParams(window.location.search);
    let username = urlParams.get("username");

    // If no username in the URL, fetch all users
    if (!username) {
        fetch("https://website.loca.lt/api/users") // Assuming this is your users API endpoint
            .then(response => response.json())
            .then(data => {
                if (data.success && data.users.length > 0) {
                    const users = data.users;
                    let usersHTML = "<ul>";
                    users.forEach(user => {
                        usersHTML += `<li><a href="?username=${user.username}">${user.username}</a></li>`;
                    });
                    usersHTML += "</ul>";
                    usersListContainer.innerHTML = usersHTML;
                } else {
                    usersListContainer.innerHTML = "No users found!";
                }
            });
    } else {
        // If username is provided, fetch user profile
        usernameElement.innerText = username;

        fetch(`https://website.loca.lt/api/users/${username}/profile`)
            .then(response => response.json())
            .then(data => {
                if (data.username) {
                    descriptionElement.value = data.description || "";
                } else {
                    profileContainer.innerHTML = "User not found!";
                }
            });

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
    }
};
