$("document").ready(function(){

//var database = firebase.database();
//using firebase info from firebase.js
var endpoint = "https://api.instagram.com/v1/";
var token; //auth token required by instragram API
var igQueryOwnPhotos = "users/self/media/recent?";
var igQueryTag = "tags/thatsmyjam/media/recent?";
var igQuerySearch = "media/search?";
var geoLocation;
var localCopyRestaurants;
var localCopyUsers;
var dataready=0;

//check for auth token and store
if (location.href.indexOf("#") > 0){
    var authTokenString = location.href.split("#").pop();
    var authToken = authTokenString.split("=");
    if (authToken[0] === "access_token"){
        $("#login").hide();
        token = authToken[1];
        initializeApp();
    }
}

function initializeApp(){
    //listen for changes to DB to keep localCopyRestaurants updated
    database.ref("restaurants").on("value", function(snapshot){
        localCopyRestaurants = snapshot.val();
        //console.log(localCopyRestaurants);
        dataready++;
        if(dataready === 2){
            //check to see if both sets of data are ready
            getOwnUserInfo();
            getOwnImages();
        }
    });
    //listen for changes to DB to keep localCopyUsers updated
    database.ref("users").on("value", function(snapshot){
        localCopyUsers = snapshot.val();
        //console.log(localCopyUsers);
        dataready++;
        if(dataready === 2){
            //check to see if both sets of data are ready
            getOwnUserInfo();
            getOwnImages();
        }
    });
    //getLocation();
}//function initializeApp

function getLocation(){
    $.get("https://ipinfo.io", function(response) {
        var location = response.loc;
        geoLocation = location.split(",");
    }, "jsonp");
}//function getLocation

function getOwnUserInfo(){
    $.ajax({
        url: endpoint + "users/self/?" + "access_token=" + token,
        method: 'GET',
        dataType: "jsonp"
    })
    .done(function(response) {
        updateUser(response.data);
    })
    .fail(function(error){
        console.error(error);
    });
}//function getOwnUserInfo(){

function updateUser(dataFromIg){
    //console.log(dataFromIg);
    var user = {
        name: dataFromIg.full_name,
        id: dataFromIg.id,
        username: dataFromIg.username,
        profilePicture: dataFromIg.profile_picture
    };
    // check to see if user already exists with this id
    if (localCopyUsers && localCopyUsers[dataFromIg.id]){
        console.log("updating existing user "+dataFromIg.id);
        database.ref("users/"+dataFromIg.id).update(user);
    } else {
        console.log("creating new user "+dataFromIg.id);
        database.ref("users/"+dataFromIg.id).set(user);
    }
    // for all: update friends list
    updateFriendList(dataFromIg.id);
}//function updateUser

function updateFriendList(userID){
    $.ajax({
        url: endpoint + "users/self/follows?" + "scope=follower_list&" + "access_token=" + token,
        method: 'GET',
        dataType: "jsonp"
    })
    .done(function(response) {
        var myFriends = [];
        var myTMJFriends = [];
        for (var i = 0; i < response.data.length; i++){
            var thisFriend = response.data[i].id;
            myFriends.push(thisFriend);
        }
        database.ref("users").child(userID).child("friends").set(myFriends);
        filterFriends(userID);
    })
    .fail(function(error){
        console.error(error);
    });
}//function updateFriendList

function filterFriends(userID){
    // check user's friends list against existing users
    // create a second friends list of only other TMJ users
    var allFriends = localCopyUsers[userID].friends;
    var myTMJFriends = [];
    for (var i = 0; i < allFriends.length; i++){
        if (localCopyUsers[allFriends[i]]){
            myTMJFriends.push(allFriends[i]);
        }
    }
    //console.log("myTMJFriends: " + myTMJFriends);
    database.ref("users").child(userID).child("friends-users").set(myTMJFriends);
    getFriendsImages(myTMJFriends);
}//function filterFriends

function getFriendsImages(myFriends){
     $.ajax({
        url: endpoint + igQueryTag + "scope=public_content&" + "access_token=" + token,
        method: 'GET',
        dataType: "jsonp"
    })
    .done(function(response) {
        processImages(response);
    })
    .fail(function(error){
        console.error(error);
    });
}//function getFriendsImages

function getOwnImages(){
    $.ajax({
        url: endpoint + igQueryOwnPhotos + "access_token=" + token,
        method: 'GET',
        dataType: "jsonp"
    })
    .done(function(response) {
        //console.log(response.data);
        processImages(response);
        promptForReviews();
    }).fail(function(err){
        console.error("Failed: " + err);
    });
}//function getOwnImages

function processImages(dataFromIg){
    if(dataFromIg.meta.code === 200){
        var reviewsToAdd = [];
        for (var i = 0; i < dataFromIg.data.length; i++) { 
            var thisImageData = dataFromIg.data[i];
            if (thisImageData.type === "image"){
                //look for the thatsmyjam hashtag
                // don't add if it's already in DB
                if (hasHashTag(thisImageData.tags) && !checkReviewExists(thisImageData)){
                    var existingRestaurantKey = checkRestaurantExists(thisImageData);
                    if(existingRestaurantKey){
                        addReviewToExistingRestaurant(thisImageData, existingRestaurantKey);
                    } else {
                        addReviewAndNewRestaurant(thisImageData);
                    }
                }
            }
        }
    } else {
        console.error("meta error: " + dataFromIg.meta.code);
    }

}// function processImages

function hasHashTag(imageTags){
    var foundHashTag = false;
    //loop through all hashtags on this image
    for (var j = 0; j < imageTags.length; j++){
        if(imageTags[j].toLowerCase() === "thatsmyjam"){
            foundHashTag = true;
        }
    }
    return foundHashTag;
}//function hasHashTag

function checkReviewExists(imageData){
    // check if this image is already in the DB as a review
    // if it is, do nothing, which will allow our reviews to
    // have custom text, and not get overwritten
    var reviewExists = false;
    for (var restaurant in localCopyRestaurants){
        if(restaurant.reviews){
            for(var i = 0; i < restaurant.reviews.length; i++){
                if(restaurant.reviews[i].review_id === imageData.id){
                    reviewsExists = true;
                    console.log("found matching review");
                    return reviewsExists;
                }
            }
        }
    }
    console.log("didn't find matching review");
    return reviewExists
}//function checkReviewExists

function checkRestaurantExists(imageData){
    var existingRestaurantKey;
    if(imageData.location){
        for(var restaurant in localCopyRestaurants){
            console.log(restaurant);
            //console.log(restaurant.lat + "===?" + imageData.location.latitude);
            //console.log(restaurant.lng + "===?" + imageData.location.longitude);
            if(restaurant.lat === imageData.location.latitude 
            && restaurant.lng === imageData.location.longitude){
                existingRestaurantKey = restaurant;
                console.log("true! duplicate key: " + restaurant);
                return restaurant;
            }
        }
    } else { // if no location is set for this image
        promptForLocation(imageData);
    }
    return false;
}// function checkRestaurantExists

function addReviewToExistingRestaurant(imageData, key){
    var thisImage = {
        review_id: imageData.id,
        thumbnail: imageData.images.thumbnail.url,
        image: imageData.images.standard_resolution.url,
        text: imageData.caption.text,
        author: imageData.caption.from.id
    };
    console.log("restaurant already exists, add review to: " + imageData.location.name);
    // restaurant already exists
    // push this image to that restaurant_name's reviews array
    database.ref("restaurants/"+key).push(imageData);
}//function addReviewToExistingRestaurant

function addReviewAndNewRestaurant(imageData){
    var thisImage = {
        review_id: imageData.id,
        thumbnail: imageData.images.thumbnail.url,
        image: imageData.images.standard_resolution.url,
        text: imageData.caption.text,
        author: imageData.caption.from.id
    };
    // add new restaurant, and add this image
    console.log("add new restaurant: " + imageData.location.name);
    var thisRestaurant = {};
    if(imageData.location.name){
        thisRestaurant.name = imageData.location.name;
    }
    if(imageData.location.latitude){
        thisRestaurant.lat = imageData.location.latitude;
    }
    if(imageData.location.longitude){
        thisRestaurant.lng = imageData.location.longitude;
    }
    var allReviews = [];
    allReviews.push(thisImage);
    thisRestaurant.reviews = allReviews;
    database.ref("restaurants").push(thisRestaurant);
}//function addReviewAndNewRestaurant

function promptForLocation(imageData){
// this is in the icebox, but it would be nice to add down the road.
// probably should pass in a way to ref. this review in the database
// once that exists
    console.log("An image was imported with no location information, it will not be displayed on any maps. Please make sure to tag all Instagram photos with a location.");
}

function promptForReviews(imageData){
// cycle through a user's reviews
// create a local array of images that have no thumbsup/down value
// in a modal ask the user if they'd like to add them now, say how many
// if yes, 
//   - show images one at a time, 
//   - show buttons of thumbs
//   - show existing text, allow them to edit it and click submit
//   - on submit, update database and show next image until done
//   - say thaks on done
}

});//document ready