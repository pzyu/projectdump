$(function(){
    $("#register-button").on('click', register);
});

function register(e) {
    e.preventDefault(); // This prevents the page from refreshing

    var theUsername = $("#inputEmail").val();
    var thePassword = $("#inputPassword").val();
    
    var theData = {
        username: theUsername,
        password: thePassword
    };
      $.ajax({
        method: "POST",
        url: "http://earlycodersx.com:8080/accounts/signup",         // What URL should be here?
        data: theData
    }).done(function(responseData){
        console.log (responseData);
        window.location="login.html";
    });

}