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
const messaging = firebase.messaging();
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
    var statusIcon, actionsIcon;
    var currentStatus = doc.data().statusID;
    if (currentStatus == "Received") {
        statusIcon = "done";
        actionsIcon = "check_circle_outline"
        processData();
    } else {
        statusIcon = "done_all";
        actionsIcon = "check_circle"
        processData();
    }

    function processData() {
        let dateArrivedValue = toDateTime(doc.data().dateArrived.seconds);
        let mainList = document.createElement('li');
        let firstLine = document.createElement('span');
        let mainIcon = document.createElement('i');
        let trackingID = document.createElement('span');
        let secondLine = document.createElement('span');
        let secondPart = document.createElement('span')
        let dateArrived = document.createElement('span');
        let mainActions = document.createElement('a');
        let mainActionsIcon = document.createElement('i');

        mainList.setAttribute('data-id', doc.id);
        mainList.setAttribute('class', 'mdl-list__item mdl-list__item--two-line');
        firstLine.setAttribute('class', "mdl-list__item-primary-content");
        mainIcon.setAttribute('class', "material-icons mdl-list__item-avatar");
        secondLine.setAttribute('class', "mdl-list__item-sub-title");
        secondPart.setAttribute('class', "mdl-list__item-secondary-content");
        dateArrived.setAttribute('class', "mdl-list__item-secondary-info");
        mainActions.setAttribute('class', "mdl-list__item-secondary-action");
        mainActionsIcon.setAttribute('class', "material-icons");
        mainIcon.textContent = statusIcon;
        trackingID.textContent = doc.id;
        secondLine.textContent = doc.data().courierID;
        dateArrived.textContent = dateArrivedValue;
        mainActionsIcon.textContent = actionsIcon;

        mainActions.appendChild(mainActionsIcon);
        secondPart.appendChild(dateArrived);
        secondPart.appendChild(mainActions);
        firstLine.appendChild(mainIcon);
        firstLine.appendChild(trackingID);
        firstLine.appendChild(secondLine);
        mainList.appendChild(firstLine);
        mainList.appendChild(secondPart);
        studentsTable.appendChild(mainList);

        if (currentStatus == "Received") {
            listenUpdate();
        }

        function listenUpdate() {
            mainActions.addEventListener('click', (e) => {
                e.stopPropagation();
                var user = firebase.auth().currentUser;
                var name, email, photoUrl, uid, emailVerified;

                if (user != null) {
                    uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
                    // this value to authenticate with your backend server, if
                    // you have one. Use User.getToken() instead.
                }
                let id = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');
                console.log("updating data on database");

                var dataLocation = db.collection('userSpecificParcelDatabase').doc(uid).collection('userParcel').doc(id);

                // Set the "capital" field of the city 'DC'
                return dataLocation.update({
                        statusID: 'Collected',
                    })
                    .then(() => {
                        refreshTable();
                        var notification = document.querySelector('.mdl-js-snackbar');
                        notification.MaterialSnackbar.showSnackbar({
                            message: 'Parcel Updated Successfully!'
                        });
                        console.log("Document successfully updated!");
                        var dataLocation = db.collection('currentParcelDatabase').doc(id);

                        // Set the "capital" field of the city 'DC'
                        return dataLocation.update({
                                statusID: 'Collected',
                            })
                            .then(() => {
                                console.log("Document successfully updated!");
                            })
                            .catch((error) => {
                                // The document probably doesn't exist.
                                console.error("Error updating document: ", error);
                            });
                    })
                    .catch((error) => {
                        // The document probably doesn't exist.
                        console.error("Error updating document: ", error);
                    });

            })
        }
    }
}

function collectData() {
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (user != null) {
        uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
    }

    db.collection('userSpecificParcelDatabase').doc(uid).collection('userParcel').get()
        .then((snapshot) => {
            snapshot.docs.forEach(doc => {
                if (doc.exists) {
                    console.log("data retrieved! rendering data");
                    renderTable(doc);
                    console.log("data rendered!");
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }

            })
        }).catch((error => {
            console.log(error);
        }))
}

async function iframeTransition() {
    document.getElementById("loadingPane").style.visibility = "visible";
    document.getElementById("loadingPane").style.opacity = "1";
    await sleep(2000);
    document.getElementById("transitionLayerFrame").style.visibility = "hidden";
    document.getElementById("transitionLayerFrame").style.opacity = "0";
}