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
    formContainer.append("Restaurant Name: <input type='text' id='restaurantName'>");
    formContainer.append("<br>Thumbs: Up <input type='radio' name='thumb' value='up' id='thumbsUp'>");
    formContainer.append("Down <input type='radio' name='thumb' value='down' id='thumbsDown'>");
    formContainer.append("<br>Review: <input type='text' id='reviewText'>");
    formContainer.append("<br>Location: <button id='useLocation'>Use Current Location</button><button id='enterAddress'>Enter Address</button>");
    openModal(formContainer);
    $("body").on("click", ".modalBG", function(){
        $("div.modalContainer").remove();
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



