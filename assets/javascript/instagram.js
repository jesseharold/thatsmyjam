$("document").ready(function(){

//var database = firebase.database();
var endpoint = "https://api.instagram.com/v1/";
var token; //auth token required by instragram API
var igQueryOwnPhotos = "users/self/media/recent?";
var igQueryTag = "tags/thatsmyjam/media/recent?";
var igQuerySearch = "media/search?";
var geoLocation;

//check for auth token and store
if (location.href.indexOf("#") > 0){
    var authTokenString = location.href.split("#").pop();
    var authToken = authTokenString.split("=");
    if (authToken[0] === "access_token"){
        $("#login").hide();
        token = authToken[1];
        getOwnUserInfo();
        getLocation();
        getOwnImages();
    }
}

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
    database.ref("users").once('value', function(snapshot) {
        var snapObject = snapshot.val();
        if (snapObject && snapObject[dataFromIg.id]){
            //console.log("updating existing user "+dataFromIg.id);
            database.ref("users/"+dataFromIg.id).update(user);
        } else {
            //console.log("creating new user "+dataFromIg.id);
            database.ref("users/"+dataFromIg.id).set(user);
        }
    });

    // for all: update friends list
    updateFriendList(dataFromIg.id);
}//function updateUser

function doesImageExist(id){
    var imageExists = false;
    database.ref("restaurants").once('value', function(snapshot) {
        snapshot.forEach(function(restaurantSnapshot) {
                if (restaurantSnapshot.hasChild("reviews")){
                    var reviews = restaurantSnapshot.child("reviews").val();
                    for (var i = 0; i < reviews.length; i++){
                        if(reviews.imageId == id){
                            imageExists = true;
                        }
                    }
                }
        });
        return imageExists;
    });
}//function doesImageExist

function doesRestaurantExist(id){
    var imageExists = false;
    database.ref("restaurants").once('value', function(snapshot) {
        snapshot.forEach(function(restaurantSnapshot) {
                if (restaurantSnapshot.hasChild("reviews")){
                    var reviews = restaurantSnapshot.child("reviews").val();
                    for (var i = 0; i < reviews.length; i++){
                        if(reviews.imageId == id){
                            imageExists = true;
                        }
                    }
                }
        });
        return imageExists;
    });
}//function doesImageExist

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
    // check user's friends list against user DB
    // create a second friends list of only other TMJ users
    database.ref("users").once('value', function(snapshot) {
        var allFriends = snapshot.child(userID).child("friends").val();
        var myTMJFriends = [];
        for (var i = 0; i < allFriends.length; i++ ){
            if (snapshot.hasChild(allFriends[i])){
                myTMJFriends.push(allFriends[i]);
            }
        }
        //console.log("myTMJFriends: " + myTMJFriends);
        database.ref("users").child(userID).child("friends-users").set(myTMJFriends);
        getFriendsImages(myTMJFriends);
    });
}

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
}

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
        for (var i = 0; i < dataFromIg.data.length; i++) {  
            if (dataFromIg.data[i].type === "image"){
                //look for the thatsmyjam hashtag
                if (hasHashTag(dataFromIg.data[i].tags)){
                    // create current round of images
                    createNewReview(dataFromIg.data[i]);
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

function createNewReview(imageData){
    // check if this image is already in the DB as a review
    // if it is, do nothing, which will allow our reviews to
    // have custom text, and not get overwritten
    database.ref("restaurants").once('value', function(snapshot) {
        var reviewExists = false;
        snapshot.forEach(function(childSnapshot) {
            if(childSnapshot.hasChild("reviews")){
                var reviewsArray = childSnapshot.child("reviews").val();
                for (var i = 0; i < reviewsArray.length; i++){
                    if(reviewsArray[i].review_id  ==  imageData.id){
                        reviewExists = true;
                    }
                }
            }

        });
        // if review doesn't already exist, add it
        if(!reviewExists){
            doAddReview(imageData);
        }
    });
}//function createNewReview

function doAddReview(imageData){
    var thisImage = {
        review_id: imageData.id,
        thumbnail: imageData.images.thumbnail.url,
        image: imageData.images.standard_resolution.url,
        text: imageData.caption.text,
        author: imageData.caption.from.id
    };


    database.ref("restaurants").once('value', function(snapshot) {
        var restaurantExists = false;
        snapshot.forEach(function(childSnapshot) {
            console.log(imageData.location.name);
            console.log(childSnapshot.child("lat").val() + ", " + childSnapshot.child("lng").val());
            console.log(imageData.location.latitude + ", " + imageData.location.longitude);
            if(childSnapshot.child("lat").val() == imageData.location.latitude && childSnapshot.child("lng").val() == imageData.location.longitude){
                console.log("equal");
                restaurantExists = true;
            } else {
                console.log("not equal");
            }
        });
        // if review doesn't already exist, add it
        if(restaurantExists){
            console.log("restaurant already exists, don't add: " + imageData.location.name);
            // restaurant already exists
            // push this image to that restaurant_name's reviews array
        } else {
            // add new restaurant, and add this image
            
            console.log("add new restaurant: " + imageData.location.name);
            var thisRestaurant = {};
            if(imageData.location){
                if(imageData.location.name){
                    thisRestaurant.name = imageData.location.name;
                }
                if(imageData.location.latitude){
                    thisRestaurant.lat = imageData.location.latitude;
                }
                if(imageData.location.longitude){
                    thisRestaurant.lng = imageData.location.longitude;
                }
            } else {
                console.log("An image was imported with no location information, it will not be displayed on any maps. Please make sure to tag all Instagram photos with a location.");
//          promptForLocation(imageData);
            }
            var allReviews = [];
            allReviews.push(thisImage);
            thisRestaurant.reviews = allReviews;
            database.ref("restaurants").push(thisRestaurant);
        }
    });
}// function doAddReview

function promptForLocation(imageData){
// this is in the icebox, but it would be nice to add down the road.
// probably should pass in a way to ref. this review in the database
// once that exists
}

function promptForReviews(imageData){
// cycle through a user's reviews
// create a local array of images that have no thumbs up/down value
// in a modal ask the user if they'd like to add them now, say how many
// if yes, 
//   - show images one at a time, 
//   - show buttons of thumbs
//   - show existing text, allow them to edit it and click submit
//   - on submit, update database and show next image until done
//   - say thaks on done
}

});//document ready