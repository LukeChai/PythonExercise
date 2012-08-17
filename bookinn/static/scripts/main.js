
$(document).ready(function() {
	// 自动保存时限
	var AUTO_SAVE_INTERVAL = 1000;
	/* 
	 * 公用方法
	 */
	// 获取窗口宽高
	function getClientSize(){
		var ch = document.documentElement.clientHeight | window.innerHeight;
		var cw = document.documentElement.clientWidth | window.innerWidth;
		return [cw, ch];
	}
	// 获得元素宽度
	function getObjWidth($obj){
		return parseFloat($obj.width()==0?$obj.get(0).width:$obj.width());
	}
	// 获得元素高度
	function getObjHeight($obj){
		return parseFloat($obj.height()==0?$obj.get(0).height:$obj.height());
	}
	
	// 设置登陆框默认值
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
			}, 5000);
		}
		return result;
	}
	
	// set masklayer
	$('#masklayer').css('opacity', '0.2').hide();
	
	// if user have logedin
	if($('#logout')[0]){
		// get inn summary
		$.ajax({
			'async': false,
			'url': '/inn/get_inn_summary',
			'data': {},
			'dataType': 'html',
			'type': 'POST',
			'success': function(data){ 
				$('#body_left').append(data);
			}
		});		

	
		// handle click add/minus button event
		$('#body_left td.ainn_room_remain button.minus_remain').click(function(e) {
			var $remain_no = $(this).next('input');
			if($remain_no.val() > 0){
				$remain_no.val($remain_no.val() - 1);
			}else{
				$remain_no.val(0);
			}
			autoSubmitRemain($remain_no);
		});
		$('#body_left td.ainn_room_remain button.add_remain').click(function(e) {
			var $remain_no = $(this).prev('input');
			$remain_no.val($remain_no.val()*1 + 1);
			autoSubmitRemain($remain_no);
		});
		var time;
		function autoSubmitRemain($o){
			time = (new Date()).getTime();
			setTimeout(function(){
				var now_time = (new Date()).getTime();
				if(now_time - time >= AUTO_SAVE_INTERVAL){
					// auto submit the no
					var id = $o.attr('name');
					var id = id.substr(id.lastIndexOf('_') + 1);
					$.ajax({
						'async': false,
						'url': '/inn/update_remain_room',
						'data': {'id': id, 'remain': $o.val()},
						'dataType': 'json',
						'type': 'POST',
						'success': function(data){ 
							var code = data['code'];
							var msg;
							if(code == 0){
								$o.parent().next('td.ainn_room_updatedtime').find('span').text(data['updatedtime']);
								msg = '自动保存';
							}else{
								msg = '操作失败了';
							}
							// show msg
							$('#header_msg').text(msg).fadeIn(100);
							setTimeout(function(){
								$('#header_msg').fadeOut(100).text('');
							}, 5000);
						}
					});	
				}
			}, AUTO_SAVE_INTERVAL);
		} 
		
		// highlight hover div
		$('#body_left div.ainn').hover(function(e) {
			$(this).toggleClass('highlight');
			$('#body_left div.inn_config').toggleClass('invisible');
		});
		$('#body_left div.ainn_room tr').hover(function(e) {
			$buttons = $(this).find('td.ainn_room_remain button');
			$buttons.toggleClass('invisible');
		});
		
		// config a inn
		$('#body_left div.inn_config a').click(function(e) {
			$('#masklayer').fadeIn(500);
			
			$.ajax({
				'async': false,
				'url': $(this).attr('href'),
				'dataType': 'html',
				'type': 'GET',
				'success': function(data){ 
					var dialog = $('<div id="dialog_inn_config" />').html(data);
					dialog.hide().insertAfter('#masklayer');
										
					var clientSize = getClientSize();
					var top = (clientSize[1] - getObjHeight($('#dialog_inn_config'))) / 2;
					var left = (clientSize[0] - getObjWidth($('#dialog_inn_config'))) / 2;
					dialog.css({'top': top + 'px', 'left': left + 'px'}).fadeIn(500);
					
					$('#config_close').click(function(e) {
                        $('#dialog_inn_config').fadeOut(500).parent().remove('#dialog_inn_config');
						$('#masklayer').fadeOut(500);
                    });
					$('#config_inn_body input').hover(function(e) {
                        $(this).toggleClass('highlight');
                    });
				}
			});				
			
			return false;
        });
	}
});