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




window.onscroll = function() {scrollFunction()};


function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("topBtn").style.display = "block";
    } else {
        document.getElementById("topBtn").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Chrome, Safari and Opera 
    document.documentElement.scrollTop = 0; // For IE and Firefox
}




$("#home").on('click', function(){
    window.location.reload();
});
