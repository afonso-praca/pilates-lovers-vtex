/**
 * Plugin Authoring
 *
 * @author Leonam Bernini / ADMAKE <leonambernini@admake.com.br>
 *
 **/
;(function( $ ){

  "use strict";

  $.fn.ADMAKEadvancedFilter = function( params ) {

    // Default options
    var options = $.extend( {
      menu            : '.menu-departamento',
      extensaoImagens : 'png',
      tipoFiltros     : {'cor':'image','Para que faixa etária':'range'},
      elTitulo        : 'h3',
      elSubTitulo     : 'h5',
      elLista         : 'ul',
      estruturaBox    :   '<div class="box-filtro {{class}}" data-type="{{datatype}}"> ' +
      '   <div class="sub-titulo">    ' +
      '       <h3>{{subtitulo}}</h3>  ' +
      '   </div>                      ' +
      '   <div class="opcoes">        ' +
      '       <ul>{{opcoes}}</ul>     ' +
      '   </div>                      ' +
      '</div>',
    }, params);

    // Plugin variables
    var $self       = this;
    var $estrutura  = null;
    var arrayTipos  = [];

    var specialChars = [
      {val:"a",let:"áàãâä"},
      {val:"e",let:"éèêë"},
      {val:"i",let:"íìîï"},
      {val:"o",let:"óòõôö"},
      {val:"u",let:"úùûü"},
      {val:"c",let:"ç"},
      {val:"A",let:"ÁÀÃÂÄ"},
      {val:"E",let:"ÉÈÊË"},
      {val:"I",let:"ÍÌÎÏ"},
      {val:"O",let:"ÓÒÕÔÖ"},
      {val:"U",let:"ÚÙÛÜ"},
      {val:"C",let:"Ç"},
      {val:"",let:"?!()"}
    ];

    // Put your DOM elements here
    var elements = {
      $htmlBody   : $('html,body'),
      $windows    : $(window),
      $menu       : $(options.menu),
      $titulo     : $( options.elTitulo, options.menu ),
      $subTitulos : $( options.elSubTitulo, options.menu ),
    };

    var methods = {
      init : function(){
        if( methods.verificaElemento( elements.$menu ) ){
          elements.$menu.hide(0);

          if( options.extensaoImagens === '' ){
            options.extensaoImagens = 'jpg';
          }

          if( $('.search-single-navigator').length ){
            elements.$subTitulos = $( '.search-single-navigator ' + options.elSubTitulo, options.menu )
          }

          methods.preparaArrayTipos();
          methods.criaEstrutura();
          methods.criaBoxes();
          methods.preparaBoxCheckbox();
          methods.preparaBoxImage();
          methods.preparaBoxRange();
          methods.startEventListener()
        }else{
          console.log('O menu "'+options.menu+'" não existe!');
        }
      },
      criaEstrutura : function(){
        if ($(window).width() >= 992){
          elements.$menu.after(
            '<div id="admake-advanced-filter" style="display: none;">' +
            '   <h2>' + '<a href="javascript:void(0);" title="Filtros">Filtros</a></h2>' + '</h2>' +
            '</div>'
          );
        } else {
          $('#collections').find('.plt-filters').html('<div id="admake-advanced-filter" style="display: none;">' +
            '   <h2>' + '<a href="javascript:void(0);" title="Filtros">Filtros</a></h2>' + '</h2>' +
            '</div>'
          );
        }
        $estrutura = $('#admake-advanced-filter');
        $estrutura.fadeIn();
      },
      criaBoxes : function(){
        $.each( elements.$subTitulos, function(){
          var subTitulo    = $(this).html();
          var subTituloAux = methods.removeCaracteres( subTitulo );
          var classAux     = 'checkbox';

          if( arrayTipos[ subTituloAux ] !== undefined && arrayTipos[ subTituloAux ] !== null && arrayTipos[ subTituloAux ] !== '' ){
            classAux = arrayTipos[ subTituloAux ];
          }

          $estrutura.append(
            options.estruturaBox
              .replace( /\{{subtitulo}}/g,    subTitulo )
              .replace( /\{{datatype}}/g,     'filtro-' + subTituloAux )
              .replace( /\{{class}}/g,        classAux + ' filtro-' + subTituloAux )
              .replace( /\{{opcoes}}/g,       $(this).next( options.elLista ).html() )
          );
        });
      },
      preparaBoxCheckbox : function(){
        var $elAtivo    = $('.checkbox li.filtro-ativo', $estrutura );
        var $elInativo  = $('.checkbox li:not(.filtro-ativo) a', $estrutura );
        $elAtivo.prepend('<i class="fa fa-check-square-o"></i> ');
        $elInativo.prepend('<i class="fa fa-square-o"></i> ');
      },
      preparaBoxImage : function(){
        $.each( $('.image', $estrutura ), function(){
          var $this  = $(this);
          var $itens = $('li a,li.filtro-ativo', $this);
          $.each( $itens, function(){
            var $t = $(this);
            var titulo = methods.removeCaracteres( ( $t.attr('title') !== undefined && $t.attr('title') !== null && $t.attr('title') !== '' ) ? $t.attr('title') : $t.html() );
            if( $this.attr('data-type') !== undefined && $this.attr('data-type') !== null && $this.attr('data-type') !== '' ){
              var imagem = $this.attr('data-type') + '-' + titulo + '.' + options.extensaoImagens;
            }else{
              var imagem = titulo + '.' + options.extensaoImagens;
            }
            $t.html('<img src="/arquivos/' + imagem.trim() + '" title="' + $t.html() + '" alt="' + $t.attr('title') + '" class="filtro-img" >');
          });
        });
      },
      preparaBoxRange : function(){

        if( !$.fn.ionRangeSlider ){
          console.log('Para habilitar a opção RANGE é necessario inserir o plugin Range.Slider - http://www.jqueryrain.com/');
          return false;
        }
        var aux = 0;
        var id  = 0;
        $.each( $('.range', $estrutura ), function(){
          var $this   = $(this);
          var $elFiltroAtivo = $('.filtro-ativo', $this);
          if( $elFiltroAtivo.length ){
            $elFiltroAtivo.prepend('<i class="fa fa-check-square-o"></i> ');
            return false;
          }
          var $opcoes = $('.opcoes', $this);
          var $lista  = $('ul', $this);
          var $itens  = $('li a', $this);

          $lista.hide();

          id = ( $this.attr('data-type') !== undefined && $this.attr('data-type') !== null && $this.attr('data-type') !== '' ) ? 'range-' + $this.attr('data-type') : 'range-' + aux++;
          $opcoes.append('<div id="'+id+'"></div>');

          var values = [];
          $.each( $itens, function(){
            var $t = $(this);
            var titulo = $t.attr('title');
            $t.attr('id', 'option-' + methods.removeCaracteres( titulo ) );
            values.push( titulo );
          });

          $("#"+id).ionRangeSlider({
            type    : "single",
            values  : values,
            min     : 0,
            max     : $itens.length,
            from    : 0,
            keyboard: true,
            onFinish: function (data) {
              var aux = $('#option-' + methods.removeCaracteres( data.from_value ) );
              if( aux.length ){
                window.location=aux.attr('href');
              }
            },
          });
        });
      },
      preparaArrayTipos : function(){
        $.each( options.tipoFiltros, function(k,v){
          arrayTipos[ methods.removeCaracteres( k ) ] = v;
        });
      },
      verificaElemento : function(e){
        return e.length;
      },
      removeCaracteres : function( str ){
        var $spaceSymbol = '-';
        var regex;
        var returnString = str;
        for (var i = 0; i < specialChars.length; i++) {
          regex = new RegExp("["+specialChars[i].let+"]", "g");
          returnString = returnString.replace(regex, specialChars[i].val);
          regex = null;
        }
        return returnString.replace(/\s/g,$spaceSymbol).toLowerCase();
      },
      startEventListener : function () {
        $estrutura.on('click', 'h2', function () {
          console.log("h2 clicked");
          $estrutura.find('.box-filtro').toggle(400);
        });
      }
    };

    // Plugin events
    var events = {
      clickAncora : function(){
      }
    };

    methods.init();
  };

})( jQuery );