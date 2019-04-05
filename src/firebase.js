import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var config = {
    apiKey: "AIzaSyDyUAOnjM_6rt2RBk2DPx-LddowR4GHsVA",
    authDomain: "weshare-info.firebaseapp.com",
    databaseURL: "https://weshare-info.firebaseio.com",
    projectId: "weshare-info",
    storageBucket: "weshare-info.appspot.com",
    messagingSenderId: "163430296804"
};

firebase.initializeApp(config);

export default firebase;
