/**
* Plugin Authoring
*
* @author Leonam Bernini / ADMAKE <leonambernini@admake.com.br>
*
**/
;(function( $ ){

    "use strict";

    $.fn.ADMAKEminiCart = function( params ) {

        // Default options
        var options = $.extend( {
			miniCartAux 	: '#mini-cart-admake-aux',	
			miniCart 		: '#mini-cart-admake',
			showQtd			: true,
			miniCartQtd		: '#mini-cart-qty-admake',
			miniCartTotal	: '#mini-cart-admake-total',
            htmlItem 		: 	'<div class="mini-cart-item item-{{ID}}">' +
								'	' +
								'	<span class="imagem">' +
								'		{{IMAGEM}}' + 
								'	</span>' +  
								'	<span class="detalhes">' +
								'		<p class="nome-produto">{{NOME}}</p>' + 
								'		<span class="qtd-valor">' +
								'			<span class="qtd">{{QTD}}x</span> ' + 
								'			<span class="preco">{{PRECO}}</span>' + 
								'		</span>' + 
								'	</span>' +  
								'</div>',
        }, params);

        // Plugin variables
        var $self       	= this;
        var $miniCartHeader = null;
		var $miniCartItens  = null;
		var $miniCartFooter = null;
		var $cartInfos 		= null;
        
        // Put your DOM elements here
        var elements = {
            $window   		: $( window ),
            $miniCart   	: $( options.miniCart ),
            $miniCartAux   	: $( options.miniCartAux ),
            $miniCartQtd   	: $( options.miniCartQtd ),
            $miniCartTotal 	: $( options.miniCartTotal ),
        };
        
        var methods = {
            init : function(){
                events.winBind();
            },
            getBoxes : function(){
				$miniCartHeader = elements.$miniCart.find('.mini-cart-header');
				$miniCartItens  = elements.$miniCart.find('.mini-cart-itens');
				$miniCartFooter = elements.$miniCart.find('.mini-cart-footer');
				$cartInfos 		= elements.$miniCartAux.find('.cart-info');
            },
            getQtd : function(){
            	var qtd = parseInt( $cartInfos.find('.amount-items-em').html() );
				var qtd = ( qtd > 0 ) ? qtd : 0 ;
				
				if( options.showQtd ){
					elements.$miniCartQtd.html( qtd );
				}

				if( qtd < 1 ){
					elements.$miniCart.hide();
				}
            },
            getItens : function(){
            	var $itensAux = elements.$miniCartAux.find('.vtexsc-productList').find('tbody').find('tr');
				if( $itensAux.length > 0 ){
					$.each( $itensAux, function(i){
						var $this 		= $(this);
						var imagem 		= $this.find('.cartSkuImage').html();
						var nome 		= $this.find('.cartSkuName').find('h4').html();
						var preco 		= $this.find('.cartSkuPrice').find('.bestPrice').html();
						var qtd 		= $this.find('.cartSkuQuantity').find('.vtexsc-skuQtt').html();

						$miniCartItens.append( 
							options.htmlItem.replace( /\{{IMAGEM}}/g, 	imagem )
											.replace( /\{{NOME}}/g, 	nome )
											.replace( /\{{PRECO}}/g, 	preco )
											.replace( /\{{QTD}}/g, 		qtd )
											.replace( /\{{ID}}/g, 		i )
						);
					});
				}
            },
            getTotal : function(){
            	var total = $cartInfos.find('.total-cart-em').html();
				elements.$miniCartTotal.html( total );
            }
        };
        
        // Plugin events
        var events = {
            winBind : function(){
               	elements.$window.bind( "load", function(){
                	methods.getBoxes();
                	methods.getQtd();
                	methods.getItens();
                	methods.getTotal();
               	});
            },
        };

        methods.init();

    };

})( jQuery );