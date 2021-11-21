const firebaseConfig = {
    apiKey: "AIzaSyD1lrk72djddDJAct0iJw0tlyFoRWb2Sn4",
    authDomain: "medicheck-group-project-24b44.firebaseapp.com",
    projectId: "medicheck-group-project-24b44",
    storageBucket: "medicheck-group-project-24b44.appspot.com",
    messagingSenderId: "844456570809",
    appId: "1:844456570809:web:b66fc74f80c4cfd9ab9068",
    measurementId: "G-VT2PKYZ32F"
};

firebase.initializeApp(firebaseConfig); // Initialize Firebase
const auth = firebase.auth();
const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true
})

nameSpan = document.createElement("span")
roleSpan = document.createElement("span")
phoneSpan = document.createElement("span")
addressSpan = document.createElement("p")



firebase.auth().onAuthStateChanged(user => {
    if (user) {
        const {
            currentUser
        } = firebase.auth();
        update(currentUser)
    } else {
        console.log("No user");
    }
})

function update(user) {
    db.collection("doctors").where("email", "==", user.email).get().then(snapshot => {
        const doc = snapshot.docs[0];
        firstName = doc.data().fname;
        lastName = doc.data().lname;
        role = doc.data().role;
        telephone = doc.data().tel;
        address1 = doc.data().add1;
        address2 = doc.data().add2;
        city = doc.data().city;
        region = doc.data().region;
        zip = doc.data().zip;
        country = doc.data().country;

        const name = firstName + " " + lastName;
        document.getElementById("welcome").innerHTML = "Welcome" + " " + name;

        nameSpan.textContent = name
        roleSpan.textContent = role
        phoneSpan.textContent = telephone
        addressSpan.textContent = address2 + " " + address1 + ", " + city + ", " + region + ", " + zip + ", " + country
        document.getElementById("name").appendChild(nameSpan)
        document.getElementById("role").appendChild(roleSpan)
        document.getElementById("phone").appendChild(phoneSpan)
        document.getElementById("address").appendChild(addressSpan)
    }).catch((error) => window.location.replace("/details"));
}


document.getElementById("addPatient").addEventListener("submit", (event) => {
    event.preventDefault();
    const patEmail = event.target.patientEmail.value;
    console.log(patEmail)
    var errMsg = document.getElementById("error");
    const {
        currentUser
    } = firebase.auth();

    db.collection("patient").where("email", "==", patEmail).get().then(snapshot => {
        const doc = snapshot.docs[0];
        patFname = doc.data().fname;
        patLName = doc.data().lname;
        patTelephone = doc.data().tel;
        patAddress1 = doc.data().add1;
        patAddress2 = doc.data().add2;
        patCity = doc.data().city;
        patRegion = doc.data().region;
        patZip = doc.data().zip;
        patCountry = doc.data().country;
    }).then(() => {
        (db.collection('doctors').doc(currentUser.email).collection('patients').add({
            fname: patFname,
            lname: patLName,
            tel: patTelephone,
            add1: patAddress1,
            add2: patAddress2,
            city: patCity,
            region: patRegion,
            zip: patZip,
            country: patCountry
        })
        )}
    )
});