const express = require("express");
const fs = require("fs");
const path = require("path");

const basicAuth = require("express-basic-auth");
const bcrypt = require("bcrypt");

const app = express();


const axios = require('axios'); 
app.get('/rickandmorty/character/:id', (req, res) => {
  const characterId = req.params.id;
  axios.get(`https://rickandmortyapi.com/api/character/${characterId}`)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      console.log(error);
      res.send('An error occurred: ' + error.message);
    });
});

const port = 3000;

// Server configuration
// Enable JSON requests/responses
app.use(express.json());
// Enable form requests
app.use(express.urlencoded({ extended: true }));

// Enable EJS templates
app.set("views", "./views");
app.set("view engine", "ejs");

// Enable static files loading (like CSS files or even HTML)
app.use(express.static("public"));

// Enable cookie parsing (and writing)
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Auth


const clearPasswordAuthorizer = (username, password, cb) => {
  // Parse the CSV file: this is very similar to parsing students!
  parseCsvWithHeader("./users-clear.csv", (err, users) => {
    console.log(users);
    // Check that our current user belong to the list
    const storedUser = users.find((possibleUser) => {
      
      return basicAuth.safeCompare(username, possibleUser.username);
    });
    
    if (!storedUser || !basicAuth.safeCompare(password, storedUser.password)) {
      cb(null, false);
    } else {
      cb(null, true);
    }
  });
};


const encryptedPasswordAuthorizer = (username, password, cb) => {
  // Parse the CSV file: this is very similar to parsing students!
  parseCsvWithHeader("./users.csv", (err, users) => {
    // Check that our current user belong to the list
    const storedUser = users.find((possibleUser) => {
      // NOTE: a simple comparison with === is possible but less safe
      return basicAuth.safeCompare(possibleUser.username, username);
    });
    // NOTE: this is an example of using lazy evaluation of condition
    if (!storedUser) {
      // username not found
      cb(null, false);
    } else {
      // now we check the password
      // bcrypt handles the fact that storedUser password is encrypted
      // it is asynchronous, because this operation is long
      // so we pass the callback as the last parameter
      bcrypt.compare(password, storedUser.password, cb);
    }
  });
};

// Setup basic authentication
//app.use(
  //basicAuth({
    // Basic hard-coded version:
    //users: { admin: "supersecret" },
    // From environment variables:
    // users: { [process.env.ADMIN_USERNAME]: process.env.ADMIN_PASSWORD },
    // Custom auth based on a file
    //authorizer: clearPasswordAuthorizer,
    // Final auth, based on a file with encrypted passwords
    //authorizer: encryptedPasswordAuthorizer,
    // Our authorization schema needs to read a file: it is asynchronous
    //authorizeAsync: true,
    //challenge: true,
  //})
//);

/**
 * CSV parsing (for files with a header and 2 columns only)
 *
 * @example: "name,school\nOmar Souidi, EPF"
 * => [{ name: "Omar Souidi", school: "EPF"}]
 */
const parseCsvWithHeader = (filepath, cb) => {
  const rowSeparator = "\n";
  const cellSeparator = ",";
  // example based on a CSV file
  fs.readFile(filepath, "utf8", (err, data) => {
    const rows = data.split(rowSeparator);
    
    const [headerRow, ...contentRows] = rows;
    const header = headerRow.split(cellSeparator);

    const items = contentRows.map((row) => {
      const cells = row.split(cellSeparator);
      const item = {
        [header[0]]: cells[0],
        [header[1]]: cells[1],
      };
      return item;
    });
    return cb(null, items);
  });
};

const getStudentsFromCsvfile = (cb) => {
  // example based on a CSV file
  parseCsvWithHeader("./students.csv", cb);
};

const storeStudentInCsvFile = (student, cb) => {
  const csvLine = `\n${student.name},${student.school}`;
  
  console.log(csvLine);
  fs.writeFile("./students.csv", csvLine, { flag: "a" }, (err) => {
    cb(err, "ok");
  });
};

// UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/home.html"));
});


app.get("/students/data", (req, res) => {
  res.render("students-data");
});

app.get("/students", (req, res) => {
  getStudentsFromCsvfile((err, students) => {
    if (err) {
      console.error(err);
      res.send("ERROR");
    }
    res.render("students", {
      students,
    });
  });
});
// Alternative without CSV
app.get("/students-basic", (req, res) => {
  res.render("students", {
    students: [{ name: "Omar Souidi", school: "EPF" }],
  });
});
// A very simple page using an EJS template
app.get("/students-no-data", (req, res) => {
  res.render("students-no-data");
});

// Student create form
app.get("/students/create", (req, res) => {
  res.render("create-student");
});



// Form handlers
app.post("/students/create", (req, res) => {
  console.log(req.body);
  const student = req.body;
  storeStudentInCsvFile(student, (err, storeResult) => {
    if (err) {
      res.redirect("/students/create?error=1");
    } else {
      res.redirect("/students/create?created=1");
    }
  });
});

// JSON API

// Not real login but just a demo of setting an auth token
// using secure cookies
app.post("/api/login", (req, res) => {
  console.log("current cookies:", req.cookies);
  // We assume that you check if the user can login based on "req.body"
  // and then generate an authentication token
  const token = "FOOBAR";
  const tokenCookie = {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 1000),
  };
  res.cookie("auth-token", token, tokenCookie);
  res.send("OK");
});

app.get("/api/students", (req, res) => {
  getStudentsFromCsvfile((err, students) => {
    res.send(students);
  });
});

app.post("/api/students/create", (req, res) => {
  console.log(req.body);
  const student = req.body;
  storeStudentInCsvFile(student, (err, storeResult) => {
    if (err) {
      res.status(500).send("error");
    } else {
      res.send("ok");
    }
  });
});

//Exercise 1 exam code 


const csv = require('csv-parser');

app.get('/students/:id', function (req, res) {
    const id = req.params.id;
    const students = [];

    fs.createReadStream('students.csv')
        .pipe(csv())
        .on('data', (row) => {
            students.push(row);
        })
        .on('end', () => {
            // Use the ID as an index into the array
            const student = students[id - 1]; // Subtract 1 because array indexing starts at 0

            if (student) {
                res.render('student_details', { student: student });
            } else {
                res.status(404).send('Student not found');
            }
        });
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

