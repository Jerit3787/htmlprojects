var userData;
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

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        userData = user;
        user.providerData.forEach(function(profile) {
            console.log("Sign-in provider: " + profile.providerId);
            console.log("  Provider-specific UID: " + profile.uid);
            console.log("  Name: " + profile.displayName);
            console.log("  Email: " + profile.email);
            console.log("  Photo URL: " + profile.photoURL);
            kicksUser();
        });
    } else {
        // No user is signed in.
    }
});

function kicksUser() {
    console.log(userData);
}

var currentPage = 1;

function nextPage() {
    var page1 = document.querySelector('#page1');
    var page2 = document.querySelector('#page2');
    var page3 = document.querySelector('#page3');
    var indicatorPage1 = document.querySelector('#inPage1');
    var indicatorPage2 = document.querySelector('#inPage2');
    var indicatorPage3 = document.querySelector('#inPage3');
    var before = document.querySelector('#before');
    var after = document.querySelector('#after');
    var color = document.querySelector('#backgroundColor');

    if (currentPage >= 3) {
        console.log("maximum page reached!")
    } else {
        currentPage = currentPage + 1;
        console.log("added to " + currentPage);
        changePage();
    }

    function changePage() {
        switch (currentPage) {
            case 2:
                console.log("case 2 selected");
                indicatorPage1.style.color = "rgba(251,250,245,0.2)";
                indicatorPage2.style.color = "#FBFAF5";
                indicatorPage3.style.color = "rgba(251,250,245,0.2)";
                page1.style.width = "0";
                page1.style.display = "none";
                before.removeAttribute("disabled");
                before.style.color = "#FBFAF5";
                page2.style.width = "100%";
                page2.style.display = "flex";
                color.style.backgroundColor = "#05b983";
                break;

            case 3:
                console.log("case 3 selected");
                indicatorPage1.style.color = "rgba(251,250,245,0.2)";
                indicatorPage2.style.color = "rgba(251,250,245,0.2)";
                indicatorPage3.style.color = "#FBFAF5";
                page2.style.width = "0";
                page2.style.display = "none";
                after.setAttribute("disabled", "");
                after.style.color = "rgba(251,250,245,0.2)";
                page3.style.width = "100%";
                page3.style.display = "flex";
                break;
        }
    }
}

function previousPage() {
    var page1 = document.querySelector('#page1');
    var page2 = document.querySelector('#page2');
    var page3 = document.querySelector('#page3');
    var indicatorPage1 = document.querySelector('#inPage1');
    var indicatorPage2 = document.querySelector('#inPage2');
    var indicatorPage3 = document.querySelector('#inPage3');
    var before = document.querySelector('#before');
    var after = document.querySelector('#after');
    var color = document.querySelector('#backgroundColor');

    if (currentPage <= 1) {
        console.log("minimum page reached!")
    } else {
        currentPage = currentPage - 1;
        console.log("reduced to " + currentPage);
        changePage();
    }

    function changePage() {
        switch (currentPage) {
            case 1:
                console.log("case 1 selected")
                indicatorPage1.style.color = "#FBFAF5";
                indicatorPage2.style.color = "rgba(251,250,245,0.2)";
                indicatorPage3.style.color = "rgba(251,250,245,0.2)";
                page2.style.width = "0%";
                page2.style.display = "none";
                before.setAttribute("disabled", "");
                before.style.color = "rgba(251,250,245,0.2)";
                page1.style.width = "100%";
                page1.style.display = "flex";
                color.style.backgroundColor = "#3da5be";
                break;

            case 2:
                console.log("case 2 selected")
                indicatorPage1.style.color = "rgba(251,250,245,0.2)";
                indicatorPage2.style.color = "#FBFAF5";
                indicatorPage3.style.color = "rgba(251,250,245,0.2)";
                page3.style.width = "0%";
                page3.style.display = "none";
                page2.style.width = "100%";
                page2.style.display = "flex";
                color.style.backgroundColor = "#03a373";
                after.removeAttribute("disabled");
                after.style.color = "#FBFAF5";
                break;
        }
    }
}

var userID

function getToken() {
    var notification = document.querySelector('.mdl-js-snackbar');
    notification.MaterialSnackbar.showSnackbar({
        message: "Make sure to click 'Allow' when asked to request notification access!"
    });
    var button = document.querySelector('#pushNotificationButton');
    // Get registration token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken({ vapidKey: 'BNtpxUWoHMO1pV17coaKiiDBEUO71Su4ECqYbTPzPbATEV0EUvJ44sTivU_2so51AfyhbQZTTRbNftOXQf9WDlU' }).then((currentToken) => {
        if (currentToken) {
            // Send the token to your server and update the UI if necessary
            userData.providerData.forEach(function(profile) {
                userID = profile.uid;
            });
            db.collection("notificationTokenDatabase").doc(userID).set({
                    notificationToken: currentToken,
                })
                .then(() => {
                    console.log("Data uploaded!")
                    button.setAttribute("disabled", "");
                    button.innerHTML = "Enabled Push Notification";
                    var notification = document.querySelector('.mdl-js-snackbar');
                    notification.MaterialSnackbar.showSnackbar({
                        message: 'Push Notification enabled!'
                    });
                })
                .catch((error) => {
                    console.log("Hello! this isn't working!");
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log("Hello! this isn't working!");
                    console.log("error : " + errorCode);
                    console.log("details : " + errorMessage);
                })
        } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
            // ...
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
    });
}