$(document).ready(function(){
    $('#reg-user').click(function() {
        var user = $('#txtUsername').val();
        var pass = $('#txtPassword').val();
        $.ajax({
            url: '/signUpUser',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
                console.log(response);
                console.log("succes");
            },
            error: function(error) {
                console.log(error);
                console.log("error")
            }
        });
    });
});
