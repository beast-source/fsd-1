
const form = document.getElementById("searchForm");
const results = document.getElementById("results");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const q = document.getElementById("search").value.trim();
    results.replaceChildren();
    message.textContent = "Searching...";

    try {
        const response = await fetch(
            "/api/students/search?q=" + encodeURIComponent(q)
        );
        const students = await response.json();

        if (!response.ok) {
            throw new Error(students.message || "Search failed.");
        }

        message.textContent = students.length
            ? `Found ${students.length} student(s).`
            : "No matching students found.";

        students.forEach((student) => {
            const card = document.createElement("div");
            card.className = "student-card";

            const heading = document.createElement("h3");
            heading.textContent = "Student ID: " + student.id;
            card.appendChild(heading);

            ["name", "email", "course"].forEach((field) => {
                const p = document.createElement("p");
                p.textContent =
                    field.charAt(0).toUpperCase() + field.slice(1) +
                    ": " + student[field];
                card.appendChild(p);
            });

            results.appendChild(card);
        });
    } catch (error) {
        message.textContent = error.message;
    }
});
