$(function(){
    $("#login-button").on('click', login);
});

function login(e) {
    e.preventDefault();
  
    var theUsername = $("#inputEmail").val();
    var thePassword = $("#inputPassword").val();
    
    var theData = {
        username: theUsername,
        password: thePassword
    }
    
    $.ajax({
        method: "POST",
        url: "http://earlycodersx.com:8080/accounts/login",     //vickylai:)
        data: theData
    }).done(function(responseData){
    console.log (responseData);
    alert (responseData.status);
    localStorage.setItem('session', responseData.data.session);
    window.location="app/index.html";
    });
    
    

}