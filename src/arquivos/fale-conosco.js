(function(){
  var self = this;
  self.urlCO = "http://api.vtex.com/pilateslovers/dataentities/CO/documents";

  self.resetMessages = function() {
    $("#form_message_success").addClass('hide');
    $("#form_message_error").addClass('hide');
  };

  self.isEmail = function(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  };

  self.self.createContact = function (){
    self.resetMessages();
    if (!self.isEmail($('#email').val().trim())){
      alert('Por favor insira um email válido');
      return;
    }
    var jsonCO = 	{
      "name": $('#name').val(),
      "email": $('#email').val().trim(),
      "order": $('#order').val(),
      "message": $('#message').val()
    };
    $.ajax({
      headers: {
        "Accept": "application/vnd.vtex.ds.v10+json",
        "Content-Type": "application/json"
      },
      data: JSON.stringify(jsonCO),
      type: 'PATCH',
      url: urlCO,
      success: function (data) {
        console.log(data);
        ResetMessages();
        $("#form_message_success").removeClass('hide');
        $("#name").val("");
        $("#email").val("");
        $("#order").val("");
        $("#message").val("");
      },
      error: function (data) {
        console.log(data);
        $("#form_message_error").removeClass('hide');
      }
    });
  };

  $('.form-submit-btn').on('click', self.createContact)
})();