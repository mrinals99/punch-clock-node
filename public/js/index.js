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
                    if(result == 'Clock In'){
                        hideAll();
                        $('#clockIn').show(500);
                    } else if(result == 'Clock Out'){
                        hideAll();
                        $('#clockOut').show(500);
                    } else if(result == 'NO'){
                        hideAll();
                        $('#notFound').show(500);
                    }
                })
                .always(function(){
                    $('.fa-spinner').css('visibility','hidden');
                    $('body').css('cursor','auto');
                });
        }else{
            hideAll();
        }
    });

    $('#clockIn').click(function(){
        clockAction('Clock In');
    });

    $('#clockOut').click(function(){
        clockAction('Clock Out');
    });

});

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

function showOnly(id){
    hideAll();
    $('#' + id).show(500);
}

function hideAll(cb){
    $('#clockOut,#clockIn,.error,.confirmation').hide(400,cb);
    $('.fa-spinner').css('visibility','hidden');
}

})();