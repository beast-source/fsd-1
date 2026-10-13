
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

            const edit = document.createElement("button");
            edit.textContent = "Edit";
            edit.addEventListener("click", () => {
                window.location.href = "edit.html?id=" + student.id;
            });

            const del = document.createElement("button");
            del.textContent = "Delete";
            del.className = "delete-btn";

            del.addEventListener("click", async () => {
                const yes = confirm(
                    `Would you like to delete student ID ${student.id}?`
                );

                if (!yes) return;

                try {
                    const deleteResponse = await fetch(
                        `/api/students/${student.id}`,
                        { method: "DELETE" }
                    );

                    const data = await deleteResponse.json();

                    if (!deleteResponse.ok) {
                        throw new Error(data.message || "Delete failed.");
                    }

                    alert(data.message);
                    form.requestSubmit();
                } catch (error) {
                    message.textContent = error.message;
                }
            });

            card.appendChild(edit);
            card.appendChild(del);
            results.appendChild(card);
        });
    } catch (error) {
        message.textContent = error.message;
    }
});
