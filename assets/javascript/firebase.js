//--- the below code blocks initialize the firebase database
// Initialize Firebase
var config = {
apiKey: "AIzaSyAkz3870LEAmF2XKge6piue0MstFN8HLOw",
authDomain: "thats-my-jam-5bd76.firebaseapp.com",
databaseURL: "https://thats-my-jam-5bd76.firebaseio.com",
storageBucket: "thats-my-jam-5bd76.appspot.com",
messagingSenderId: "24683058045"
};
firebase.initializeApp(config);

var database = firebase.database();
