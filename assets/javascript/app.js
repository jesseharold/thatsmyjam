
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



// function populateFriendsList(snapshot?) {

//     var listTagFriend = $('<li>').addClass("mdl-list__item");
//     var spanTagFriend = $('<span>').addClass("mdl-list__item-primary-content");
//     var imageTagFriend = $('<img>').addClass("mdl-list__item-avatar").append("src", IGsnapshotSOURCE).html(IGsnapshotUSERNAME);
//     var spanCheckmark = $('<span>').addClass("mdl-list__item-secondary-action");
//     var inputCheckmark = $('<input>').append("type", checkbox).append("id", list-checkbox-LENGTHNUMBER).addClass("mdl-checkbox__input");
//     var labelCheckmark = $('<label>').addClass("mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect").append("for", list-checkbox-LENGTHNUMBER).append(inputCheckmark)
    
    
    
//     var completedFriend = listTag.append(spanTagFriend + imageTagFriend + spanCheckmark + labelCheckmark);
// }

// On connection to IG API {
    
//     loop through IG friends list (maybe if the user has a TMJ account too??)
//     for (var i = 0, i < friendlist.length, i++){
//         $(".friendlist").append(completedFriend);
//     }
    


// }




var friendsUsers = {
    friendNumber: 6,
    userName: "Dirk",
    imageURL: "https://scontent.cdninstagram.com/t51.2885-15/s150x150/e35/14262873_1829037100651690_6065155530383425536_n.jpg?ig_cache_key=MTM4MjE3Njc2NDkxNDEwODY4NA%3D%3D.2",

}



function populateFriendsList(testObject) {



    var completedFriend

    var listTagFriend = $('<li>').addClass("mdl-list__item");

    var spanTagFriend = $('<span>').addClass("mdl-list__item-primary-content");
    listTagFriend.append(spanTagFriend);

    var imageTagFriend = $('<img>').addClass("mdl-list__item-avatar").attr("src", testObject.imageURL)
    spanTagFriend.append(imageTagFriend).append(testObject.userName);

    var spanCheckmark = $('<span>').addClass("mdl-list__item-secondary-action");
    spanTagFriend.after(spanCheckmark);

    var labelCheckmark = $('<label>').addClass("mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect").attr("for", "list-checkbox-" + testObject.friendNumber);
    var inputCheckmark = $('<input>').addClass("mdl-checkbox__input").attr("type", "checkbox").attr("id", "list-checkbox-" + testObject.friendNumber).attr("checked", "");
   
    spanCheckmark.append(labelCheckmark);

    labelCheckmark.append(inputCheckmark);
    
    
    completedFriend = listTagFriend;
    
    console.log(completedFriend);
    $(".friendlist").append(completedFriend);
   
}

$(document).on("click",'#addfriend', function(){
    
    populateFriendsList(friendsUsers);
    componentHandler.upgradeDom();
});




//"users/"+dataFromIg.id