
$(document).ready(function() {
	// login default value
	$('#username').addClass('color_gray').val('用户名').focus(function(e) {
		var $this = $(this);
        if($this.val() == '用户名'){
			$this.removeClass('color_gray').val('');
		}
    }).blur(function(e) {
		var $this = $(this);
        if($this.val() == ''){
			$this.addClass('color_gray').val('用户名');
		}
    });
	$('#password_mask').click(function(e) {
		$('#password').focus();
	});
	$('#password').focus(function(e) {
        $('#password_mask').hide();
    }).blur(function(e) {
		var $this = $(this);
        if($this.val() == ''){
			$('#password_mask').show();
		}    
	});
	
	// ajax submit login
	$('#login_form').submit(function(e) {
		if(!validate_login_form()) return false;
		
		var $this = $(this);
		var $username = $('#username').attr('readonly', 'readonly');
		var $password = $('#password').attr('readonly', 'readonly');
		$('#submit').attr('disabled', 'disabled').animate({'width': '100px'}, 100).val('正在登录');
		$('#signin').animate({'width': '0px'}, 100);
		
		$.ajax({
			'async': false,
			'url': $this.attr('action'),
			'data': {'username': $username.val(), 'password': $password.val()},
			'dataType': 'json',
			'type': 'POST',
			'success': function(data){ 
				var code = data['code'];
				if(code == 0){
					window.location.href = window.location.href;
				}else if(code == 1){
					$username.removeAttr('readonly');
					$password.removeAttr('readonly');
					$('#submit').removeAttr('disabled').animate({'width': '50px'}, 100).val('登录');
					$('#signin').animate({'width': '50px'}, 100);
					
					// show error msg
					$('#header_msg').text(data['msg']).fadeIn(100);
					setTimeout(function(){
						$('#header_msg').fadeOut(100).text('');
					}, 5000)
				}
			}
		});
        
		return false;
    });
	// validate login info
	function validate_login_form(){
		var result = true;
		var username = $.trim($('#username').val());
		var password = $.trim($('#password').val());
		
		if(username == '' || username == '用户名'){
			$('#header_msg').text('忘记输用户名了哦!').fadeIn(100).focus();
			result = false;
		}else if(password == ''){
			$('#header_msg').text('忘记输密码了哦!').fadeIn(100).focus();
			result = false;
		}
		
		if(!result){
			setTimeout(function(){
				$('#header_msg').fadeOut(100).text('');
			}, 5000)
		}
		return result;
	}
});