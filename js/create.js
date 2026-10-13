
const form = document.getElementById("createForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const student = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        course: document.getElementById("course").value.trim()
    };

    try {
        const response = await fetch("/api/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });

        const result = await response.json();
        message.textContent = response.ok
            ? `${result.message} Student ID: ${result.id}`
            : result.message;
        
        if (response.ok) {
            form.reset();
        }
    } catch (error) {
        message.textContent = "Unable to connect to the server.";
    }
});
