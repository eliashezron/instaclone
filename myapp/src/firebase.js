import firebase from "firebase"


    const firebaseApp = firebase.initializeApp({
      apiKey: "AIzaSyCcIMIGPhrzayroYz6107LR8zFcyft5MUc",
      authDomain: "instaclone-90e11.firebaseapp.com",
      databaseURL: "https://instaclone-90e11.firebaseio.com",
      projectId: "instaclone-90e11",
      storageBucket: "instaclone-90e11.appspot.com",
      messagingSenderId: "389902736285",
      appId: "1:389902736285:web:53da9e5404c08ccff42d74",
      measurementId: "G-TFBWV4Z42F"
    });
    const db = firebaseApp.firestore()
    const auth=firebase.auth()
    const storage=firebase.storage()

    export{ db, auth, storage}