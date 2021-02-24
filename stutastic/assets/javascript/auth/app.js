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
            checkHasRelinked(user);
            console.log("redirect executed!");
        } else {
            console.log("loginUI executed!");
            startUI();
        }
    })
}

// starts Firebase-UI
function startUI() {
    var uiConfig = {
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            {
                provider: 'microsoft.com',
                customParameters: {
                    prompt: "consent",
                    tenant: "e3bc2a05-2ae6-4a5f-82c5-ca2c65d79a75",
                }
            }, {
                provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                fullLabel: 'Activate account',
            },
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: '<your-tos-url>',
        // Privacy policy url/callback.
        privacyPolicyUrl: function() {
            window.location.assign('<your-privacy-policy-url>');
        }
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
}

// init checks on account activations
function checkHasRelinked(user) {
    var providerData = user.providerData[0].providerId;

    if (providerData == "password") {
        window.location.replace('link-account.html');
    } else {
        window.location.replace('../index.html');
    }
}