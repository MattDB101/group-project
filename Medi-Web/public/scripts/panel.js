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
const msgList = document.querySelector('#msg-list');

const queryRes = document.querySelector('#queryRes');
var msgCount = 0
const patients = []

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

            newlink2 = document.createElement('a');
            newlink2.innerHTML = 'View AI Results';
            newlink2.setAttribute('title', 'View');
            newlink2.setAttribute('href', 'javascript:void(0)');
            li.appendChild(newlink2);

            newlink = document.createElement('a');
            newlink.innerHTML = 'Delete';
            newlink.setAttribute('title', 'Delete');
            newlink.setAttribute('href', 'javascript:void(0)');
            newlink.style.marginLeft = "10px";
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

            // deleteing data
            newlink2.addEventListener("click", (e) => {
                e.stopPropagation()
                let id = e.target.parentElement.getAttribute("data-id")
                console.log(id)
                getAIres(id)
            })
        });
    });


    db.collection("contacts").where("recipient", "==", user.email).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            msgCount++
            let li = document.createElement('li');
            let head = document.createElement('span');
            head.style.display = "block"
            let date = document.createElement('span');
            date.style.display = "block"
            let text = document.createElement('span');
            text.style.display = "block"

            li.setAttribute('data-id', doc.id);

            head.textContent = doc.data().title;
            text.textContent = doc.data().description;
            date.textContent = doc.data().date;
            head.style.fontWeight = "bold";

            li.appendChild(head);
            li.appendChild(text);
            li.appendChild(date);

            newlink = document.createElement('a');
            newlink.innerHTML = 'Delete';
            newlink.setAttribute('title', 'Delete');
            newlink.setAttribute('href', 'javascript:void(0)');
            li.appendChild(newlink);

            li.style.border = "1px solid rgb(201, 201, 201)";
            li.style.marginTop = "2%";
            li.style.marginBottom = "2%";
            li.style.padding = "5%";
            msgList.appendChild(li);
            if (msgCount == 1) {
                document.getElementById("messageHeading").innerHTML = "You have " + msgCount + " message"
            } else {
                document.getElementById("messageHeading").innerHTML = "You have " + msgCount + " messages."
            }


            // deleteing data
            newlink.addEventListener("click", (e) => {
                e.stopPropagation()
                let id = e.target.parentElement.getAttribute("data-id")
                console.log(id)
                db.collection('contacts').doc(id).delete();
                location.reload()
            })

        });
    });
}

function getAIres(patEmail) {
    const {
        currentUser
    } = firebase.auth();
    var age, asf, cdr, educ, etiv, mF, mmse, nwbv, ses, bloodpressure, bmi, dbf, glucose, insulin, pregnancies, skinthickness, ca, chol, cp, exang, fbs, oldpeak, restecg, sex, slope, heartTarget, diabetesTarget, thal, thalach, trestbps
    age = asf = cdr = educ = etiv = mF = mmse = nwbv = ses = bloodpressure = bmi = dbf = glucose = insulin = pregnancies = skinthickness = ca = chol = cp = exang = fbs = oldpeak = restecg = sex = slope = heartTarget = diabetesTarget = thal = thalach = trestbps = "Not Enough Data.";
    db.collection('patient').doc(patEmail).collection('diseases').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            if (doc.id == "alzheimers") { // alzheimers
                age = doc.data().age;
                asf = doc.data().asf;
                cdr = doc.data().cdr;
                educ = doc.data().educ;
                etiv = doc.data().etiv;
                mF = doc.data().mF;
                mmse = doc.data().mmse;
                nwbv = doc.data().nwbv;
                ses = doc.data().ses;


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
                diabetesTarget = doc.data().target;


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
                heartTarget = doc.data().target;
                thal = doc.data().thal;
                thalach = doc.data().thalach;
                trestbps = doc.data().trestbps;

            }
        })
    }).then(() => {
        alzheimers = "Alzheimers : " + asf;

        switch (diabetesTarget) {
            case 0:
                diabetes = "Diabetes: Absent"
                break;
            case 1:
                diabetes = "Diabetes: Likely"
                break;
            default:
                diabetes = "Diabetes: " + heartTarget
                break;
        }

        switch (heartTarget) {
            case 0:
                heart = "Heart Disease: Absent"
                break;
            case 1:
                heart = "Heart Disease: Mild"
                break;
            case 2:
                heart = "Heart Disease: Minor"
                break;
            case 3:
                heart = "Heart Disease: Moderate"
                break;
            case 4:
                heart = "Heart Disease: Severe"
                break;
            default:
                heart = "Heart Disease: " + heartTarget
                break;
        }

        alert("AI Results for patient " + patEmail + "\n" + alzheimers + "\n" + heart + "\n" + diabetes)

    })
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}






document.getElementById("alzheimersForm").addEventListener("submit", (event) => {
    event.preventDefault();
    var totPats = 0;
    var illpats = 0;
    const formage = event.target.age.value;
    formAge = parseInt(formage)
    const formSex = event.target.sex.value;
    const formCdr = event.target.cdr.value;
    const formEtiv = event.target.etiv.value;
    console.log(formAge, formSex, formCdr, formEtiv)


    db.collection('patient').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            patients.push(doc.data().email)
        })
    }).then(() => {
        var unique = patients.filter(onlyUnique);
        console.log(unique)
        for (let i = 0; i < unique.length; i++) {
            db.collection('patient').doc(unique[i]).collection('diseases').get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    if (doc.id == "alzheimers") {

                        patAge = doc.data().age;
                        patCdr = doc.data().cdr;
                        patSex = doc.data().mF;
                        patEtiv = doc.data().etiv;
                        patTarget = doc.data().group;
                        totPats++

                        if (formAge == 60) {
                            var ageBool = (patAge > formAge)
                        } else {
                            var ageBool = (patAge > formAge && patAge < formAge + 19)
                        }

                        if (ageBool && (patSex == formSex) && (patCdr <= formCdr) && (patEtiv >= formEtiv) && patTarget == "1") {
                            illpats++

                        }
                    }
                })
            })
        }

    }).then(() => {
        setTimeout(() => {
            console.log(illpats, totPats)
            percent = illpats / totPats * 100
            queryRes.innerHTML = percent + "% of patients in the database that match the given description description have Alzheimer's.";

        }, 2000);
    })
})


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

document.getElementById("diabetesForm").addEventListener("submit", (event) => {
    event.preventDefault();
    var totPats = 0;
    var illpats = 0;
    const formage = event.target.age.value;
    formAge = parseInt(formage)
    const formBp = event.target.bp.value;
    const formBmi = event.target.bmi.value;
    const formGlucose = event.target.glucose.value;

    console.log(formAge, formBp, formBmi, formGlucose)

    db.collection('patient').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            patients.push(doc.data().email)
        })
    }).then(() => {
        var unique = patients.filter(onlyUnique);
        console.log(unique)
        for (let i = 0; i < unique.length; i++) {
            db.collection('patient').doc(unique[i]).collection('diseases').get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    if (doc.id == "diabetes") {

                        patAge = doc.data().age;
                        patBmi = doc.data().bmi;
                        patBp = doc.data().bloodpressure;
                        patGlucose = doc.data().glucose;
                        patTarget = doc.data().target;
                        totPats++

                        console.log(formAge, patAge, patBmi, patBp, patGlucose)
                        if (formAge == 60) {
                            var ageBool = (patAge > formAge)
                        } else {
                            var ageBool = (patAge > formAge && patAge < formAge + 19)
                        }
                        console.log(ageBool)
                        if (ageBool & (patBp <= formBp) && (patGlucose <= formGlucose) && (patBmi <= formBmi) && patTarget == 1) {
                            illpats++

                        }
                    }
                })
            })
        }

    }).then(() => {
        setTimeout(() => {
            console.log(illpats, totPats)
            percent = illpats / totPats * 100
            queryRes.innerHTML = percent + "% of patients in the database that match the given description description have Diabetes.";
        }, 1000);
    })
})

document.getElementById("heartForm").addEventListener("submit", (event) => {
    event.preventDefault();
    var totPats = 0;
    var illpats = 0;
    const formage = event.target.age.value;
    formAge = parseInt(formage)
    const formSex = event.target.sex.value;
    const formBp = event.target.bp.value;
    const formCholestrol = event.target.cholestrol.value;
    console.log(formAge, formSex, formBp, formCholestrol)


    db.collection('patient').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            patients.push(doc.data().email)
        })
    }).then(() => {
        var unique = patients.filter(onlyUnique);
        console.log(unique)
        for (let i = 0; i < unique.length; i++) {
            db.collection('patient').doc(unique[i]).collection('diseases').get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    if (doc.id == "heart disease") { // Heart disease

                        patAge = doc.data().age;
                        patCholestrol = doc.data().chol;
                        patSex = doc.data().sex;
                        patBp = doc.data().trestbps;
                        patTarget = doc.data().target;
                        totPats++

                        if (formAge == 60) {
                            var ageBool = (patAge > formAge)
                        } else {
                            var ageBool = (patAge > formAge && patAge < formAge + 19)
                        }

                        if (ageBool && (patSex == formSex) && (patCholestrol <= formCholestrol) && (patBp <= formBp) && patTarget == 1) {
                            illpats++

                        }
                    }
                })
            })
        }

    }).then(() => {
        setTimeout(() => {
            console.log(illpats, totPats)
            percent = illpats / totPats * 100
            queryRes.innerHTML = percent + "% of patients in the database that match the given description description have Heart Disease.";
        }, 1000);
    })
})


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
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
                    if (doc.id == "alzheimers") {
                        (db.collection('doctors').doc(currentUser.email).collection('patients').doc(patEmail).collection("diseases").doc("alzheimers").set({
                            age: doc.data().age,
                            asf: doc.data().asf,
                            cdr: doc.data().cdr,
                            educ: doc.data().educ,
                            etiv: doc.data().etiv,
                            mF: doc.data().mF,
                            mmse: doc.data().mmse,
                            nwbv: doc.data().nwbv,
                            ses: doc.data().ses,

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
            location.reload()
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
                var age, asf, cdr, educ, etiv, mF, mmse, nwbv, ses, bloodpressure, bmi, dbf, glucose, insulin, pregnancies, skinthickness, ca, chol, cp, exang, fbs, oldpeak, restecg, sex, slope, target, thal, thalach, trestbps
                age = asf = cdr = educ = etiv = mF = mmse = nwbv = ses = bloodpressure = bmi = dbf = glucose = insulin = pregnancies = skinthickness = ca = chol = cp = exang = fbs = oldpeak = restecg = sex = slope = target = thal = thalach = trestbps = "Not Given";
                snapshot.docs.forEach(doc => {
                    if (doc.id == "alzheimers") { // alzheimers
                        age = doc.data().age;
                        asf = doc.data().asf;
                        cdr = doc.data().cdr;
                        educ = doc.data().educ;
                        etiv = doc.data().etiv;
                        mF = doc.data().mF;
                        mmse = doc.data().mmse;
                        nwbv = doc.data().nwbv;
                        ses = doc.data().ses;


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
                arrofArr[i].push(age, asf, cdr, educ, etiv, mF, mmse, nwbv, ses, bloodpressure, bmi, dbf, glucose, insulin, pregnancies, skinthickness, ca, chol, cp, exang, fbs, oldpeak, restecg, sex, slope, target, thal, thalach, trestbps)
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