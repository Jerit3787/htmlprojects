// fetches the firebase configuration and init firebase
fetch("../assets/config/firebase.json")
    .then(response => {
        return response.json();
    })
    .then(data => {
        initFirebase(data);
        isLoggedIn();
    });

// init firebase config
function initFirebase(data) {
    firebase.initializeApp(data);
    firebase.analytics();

    // Sets constant for firebase uility
    const auth = firebase.auth();
    const db = firebase.firestore();
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
            console.log("no action needed!");
        } else {
            window.location.replace('auth/index.html');
            console.log("redicted excetuted!");
        }
    })
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        user.providerData.forEach(function(profile) {
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
        window.location.replace('index.html');
    }).catch(function(error) {
        console.log("Hello! this isn't working!");
    });
}