(function () {

  var startSlicker = function () {
    $("#slick-container > div:gt(0)").hide();
    setInterval(function() {
      $('#slick-container > div:first')
        .fadeOut(1000)
        .next()
        .fadeIn(1000)
        .end()
        .appendTo('#slick-container');
    },  4000);
  };

  var checkAvailability = function () {
    $(window).on('skuSelected.vtex', function(evt, productId, sku){
      if (sku){
        if (sku.available == true){
          $('.product-info .availability').show();
        } else {
          $('.product-info .availability').hide();
        }
      }
    });
  };

  var verifyUserLoggin = function () {
    $(window).on('orderFormUpdated.vtex', function () {
      if (vtexjs.checkout.orderForm.loggedIn){
        $('.btn-login').remove();
        $('.link-login').remove();
        $('.btn-logout').removeClass('hidden');
        $('.link-logout').removeClass('hidden');
      }
    });
  };

  verifyUserLoggin();
  startSlicker();
  checkAvailability();

})();