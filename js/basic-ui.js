$("#sign_up").on('click', function(){
        var preparedJSON = {
          username : $("#username").val() ,
          password : $("#pass1").val() ,
          passwordVerif : $("#pass2").val()
        }
        //***register account***
        $.post( "/creating", preparedJSON, function( res ) {

              $("#status").html(res);
                  if(res=="Account created!"){
                      setTimeout(function(){
                      window.location.href = ("/");
                            //$window.url('/');
                       }, 500);
                  }   
        });
});


$("#login").on('click', function(){

var preparedJSON = {
        username : $("#username").val() ,
        password : $("#pass").val() ,
      }
      //***login account***
      $.post( "/loggingIn", preparedJSON, function( res ) {

          $("#status").html(res);
          if(res=="Logged in."){ 
              setTimeout(function(){       
              window.location.href = ("/");
            }, 500);
          }
      });  
});



$(function(){
     $('.form').find('input').on('keyup', function(e){
       if(e.keyCode === 13) {
          $( ".send" ).trigger( "click" );
        };
     });
});


function switchToViewPost(){

    $("#viewPostDiv").removeClass("displayNone");  
    $("#createPostDiv").addClass("displayNone");

}

function switchToCreatePost(){

    $("#createPostDiv").removeClass("displayNone");  
    $("#viewPostDiv").addClass("displayNone");

}


$("#viewpost").on('click', function(){
    switchToViewPost()
});

$("#createpost").on('click', function(){
    switchToCreatePost();
});