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
    $("body").on("click", ".modalBG", function(){
        $("div.modalContainer").remove();
    });
    $("body").on("click", "#useLocation", function(){
        $("#useLocation").data("location", currentLocation);
    });
    $("body").on("click", "#enterAddress", function(){
        console.log("enterAddress");
    });
    $("body").on("click", "#submitReview", function(){
        var reviewData = {
            location: {}
        };
        reviewData.text = $(".modalContainer #reviewText").val();
        reviewData.author = currentUserId;
        reviewData.text = $(".modalContainer #reviewText").val();
        reviewData.location.name = $(".modalContainer #restaurantName").val();
        reviewData.location.latitude = $(".modalContainer #useLocation").data("location").lat;
        reviewData.location.longitude = $(".modalContainer #useLocation").data("location").lng;
        reviewData.review_id = "review" + Math.random()*9999999999999999999999;
        reviewData.thumb = $("input[name=thumb]:checked").val();
        var restaurantKey = checkRestaurantExists(reviewData);
        console.log(restaurantKey);
        if (restaurantKey){
            addReviewToExistingRestaurant(reviewData, restaurantKey)
        } else {
            addReviewAndNewRestaurant(reviewData);
        }

    });


}
function openModal(content){
    var modalContainer = $("<div>").addClass("modalContainer");
    var modalBG = $("<div>").addClass("modalBG");
    var modalContent = $("<div>").addClass("modalContent");
    modalContainer.append(modalBG);
    modalContainer.append(modalContent);
    modalContent.append(content);
    $("body").append(modalContainer);
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



