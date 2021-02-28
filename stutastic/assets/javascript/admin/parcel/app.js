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

async function refreshTable() {
    const removeChilds = (parent) => {
        while (parent.lastChild) {
            parent.removeChild(parent.lastChild);
        }
    };

    // select target target 
    const body = document.querySelector('#parcelTable');

    // remove all child nodes
    console.log("Refreshing table");
    console.log("Deleting table");
    await removeChilds(body);
    loadTable();

}

var studentsTable;
loadTable();

async function loadTable() {
    await sleep(2000);
    studentsTable = document.querySelector('#parcelTable');
    console.log("table ready for initlization!");
    await collectData();
    document.getElementById("loadingPane").style.visibility = "hidden";
    document.getElementById("loadingPane").style.opacity = "0";
}

function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    dateMonth = t.getMonth() + 1;
    var stringDate = t.getDate() + "/" + dateMonth + "/" + t.getFullYear();
    return stringDate;
}

function renderTable(doc) {
    var dateArrivedValue = toDateTime(doc.data().dateArrived.seconds);
    let tableRow = document.createElement('tr');
    let trackingID = document.createElement('td');
    let courierID = document.createElement('td');
    let collegeID = document.createElement('td');
    let dateArrived = document.createElement('td');
    let statusID = document.createElement('td');
    let cross = document.createElement("td");

    tableRow.setAttribute('data-id', doc.id);
    trackingID.setAttribute('class', "mdl-data-table__cell--non-numeric");
    courierID.setAttribute('class', "mdl-data-table__cell--non-numeric");
    collegeID.setAttribute('class', "mdl-data-table__cell--non-numeric");
    dateArrived.setAttribute('class', "mdl-data-table__cell--non-numeric");
    statusID.setAttribute('class', "mdl-data-table__cell--non-numeric");
    cross.setAttribute('class', "material-icons");
    trackingID.textContent = doc.id;
    courierID.textContent = doc.data().courierID;
    collegeID.textContent = doc.data().collegeID;
    dateArrived.textContent = dateArrivedValue;
    statusID.textContent = doc.data().statusID;
    cross.textContent = "clear";

    studentsTable.appendChild(tableRow);
    tableRow.appendChild(trackingID);
    tableRow.appendChild(courierID);
    tableRow.appendChild(collegeID);
    tableRow.appendChild(dateArrived);
    tableRow.appendChild(statusID);
    tableRow.appendChild(cross);

    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        console.log("deleting data from database");
        db.collection("currentParcelDatabase").doc(id).delete().then(() => {
            console.log("data deleted successfully!");
            refreshTable();
            var notification = document.querySelector('.mdl-js-snackbar');
            notification.MaterialSnackbar.showSnackbar({
                message: 'Parcel Deleted Successfully!'
            });
        });
    })
}

function collectData() {
    db.collection('currentParcelDatabase').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            console.log("data retrieved! rendering data");
            renderTable(doc);
        })
        console.log("data rendered!");
    })
}

async function iframeTransition() {
    document.getElementById("loadingPane").style.visibility = "visible";
    document.getElementById("loadingPane").style.opacity = "1";
    await sleep(2000);
    document.getElementById("transitionLayerFrame").style.visibility = "hidden";
    document.getElementById("transitionLayerFrame").style.opacity = "0";
}