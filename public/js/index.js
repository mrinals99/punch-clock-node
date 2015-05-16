(function(){

var PINCODE_LEGTH = 4;

$(function(){
    $('#pincode').on('input',function(e){
        if(this.value.length > PINCODE_LEGTH){
            this.value = this.value.slice(0,4);
        }else if($('#pincode').val().length == PINCODE_LEGTH){
            $('body').css('cursor','wait');
            $('.fa-spinner').css('visibility','visible');
            $.ajax('/availableActions?pin=' + $('#pincode').val())
                .done(function(result){
                    var arrResult = result.split(',');
                    hideAll();
                    if(result == 'NO'){
                        $('#notFound').show(500);
                    }else{
                        if(arrResult.length == 2){
                            arrResult.map(actionToId).forEach(function(id){
                            $('#' + id).addClass('twoInRow')
                            });
                        }
                        arrResult.map(actionToId).forEach(function(id){
                            $('#' + id).show(500);
                        });
                    }
                })
                .always(function(){
                    $('body').css('cursor','auto');
                });
        }else{
            hideAll();
        }
    })

    $('.clockAction').click(function(){
        clockAction(idToAction(this.id));
    });


})

function idToAction(fullActionName){
    return fullActionName.replace(/_/g,' ');
}

function actionToId(fullActionName){
    return fullActionName.replace(/ /g,'_');
}

function clockAction(action){
    hideAll(function(){
        $('.fa-spinner').css('visibility','visible');
    });

    $.ajax('/do?action=' + action +'&pin=' + $('#pincode').val())
        .always(function(){
            $('.fa-spinner').css('visibility','hidden');
            $('.confirmation').show(500);
            setTimeout(function(){$('.confirmation').hide(1000);},1000);
            $('#pincode').val('');
        });
}

function hideAll(cb){
    $('.twoInRow').removeClass('twoInRow');
    $('.clockAction,.error,.confirmation').hide(400,cb);
    $('.fa-spinner').css('visibility','hidden');
}

})();