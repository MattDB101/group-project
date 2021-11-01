function logOut() {
    firebase.auth().signOut().then(() => {
        console.log("User signed out.");
    })
}