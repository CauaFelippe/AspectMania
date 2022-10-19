$(function(){

    var clipboard = new Clipboard('#copyButton');
    clipboard.on('success', function(e) {
        $(e.trigger).html("PRONTO PARA JOGAR");
        setTimeout(function() {
            $(e.trigger).html("mc.aspectmania.com.br");
        }, 1000);
    });

    if($('.jogadores').length > 0) {
        setInterval(function() {
            $('.jogadores').fadeOut("slow");
            var ip   = $('.jogadores').attr('id');
            var link = 'https://mcapi.us/server/status?ip=mc.hypixel.net';
            $.ajax({
                url: link,
                type: 'GET',
                dataType: 'JSON',
                complete: function(result) {
                    var r = JSON.parse(result.responseText);
                    $('.jogadores').fadeIn("slow").html(r.players.online);
                }
            });
        }, 5000);
    }

    $('#logarComprador').on('submit', function(e) {
        e ? e.preventDefault() : false;
		$('.alert').slideUp("slow");
        $('#logarComprador button').html("Entrando...");
        $.ajax({
            url: "/loja/logar",
            type: "POST",
            dataType:'JSON',
            data: $(this).serialize(),
            complete: function (result){
                var r = JSON.parse(result.responseText);
                console.log(r);
                if(r.response == "ok"){
                    $('#logarComprador button').html("Redire...");
                    window.location.reload();
                }else{
                    $('#logarComprador button').html("Continuar");
                }
            }
        });
        return false;
    });
    
    $('#shareComment').on('submit', function(e) {
        e ? e.preventDefault() : false;
        $('#shareComment .btn-success').html("Aguarde...");
        $.ajax({
            type: 'POST',
            url: "/home/postar",
            data: $(this).serialize(),
            dataType: 'JSON',
            complete: function (result) {
                console.log(result.responseText);
                var r = JSON.parse(result.responseText);
                console.log(result.responseText);
                if(r.response == "ok"){
                    $('#shareComment input').val("");
                    $('#shareComment .btn-success').html("Atualizando...");
                    setTimeout(function() {
                        location.reload();
                    }, 1500);
                }else{
                    $('#shareComment .alert-danger').slideDown().html(r.message);
                    $('#shareComment .btn-success').html("Tentar novamente");
                }
            }
        });
        return false;
    });

    $('.add-to-cart').on('click',function(e){
        e ? e.preventDefault() : false;
        var id = $(this).attr('id');
        $.ajax({
            url: "/loja/addCart",
            type:"POST",
            dataType:'JSON',
            data: { 'id':id },
            complete: function (result){
                var r = JSON.parse(result.responseText);
                if(r.response == "ok"){
                    window.location.href = "/loja/carrinho";
                }
            }
        });
        return false;
    });

    $('.remove-from-cart').on('click',function(e){
        e ? e.preventDefault() : false;
        $.ajax({
            url:  "/loja/removeCart",
            type:"POST",
            data: {'id':$(this).attr('id')},
            complete: function (){
                window.location.reload();
            }
        });
        return false;
    });

    $('#checkoutForm').on('submit', function(e) {
        e ? e.preventDefault() : false;
        
        var nick    = $('#nickname');
        var cupom   = $('#cupom');
        var getway  = $('#getway:checked');
        var termos  = $("#termos");
        if(!termos.is(':checked')) { return termos.focus(); }

        var alertError = $('#errorCheck');

        nick.prop('disabled', true);
        cupom.prop('disabled', true);
        $(this).prop('disabled', true);
        $(this).prop('tabindex', '-1');
        console.log(nick.val());
        console.log(getway.val());
        $.ajax({
            url: "/loja/checkout",
            type:"POST",
            dataType:'JSON',
            data: { nickname: nick.val(), getway: getway.val() },
            complete: function (result){
                //console.log(result.responseText);
                var r = JSON.parse(result.responseText);
                if(r.response == "ok"){
                    location.href = r.url;
                } else {
                    alertError.addClass(' alert-danger');
                    alertError.html('<b class="text-danger"><i class="fa fa-info-circle"></i> ERROR - <b>' + r.message);
                    console.log('error');
                    $(this).prop('tabindex', "1");
                    $(this).prop('disabled', false);
                }
            }
        });
    });

    function loadFeed(init, max) {
        var dados = { init: init, max: max };
        $.ajax({
            url:  "/home/get",
            type: "POST",
            data: dados,
            dataType: "JSON",
            complete: function (r) {
                var data = JSON.parse(r.responseText);
                if (data.totalResults > 0) {
                    for (i = 0; i < data.dados.length; i++) {
                        html =  '<div class="noticia box-shadow"> \n'+
                        '           <div class="autor box-shadow text-center"> \n'+
                        '               <img src="https://cravatar.eu/helmavatar/'+data.dados[i].autor+'/115" alt="Avatar"> \n'+
                        '               <p class="text-muted m-0 p-0">PUBLICADO POR <b>'+data.dados[i].autor+'</b></p> \n'+
                        '               <p class="text-muted m-0 p-0"><i class="fa fa-calendar"></i> '+data.dados[i].data+'</p> \n'+
                        '           </div> \n'+
                        '           <div class="media header"> \n'+
                        '               <h3>'+data.dados[i].titulo+'</h3> \n'+
                        '           </div> \n'+
                        '           <hr> \n'+
                        '           <div class="body"> \n'+
                        '               '+data.dados[i].noticia+'<br> \n'+
                        '           </div> \n'+
                        '           <hr> \n'+
                        '           <a class="button box-shadow" href="https://localhost/home/noticia/'+data.dados[i].id+'">Ver mais</a> \n'+
                        '        </div><br><br><br><br>\n';

                        $('.feedlist').append(html).fadeIn("slow");
                    }
                    var conta = $(".feedlist .feed").length;
                    if (conta == data.totalResults) {
                        $("#nav-pag-feed").hide();
                    }
                } else {
                    $(".feedlist").html("<div class='box-shadow' style='padding: 25px; border: 1px solid rgb(0, 0, 0, 0.3);'><h3 class='text-center'>Não há notícias</h3><p class='text-center'>os administradores do website ainda não fizeram nenhuma publicação.</p></div>")
                    $("#nav-pag-feed").hide();
                }
            }
        });
    }

    if($('.feedlist').length > 0) {
        loadFeed(0, 5);
    }

    $("#loadfeedmore").click(function(e) {
        e.preventDefault();
        var init = $(".feedlist .feed").length;
        loadFeed(init, 5);
    });

    function loadPunish(init, max) {
        var dados = { init: init, max: max };
        $.ajax({
            url:  "/punicoes/get",
            type: "POST",
            data: dados,
            dataType: "JSON",
            complete: function (r) {
                var data = JSON.parse(r.responseText);
                if(data.total > 0) {
                    for (i = 0; i < data.dados.length; i++) {
                        var red = "";
                        if(data.dados[i].status == "Removido") {
                            red = "red";
                        }
                        var html = 
                        '<div class="punishl"> \n'+
                        '   <div class="header" role="tab" id="heading'+data.dados[i].id+'"> \n'+
                        '       <div class="row" data-toggle="collapse" data-parent="#accordion" href="#p-'+data.dados[i].id+'" > \n'+
                        '           <div class="col-md-3"> '+
                        '               <span><i class="fa fa-clock"></i> '+data.dados[i].date+'</span> \n'+
                        '           </div> \n'+
                        '           <div class="col-md-7"> '+
                        '               <span>'+data.dados[i].username+' foi banido por '+data.dados[i].by+'</span> \n'+
                        '           </div> \n'+
                        '           <div class="col-md-2 text-right"> '+
                        '               <span>'+data.dados[i].server+'</span> \n'+
                        '           </div> \n'+
                        '       </div> \n'+
                        '   </div> \n'+
                        '   <div id="p-'+data.dados[i].id+'" class="collapse" role="tabpanel" aria-labelledby="heading'+data.dados[i].id+'"> \n' +
                        '   <div class="details-arrow"></div> \n' +
                        '       <div class="punishlf'+red+' row">\n' +
                        '           <p class="col-4">\n' +
                        '               <b>Motivo</b> <br>\n' +
                        '               '+data.dados[i].reason+'\n' +
                        '           </p>\n' +
                        '           <p class="col-3">\n' +
                        '               <b>Término</b> <br>\n' +
                        '               '+data.dados[i].end+'\n' +
                        '           </p>\n' +
                        '           <p class="col-3">\n' +
                        '               <b>Status</b> <br>\n' +
                        '               '+data.dados[i].status+'\n' +
                        '           </p>\n' +
                        '           <p class="col-2">\n' +
                        '               <b>Provas</b> <br>\n' + data.dados[i].prove +
                        '           </p>\n' +
                        '       </div>\n' +
                        '   </div>\n' +
                        '</div>';
                        $('#accordion').append(html).fadeIn("slow");
                    }
                    var conta = $("#accordion .card").length;
                    if(conta == data.total) {
                        $("#punishLoad").hide();
                    }
                }else{
                    $("#accordion").html("<h3 class='text-center'>Não há punições</h3>")
                    $("#punishLoad").hide();
                }
            }
        });
    }

    if($('#punishLoad').length > 0) {
        loadPunish(0, 10);
    }

    $("#punishLoad").click(function(e) {
        e.preventDefault();
        $(this).html("<i class=\"fa fa-spinner fa-pulse fa-fw\"></i> CARREGANDO");
        var init = $("#accordion .card").length;
        loadPunish(init, 10);
        return $(this).html("<i class=\"ion-plus\"></i> CARREGAR MAIS");
    })

    $('#sendContact').on('submit', function(e) {
        e ? e.preventDefault() : false;
        $('.alert', this).slideUp();
        $('#sendContact .btn-warning').html("Enviando...");
        $.ajax({
            type: 'POST',
            url: "/contato/sender",
            data: $(this).serialize(),
            dataType: 'JSON',
            complete: function (result) {
                var r = JSON.parse(result.responseText);
                console.log(result.responseText);
                if(r.response == "ok"){
                    $('#sendContact .alert-success').slideDown().html(r.message);
                    $('#sendContact input').val("");
                    $('#sendContact textarea').val("");
                    $('#sendContact .btn-warning').html("Enviar");
                    setTimeout(function() {
                        location.reload();
                    }, 1500);
                }else{
                    $('#sendContact .alert-danger').slideDown().html(r.message);
                    $('#sendContact .btn-warning').html("Tentar novamente");
                }
            }
        });
        return false;
    });

    $('.summernote').summernote({
        tabsize: 2,
        height: 200,
        responsive: true,
        toolbar: [
            [ 'style', [ 'style' ] ],
            [ 'font', [ 'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear'] ],
            [ 'fontname', [ 'fontname' ] ],
            [ 'fontsize', [ 'fontsize' ] ],
            [ 'color', [ 'color' ] ],
            [ 'para', [ 'ol', 'ul' ] ],
            [ 'insert', [ 'link', 'picture' ] ],
            [ 'view', [ 'fullscreen' ] ]
        ],
        lang: "pt-BR"
    });

    $('#searchPunish').on('submit', function(e) {
        e ? e.preventDefault() : false;
        $.ajax({
            url: "/punicoes/search",
            type: "POST",
            data: $(this).serialize(),
            dataType:'JSON',
            complete: function (result){
                var r = JSON.parse(result.responseText);
                if(r.response == "ok"){
                    $('#modalSearch .modal-body').html(r.message);
                    $('#modalSearch').modal('toggle');
                }else{
                    swal({
                        title: r.title,
                        text: r.message,
                        timer: 4000,
                        type: "success",
                        showConfirmButton: false
                    });
                }
            }
        });
        return false;
    });

});

function goTo(str, boolean) {
    if(boolean) {
        return window.open(str, "_blank");
    }
    window.location.href = str;
}

$('input#cupom').keyup(function(){
    var $this      = $(this);
    var valueSeach = $this.val();
    var campo1     = $(".valorDesconto");
    var campo2     = $(".valorTotal");
    var cupomC     = $("#cupomCode");
    if(valueSeach.length >= 1){
        $.ajax({
            url: "/loja/addDiscount",
            type:"POST",
            dataType:'JSON',
            data: {'hash': valueSeach},
            complete: function (result){
                var r = JSON.parse(result.responseText);
                if(r.response == "ok"){
                    $this.prop('disabled', true);
                    campo1.html(r.discount).fadeIn("slow");
                    campo2.html(r.total).fadeIn("slow");
                    cupomC.html(valueSeach).fadeIn("slow");
                }
            }
        });
    }else{
        campo1.html("R$00,00");
    }
});

var localtema = localStorage.getItem('tema');
var dark = false;

function invertColors() {
    var btn = document .getElementById("temaBtn");
    dark = !dark;
	localStorage.setItem('tema', dark);
    if(dark){ 
        btn.style.color = "white";
        document.querySelector("meta[name=theme-color]").setAttribute("content", '#0c0c0c');
        
        $('.box-shadow').addClass('box-shadow-white');
        $('.box-shadow').removeClass('box-shadow');
    }else{
		btn.style.color = "rgb(24, 26, 26)";
		localStorage.removeItem('tema');
        document.querySelector("meta[name=theme-color]").setAttribute("content", '#EFEFF6');
        
        $('.box-shadow-white').addClass('box-shadow');
        $('.box-shadow-white').removeClass('box-shadow-white');
    }
    var colorProperties = ['color', 'background-color', 'background'];
    $('*').each(function() {
        var color = null;
        for (var prop in colorProperties) {
            prop = colorProperties[prop];
            if (!$(this).css(prop)) continue;
            if($(this).attr("name") == "percent"){
                continue;
            }   
            color = new RGBColor($(this).css(prop));
            if (color.ok) {                              
                if(dark){                    
                    if(prop == 'color' || prop == 'background'){
                        if(color.r == 33 && color.g == 37 && color.b == 41){
                            this.style.setProperty(prop, 'rgb(255, 255, 255)', '');
                        }
                        continue;                                         
                    }           
                    //this.style.setProperty(prop, 'rgb(' + (255 - color.r) + ',' + (255 - color.g) + ',' + (255 - color.b) + ')');
                    if(color.r == 255 && color.g == 255 && color.b == 255){
                        this.style.setProperty(prop, 'rgb(24, 26, 27)', 'important');
                    }else if(color.r == 239 && color.g == 239 && color.b == 246){
                        this.style.setProperty(prop, 'rgb(29, 31, 32)', 'important');
                    }
                }else{
                    if(color.r == 249 && color.g == 251 && color.b == 253 || color.r == 240 && color.g == 240 && color.b == 240 || color.r == 136 && color.g == 136 && color.b == 136){
                        // cores ignoradas
                        continue;
                    }
                    if(prop == 'color' || prop == 'background'){
                        if(color.r == 200 && color.g == 200 && color.b == 200){
                            this.style.setProperty(prop, 'rgb(255, 255, 255)', '');
                        }
                        if(color.r == 255 && color.g == 255 && color.b == 255){
                            this.style.setProperty(prop, 'rgb(33, 37, 41)', '');
                        }
                        continue;                                         
                    }                               
                    if(color.r == 24 && color.g == 26 && color.b == 27){
                        this.style.setProperty(prop, 'rgb(255, 255, 255)', 'important');
                    }else if(color.r == 29 && color.g == 31 && color.b == 32){
                        this.style.setProperty(prop, 'rgb(239, 239, 246)', 'important');
                    }
                }
            }
            color = null;
        }
    });
}

/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license MIT license
 */
function RGBColor(color_string)
{
    this.ok = false;

    // strip any leading #
    if (color_string.charAt(0) == '#') { // remove # if any
        color_string = color_string.substr(1,6);
    }

    color_string = color_string.replace(/ /g,'');
    color_string = color_string.toLowerCase();

    // #EFEFF6
    // array of color definition objects
    // rgb(239, 239, 246)
    var color_defs = [
        {
            re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            example: ['rgb(239, 239, 246)', 'rgb(239,239,246)'],
            process: function (bits){
                return [
                    parseInt(bits[1]),
                    parseInt(bits[2]),
                    parseInt(bits[3])
                ];
            }
        },
        {
            re: /^(\w{2})(\w{2})(\w{2})$/,
            example: ['#00ff00', '336699'],
            process: function (bits){
                return [
                    parseInt(bits[1], 16),
                    parseInt(bits[2], 16),
                    parseInt(bits[3], 16)
                ];
            }
        },
        {
            re: /^(\w{1})(\w{1})(\w{1})$/,
            example: ['#fb0', 'f0f'],
            process: function (bits){
                return [
                    parseInt(bits[1] + bits[1], 16),
                    parseInt(bits[2] + bits[2], 16),
                    parseInt(bits[3] + bits[3], 16)
                ];
            }
        }
    ];

    // search through the definitions to find a match
    for (var i = 0; i < color_defs.length; i++) {
        var re = color_defs[i].re;
        var processor = color_defs[i].process;
        var bits = re.exec(color_string);
        if (bits) {
            channels = processor(bits);
            this.r = channels[0];
            this.g = channels[1];
            this.b = channels[2];
            this.ok = true;
        }

    }

    // validate/cleanup values
    this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
    this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
    this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);

    // some getters
    this.toRGB = function () {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
    }
    this.toHex = function () {
        var r = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);
        if (r.length == 1) r = '0' + r;
        if (g.length == 1) g = '0' + g;
        if (b.length == 1) b = '0' + b;
        return '#' + r + g + b;
    }
}