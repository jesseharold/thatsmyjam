// import latest restaurant information from firebase
//create local variable to store the info in
var restaurantDatabase = [];
//on initial load and when children are added, push those children to the local array
database.ref("/restaurantData").on("child_added", function(childSnap){
    var restrauntName = childSnap.val().name;
    var restrauntLocation = childSnap.val().location;
    var restrauntReviews = childSnap.val().reviews;
    var restrauntData = {name: restrauntName, location: restrauntLocation, reviews: restrauntReviews};
    restaurantDatabase.push(restrauntData);
});
console.log(restaurantDatabase);
//import latest user information from firebase
var userDatabase = [];
database.ref("/userData").on("child_added", function(childSnap){
    var userName = childSnap.val().name;
    var userEmail = childSnap.val().email;
    var userPassword = childSnap.val().password;
    var userFriends = childSnap.val().friends;
    var userData = {name: userName, email: userEmail, password: userPassword, friends: userFriends};
    userDatabase.push(userData);
});
console.log(userDatabase);

//create a list of possible current locations to center the map on  (note: need to pull this dynamically)
var losAngeles = {lat: 34.0554665, lng: -118.30951240000002};
var sanFrancisco = {lat: 34.0554665, lng: -118.30951240000002};

//store the currently logged-in user, so we know who to display information and develop needed info for this user
var currentLocation = losAngeles;
var currentUser = "bill@gmail.com";
//create list of friends
var currentUserFriends = [];
currentUserFriends.push(currentUser); //add the current user to the list so that the users reviews will appear in addition to friends
for (var i = 0; i < userDatabase.length; i++){
    if (userDatabase[i].email === currentUser){
        currentUserFriends = userDatabase[i].friends;
    }
}
//create a list of restaurants that your friends have reviewed
var restaurantList = [];
for (var i = 0; i < restaurantDatabase.length; i++){
    //for this restaurant, loop through the reviews to see if it was reviewed by your friends
    var restaurantObject = restaurantDatabase[i];
    var restaurantReviews = restaurantDatabase[i].reviews;
    for (var j = 0; j < restaurantReviews.length; j++){
        //if the reviewer is on your list of friends, add it to your list of restaurants
        var reviewAuthor = restaurantReviews[j].reviewer;
        if (currentUserFriends.indexOf(reviewAuthor) != -1){
            restaurantList.push(restaurantObject);
        };
    };
};

//this function creates the HTML that will be put in the marker's infowindow
function createMarkerContent(restaurant){
    var markerHTML = "<div>";  //start the marker content with an open div tag
    markerHTML = markerHTML + "<h3>" + restaurant.name + "</h3>";
    markerHTML = markerHTML + "<p>" + restaurant.location + "</p>";
    var allReviews = restaurant.reviews;
    for (var j = 0; j < allReviews.length; j++){  //add all the reviews
        //start each individual review with a new div
        markerHTML = markerHTML + "<div class='review-wrapper'>";
        //add the reviewer name
        markerHTML = markerHTML + "<p class='review-author'>" + allReviews[j].reviewer + " says: </p>";
        //add the reviewer's text review
        markerHTML = markerHTML + "<p>" + allReviews[j].text + "</p>";
        //add all images saved along with the review
        var reviewImages = allReviews[j].images;
        if (reviewImages != undefined){  //only do the following if the review includes an "images" array 
            for (var k = 0; k < reviewImages.length; k++) {  //for each image in the "images" array...
            markerHTML = markerHTML + "<img src='" + reviewImages[k] +"' class='review-image'>"; //add it to the marker content html 
            };
        };
        //close the review wrapper for this tag 
        markerHTML = markerHTML + "</div>";
    }
    markerHTML = markerHTML + "</div>"; //add the closing div tag;
    return markerHTML;
}

//create a map and place initial markers
function initMap() {
    //declare variables
    var mapCenter = currentLocation;
    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: mapCenter
    });
    console.log("map created")
    //place the markers from the restaurant list array
    for (var i = 0; i < restaurantList.length; i++) {
        //create the marker
        var marker = new google.maps.Marker({
            position: restaurantList[i].location,
            map: map,  //set which map to place the marker on
            title: restaurantList[i].name,
            animation: google.maps.Animation.DROP
        });
        //create the info window
        var infowindow = new google.maps.InfoWindow(); 
        //assign the infowindow to the marker
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function(){
                infowindow.open(map, marker); //tell the infowindow what map and marker to open on
                var markerContent = createMarkerContent(restaurantList[i]);  //create the conent for the info marker
                infowindow.setContent(markerContent); //place the content in the marker
            }
        })(marker, i));
        //testing console log
        console.log("marker created");
    };
};
