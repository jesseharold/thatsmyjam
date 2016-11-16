
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



//                     <li class="mdl-list__item">
//                         <span class="mdl-list__item-primary-content">
//                         <img class="mdl-list__item-avatar" src="assets/images/testprofpic.jpg"/>
//                         Eric
//                         </span>
//                         <span class="mdl-list__item-secondary-action">
//                         <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="list-checkbox-3">
//                             <input type="checkbox" id="list-checkbox-3" class="mdl-checkbox__input" />
//                         </label>
//                         </span>
//                     </li>

var testObject = {
    friendNumber: 6,
    userName: "Dirk",
    imageURL: "assets/images/testprofpic.jpg",

}



function populateFriendsList(testObject) {

    var listTagFriend = $('<li>').addClass("mdl-list__item");
    var spanTagFriend = $('<span>').addClass("mdl-list__item-primary-content");
    var imageTagFriend = $('<img>').addClass("mdl-list__item-avatar").append("src", testObject.imageURL).html(testObject.userName);
    var spanCheckmark = $('<span>').addClass("mdl-list__item-secondary-action");
    var inputCheckmark = $('<input>').append("type", "checkbox").append("id", "list-checkbox-" + testObject.friendNumber).addClass("mdl-checkbox__input");
    var labelCheckmark = $('<label>').addClass("mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect").append("for", "list-checkbox-" + testObject.friendNumber).append(inputCheckmark)
    
    
    
    var completedFriend = listTagFriend.append(spanTagFriend + imageTagFriend + spanCheckmark + labelCheckmark);
    $(".friendlist").append(completedFriend);
}

$(document).on("click",'#addfriend', function(){
    populateFriendsList(JSON.stringify(testObject));
});
