
const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const PORT = 3000;
const STUDENT_TABLE = "students3";

// Read JSON data sent by the frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Jawad123",
    database: "student_db3"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }
    console.log("Connected to MySQL!");
});

// Serve HTML, CSS and JavaScript files
app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));

app.get("/css/:filename", (req, res) => {
    const filename = req.params.filename;
    if (!/^[A-Za-z0-9_.-]+$/.test(filename)) {
        return res.status(400).send("Invalid file name.");
    }

    res.sendFile(path.join(__dirname, "css", filename));
});

app.get("/js/:filename", (req, res) => {
    const filename = req.params.filename;
    if (!/^[A-Za-z0-9_.-]+$/.test(filename)) {
        return res.status(400).send("Invalid file name.");
    }

    res.sendFile(path.join(__dirname, "js", filename));
});

// CREATE: Add a student
app.post("/api/students", (req, res) => {
    const { name, email, course } = req.body;

    if (!name || !email || !course) {
        return res.status(400).json({
            message: "Please fill in all fields."
        });
    }

    const sql =
        `INSERT INTO ${STUDENT_TABLE} (name, email, course) VALUES (?, ?, ?)`;

    db.query(sql, [name, email, course], (err, result) => {
        if (err) {
            console.error("CREATE STUDENT ERROR:", err);
            return res.status(500).json({
                message: err.message
            });
        }

        console.log("Student saved with ID:", result.insertId);

        res.status(201).json({
            message: "Student created successfully!",
            id: result.insertId
        });
    });
});

// READ: Search by student ID or name
app.get("/api/students/search", (req, res) => {
    const q = (req.query.q || "").trim();

    if (!q) {
        return res.status(400).json({
            message: "Enter a student ID or name."
        });
    }

    const sql = `
        SELECT * FROM ${STUDENT_TABLE}
        WHERE CAST(id AS CHAR) = ?
        OR name LIKE ?
        ORDER BY id
    `;

    db.query(sql, [q, `%${q}%`], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Search failed."
            });
        }

        res.json(results);
    });
});

// UPDATE: Edit a student
app.put("/api/students/:id", (req, res) => {
    const { name, email, course } = req.body;
    const id = req.params.id;

    if (!name || !email || !course) {
        return res.status(400).json({
            message: "Please fill in all fields."
        });
    }

    const sql = `
        UPDATE ${STUDENT_TABLE}
        SET name = ?, email = ?, course = ?
        WHERE id = ?
    `;

    db.query(sql, [name, email, course, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Update failed."
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Student not found or no changes made."
            });
        }

        res.json({ message: "Student updated successfully!" });
    });
});

// DELETE: Remove a student
app.delete("/api/students/:id", (req, res) => {
    const id = req.params.id;

    db.query(
        `DELETE FROM ${STUDENT_TABLE} WHERE id = ?`,
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Delete failed."
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Student not found."
                });
            }

            res.json({ message: "Student deleted successfully!" });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
