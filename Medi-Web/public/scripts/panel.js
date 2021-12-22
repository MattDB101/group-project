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
addressSpan = document.createElement("span")
const patList = document.querySelector('#pat-list');


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

    db.collection('doctors').doc(user.email).collection('patients').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            let li = document.createElement('li');
            let name = document.createElement('span');
            let email = document.createElement('span');
            email.style.display = "block"
            let tel = document.createElement('span');
            tel.style.display = "block"
            let add = document.createElement('span');
            add.style.display = "block"

            li.setAttribute('data-id', doc.id);

            add.textContent = doc.data().add2 + " " + doc.data().add1 + " " + doc.data().city
            name.textContent = doc.data().fname + " " + doc.data().lname
            email.textContent = doc.data().email;
            tel.textContent = doc.data().tel;

            li.appendChild(name);
            li.appendChild(email);
            li.appendChild(tel);
            li.appendChild(add);
            newlink = document.createElement('a');
            newlink.innerHTML = 'Delete';
            newlink.setAttribute('title', 'Delete');
            newlink.setAttribute('href', 'javascript:void(0)');
            li.appendChild(newlink);

            patList.appendChild(li);

            // deleteing data
            newlink.addEventListener("click", (e) => {
                e.stopPropagation()
                let id = e.target.parentElement.getAttribute("data-id")
                console.log(id)
                db.collection('doctors').doc(user.email).collection('patients').doc(id).delete();
                location.reload()
            })
        });
    });
}


document.getElementById("addPatient").addEventListener("submit", (event) => {
    event.preventDefault();
    flag = false
    const patEmail = event.target.patientEmail.value;
    console.log(patEmail)
    var errMsg = document.getElementById("error");
    const {
        currentUser
    } = firebase.auth();

    db.collection('doctors').doc(currentUser.email).collection('patients').where("email", "==", patEmail).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            //doc.ref.delete()
            flag = true
            errMsg.innerHTML = "You already own this patient";
            errMsg.style.display = "block";

        })
    }).then(() => {
        if (flag) {
            return
        }
        let patFname, patLName, patTelephone, patAddress1, patAddress2, patCity, patRegion, patZip, patCountry, patWallet, age, ca, chol, cp, exang, fbs, oldpeak, restecg, sex, slope, target, thal, thalach, trestbps = "Not Given."
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
            patWallet = doc.data().wallet;
        }).then(() => {
            if (flag) {
                return
            }
            (db.collection('doctors').doc(currentUser.email).collection('patients').doc(patEmail).set({
                fname: patFname,
                lname: patLName,
                email: patEmail,
                tel: patTelephone,
                add1: patAddress1,
                add2: patAddress2,
                city: patCity,
                region: patRegion,
                zip: patZip,
                country: patCountry,
                wallet: patWallet
            }))
        }).then(() => {
            if (flag) {
                return
            }
            db.collection('patient').doc(patEmail).collection('diseases').get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    if (doc.id == "alzheimers") { // alzheimers when its added
                        (db.collection('doctors').doc(currentUser.email).collection('patients').doc(patEmail).collection("diseases").doc("alzheimers").set({
                            age: doc.data().age,
                            asf: doc.data().asf,
                            cdr: doc.data().cdr,
                            educ: doc.data().educ,
                            etiv: doc.data().etiv,
                            group: doc.data().group,
                            hand: doc.data().hand,
                            mF: doc.data().mF,
                            mmse: doc.data().mmse,
                            mrDelay: doc.data().mrDelay,
                            nwbv: doc.data().nwbv,
                            ses: doc.data().ses,
                            visit: doc.data().visit,
                        }))

                    }

                    if (doc.id == "diabetes") { // diabetes when its added
                        (db.collection('doctors').doc(currentUser.email).collection('patients').doc(patEmail).collection("diseases").doc("diabetes").set({
                            age: doc.data().age,
                            bloodpressure: doc.data().bloodpressure,
                            bmi: doc.data().bmi,
                            dbf: doc.data().dbf,
                            glucose: doc.data().glucose,
                            insulin: doc.data().insulin,
                            pregnancies: doc.data().pregnancies,
                            skinthickness: doc.data().skinthickness,
                            target: doc.data().target,
                        }))
                    }

                    if (doc.id == "heart disease") { // Heart disease
                        (db.collection('doctors').doc(currentUser.email).collection('patients').doc(patEmail).collection("diseases").doc("heart disease").set({
                            age: doc.data().age,
                            ca: doc.data().ca,
                            chol: doc.data().chol,
                            cp: doc.data().cp,
                            exang: doc.data().exang,
                            fbs: doc.data().fbs,
                            oldpeak: doc.data().oldpeak,
                            restecg: doc.data().restecg,
                            sex: doc.data().sex,
                            slope: doc.data().slope,
                            target: doc.data().target,
                            thal: doc.data().thal,
                            thalach: doc.data().thalach,
                            trestbps: doc.data().trestbps,
                        }))
                    }
                })
            })

        }).then(() => {
            let name = patFname + " " + patLName
            let addr = patAddress1 + " " + patAddress2 + " " + patCity + " " + patRegion + " " + patZip + " " + patCountry
            let email = patEmail
            let tel = patTelephone
            let wallet = patWallet
            console.log("Pushing to blockchain: ")
            console.log(name)
            console.log(addr)
            console.log(email)
            console.log(tel)
            console.log(wallet)

            App.createPatient(name, addr, email, tel, wallet);
            //location.reload()
        }).catch(err => {
            var errMsg = document.getElementById("error");
            errMsg.innerHTML = "Email not linked to a user.";
            errMsg.style.display = "block";
            console.log("Wrong email!")
        })
    })
});

function exportCSV() {
    const {
        currentUser
    } = firebase.auth();
    const data = [];
    const arrofArr = [];
    disseaseArr = [];
    db.collection('doctors').doc(currentUser.email).collection('patients').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            var fName, lName, tel, email, add1, add2, city, region, zip, country, wallet
            fName = lName = tel = email = add1 = add2 = city = region = zip = country = wallet = "Not Given";
            var patArr = [];
            fName = doc.data().fname
            lName = doc.data().lname
            add1 = doc.data().add1
            add2 = doc.data().add2
            city = doc.data().city
            email = doc.data().email;
            tel = doc.data().tel;
            region = doc.data().region;
            zip = doc.data().zip;
            country = doc.data().country;
            wallet = doc.data().wallet;
            patArr.push(fName, lName, tel, email, add1, add2, city, region, zip, country, wallet)
            arrofArr.push(patArr);
        })
    }).then(() => {
        for (let i = 0; i < arrofArr.length; i++) {
            db.collection('doctors').doc(currentUser.email).collection('patients').doc(arrofArr[i][3]).collection('diseases').get().then(snapshot => {
                var age, asf, cdr, educ, etiv, group, hand, mF, mmse, mrDelay, nwbv, ses, visit, bloodpressure, bmi, dbf, glucose, insulin, pregnancies, skinthickness, ca, chol, cp, exang, fbs, oldpeak, restecg, sex, slope, target, thal, thalach, trestbps
                age = asf = cdr = educ = etiv = group = hand = mF = mmse = mrDelay = nwbv = ses = visit = bloodpressure = bmi = dbf = glucose = insulin = pregnancies = skinthickness = ca = chol = cp = exang = fbs = oldpeak = restecg = sex = slope = target = thal = thalach = trestbps = "Not Given";
                snapshot.docs.forEach(doc => {
                    if (doc.id == "alzheimers") { // alzheimers
                        age = doc.data().age;
                        asf = doc.data().asf;
                        cdr = doc.data().cdr;
                        educ = doc.data().educ;
                        etiv = doc.data().etiv;
                        group = doc.data().group;
                        hand = doc.data().hand;
                        mF = doc.data().mF;
                        mmse = doc.data().mmse;
                        mrDelay = doc.data().mrDelay;
                        nwbv = doc.data().nwbv;
                        ses = doc.data().ses;
                        visit = doc.data().visit;

                    }

                    if (doc.id == "diabetes") { // diabetes when its added
                        age = doc.data().age;
                        bloodpressure = doc.data().bloodpressure;
                        bmi = doc.data().bmi;
                        dbf = doc.data().dbf;
                        glucose = doc.data().glucose;
                        insulin = doc.data().insulin;
                        pregnancies = doc.data().pregnancies;
                        skinthickness = doc.data().skinthickness;
                        target = doc.data().target;


                    }

                    if (doc.id == "heart disease") { // Heart disease
                        age = doc.data().age;
                        ca = doc.data().ca;
                        chol = doc.data().chol;
                        cp = doc.data().cp;
                        exang = doc.data().exang;
                        fbs = doc.data().fbs;
                        oldpeak = doc.data().oldpeak;
                        restecg = doc.data().restecg;
                        sex = doc.data().sex;
                        slope = doc.data().slope;
                        target = doc.data().target;
                        thal = doc.data().thal;
                        thalach = doc.data().thalach;
                        trestbps = doc.data().trestbps;

                    }
                })
                arrofArr[i].push(age, asf, cdr, educ, etiv, group, hand, mF, mmse, mrDelay, nwbv, ses, visit, bloodpressure, bmi, dbf, glucose, insulin, pregnancies, skinthickness, ca, chol, cp, exang, fbs, oldpeak, restecg, sex, slope, target, thal, thalach, trestbps)
            });
        }
        
    }).then(() => {
        setTimeout(() => {
            for (let i = 0; i < arrofArr.length; i++) {

                data.push(arrofArr[i])
            }
            let csvContent = "data:text/csv;charset=utf-8," +
                data.map(e => e.join(",")).join("\n");
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "patientData.csv");
            document.body.appendChild(link);
            link.click();
        }, 2000);

    });
}