<<<<<<< HEAD
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
=======
//TEST DATA - locations
//create a list of possible current locations to center the map on  (note: need to pull this dynamically)
var LA = {lat: 34.0554665, lng: -118.30951240000002};
var SF = {lat: 37.7749, lng: -122.4194}; 
//TEST DATA - current user
//store the currently logged-in user info locally, so we know who to display information and develop needed info for this user
var currentLocation = SF;
var currentUser = "bill@gmail.com";
var friendsList = ["4147363198", "4147363198", "4149753642"];

//database references
var restaurantData = database.ref("/restaurants");

//this function creates the HTML that will be put in the marker's infowindow
function createMarkerContent(restaurant, callback){
    //start the marker content with an open div tag
    
    //add restaurants address
    latLngToAddress(restaurant.lat, restaurant.lng, function(result){
        var markerHTML = "<div>";  
        var address;
        //add restaurants name
        markerHTML = markerHTML + "<h3>" + restaurant.name + "</h3>";
        address = result;
        console.log("callback executed");
        markerHTML = markerHTML + "<p>" + address + "</p>"; 
        //add restaurants reviews
        var allReviews = restaurant.reviews;
        console.log(allReviews);
        for (var j = 0; j < allReviews.length; j++){  //loop through all the reviews for the restaurant
            if (friendsList.indexOf(allReviews[j].author) >= 0){  //if the reviewer is on the friendsList then proceed...  
                //start each individual review with a new div
                markerHTML = markerHTML + "<div class='review-wrapper'>";
                //add the reviewer name
                markerHTML = markerHTML + "<p class='review-author'>" + allReviews[j].author + " says: </p>";
                //add the reviewer's text review
                markerHTML = markerHTML + "<p>" + allReviews[j].text + "</p>";
                //add all images saved along with the review
                markerHTML = markerHTML + "<img src='" + allReviews[j].image +"' class='review-image'>"; //add it to the marker content html
                // the below block can be used to add multiple images if they are in an array
                // var reviewImages = allReviews[j].image;
                // if (reviewImages != undefined){  //only do the following if the review includes an "images" array 
                //     for (var k = 0; k < reviewImages.length; k++) {  //for each image in the "images" array...
                //     markerHTML = markerHTML + "<img src='" + reviewImages[k] +"' class='review-image'>"; //add it to the marker content html 
                //     };
                // };

                //close the review wrapper for this tag 
                markerHTML = markerHTML + "</div>";
>>>>>>> 576f4e620f76ef9c2702c9214ba62d5720688f8e
            };
            //close the review wrapper for this tag 
            markerHTML = markerHTML + "</div>";
        };
<<<<<<< HEAD
    };
    markerHTML = markerHTML + "</div>"; //add the closing div tag;
    return markerHTML;
=======
        markerHTML = markerHTML + "</div>"; //add the closing div tag;
        callback(markerHTML);
    });
    
>>>>>>> 576f4e620f76ef9c2702c9214ba62d5720688f8e
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

    //code for geocoder
    var geocoder = new google.maps.Geocoder();
    document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(geocoder, map);
    });
};

<<<<<<< HEAD
//look at all the children (restaurants) in the restaurant database & place a marker if reviewed by one of your friends
database.ref("/restaurantData").on("child_added", function(childSnap){
=======
//geocorder for changing the map's center
function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);
        } else {
        alert('Geocode was not successful for the following reason: ' + status);
        };
    });
}

//function to find a place ID from a lat and lng
function latLngToPlaceId(latLng){
    var geocoder = new google.maps.Geocoder();
    var lat = latLng.lat;
    var lng = latLng.lng;
    geocoder.geocode({'lat': lat, 'lng': lng}, function(results, status) {
        if (status === "OK") {
            console.log(results[0].XXX);
            return results[0].XXX;
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        };
    });
}

//function to find an address from a lat and lng 
function latLngToAddress(latitude, longitude, callback){
    var geocoder = new google.maps.Geocoder();
    var latlng = {lat: latitude, lng: longitude};
    var address = "error";
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === "OK") {
            console.log(results[0].formatted_address)
            address = results[0].formatted_address;
            callback(address);
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        };
    });
}

//look at all the children (restaurants) in the restaurant database & place a marker if reviewed by one of your friends
database.ref("/restaurants").on("child_added", function(childSnap){
>>>>>>> 576f4e620f76ef9c2702c9214ba62d5720688f8e
    //check to see if the restaurant was reviewed by a friend
    var display = false;  //we will assume we do not have a review from a friend
    var reviews = childSnap.val().reviews; //store the array that has all the reviews
    for (var i = 0; i < reviews.length; i++){  //loop over the array looking at each review..
<<<<<<< HEAD
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
=======
        if (friendsList.indexOf(reviews[i].author) >= 0){ //for each reivew, if the author is in your friends list... 
            display = true;  //then display is true.
        };
    };
    //if it was reviewed by a friend, display the restaurant and include all of the friend reviews
    // console.log (display, childSnap.val());
    if (display === true){  
        //create the marker
        var marker = new google.maps.Marker({
            position: {lat: childSnap.val().lat, lng: childSnap.val().lng},
>>>>>>> 576f4e620f76ef9c2702c9214ba62d5720688f8e
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
<<<<<<< HEAD
                var markerContent = createMarkerContent(childSnap.val());  //create the conent for the info marker
                infowindow.setContent(markerContent); //place the content in the marker
=======
                var markerContent = createMarkerContent(childSnap.val(), function(content){
                    infowindow.setContent(content)  //place the content in the marker
                });  //create the conent for the info marker
>>>>>>> 576f4e620f76ef9c2702c9214ba62d5720688f8e
            }
        })(marker));
        //testing console log
        console.log("marker created");
    };
        
<<<<<<< HEAD
});


//geocorder for relocating map
function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);
        } else {
        alert('Geocode was not successful for the following reason: ' + status);
        }
    });
    }
=======
});
>>>>>>> 576f4e620f76ef9c2702c9214ba62d5720688f8e
