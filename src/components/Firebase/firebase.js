import app from 'firebase/app';
import 'firebase/auth';
import "firebase/database";
import "firebase/firebase-firestore";

// const firebaseConfig = {
//     apiKey: process.env.FIREBASE_APP_API_KEY,
//     authDomain:  process.env.FIREBASE_APP_AUTH_DOMAIN,
//     databaseURL: process.env.FIREBASE_APP_DATABASE_URL,
//     projectId: process.env.FIREBASE_APP_PROJECT_ID,
//     storageBucket: process.env.FIREBASE_APP_STORAGE_BUCKET,
//     messagingSenderId: process.env.FIREBASE_APP_MESSAGING_SENDER_ID,
//     appId: process.env.FIREBASE_APP_ID
// };

const firebaseConfig = {
    apiKey: "AIzaSyCYb_1DIaRn6NPSasMqYzwncMXuhGWD-Gk",
    authDomain: "login-authentication-d266e.firebaseapp.com",
    databaseURL: "https://login-authentication-d266e.firebaseio.com",
    projectId: "login-authentication-d266e",
    storageBucket: "login-authentication-d266e.appspot.com",
    messagingSenderId: "1028307282361",
    appId: "1:1028307282361:web:b7a15e1bfb30271220ae68"
};

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);

        this.auth = app.auth();
        this.db = app.database();
        this.firestore = app.firestore()
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);
    
    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    doStoreUser = (first_name, last_name, email, phone_number, age, address) => {
        this.firestore.collection("users").add({
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone_number: phone_number,
            age: age,
            address: address,
        })
    }

    doUpdateUser = (first_name, last_name, phone_number, age, address, doc_id) => {
        this.firestore.collection("users").doc(doc_id).update({
            first_name: first_name,
            last_name: last_name,
            phone_number: phone_number,
            age: age,
            address: address,
        })
    }

    doGetAllUser = () => {
        // const users = await this.firestore.collection("users").get()
        // console.log(users.docs.map((doc) => doc.data()))
        // const a = await users.docs.map((doc) => doc.data())
        // // return users.docs.map((doc) => doc.data())
        return this.firestore
    }

    // API

    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users')
}

export default Firebase;