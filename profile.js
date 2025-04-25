window.onload = function () {
    const profileContainer = document.getElementById("profile-container");
    const usernameElement = document.getElementById("username");
    const descriptionElement = document.getElementById("description");
    
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");

    if (!username) {
        profileContainer.innerHTML = "No username provided!";
        return;
    }

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
};
