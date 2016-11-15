$("document").ready(function(){
                
var database = firebase.database();
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
    //console.log(doesUserExist(dataFromIg.id));
    if (doesUserExist(dataFromIg.id)){
        console.log("updating existing user "+dataFromIg.id);
        database.ref("users/"+dataFromIg.id).update(user);
    } else {
        console.log("creating new user "+dataFromIg.id);
        database.ref("users/"+dataFromIg.id).set(user);
    }

    // for all: update friends list
    updateFriendList(dataFromIg.id);
}//function updateUser

function doesUserExist(id){
    var userExists = false;
    database.ref("users").once('value', function(snapshot) {
        console.log(snapshot.val());
        if (snapshot.hasChild(id)){
            userExists = true;
        }
        return userExists;
    });
}//function doesUserExist

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
            myFriends.push(response.data[i].id);
            if (doesUserExist(response.data[i].id)){
                myTMJFriends.push(response.data[i].id);
            }
        }
        database.ref("users").child(userID).child("friends").set(myFriends);
        database.ref("users").child(userID).child("friends-users").set(myTMJFriends);
        getFriendsImages(myTMJFriends);
    })
    .fail(function(error){
        console.error(error);
    });
}//function updateFriendList

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
    // if it doesn't exist, add it
    if(!doesImageExist(imageData.id)){
        var thisImage = {
            id: imageData.id,
            thumbnail: imageData.images.thumbnail.url,
            image: imageData.images.standard_resolution.url,
            review: imageData.caption
        };
        if(imageData.location){
            if(imageData.location.name){
                thisImage.restaurant_name = imageData.location.name;
            }
            if(imageData.location.latitude){
                thisImage.lat = imageData.location.latitude;
            }
            if(imageData.location.longitude){
                thisImage.lng = imageData.location.longitude;
            }
        } else {
            //promptForLocation(imageData);
        }
        //promptForReview();
        //console.log(thisImage);
        // if location exists
        // add this image to that restaurant_name
        // else
        // add new restaurant, and add this image
    }//initial if
}//function createNewReview

function displayReview(){
 /* NO LONGER USED
    var thumbnail = $("<img>");
    thumbnail
        .attr("src", imageData.images.thumbnail.url)
        .addClass("thumbnail");
    $("#response").append(thumbnail);
*/
}//function displayReview

function promptForLocation(imageData){
    // this is in the icebox, but it would be nice to add down the road.
    // probably should pass in a way to ref. this review in the database
    // once that exists
}

});//document ready