//var database = firebase.database();
//using firebase info from firebase.js
var instagramEndpoint = "https://api.instagram.com/v1/";
var instagramAuthToken; //auth token required by instragram API
var instagramQueryOwnPhotos = "users/self/media/recent?";
var instagramQueryTag = "tags/thatsmyjam/media/recent?";
var instagramQuerySearch = "media/search?";
var geoLocation;
var localCopyRestaurants;
var localCopyUsers;
var currentUserId;
var instagramDataReady=0;

function checkForAuthToken(){
    //check for auth token and store
    if (location.href.indexOf("#") > 0){
        var authTokenString = location.href.split("#").pop();
        var authToken = authTokenString.split("=");
        if (authToken[0] === "access_token"){
            $("#login").hide();
            instagramAuthToken = authToken[1];
            document.cookie = "authToken=" + instagramAuthToken;
            initializeApp();
        }
    } else {
        //look for token value in cookies
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++){
            var cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf("authToken=") === 0) {
                instagramAuthToken = cookie.substring(10, cookie.length);
                initializeApp();
            }
        }
    }
}

function initializeApp(){
    //listen for changes to DB to keep localCopyRestaurants updated
    database.ref("restaurants").on("value", function(snapshot){
        localCopyRestaurants = snapshot.val();
        //console.log(localCopyRestaurants);
        instagramDataReady++;
        if(instagramDataReady === 2){
            //check to see if both sets of data are ready
            getOwnUserInfo();
            getOwnImages();
        }
    });
    //listen for changes to DB to keep localCopyUsers updated
    database.ref("users").on("value", function(snapshot){
        localCopyUsers = snapshot.val();
        //console.log(localCopyUsers);
        instagramDataReady++;
        if(instagramDataReady === 2){
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
        url: instagramEndpoint + "users/self/?" + "access_token=" + instagramAuthToken,
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
    var user = {
        name: dataFromIg.full_name,
        id: dataFromIg.id,
        username: dataFromIg.username,
        profilePicture: dataFromIg.profile_picture
    };
    // check to see if user already exists with this id
    if (localCopyUsers && localCopyUsers[dataFromIg.id]){
        database.ref("users/"+dataFromIg.id).update(user);
    } else {
        database.ref("users/"+dataFromIg.id).set(user);
    }
    // for all: store ID locally and update friends list
    currentUserId = dataFromIg.id;
    updateFriendList(dataFromIg.id);
}//function updateUser

function updateFriendList(userID){
    $.ajax({
        url: instagramEndpoint + "users/self/follows?" + "scope=follower_list&" + "access_token=" + instagramAuthToken,
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
    if(allFriends){
        for (var i = 0; i < allFriends.length; i++){
            if (localCopyUsers[allFriends[i]]){
                myTMJFriends.push(allFriends[i]);
            }
        }
    }
    database.ref("users").child(userID).child("friends-users").set(myTMJFriends);
    getFriendsImages(myTMJFriends);
    // call function on the user interface to populate visible friends list
    populateFriendsList(myTMJFriends);
    createMarkers(myTMJFriends);
}//function filterFriends

function populateFriendsList(arrayOfIDs) {
    var completedFriends = $("<ul>")
        .addClass("demo-list-control")
        .addClass("mdl-list")
        .addClass("friendlist");
    //loop through array of friends' user IDs, build html
    for(var i = 0; i < arrayOfIDs.length; i++){
        var friendID = arrayOfIDs[i];
        var listTagFriend = $('<li>').addClass("mdl-list__item");
        var spanTagFriend = $('<span>').addClass("mdl-list__item-primary-content");
        listTagFriend.append(spanTagFriend);

        var imageTagFriend = $('<img>')
            .addClass("mdl-list__item-avatar")
            .attr("src", localCopyUsers[friendID].profilePicture);
        spanTagFriend
            .append(imageTagFriend)
            .append(localCopyUsers[friendID].name);

        var spanCheckmark = $('<span>').addClass("mdl-list__item-secondary-action");
        spanTagFriend.after(spanCheckmark);

        var labelCheckmark = $('<label>')
            .addClass("mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect")
            .attr("for", "list-checkbox-" + i);
        var inputCheckmark = $('<input>')
            .addClass("mdl-checkbox__input")
            .attr("type", "checkbox")
            .attr("id", "list-checkbox-" + i)
            .attr("checked", "");
    
        spanCheckmark.append(labelCheckmark);
        labelCheckmark.append(inputCheckmark);

        completedFriends.append(listTagFriend);    
        //console.log(completedFriend);
    }
    $(".mdl-layout__drawer-right").append(completedFriends);
}


function getFriendsImages(myFriends){
     $.ajax({
        url: instagramEndpoint + instagramQueryTag + "scope=public_content&" + "access_token=" + instagramAuthToken,
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
        url: instagramEndpoint + instagramQueryOwnPhotos + "access_token=" + instagramAuthToken,
        method: 'GET',
        dataType: "jsonp"
    })
    .done(function(response) {
        processImages(response);
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
        if(localCopyRestaurants[restaurant].reviews){
            for(review in localCopyRestaurants[restaurant].reviews){
                if(localCopyRestaurants[restaurant].reviews[review].review_id === imageData.id){
                    reviewsExists = true;
                    return reviewsExists;
                }
            }
        }
    }
    return reviewExists
}//function checkReviewExists

function checkRestaurantExists(imageData){
    var existingRestaurantKey;
    if(imageData.location){
        for(var restaurant in localCopyRestaurants){
            if(hasSameLocation(localCopyRestaurants[restaurant].lat, localCopyRestaurants[restaurant].lng,
            imageData.location.latitude, imageData.location.longitude)){
                // duplicate entry, return the key
                existingRestaurantKey = restaurant;
                return restaurant;
            }
        }
    }// else { // if no location is set for this image
        //promptForLocation(imageData);
        //iceboxed
    //}
    return false;
}// function checkRestaurantExists

function hasSameLocation(lat1, lng1, lat2, lng2){
    //icebox feature: have two thresholds, one that's a for sure match
    //and one that triggers a text compare between the names, looks for
    //a high percentage of string match
    var sameLocation = false;
    var threshold = 0;
    if (Math.abs(lat1 - lat2) <= threshold && Math.abs(lng1 - lng2) <= threshold){
        sameLocation = true;
    }
    return sameLocation;
}

function addReviewToExistingRestaurant(imageData, key){
    // restaurant already exists, only need the review data
    var thisImage = {
        review_id: imageData.id,
        thumbnail: imageData.images.thumbnail.url,
        image: imageData.images.standard_resolution.url,
        text: imageData.caption.text,
        author: imageData.caption.from.id,
        thumb: "up"
    };
    // push this image to that restaurant_name's reviews array
    database.ref("restaurants/" + key + "/reviews").push(thisImage);
}//function addReviewToExistingRestaurant

function addReviewAndNewRestaurant(imageData){
    var thisImage = {
        review_id: imageData.id,
        thumbnail: imageData.images.thumbnail.url,
        image: imageData.images.standard_resolution.url,
        text: imageData.caption.text,
        author: imageData.caption.from.id,
        thumb: "up"
    };
    // add new restaurant, and add this image
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

//function promptForLocation(imageData){
// this is in the icebox, but it would be nice to add down the road.
// probably should pass in a way to ref. this review in the database
// once that exists
    //console.log("An image was imported with no location information, it will not be displayed on any maps. Please make sure to tag all Instagram photos with a location.");
//}

function openModal(content){
    var modalContainer = $("<div>").addClass("modalContainer");
    var modalBG = $("<div>").addClass("modalBackground");
    var modalContent = $("<div>").addClass("modalContent");
    modalContainer.append(modalBG);
    var modal = modalContainer.append(container);
    modal.append(content);
    $("body").append(modalContainer);
}

$("document").ready(function(){
checkForAuthToken();
});//document ready