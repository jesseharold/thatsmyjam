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



