const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");

// Server setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use EJS templates
app.set("views", "./views");
app.set("view engine", "ejs");

// Serve static files (CSS, HTML, etc.)
app.use(express.static("public"));

// Serve HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/home.html"));
});

// Student model
const getStudentsFromCsvfile = (cb) => {
  const rowSeparator = "\n";
  const cellSeparator = ",";
  fs.readFile("./students.csv", "utf8", (err, data) => {
    if (err) {
      return cb(err, null);
    }
    const rows = data.split(rowSeparator);
    const [headerRow, ...contentRows] = rows;
    const header = headerRow.split(cellSeparator);

    const students = contentRows.map((row) => {
      const cells = row.split(cellSeparator);
      const student = {
        [header[0]]: cells[0],
        [header[1]]: cells[1],
      };
      return student;
    });
    return cb(null, students);
  });
};

const storeStudentInCsvFile = (student, cb) => {
  const csvLine = `\n${student.name},${student.school}`;
  console.log(csvLine);
  fs.writeFile("./students.csv", csvLine, { flag: "a" }, (err) => {
    cb(err, "ok");
  });
};

// User interface
app.get("/students", (req, res) => {
  getStudentsFromCsvfile((err, students) => {
    if (err) {
      console.error(err);
      return res.send("ERROR");
    }
    res.render("students", {
      students,
    });
  });
});
app.get("/students-basic", (req, res) => {
  res.render("students", {
    students: [{ name: "Omar Souidi", school: "EPF" }],
  });
});
app.get("/students/create", (req, res) => {
  res.render("create-student");
});
// Handle form submissions
app.post("/students/create", (req, res) => {
  console.log(req.body);
  const student = req.body;
  storeStudentInCsvFile(student, (err, storeResult) => {
    if (err) {
      console.error(err);
      return res.status(500).send("error");
    } else {
      return res.redirect("/students/create?created=1");
    }
  });
});

// JSON API
app.get("/api/students", (req, res) => {
  getStudentsFromCsvfile((err, students) => {
    if (err) {
      console.error(err);
      return res.status(500).send("error");
    }
    return res.send(students);
  });
});

app.post("/api/students/create", (req, res) => {
  console.log(req.body);
  const student = req.body;
  storeStudentInCsvFile(student, (err, storeResult) => {
    if (err) {
      console.error(err);
      return res.status(500).send("error");
    } else {
      return res.send("ok");
    }
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

