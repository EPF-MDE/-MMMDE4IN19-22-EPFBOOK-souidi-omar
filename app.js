const express = require("express");
const app = express();
const port = 3000;
// https://nodejs.org/api/fs.html
const fs = require("fs");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/students", (req, res) => {
  // basic example: we send hard-coded data
  res.send([
    { name: "Omar Souidi", school: "EPF" },
    { name: "Luka Modric", school: "Real Madrid" },
    { name: "Harry Potter", school: "Poudlard" },
  ]);
});

app.get("/students-csv", (req, res) => {
  fs.readFile("./students.csv", "utf8", (err, data) => {
    res.send(data);
  });
});

app.get("/students-csv-parsed", (req, res) => {
  const rowSeparator = "\n";
  const cellSeparator = ",";
  
  fs.readFile("./students.csv", "utf8", (err, data) => {
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
    res.send(students);
  });
});

app.use(express.json());
app.post("/students/create", (req, res) => {
  console.log(req.body);
  const csvLine = `\n${req.body.name},${req.body.school}`;
  console.log(csvLine);
  const stream = fs.writeFile(
    "./students.csv",
    csvLine,
    { flag: "a" },
    (err) => {
      res.send("ok");
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
