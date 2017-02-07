$('#notif').click(function(){
    if($('.mdl-layout__drawer-right').hasClass('active')){       
        $('.mdl-layout__drawer-right').removeClass('active'); 
    }
    else{
        $('.mdl-layout__drawer-right').addClass('active'); 
    }
});

$('.mdl-layout__obfuscator-right').click(function(){
    if($('.mdl-layout__drawer-right').hasClass('active')){       
        $('.mdl-layout__drawer-right').removeClass('active'); 
    }
    else{
        $('.mdl-layout__drawer-right').addClass('active'); 
    }
});


$(document).on("click",".add-review-link", function(){
    addReviewModal();
});
function addReviewModal(){
    var formContainer = $("<div>");
    formContainer.append("<h3>Add a Review</h3>");
    formContainer.append("Restaurant Name* <input type='text' id='restaurantName'>");
    formContainer.append("<br>Thumbs* <i class='material-icons thumbs-icons'>thumb_up_outline</i> <input type='radio' name='thumb' value='up' id='thumbsUp'>");
    formContainer.append("<i class='material-icons thumbs-icons'>thumb_down_outline</i> <input type='radio' name='thumb' value='down' id='thumbsDown'>");
    formContainer.append("<br><textarea id='reviewText' rows='5' cols='20'>Review</textarea>");
    formContainer.append("<br>Location* <button id='useLocation'>Use Current Location</button><button id='enterAddress'>Enter Address</button>");
    formContainer.append("<br><button id='submitReview'>Add Review</button>");
    openModal(formContainer);
    $("body").on("click", "#useLocation", function(){
        $("#useLocation").data("location", currentLocation);
    });
    $("body").on("click", "#enterAddress", function(){
        $("#enterAddress").off().after("<br>Address: <input type='text' id='newReviewAddress1'><br>Address 2: <input type='text' id='newReviewAddress2'>");
    });
    $("body").on("click", "#submitReview", function(){
        if($(".modalContainer #newReviewAddress1").val()){
            addressToLatLng($(".modalContainer #newReviewAddress1").val()+$(".modalContainer #newReviewAddress2").val(), processReviewFromModal);
        } else {
            processReviewFromModal({
                lat: $(".modalContainer #useLocation").data("location").lat,
                lng: $(".modalContainer #useLocation").data("location").lng
            });
        }
    });
}

function processReviewFromModal(location){
    var reviewData = {
        location: {},
        images: {
            thumbnail: {url: ""},
            standard_resolution: {url: ""}
        },
        caption: {
            from: {}
        }
    };
    reviewData.caption.from.id = currentUserId;
    reviewData.caption.text = $(".modalContainer #reviewText").val();
    reviewData.location.name = $(".modalContainer #restaurantName").val();
    reviewData.location.latitude = location.lat;
    reviewData.location.longitude = location.lng;
    reviewData.id = "review" + Math.random()*99999999999999999;
    reviewData.thumb = $("input[name=thumb]:checked").val();
    var restaurantKey = checkRestaurantExists(reviewData);
    if (restaurantKey){
        addReviewToExistingRestaurant(reviewData, restaurantKey)
    } else {
        addReviewAndNewRestaurant(reviewData);
    }
    $("div.modalContainer").remove();
}//function processReviewFromModal


function openModal(content){
    var modalContainer = $("<div>").addClass("modalContainer");
    var modalBG = $("<div>").addClass("modalBG");
    var modalContent = $("<div>").addClass("modalContent");
    modalContainer.append(modalBG);
    modalContainer.append(modalContent);
    modalContent.append(content);
    $("body").append(modalContainer);
    $("body").on("click", ".modalBG", function(){
        $("div.modalContainer").remove();
    });
}

//Color the thumbs up or down
$(document).on("click","#thumbup", function(){
    if ($(this).hasClass('mdl-button mdl-js-button mdl-button--icon')){
    $(this).toggleClass('mdl-button--colored');
    componentHandler.upgradeDom();
    }
});

$(document).on("click","#thumbdown", function(){
    if ($(this).hasClass('mdl-button mdl-js-button mdl-button--icon')){
    $(this).toggleClass('mdl-button--colored');
    componentHandler.upgradeDom();
    }
});

$(document).ready(promptForLogin);

function promptForLogin(){
    if(!instagramAuthToken){
        var formContainer = $("<div>");
        formContainer.append("<h3>Welcome to That's My Jam</h3>");
        formContainer.append("<p>Log in with your Instagram account to see your friends' and your own delicious meals nearby.</p>");
        formContainer.append("<button id='loginFromModal'>Begin</button>");
        $(document).on("click","#loginFromModal", function(){
            window.location = "https://api.instagram.com/oauth/authorize/?client_id=7c89da9d27cd49f9a18e2d6155032011&redirect_uri=https://jesseharold.github.io/thatsmyjam/&response_type=token&scope=follower_list+public_content";
        });
        openModal(formContainer);
    }
}
