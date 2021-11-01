document.getElementById("login").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    var errMsg = document.getElementById("error");
    firebase.auth().signInWithEmailAndPassword(email, password).then(({
        user
    }) => {
        var emailVerified = user.emailVerified;
        if (emailVerified == true) {
            return user.getIdToken().then((idToken) => {
                return fetch("/sessionLogin", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                    },
                    body: JSON.stringify({
                        idToken
                    }),
                });
            }).then(() => {
                window.location.assign("/panel");
            })
        } else {
            errMsg.innerHTML = "Account not verified, check your email.";
            errMsg.style.display = "block";
            console.log("Not Verified")
            logOut()
        }
    }).catch(err => {
        if (err.code == "auth/user-not-found") {
            errMsg.innerHTML = "Email not linked to a user.";
            errMsg.style.display = "block";
            console.log("Wrong email!")
        } else if (err.code == "auth/wrong-password") {
            errMsg.innerHTML = "Incorrect password.";
            errMsg.style.display = "block";
            console.log("Wrong email!")
        } else if (err.code == "auth/too-many-requests") {
            errMsg.innerHTML = "Too many requests, please try again later.";
            errMsg.style.display = "block";
            console.log("Too many requests!")
        } else {
            errMsg.innerHTML = err.message;
            errMsg.style.display = "block";
            console.log("Unknown Error");
        }
    });
    return false;
});

document.getElementById("googleLogin").addEventListener("click", GoogleLogin)

let provider = new firebase.auth.GoogleAuthProvider()

function GoogleLogin() {
    console.log("Logging in with Google.")
    firebase.auth().signInWithPopup(provider).then(({
        user
    }) => {
        var emailVerified = user.emailVerified;
        if (emailVerified == true) {
            return user.getIdToken().then((idToken) => {
                return fetch("/sessionLogin", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                    },
                    body: JSON.stringify({
                        idToken
                    }),
                });
            }).then(() => {
                window.location.assign("/panel");
            })
        } else {
            errMsg.innerHTML = "Account not verified, check your email.";
            errMsg.style.display = "block";
            console.log("Not Verified")
            logOut()
        }
    })
}
