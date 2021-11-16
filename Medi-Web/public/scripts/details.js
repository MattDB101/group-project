const firebaseConfig = {
    apiKey: "AIzaSyD1lrk72djddDJAct0iJw0tlyFoRWb2Sn4",
    authDomain: "medicheck-group-project-24b44.firebaseapp.com",
    projectId: "medicheck-group-project-24b44",
    storageBucket: "medicheck-group-project-24b44.appspot.com",
    messagingSenderId: "844456570809",
    appId: "1:844456570809:web:b66fc74f80c4cfd9ab9068",
    measurementId: "G-VT2PKYZ32F"
};

const form = document.getElementById("docDetails")


firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true
})

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        const {
            currentUser
        } = firebase.auth();
        console.log('Currently logged in user', currentUser);
        const str = 'Hello' + ' ' + user.email;
        console.log(str)
    } else {
        console.log("No user");
    }
})


form.addEventListener("submit", (event) => {
    event.preventDefault();

    const {
        currentUser
    } = firebase.auth();

    db.collection("doctors").where("email", "==", currentUser.email).get().then(snapshot => {
        snapshot.forEach((doc) => {
            doc.ref.delete().then(() => {
                console.log("Document successfully deleted!");
            }).catch(function (error) {
                console.error("Error removing document: ", error);
            });
        });
    })
    
    setTimeout(function() {
        db.collection("doctors").add({
            email: currentUser.email,
            fname: form.fname.value,
            lname: form.lname.value,
            role: form.role.value,
            tel: form.tel.value,
            add1: form.address.value,
            add2: form.address2.value,
            city: form.city.value,
            region: form.region.value,
            zip: form.zip.value,
            country: form.country.value,
    
        })
        console.log("Document successfully added!");
        window.location.replace("/panel")
    }, (3 * 100));

    

})
