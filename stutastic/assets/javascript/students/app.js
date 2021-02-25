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
            window.location.replace('../../auth/index.html');
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

// Prompt the user to re-provide their sign-in credentials
function reAuth() {
    var user = firebase.auth().currentUser;
    var unForm = document.querySelector('#addStudentForm');

    //gets user data
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (user != null) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
    }
    var credential = firebase.auth.EmailAuthProvider.credential(email, unForm.adminPassword.value);

    user.reauthenticateWithCredential(credential).then(function() {
        // User re-authenticated.
        console.log("User has been reauthenticated!");
    }).catch(function(error) {
        // An error happened.
        console.log("Hello! this isn't working!");
    });
}

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

function announceUser(user) {
    var name, email, photoUrl, uid, emailVerified, providerId;

    if (user != null) {
        providerId = user.providerId;
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.

        console.log("decrypting data");
        console.log("Sign-in provider: " + providerId);
        console.log("  Provider-specific UID: " + uid);
        console.log("  Name: " + name);
        console.log("  Email: " + email);
        console.log("  Photo URL: " + photoUrl);
    }
}

var studentsTable;
loadTable();

async function loadTable() {
    await sleep(2000);
    studentsTable = document.querySelector('#studentsTable');
    console.log("table ready for initlization!");
    collectData();
}

function renderTable(doc) {
    let tableRow = document.createElement('tr');
    let collegeID = document.createElement('td');
    let name = document.createElement('td');
    let classID = document.createElement('td');
    let emailID = document.createElement('td');

    tableRow.setAttribute('data-id', doc.id);
    collegeID.textContent = doc.data().collegeID;
    name.textContent = doc.data().name;
    classID.textContent = doc.data().classID;
    emailID.textContent = doc.data().emailID;

    studentsTable.appendChild(tableRow);
    tableRow.appendChild(collegeID);
    tableRow.appendChild(name);
    tableRow.appendChild(classID);
    tableRow.appendChild(emailID);

}

function collectData() {
    db.collection('userDatabase').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            console.log("data retrieved! rendering data");
            renderTable(doc);
        })
        console.log("data rendered!");
    })
}