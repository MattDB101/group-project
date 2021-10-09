document.getElementById("signup").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(({
        user
    }) => {
        sendVerificationEmail();
    }).then(() => {
        alert("Check your email to confirm your account before signing in.")
        window.location.assign("/");
    }).catch(err => {
        var errMsg = document.getElementById("error");
        if (err.code == "auth/invalid-email") {
            errMsg.innerHTML = "Not a valid email.";
            errMsg.style.display = "block";
            console.log("Not an email!")
        } else if (err.code == "auth/email-already-exists") {
            errMsg.innerHTML = "Email already in use.";
            errMsg.style.display = "block";
            console.log("Email already in use.")
        } else if (err.code == "auth/weak-password") {
            errMsg.innerHTML = "Enter a stronger password.";
            errMsg.style.display = "block";
            console.log("Weak password!")
        } else {
            errMsg.innerHTML = err.message;
            errMsg.style.display = "block";
            console.log("Unknown Error");
        }
    });
    return false;
});

const sendVerificationEmail = () => {
    auth.currentUser.sendEmailVerification() // Built in firebase function responsible for sending the verification email
        .then(() => {
            console.log('Verification Email Sent Successfully !');

        })
        .catch(error => {
            console.error(error);
        })
}

