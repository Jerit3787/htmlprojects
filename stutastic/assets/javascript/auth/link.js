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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var form;
loadForm();

async function loadForm() {
    await sleep(2000);
    form = document.querySelector('#addEmailAdmin');
    console.log("form ready for usage!");
    document.getElementById("loadingPane").style.visibility = "hidden";
    document.getElementById("loadingPane").style.opacity = "0";

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        relinkAccount();
    })

    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (user != null) {
        email = user.email; // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
    }

    form.emailID.value = email;
}

function updateUserName() {
    var user = firebase.auth().currentUser;
    user.providerData.forEach(function(profile) {
        if (profile.providerId == "microsoft.com") {
            user.updateProfile({
                displayName: profile.displayName,
            }).then(function() {
                console.log("User account name successfully synced with Microsoft");
                user.unlink('password').then(() => {
                    // Auth provider unlinked from account
                    // ...
                    console.log("Account unlinked from email. Only Microsoft Account is allowed to be used for login");
                    uploadData();
                }).catch((error) => {
                    // An error happened
                    // ...
                });
                // Update successful.
            }).catch(function(error) {
                // An error happened.
                console.log("Hello! this isn't working!", error);
            });
        } else {
            console.log("Not a Microsoft Account linked");
        }
    });
}

// starts relinking process
function relinkAccount() {
    checkAssignedAccount();

    function checkAssignedAccount() {
        firebase.auth().signInWithEmailAndPassword(form.emailID.value, form.adminPassword.value)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                // ...
                console.log("Account linking success", user);
                unlink();
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("Account linking error", error);
                var notification = document.querySelector('.mdl-js-snackbar');
                notification.MaterialSnackbar.showSnackbar({
                    message: error.message,
                });
                form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        relinkAccount();
                    })
                    // ..
            });
    }

    function unlink() {
        var user = firebase.auth().currentUser;
        user.unlink('microsoft.com').then(() => {
            console.log("Account unlinked");
            linkMicrosoft();
        }).catch((error) => {
            console.log("Hello! this isn't working!", error.message);
            // ...
        });
    }

    function linkMicrosoft() {
        var provider = new firebase.auth.OAuthProvider('microsoft.com');

        provider.setCustomParameters({
            prompt: "consent",
            tenant: "e3bc2a05-2ae6-4a5f-82c5-ca2c65d79a75",
        });

        console.log("Starting user Microsoft account relinking process");

        auth.currentUser.linkWithPopup(provider).then((result) => {
            // Accounts successfully linked.
            var credential = result.credential;
            var user = result.user;
            console.log("User account linked with Microsoft & Email");
            updateUserName();
        }).catch((error) => {
            console.log("Hello! this isn't working!", error.message);
        });
    }
}

function uploadData() {
    // preparing dateArrived data
    currentMili = Date.now();
    currentSeconds = currentMili / 1000;

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

    // push infomation to adminDatabase
    db.collection("userDatabase").doc(uid).update({
            status: 'Activated',
        })
        .then(() => {
            // data successfully uploaded into adminDatabase
            console.log("Activation status updated successfully!");
            window.location.assign('../intro/index.html');
        })
        .catch((error) => {
            // fail to upload into adminDatabase
            console.log("Hello! this isn't working!");
            console.log("error : " + errorCode);
            console.log("details : " + errorMessage);
        })
}