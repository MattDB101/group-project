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
        const {currentUser} = firebase.auth();
        update(currentUser)
    } else {
        console.log("No user");
    }
})

function update(user){
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
            addressSpan.textContent = address2 + ", " + address1 + ", " + city + ", " + region + ", " + zip + ", " + country
            document.getElementById("name").appendChild(nameSpan)
            document.getElementById("role").appendChild(roleSpan)
            document.getElementById("phone").appendChild(phoneSpan)
            document.getElementById("address").appendChild(addressSpan)
    }).catch((error) => window.location.replace("/details"));
}



