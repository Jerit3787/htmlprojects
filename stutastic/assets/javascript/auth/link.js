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

// starts relinking process
function relinkAccount() {
    var provider = new firebase.auth.OAuthProvider('microsoft.com');

    provider.setCustomParameters({
        prompt: "consent",
        tenant: "e3bc2a05-2ae6-4a5f-82c5-ca2c65d79a75",
    });

    console.log("Starting user account relinking process");

    auth.currentUser.linkWithPopup(provider).then((result) => {
        // Accounts successfully linked.
        var credential = result.credential;
        var user = result.user;
        console.log("User account linked with Microsoft & Email");
        user.unlink('password').then(() => {
            console.log("User unlinked from email auth. Only Microsoft account is allowed to use for login.");
            console.log("Account ready for usage!")
            window.location.replace('../auth/index.html');
        }).catch((error) => {
            console.log("Hello! this isn't working!");
        });
    }).catch((error) => {
        console.log("Hello! this isn't working!");
    });
}