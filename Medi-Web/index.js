const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser"); // 
const csrf = require("csurf"); // CSRF protection middleware.
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const csrfMiddleware = csrf({
  cookie: true
}); // checks for required cookies
const path = require('path');
const hostname = "localhost";
const port = 3001;
const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.set("view engine", "ejs"); // set view engine to use .ejs files
app.use(express.static("./public")) // set css file location

app.use(bodyParser.json()); // used parse body of post request
app.use(cookieParser());
app.use(csrfMiddleware);

// All requests
app.all("*", (req, res, next) => { // sets XSRF cookie for any request.
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

app.get("/scripts/auth.js", function (req, res) {
  res.sendFile(path.join(__dirname, 'scripts', 'auth.js'));
});

// Login page
app.get("/login", (req, res) => {
  const sessionCookie = req.cookies.session || "";
  admin.auth().verifySessionCookie(sessionCookie, true).then(() => { // using an error to check if the user is trying to log in whilst already logged in, probably not the best way to do this.
      res.redirect("panel");
    })
    .catch((error) => {
      res.render("login");
    });
});


// Sign up
app.get("/signup", (req, res) => {
  const sessionCookie = req.cookies.session || "";
  admin.auth().verifySessionCookie(sessionCookie, true).then(() => { // using an error to check if the user is trying to sign up whilst logged in
      res.redirect("panel");
    })
    .catch((error) => {
      res.render("signup");
    });
});

// Patient Panel
app.get("/panel", function (req, res) {
  const sessionCookie = req.cookies.session || "";
  admin.auth().verifySessionCookie(sessionCookie, true).then(() => {
      res.render("panel", {
        loggedIn: true
      });
    })
    .catch((error) => {
      res.redirect("login");
    });
});

// Index
app.get("/", (req, res) => {
  const sessionCookie = req.cookies.session || "";
  admin.auth().verifySessionCookie(sessionCookie, true).then(() => {
      res.render("home", {
        loggedIn: true
      });
    })
    .catch((error) => {
      res.render("home", {
        loggedIn: false
      });
    });
});

// Post Login
app.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  admin.auth().createSessionCookie(idToken, {
    expiresIn
  }).then(
    (sessionCookie) => {
      const options = {
        maxAge: expiresIn,
        httpOnly: true
      };
      res.cookie("session", sessionCookie, options);
      res.end(JSON.stringify({
        status: "success"
      }));
    },
    (error) => {
      res.status(401).send("UNAUTHORIZED REQUEST!");
    }
  );

});

// Logout.
app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/");
});

// Index
app.get("/pricing", (req, res) => {
  const sessionCookie = req.cookies.session || "";
  admin.auth().verifySessionCookie(sessionCookie, true).then(() => {
      res.render("pricing", {
        loggedIn: true
      });
    })
    .catch((error) => {
      res.render("pricing", {
        loggedIn: false
      });
    });
});

app.listen(port, hostname, () => { // tell server to listen on set port on set host
  console.log(`server started on http://${hostname}:${port}`);
});