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
isLoggedIn();

// Sets constant for firebase uility
const auth = firebase.auth();
const db = firebase.firestore();

function startLogin() {
    var provider = new firebase.auth.OAuthProvider('microsoft.com');
    provider.setCustomParameters({
        // Force re-consent.
        prompt: 'consent',
        // Target specific email with login hint.
        login_hint: 'collegeNumber@tgb.mrsm.edu.my',
        tenant: "e3bc2a05-2ae6-4a5f-82c5-ca2c65d79a75",
    });

    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            // IdP data available in result.additionalUserInfo.profile.
            // ...

            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // OAuth access and id tokens can also be retrieved:
            var accessToken = credential.accessToken;
            var idToken = credential.idToken;
            var user = result.user;
            window.location.assign('student.html');
        })
        .catch((error) => {
            // Handle error.
        });
}

function redirectTeacher() {
    window.location.assign('teachers.html');
}

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
            console.log("loginUI ready");
        } else {
            console.log("loginUI ready");
        }
    })
}