/**
* Plugin Authoring
*
* @author Leonam Bernini / ADMAKE <leonambernini@admake.com.br>
*
**/
;(function( $ ){

    "use strict";

    $.fn.ADMAKEmenu = function( params ) {

        // Default options
        var options = $.extend({
            boxDefault      : '#top-menu .container',
            menu            : '.menu',
            btnMobile       : '.btn-menu-xs',
            boxMobile       : '#menu-mobile',
            boxRecebeMobile : '#menu-mobile .recebe-menu',
            widthTablet     : 991,
        }, params);

        // Plugin variables
        var $self       = this;

        // Put your DOM elements here
        var elements = {
            $body       : $('body'),
            $boxDefault : $(options.boxDefault),
            $boxMobile  : $(options.boxMobile),
            $boxRecebeMobile  : $(options.boxRecebeMobile),
            $btnMobile  : $(options.btnMobile),
        };
        
        var methods = {
            init : function(){
                methods.ajustaMenu();
                events.resizeWindow();
                events.btnMobileAction();
                events.fechaMenu();
            },
            ajustaMenu : function(){
                if( $( window ).width() > options.widthTablet ){
                    if( !elements.$body.hasClass('versao-desktop') && elements.$body.hasClass('versao-mobile') ){
                        elements.$boxDefault.html( $( options.menu, $(options.boxRecebeMobile) ) );
                        elements.$body.addClass('versao-desktop').removeClass('versao-mobile').removeClass('menu-ativo');
                    }
                }else{
                    if( !elements.$body.hasClass('versao-mobile') ){
                        elements.$boxRecebeMobile.html( $( options.menu, $(options.boxDefault) ) );
                        elements.$body.addClass('versao-mobile').removeClass('versao-desktop');
                    }
                }
            },
            controlaMenuMobile : function(esconder){
                var e = elements.$boxMobile;
                if( e.is(':visible') || esconder === true ){
                    e.removeClass('show-menu').addClass('hide-menu');
                    e.fadeOut( function(){
                        elements.$body.removeClass('menu-ativo');
                    });
                }else{
                    e.removeClass('hide-menu').addClass('show-menu');
                    e.fadeIn( function(){
                        elements.$body.addClass('menu-ativo');
                    });
                }
            },
        };
        
        // Plugin events
        var events = {
            resizeWindow : function(){
                window.onresize = function() {
                    methods.ajustaMenu();
                };
            },
            btnMobileAction : function(){
                elements.$btnMobile.click( function(){
                    methods.controlaMenuMobile();
                });
            },
            fechaMenu : function(){
                $(document).on( 'click', 'body.menu-ativo', function(event){
                    if (!$(event.target).closest("#menu-mobile").length) {
                        methods.controlaMenuMobile(true);
                    }
                });
            },
        };

        methods.init();

    };

})( jQuery );