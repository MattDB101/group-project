const router = require("express").Router();

// Login page.
router.get("/login", (req, res) => {
    res.render("login", {
        user: req.user
    });
});

// Logout.
router.get("/logout", (req, res) => {
    res.send("logging out");
});

// oAuth w/ Google.
router.get("/google", (req, res) => {
    res.send("logging in with Google");
});

module.exports = router;