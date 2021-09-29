const express = require("express");
const authRoutes = require("./routes/auth-routes");

const app = express();
const hostname = "localhost";
const port = 3000;

app.set("view engine", "ejs"); //set view engine to use .ejs files
app.use(express.static("./public")) //set style.css location

// Use auth-routes.
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.render("home");
});

app.listen(port, hostname, () => { // tell server to listen on set port on set host, in this case localhost and port 3000
    console.log(`server started on http://${hostname}:${port}`);
});