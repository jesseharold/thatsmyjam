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

// --- the below code is commented out currently, but it can be used to reset the test data in firebase
// create a test database of restraurants
// var restaurantDatabase = [
//     {
//         name: "Bill's House", 
//         location: {lat: 34.082517, lng: -118.280028}, 
//         reviews: [
//             {
//                 reviewer: "eric@gmail.com",
//                 text: "this place is super kewl",
//                 images: ["assets/images/indian.jpg"],
//                 thumbsUp: true
//             },
//             {
//                 reviewer: "bill@gmail.com",
//                 text: "I would eat here every night if I could.  two thumbs up.",
//                 images: [],
//                 thumbsUp: true
//             }
//         ]
//     },
//     {
//         name: "Lukshon", 
//         location: {lat: 34.029885, lng: -118.384300},  
//         reviews: [
//             {   reviewer: "harold@gmail.com",
//                 text: "this restaurant is super kewl",
//                 images: [],
//                 thumbsUp: true
//             },
//             {
//                 reviewer: "bill@gmail.com",
//                 text: "this restaurant is lame",
//                 images: ["assets/images/wrap.jpg", "assets/images/pizza.jpg"],
//                 thumbsUp: false
//             },
//         ]
//     },

// ];
// //clear the current restaurant database
// database.ref("/restaurantData").remove()
// //upload the test restaurant database
// for (var i = 0; i < restaurantDatabase.length; i++){
//     database.ref("/restaurantData").push(restaurantDatabase[i]);
// }


// //create test database of all the users and their friends and reviews (update from firebase on load and when changes are made)
// var userDatabase = [
//     {
//         name: "Bill Bittner",
//         email: "bill@gmail.com",
//         password: "password",
//         friends: ["harold@gmail.com", "eric@gmail.com"],
//     },
//     {
//         name: "Harold",
//         email: "harold@gmail.com",
//         password: "password",
//         friends: ["eric@gmail.com", "bill@gmail.com"],
//     },
//     {
//         name: "Eric",
//         email: "eric@gmail.com",
//         password: "password",
//         friends: ["harold@gmail.com", "bill@gmail.com"],
//     }
// ];
// //add the test database to firebase 
// database.ref("/userData").remove()
// for (var i = 0; i < userDatabase.length; i++){
//     database.ref("/userData").push(userDatabase[i]);
// }
