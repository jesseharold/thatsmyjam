//define variables
var currentLocation = {lat: 37.7749, lng: -122.4194};  //test
var friendsList;
//database references
var restaurantData = database.ref("/restaurants");

console.log("bill test: map.js called");

//create a map
var map;
function initMap() {
    //declare variables
    var mapCenter = currentLocation;
    setAddressSuggest(currentLocation);
    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: mapCenter
    });
    console.log("bill test: map created")

    //code for geocoder
    var geocoder = new google.maps.Geocoder();
    document.getElementById('submit').addEventListener('click', function() {
        geocodeCenterMap(geocoder, map);
        $("#address").val("");
    });
}
function createMarkers(friendsListFromIG){
    friendsList = friendsListFromIG;
    console.log("createMarkers fired");
    //look at all the children (restaurants) in the restaurant database & place a marker if reviewed by one of your friends
    restaurantData.on("child_added", function(childSnap){
        console.log("child added fired")
        //check to see if the restaurant was reviewed by a friend
        var display = false;  //we will assume we do not have a review from a friend
        var reviews = childSnap.val().reviews; //store the array that has all the reviews
        for (var i = 0; i < reviews.length; i++){  //loop over the array looking at each review..
            if (friendsList && friendsList.indexOf(reviews[i].author) >= 0){ //for each reivew, if the author is in your friends list... 
                display = true;  //then display is true.
            };
        };
        //if it was reviewed by a friend, display the restaurant and include all of the friend reviews
        if (display === true){  
            //create the marker
            var marker = new google.maps.Marker({
                position: {lat: childSnap.val().lat, lng: childSnap.val().lng},
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
                    var markerContent = createMarkerContent(childSnap.val(), function(content){
                        infowindow.setContent(content)  //place the content in the marker
                    });  //create the conent for the info marker
                }
            })(marker));
            //testing console log
            console.log("marker created 2");
        };
            
    });
};


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
            if (friendsList && friendsList.indexOf(allReviews[j].author) >= 0){  //if the reviewer is on the friendsList then proceed...  
                //start each individual review with a new div
                markerHTML = markerHTML + "<div class='review-wrapper'>";
                //add the reviewer name
                markerHTML = markerHTML + "<p class='review-author'>" + allReviews[j].author + " says: </p>";
                //add the reviewer's text review
                markerHTML = markerHTML + "<p>" + allReviews[j].text + "</p>";
                //add all images saved along with the review
                markerHTML = markerHTML + "<img src='" + allReviews[j].image +"' class='review-image'>"; //add it to the marker content html

                //close the review wrapper for this tag 
                markerHTML = markerHTML + "</div>";
            };
        };
        markerHTML = markerHTML + "</div>"; //add the closing div tag;
        callback(markerHTML);
    });
}

//geocorder for changing the map's center
function geocodeCenterMap(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);
        } else {
        alert('Geocode was not successful for the following reason: ' + status);
        };
        //reset the value of the search box
        $("#address").attr("placeholder", address);
    })
}

//function to find an address from a lat and lng 
function latLngToAddress(latitude, longitude, callback){
    var geocoder = new google.maps.Geocoder();
    var latlng = {lat: latitude, lng: longitude};
    var address = "error finding address";
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

function setAddressSuggest(addressObject){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': addressObject}, function(results, status) {
        if (status === "OK") {
            console.log(results[0].address_components)
            $("#address").attr("placeholder", results[0].address_components[3].long_name)
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        };
    });
}
