const maxNameLength = 20; // Change this to your desired maximum length

const usernameUpdated = document.getElementById("usernameUpdated");

usernameUpdated.addEventListener("keydown", (event) => {
  if (usernameUpdated.textContent.length >= maxNameLength && event.key !== "Backspace") {
    event.preventDefault();
  }
});
