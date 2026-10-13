
const form = document.getElementById("editForm");
const message = document.getElementById("message");
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Load existing student details
async function loadStudent() {
    if (!id || !/^\d+$/.test(id)) {
        message.textContent = "Invalid student ID.";
        form.hidden = true;
        return;
    }

    try {
        const response = await fetch(
            "/api/students/search?q=" + encodeURIComponent(id)
        );
        const students = await response.json();

        if (!response.ok) {
            throw new Error(students.message || "Could not load student.");
        }

        const student = students.find(
            (item) => String(item.id) === id
        );

        if (!student) {
            throw new Error("Student not found.");
        }

        document.getElementById("id").value = student.id;
        document.getElementById("name").value = student.name;
        document.getElementById("email").value = student.email;
        document.getElementById("course").value = student.course;
    } catch (error) {
        message.textContent = error.message;
        form.hidden = true;
    }
}

loadStudent();

// Save edited details
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const student = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        course: document.getElementById("course").value.trim()
    };

    try {
        const response = await fetch(`/api/students/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Update failed.");
        }

        message.textContent = result.message;

        if (response.ok) {
            form.reset();
            document.getElementById("id").value = id;
        }
    } catch (error) {
        message.textContent = error.message;
    }
});
