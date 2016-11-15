//create a list of possible current locations to center the map on  (note: need to pull this dynamically)
var losAngeles = {lat: 34.0554665, lng: -118.30951240000002};
var sanFrancisco = {lat: 34.0554665, lng: -118.30951240000002};
//store the currently logged-in user, so we know who to display information and develop needed info for this user
var currentLocation = losAngeles;
var currentUser = "bill@gmail.com";
var friendsList = ["harold@gmail.com", "eric@gmail.com"];

//this function creates the HTML that will be put in the marker's infowindow
function createMarkerContent(restaurant){
    var markerHTML = "<div>";  //start the marker content with an open div tag
    markerHTML = markerHTML + "<h3>" + restaurant.name + "</h3>";
    markerHTML = markerHTML + "<p>" + restaurant.location + "</p>";
    var allReviews = restaurant.reviews;
    for (var j = 0; j < allReviews.length; j++){  //loop through all the reviews for the restaurant
        if (friendsList.indexOf(allReviews[j].reviewer) >= 0){  //if the reviewer is on the friendsList then proceed... to add the review  
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
        };
    };
    markerHTML = markerHTML + "</div>"; //add the closing div tag;
    return markerHTML;
}

//create a map
var map;
function initMap() {
    //declare variables
    var mapCenter = currentLocation;
    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: mapCenter
    });
    console.log("map created")
};

//look at all the children (restaurants) in the restaurant database & place a marker if reviewed by one of your friends
database.ref("/restaurantData").on("child_added", function(childSnap){
    //check to see if the restaurant was reviewed by a friend
    var display = false;  //we will assume we do not have a review from a friend
    var reviews = childSnap.val().reviews; //store the array that has all the reviews
    for (var i = 0; i < reviews.length; i++){  //loop over the array looking at each review..
        if (friendsList.indexOf(reviews[i].reviewer) >= 0){ //for each reivew if any of the friends wrote the review 
            display = true;  //then display is true
        };
    };
    //if it was reviewed by a friend, display the restaurant and include all of the friend reviews
    console.log (display, childSnap.val())
    if (display === true){  
        //create the marker
        var marker = new google.maps.Marker({
            position: childSnap.val().location,
            map: map,  //set which map to place the marker on
            title: childSnap.val().name,
            animation: google.maps.Animation.DROP
        });
        //create the info window
        var infowindow = new google.maps.InfoWindow(); 
        //assign the infowindow to the marker
        google.maps.event.addListener(marker, 'click', (function(marker) {
            return function(){
                infowindow.open(map, marker); //tell the infowindow what map and marker to open on
                var markerContent = createMarkerContent(childSnap.val());  //create the conent for the info marker
                infowindow.setContent(markerContent); //place the content in the marker
            }
        })(marker));
        //testing console log
        console.log("marker created");
    }
        
});
