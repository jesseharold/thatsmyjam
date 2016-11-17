
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


$(document).on("click","#submit-restaurant", function(){
    window.location = "index.html";
});



function populateFriendsList() {

    for (var m = 0; m < myTMJFriends.length; m++){

    var friendListID = database.ref("users/" + myTMJFriends[m] + "/id").val();
    var friendListName = database.ref("users/" + myTMJFriends[m] + "/name").val();
    var friendListProfilePicture = database.ref("users/" + myTMJFriends[m] + "/profilePicture").val();
    var friendListUsername = database.ref("users/" + myTMJFriends[m] + "/username").val();

    var listTagFriend = $('<li>').addClass("mdl-list__item");

    var spanTagFriend = $('<span>').addClass("mdl-list__item-primary-content");
    listTagFriend.append(spanTagFriend);

    var imageTagFriend = $('<img>').addClass("mdl-list__item-avatar").attr("src", friendListProfilePicture)
    spanTagFriend.append(imageTagFriend).append(friendListName);

    var spanCheckmark = $('<span>').addClass("mdl-list__item-secondary-action");
    spanTagFriend.after(spanCheckmark);

    var labelCheckmark = $('<label>').addClass("mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect").attr("for", "list-checkbox-" + myTMJFriends.indexOf([m]));
    var inputCheckmark = $('<input>').addClass("mdl-checkbox__input").attr("type", "checkbox").attr("id", "list-checkbox-" + myTMJFriends.indexOf([m])).attr("checked", "");
   
    spanCheckmark.append(labelCheckmark);

    labelCheckmark.append(inputCheckmark);
    
    
    var completedFriend = listTagFriend;
    
    console.log(completedFriend);
    $(".friendlist").append(completedFriend);

    }
   
}


$(document).on("click",'#addfriend', function(){
    
    populateFriendsList();
    componentHandler.upgradeDom();
});




