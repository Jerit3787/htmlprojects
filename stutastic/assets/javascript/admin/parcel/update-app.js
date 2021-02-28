// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyC5fAN0QL5RQWt0KgsJkODZER0VWngr0Rc",
    authDomain: "stutastic-server.firebaseapp.com",
    databaseURL: "https://stutastic-server-default-rtdb.firebaseio.com",
    projectId: "stutastic-server",
    storageBucket: "stutastic-server.appspot.com",
    messagingSenderId: "269786616381",
    appId: "1:269786616381:web:c17cc9e33bbe2c946a1054",
    measurementId: "G-XZEFWH3R3K"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Sets constant for firebase uility
const auth = firebase.auth();
const db = firebase.firestore();
isLoggedIn();

// redirect configuration
function isLoggedIn() {
    firebase.auth().onAuthStateChanged(function(user) {
        var status;

        if (user) {
            status = "logged in";
        } else {
            status = "not logged in";
        }

        console.log("userStatus: " + status);
        if (user) {
            console.log("no action needed!");
        } else {
            window.location.assign('../../auth/index.html');
            console.log("redicted excetuted!");
        }
    })
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        userData = user;
        user.providerData.forEach(function(profile) {
            emailUser = document.getElementById('userEmail');
            nameUser = document.getElementById('userName');
            emailUser.innerHTML = profile.email;
            nameUser.innerHTML = profile.displayName;
            console.log("Sign-in provider: " + profile.providerId);
            console.log("  Provider-specific UID: " + profile.uid);
            console.log("  Name: " + profile.displayName);
            console.log("  Email: " + profile.email);
            console.log("  Photo URL: " + profile.photoURL);
        });
    } else {
        // No user is signed in.
    }
});

function signOutFirebase() {
    firebase.auth().signOut().then(function() {
        window.location.replace('../../auth/index.html');
    }).catch(function(error) {
        console.log("Hello! this isn't working!");
    });
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var form;
loadForm();

async function loadForm() {
    await sleep(2000);
    form = document.querySelector('#addParcelForm');
    console.log("form ready for usage!");
    document.getElementById("loadingPane").style.visibility = "hidden";
    document.getElementById("loadingPane").style.opacity = "0";

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        updateMainParcelDatabase();
    })
}

function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    dateMonth = t.getMonth() + 1;
    var stringDate = t.getDate() + "/" + dateMonth + "/" + t.getFullYear();
    return stringDate;
}

async function iframeTransition() {
    document.getElementById("loadingPane").style.visibility = "visible";
    document.getElementById("loadingPane").style.opacity = "1";
    await sleep(2000);
    document.getElementById("transitionLayerFrame").style.visibility = "hidden";
    document.getElementById("transitionLayerFrame").style.opacity = "0";
}

function updateMainParcelDatabase() {
    // preparing dateArrived data
    currentMili = Date.now();
    currentSeconds = currentMili / 1000;
    var docName = form.trackingID.value;

    // push infomation to currentParcelDatabase
    db.collection("currentParcelDatabase").doc(docName).set({
            trackingID: form.trackingID.value,
            courierID: form.courierID.value,
            collegeID: form.collegeID.value,
            dateArrived: firebase.firestore.FieldValue.serverTimestamp(),
            statusID: "Received",
        })
        .then(() => {
            // data successfully uploaded into currentParcelDatabase
            console.log("Data uploaded!")
            getUserUID();
        })
        .catch((error) => {
            // fail to upload into currentParcelDatabase
            console.log("Hello! this isn't working!");
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Hello! this isn't working!");
            console.log("error : " + errorCode);
            console.log("details : " + errorMessage);
        })
}

function getUserUID() {
    var docRef = db.collection("userUIDDatabase").doc(form.collegeID.value);

    docRef.get().then((doc) => {
        if (doc.exists) {
            userUID = doc.data().UID;
            updateUserParcelDatabase(userUID);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function updateUserParcelDatabase(uid) {
    db.collection("userSpecificParcelDatabase").doc(uid).collection("userParcel").doc(form.trackingID.value).set({
            trackingID: form.trackingID.value,
            courierID: form.courierID.value,
            collegeID: form.collegeID.value,
            dateArrived: firebase.firestore.FieldValue.serverTimestamp(),
            statusID: "Received",
        })
        .then(() => {
            // data successfully uploaded into currentParcelDatabase
            console.log("Data uploaded!");
            var titleMessage = 'Project Stutastic'
            var parseMessage = "Your parcel (" + form.trackingID.value + ") has arrived at the school's counter! Come and collect it!";
            var collegeID = form.collegeID.value;
            sendNotification(titleMessage, parseMessage, collegeID);
        })
        .catch((error) => {
            // fail to upload into currentParcelDatabase
            console.log("Hello! this isn't working!");
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Hello! this isn't working!");
            console.log("error : " + errorCode);
            console.log("details : " + errorMessage);
        })
}

var notificationToken;

function sendNotification(title, message, collegeID) {
    var docRef = db.collection("userUIDDatabase").doc(collegeID);

    docRef.get().then((doc) => {
        if (doc.exists) {
            userUID = doc.data().UID;
            getNotiToken(title, message, userUID);

            function getNotiToken(title, message, userUID) {
                var notiTokenData = db.collection("notificationTokenDatabase").doc(userUID);
                notiTokenData.get().then((doc) => {
                    console.log(doc.data().notificationToken);
                    notificationToken = doc.data().notificationToken;
                    var parseURL = 'https://danishsite.ml/send_notification.php?title=' + title + '&message=' + message + '&token=' + notificationToken + "&icon=https://projects.danishsite.me/stutastic/assets/images/icon.png";
                    fetch(parseURL, { mode: 'no-cors', method: 'GET' }).then(() => {
                        window.location.assign('index.html');
                    });
                }).catch((error) => {
                    console.log("Error getting document:", error);
                })
            }
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}