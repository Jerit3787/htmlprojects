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
            }
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
    collectData();

    function collectData() {
        var user = firebase.auth().currentUser;
        var name, email, photoUrl, uid, emailVerified;

        if (user != null) {
            uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
            // this value to authenticate with your backend server, if
            // you have one. Use User.getToken() instead.

            db.collection('adminDatabase').doc(uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        console.log('user has admins right. redirecting')
                        window.location.replace('../../index.html');
                    } else {
                        // doc.data() will be undefined in this case
                        var notification = document.querySelector('.mdl-js-snackbar');
                        notification.MaterialSnackbar.showSnackbar({
                            message: "Sorry! The account that you have logged in does not have admin rights! Please try again!"
                        });
                        signOutFirebase();

                        function signOutFirebase() {
                            firebase.auth().signOut().then(function() {
                                console.log("Account signed out!")
                            }).catch(function(error) {
                                console.log("Hello! this isn't working!");
                            });
                        };
                    }
                }).catch((error => {
                    console.log(error);
                }))
        }
    }
}