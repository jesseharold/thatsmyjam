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
    database.ref("users").once('value', function(snapshot) {
    // check to see if user exists with this id
    var userExists = false;
        snapshot.forEach(function(childSnapshot) {
            if (childSnapshot.hasChild("id")){
                var childData = childSnapshot.child("id").val();
                if (childData == dataFromIg.id){
                    userExists = true;
                }
            }
        });
        if (userExists){
            database.ref("users").child(dataFromIg.id).update(user);
        } else {
            database.ref("users").push(user);
        }
    });
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
        //console.log(response);
        var myFriends = [];
        for (var i = 0; i < response.data.length; i++){
            myFriends.push(response.data[i].id);
        }
        database.ref("users").child(userID).child("friends").set(myFriends);
        getFriendsImages(myFriends);
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
        console.log("getFriendsImages: " + response);
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
        if(response.meta.code === 200){
            for (var i = 0; i < response.data.length; i++) {  
                if (response.data[i].type === "image"){
                    //look for the thatsmyjam hashtag
                    if (hasHashTag(response.data[i].tags)){
                        // create current round of images
                        createNewReview(response.data[i]);
                    }
                }
            }
        } else {
            console.error("meta error: "+response.meta.code);
        }
    }).fail(function(err){
        console.error("Failed: " + err);
    });
}//function getOwnImages

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
    var thumbnail = $("<img>");
    thumbnail
        .attr("src", imageData.images.thumbnail.url)
        .addClass("thumbnail");
    $("#response").append(thumbnail);
    // get location information
    if(imageData.location){
        if(imageData.location.name){
            $("#response").append("<div class='restaurant-name'>" + "restaurant name: " + imageData.location.name);
        }
        if(imageData.location.latitude){
            $("#response").append("<div class='restaurant-coords'>" + "latitude: " + imageData.location.latitude);
        }
        if(imageData.location.longitude){
            $("#response").append("<div class='restaurant-coords'>" + "longitude: " + imageData.location.longitude);
        }
    } else {
        //promptForLocation(imageData);
    }
}//function createNewReview

function promptForLocation(imageData){
    // this is in the icebox, but it would be nice to add down the road.
    // probably should pass in a way to ref. this review in the database
    // once that exists
}

});//document ready