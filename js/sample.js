
$(document).on('ready', function () {
  //$("#LoginDiv").show();
  //$("#SignUpDiv").hide();

  $("#back_button").click(function(event) {
    $("#LoginDiv").show('slow');
    $("#SignUpDiv").hide('slow');

  });

  $("#register-button").click(function(event) {
    $("#LoginDiv").hide('slow');
    $("#SignUpDiv").show('slow');
  });


  $("#login-button").click(function(event){
    $('#signin').submit();
    //$('form').fadeOut(500);
    //$('.wrapper').addClass('form-success');
  });
  
});


