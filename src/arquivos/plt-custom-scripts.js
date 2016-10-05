$("#slick-container > div:gt(0)").hide();

setInterval(function() {
  $('#slick-container > div:first')
    .fadeOut(1000)
    .next()
    .fadeIn(1000)
    .end()
    .appendTo('#slick-container');
},  4000);