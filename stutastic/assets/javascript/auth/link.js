// fetches the firebase configuration and init firebase
fetch("../assets/config/firebase.json")
    .then(response => {
        return response.json();
    })
    .then(data => {
        initFirebase(data);
    });

// init firebase config
function initFirebase(data) {
    firebase.initializeApp(data);
    firebase.analytics();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



// starts relinking process
async function relinkAccount() {
    var provider = new firebase.auth.OAuthProvider('microsoft.com');

    // Sets constant for firebase uility
    const auth = firebase.auth();
    const db = firebase.firestore();

    await sleep(2000);

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
            window.location.replace('../index.html');
        }).catch((error) => {
            console.log("Hello! this isn't working!");
        });
    }).catch((error) => {
        console.log("Hello! this isn't working!");
    });
}