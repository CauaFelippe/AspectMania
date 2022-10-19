$("#addEmail").on("submit", function(e) {
    e.preventDefault();

    var email = $.trim($(this).find('input#email').val());

    if(email.length > 0) {
        $.ajax({
            url: "/minhaconta/email",
            type: "POST",
            dataType: "JSON",
            data: {'email': email},
            success: function(r) {
                console.log(r);

                if(r.response == "ok") {
                    location.reload();
                } else {
                    console.log("Erro na resposta.");
                }
            }, error: function(result) {
                console.log(result);
                console.log("Erro.");
            }
        });
    }
});

$('#login-forms').on('submit', function(e) {
	e ? e.preventDefault() : false;
	$('.alert').slideUp("slow");
	$('#login-form button').html("Autenticando...")
	$.ajax({
		url: "/entrar/authenticate",
		type: "POST",
		dataType:'JSON',
		data: $(this).serialize(),
		complete: function (result){
			var r = JSON.parse(result.responseText);
			console.log(result.responseText);
			if(r.response == "ok"){
				$('.alert-success').slideDown().html(r.message);
				$('#login-form input').prop('disabled', true);
				setInterval(function () {
					location.reload();
				}, 2000);
				$('#login-form button').html("Redirecionando...");
			}else{
				$('.alert-danger').slideDown().html(r.message);
				$('#login-form button').html("ENTRAR");
			}
		}
	});
	return false;
});

$('#login-formsdasd').on('submit', function(e) {
    e ? e.preventDefault() : false;
    var username = $.trim($(this).find('input#username').val());
    var password = $.trim($(this).find('input#password').val());
    $('.alert').slideUp("slow");
    $('#login-form button').html("Entrando...");
    var alert = $(this).find("#alertError");
    $.ajax({
        url: "/entrar/authenticate",
        type: "POST",
        dataType:'JSON',
        data: {'username': username, 'password': password},
        complete: function (result){
            var r = JSON.parse(result.responseText);
            console.log(r);
            if(r.response == "ok"){
                if(alert.hasClass("alert-danger")) {
                    alert.removeClass("alert-danger");
                }

                alert.addClass("alert-success");
                alert.slideDown().html("Redirecionando...");
                $('#login-form button').html("Redirecionando...");
                
            }else{
                $('#login-form button').html("Logar");
                alert.addClass("alert-danger");
                alert.slideDown().html("Nickname ou senha incorretos!");
            }
        }
    });
    return false;
});

$("#login-form").on("submit", function(e) {
    e.preventDefault();

    var username = $.trim($(this).find('input#username').val());
    var password = $.trim($(this).find('input#password').val());
    var alert = $(this).find("#alertError");
    var btn = $(this).find('[type=submit]');

    if(username.length > 0 && password.length > 0) {
        $.ajax({
            url: "/entrar/authenticate",
            type: "POST",
            dataType: "JSON",
            data: {'username': username, 'password': password},
            success: function(r) {
                console.log(r);

                if(r.response == "ok") {
                    if(alert.hasClass("alert-danger")) {
                        alert.removeClass("alert-danger");
                    }

                    alert.addClass("alert-success");
                    alert.slideDown().html("Redirecionando...");
                    btn.addClass(".disabled");
                    location.reload();
                } else {
                    alert.addClass("alert-danger");
                    alert.slideDown().html("Nickname ou senha incorretos!");
                }
            }, error: function(result) {
                console.log(result.responseText);
                console.log("Error.");
            }
        });
    } else {
		alert.addClass("alert-warning");
		alert.slideDown().html("Insira seus dados!");
	}
});