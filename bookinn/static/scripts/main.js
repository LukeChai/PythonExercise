
$(document).ready(function() {
	// 自动保存时限
	var AUTO_SAVE_INTERVAL = 1000;
	// 轮询讯息间隔
	var AUTO_GET_MESSAGE = 3000;
	// 用户名输入框默认值
	var DEFAULT_INPUT_USERNAME = $('#username').val();
	// 旅店名称输入框默认值
	var DEFAULT_INPUT_INNNAME = $('#new_inn_name').val() || $('#search_inn_name').val();
	// 旅店地址输入框默认值
	var DEFAULT_INPUT_INNLOCATION = $('#new_inn_location').val() || $('#search_inn_location').val();
	// 注册用户名输入框默认值
	var DEFAULT_INPUT_REG_USERNAME = $('#reg_username').val();
	// 注册密码输入框默认值
	var DEFAULT_INPUT_REG_PASSWORD = $('#reg_password').val();
	// 注册移动电话输入框默认值
	var DEFAULT_INPUT_REG_MOBILE = $('#reg_mobile').val();
	// 注册电子邮箱输入框默认值
	var DEFAULT_INPUT_REG_EMAIL = $('#reg_email').val();
	// 注册联系地址输入框默认值
	var DEFAULT_INPUT_REG_LOCATION = $('#reg_location').val();
	
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
	
	// 输入框默认提示功能
	function inputBoxEffect($obj){
		var text = $obj.val();
		$obj.addClass('color_gray').focus(function(e) {
			var $this = $(this);
			if($this.val() == text){
				$this.removeClass('color_gray').val('');
			}
		}).blur(function(e) {
			var $this = $(this);
			if($this.val() == ''){
				$this.addClass('color_gray').val(text);
			}
		});
		
	}
	
	// 设置登陆框默认值
	inputBoxEffect($('#username'));
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
					$('#submit').removeAttr('disabled').animate({'width': '50px'}, 100).val('登錄');
					$('#signin').animate({'width': '50px'}, 100);
					
					// show error msg
					$('#header_msg').text(data['msg']).fadeIn(100);
					setTimeout(function(){
						$('#header_msg').fadeOut(100).text('');
					}, 5000);
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
		
		if(username == '' || username == DEFAULT_INPUT_USERNAME){
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
		// 检查权限
		var privilege = false;
		if($('#privilege')[0]){
			privilege = true;
		}
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

		if(privilege){
			// 管理员(root)权限
			inputBoxEffect($('#search_inn_name'));
			inputBoxEffect($('#search_inn_location'));
			$('#search_inn_filter').click(function(e) {
                var search_inn_name = $('#search_inn_name').val();
				var search_inn_location = $('#search_inn_location').val();
				var filter_inn_name = !(search_inn_name == '' || search_inn_name == DEFAULT_INPUT_INNNAME);
				var filter_inn_location = !(search_inn_location == '' || search_inn_location == DEFAULT_INPUT_INNLOCATION);
				
				$('#body_left div.ainn').each(function(index, element) {
					$this = $(element);
					var result = false;
					
					var $p = $this.find('div.ainn_banner > div > p');
					if(filter_inn_name){
						var inn_name = $p.first().text();
						if(inn_name.indexOf(search_inn_name) == -1){
							result = true;
						}
					}
					if(filter_inn_location){
						var inn_location = $this.find('div.ainn_banner > div > p').last().text();
						if(inn_location.indexOf(search_inn_location) == -1){
							result = true;
						}						
					}
					if(result){
                    	$this.fadeOut(200);
					}
                });
            });
			$('#search_inn_showAll').click(function(e) {
                $('#body_left div.ainn').fadeIn(200);
            });
		}else{
			// 普通(leaf)权限
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
						id = id.substr(id.lastIndexOf('_') + 1);
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
				$(this).find('div.inn_config').toggleClass('invisible');
			});
			$('#body_left div.ainn_room tr').hover(function(e) {
				$buttons = $(this).find('td.ainn_room_remain button');
				$buttons.toggleClass('invisible');
			});
			
			// new a inn
			$('#new_ainn_action').css({'height': 0, 'opacity': 0});
			$('#new_ainn_button').click(function(e) {
				$(this).slideUp(200);
				$('#new_ainn_body').slideDown(200);
				$('#new_ainn_action').animate({'height': '30px', 'opacity': 1}, 200);
			});
			function submitNewInnForm(isContinue){
				var innName = $('#new_inn_name').val();
				if(innName != DEFAULT_INPUT_INNNAME){
					var innLocation = $('#new_inn_location').val();
					var orderno = $('#body_left div.ainn_room').size();
					$.ajax({
						'async': false,
						'url': '/inn/save_inn',
						'data': {'innname': innName, 'location': innLocation, 'orderno': orderno},
						'dataType': 'html',
						'type': 'POST',
						'success': function(data){ 
							$('#body_left').append(data).find('div.ainn:last div.inn_config_after_new a').click(function(e) {
								return open_config_inn_dialog(this);
							});
							
							if(!isContinue){
								slideDownNewButton();
							}
						}
					});
				}else {
					if(!isContinue){
						slideDownNewButton();
					}
				}			
			}
			function resetNewInnForm(){
				$('#new_inn_name').val('').blur();
				$('#new_inn_location').val('').blur();
			}
			function slideDownNewButton(){
				$('#new_ainn_body').slideUp(200);
				$('#new_ainn_action').animate({'height': 0, 'opacity': 0}, 200); 
				$('#new_ainn_button').slideDown(200);
			}
			$('#new_ainn_continue').click(function(e) {
				submitNewInnForm(true);
				resetNewInnForm();
			});
			$('#new_ainn_done').click(function(e) {
				submitNewInnForm(false);
				resetNewInnForm();
			});
			inputBoxEffect($('#new_inn_name'));
			inputBoxEffect($('#new_inn_location'));
			
			// config a inn
			function open_config_inn_dialog(obj){
				$('#masklayer').fadeIn(500);
				
				$.ajax({
					'async': false,
					'url': $(obj).attr('href'),
					'dataType': 'html',
					'type': 'GET',
					'success': function(data){ 
						var dialog = $('<div id="dialog_inn_config" />').html(data);
						dialog.hide().insertAfter('#masklayer');
											
						var clientSize = getClientSize();
						var top = (clientSize[1] - getObjHeight($('#dialog_inn_config'))) / 2;
						var left = (clientSize[0] - getObjWidth($('#dialog_inn_config'))) / 2;
						dialog.css({'top': top + 'px', 'left': left + 'px'}).fadeIn(500);
						
						// 关闭按钮
						var isChange = false;
						$('#config_close').click(function(e) {
							$('#dialog_inn_config').fadeOut(500).remove();
							$('#masklayer').fadeOut(500, function(){
								if(isChange){
									// 刷新页面
									window.location.href = window.location.href;
								}
							});
						});
						$('#config_inn_body input').hover(function(e) {
							$(this).toggleClass('highlight');
						});
						// 新增一行点击button事件
						$('#config_inn_newline').hide();
						$('#config_inn_newbutton').click(function(e) {
							$(this).slideUp(200);
							$('#config_inn_newline').slideDown(200);
						});
						$('#config_inn_continue').click(function(e) {		
							var $roomname = $('#config_inn_newline td.ainn_room_name input');
							var $remain = $('#config_inn_newline td.ainn_room_remain input');
							var orderno = -1;
							addNewLine($roomname.val(), $remain.val(), orderno); 
							$roomname.val('请输入房间名称');
							$remain.val(0);       
						});
						$('#config_inn_done').click(function(e) {
							$('#config_inn_newline').slideUp(200);
							$('#config_inn_newbutton').slideDown(200); 
							
							var roomname = $('#config_inn_newline td.ainn_room_name input').val();
							var remain = $('#config_inn_newline td.ainn_room_remain input').val();
							var orderno = 'N';
							if(roomname != '请输入房间名称'){
								addNewLine(roomname, remain, orderno);
							}
						});
						// 新增一行
						function addNewLine(roomname, remain, orderno){
							var $newLine = $('#config_inn_mode').clone();						
							var $input = $('<input type="text" name="mode" value="" />');
							// orderno
							var $ordernoInput = $input.clone().attr('type', 'hidden').attr('name', 'config_room_orderno_' + maxId);
							$newLine.find('td.ainn_room_action').append($ordernoInput.val(orderno));
							// roomname
							var $roomname = $input.clone().attr('name', 'config_room_name_' + maxId);
							$newLine.find('td.ainn_room_name').append($roomname.val(roomname));
							// remain
							var $remain = $input.clone().attr('name', 'config_room_remain_' + maxId);
							$newLine.find('td.ainn_room_remain').append($remain.val(remain));
							
							// 追加
							$('#config_inn_body div.ainn_rooms').append($newLine.attr('id', 'config_' + maxId));
							// 绑定事件
							$newLine.find('div.config_inn_moveup').click(function(e) {
								config_inn_action_click($newLine, 'moveup');
							});
							$newLine.find('div.config_inn_movedown').click(function(e) {
								config_inn_action_click($newLine, 'movedown');
							});
							$newLine.find('div.config_inn_remove').click(function(e) {
								config_inn_action_click($newLine, 'remove');
							});
							$newLine.find('input').hover(function(e) {
								$(this).toggleClass('highlight');
							});
							$newLine.hover(function(e) {
								$newLine.find('div.ainn_room_action_mv').toggleClass('invisible');
								$newLine.find('div.config_inn_remove').toggleClass('invisible');
							});
							// 显示
							$newLine.fadeIn(200, function(){
								$(this).removeClass('hide');
							});
						}
						// 行内按钮事件（上移 下移 删除）
						function config_inn_action_click($object, action){
							if(action == 'moveup'){
								var $prev = $object.prev();
								if($prev[0]){
									$object.slideUp(200, function(){
										$object.insertBefore($prev).slideDown(200);
									});
								}
							}else if(action == 'movedown'){
								var $next = $object.next();
								if($next[0]){
									$object.slideUp(200, function(){
										$object.insertAfter($next).slideDown(200);
									});
								}
							}else if(action == 'remove'){
								$object.fadeOut(500, function(){
									$object.remove();
								});
							}
						}
						// 遍历table并初始化
						var tabData = new Array();
						var maxId = 0;
						function buildTabData(index, element){
							var $this = $(element);
							var lineData = new Array();
							var id = element.id;
							id = id.substr(id.lastIndexOf('_') + 1);
							// update max id
							if(id*1 > maxId){
								maxId = id*1;
							}
							// store roomid
							lineData[0] = id;
							// store roomname
							lineData[1] = $this.find('td.ainn_room_name input').val();
							// store remain
							lineData[2] = $this.find('td.ainn_room_remain input').val();
							// store orderno
							lineData[3] = $this.find('td.ainn_room_action input').val();
							// store sign 0
							lineData[4] = 0;
							tabData[id] = lineData;						
						}
						$('#config_inn_body div.ainn_rooms > div.ainn_room').each(function(index, element) {
							var $this = $(element);
							buildTabData(index, element);
							
							$this.find('div.config_inn_moveup').click(function(e) {
								config_inn_action_click($this, 'moveup');
							});
							$this.find('div.config_inn_movedown').click(function(e) {
								config_inn_action_click($this, 'movedown');
							});
							$this.find('div.config_inn_remove').click(function(e) {
								config_inn_action_click($this, 'remove');
							});
							$this.hover(function(e) {
								$this.find('div.ainn_room_action_mv').toggleClass('invisible');
								$this.find('div.config_inn_remove').toggleClass('invisible');
							});
						});
						
						// 点击保存按钮
						// 使用下列格式组装
						// id|name|remain|orderno;...
						// sign 0 表示初始 1 表示正常 2 表示更新
						$('#config_inn_save').click(function(e) {
							isChange = true;
							var button_save = this;
							button_save.disabled = 'disabled';
							$(button_save).text('正在保存...');
							var $layer = $('<div id="config_inn_layout" />').css('height', getObjHeight($('#config_inn_body')))
																			.appendTo('#dialog_inn_config');
							
							// 处理数据
							var insertData = '', updateData = '', deleteData = '';
							$('#config_inn_body div.ainn_rooms table tr').each(function(index, element) {
								var $this = $(element);
								var $orderno = $this.find('td.ainn_room_action input');
								var $roomname = $this.find('td.ainn_room_name input');
								var $remain = $this.find('td.ainn_room_remain input');
								var id = $orderno.attr('name');
								id = id.substr(id.lastIndexOf('_') + 1);
								if($orderno.val() == 'N' || !tabData[id]){
									// 该行是新增的
									insertData += $roomname.val() + '|' + $remain.val() + '|' + index + ';';
								}else{
									var lineData = tabData[id];
									if(lineData[1] == $roomname.val() && lineData[2] == $remain.val() && lineData[3] == index){
										// 该行没被动过
										lineData[4] = 1;
									}else{
										// 该行需要被更新
										updateData += id + '|'+ $roomname.val() + '|' + $remain.val() + '|' + index + ';';
										lineData[4] = 2;
									}
								}
							});
							while(tabData.length != 0){
								lineData = tabData.pop();
								if(lineData){
									if(lineData[4] == 0){
										// 该行被删除了
										deleteData += lineData[0] + ';';
									}else{
										lineData[4] = 0;
									}
								}
							}
							
							var innid = $('#config_header div.config_innid').text();
							insertData = insertData.length==0?'':insertData.substr(0, insertData.length - 1);
							updateData = updateData.length==0?'':updateData.substr(0, updateData.length - 1);
							deleteData = deleteData.length==0?'':deleteData.substr(0, deleteData.length - 1);
							$.ajax({
								'async': false,
								'url': '/inn/save_inn_config',
								'data': {'innid': innid, 
									'innname': $('#config_inn_name').val(),
									'insertData': insertData, 
									'updateData': updateData, 
									'deleteData': deleteData},
								'dataType': 'json',
								'type': 'POST',
								'success': function(data){ 
									var code = data['code'];
									if(code == 0){
										$(button_save).text('保存成功！');
									}else {
										$(button_save).text('保存失败！');
									}
									setTimeout(function(){
										$(button_save).text('保存');
										button_save.disabled = '';
										$layer.remove();
									}, 1000);
									// 重新初始化
									tabData = new Array();
									maxId = 0;
									$('#config_inn_body div.ainn_rooms > div.ainn_room').each(function(index, element) {
										buildTabData(index, element);
									});
								}
							});
						});
					}
				});				
				
				return false;
			}
			$('#body_left div.inn_config a').each(function(index, element) {
				$(element).click(function(e) {
					return open_config_inn_dialog(element);
				});
			});
			$('#body_left div.inn_config_after_new a').each(function(index, element) {
				$(element).click(function(e) {
					return open_config_inn_dialog(element);
				});            
			});
		}

		// 轮询获取消息
		function getMessageFromServer(){
			$.ajax({
				'async': false,
				'url': '/msg',
				'data': {},
				'dataType': 'json',
				'type': 'GET',
				'success': function(data){ 
					var datas = data['data'];
					
					$.each(datas, function(index, element){
						var $msgDiv = $('<div class="msg_block"></div>').hide();
						var $msgDivMsg = $('<div></div>').text(element.msg);
						var $msgDivDate = $('<div class="msg_timestamp"></div>').text(element.timestamp);
						
						$msgDiv.append($msgDivMsg).append($msgDivDate);
						$('#body_right').prepend($msgDiv);	
						$msgDiv.slideDown(200);			
					});	
					
					setTimeout(getMessageFromServer, AUTO_GET_MESSAGE);
				}
			});
		}
		getMessageFromServer();
	}else{
		// 用户尚在登录页面
		$('#signin').click(function(e) {
			$('#body_register table').show();
			$('#body_register > div').hide();
            $('#body_register').fadeIn(200);
        });
		inputBoxEffect($('#reg_username'));
		inputBoxEffect($('#reg_password'));
		inputBoxEffect($('#reg_mobile'));
		inputBoxEffect($('#reg_email'));
		inputBoxEffect($('#reg_location'));
		
		$('#reg_approve').click(function(e) {
			$('#body_register div.reg_field_msg').remove();
            var reg_username = $.trim($('#reg_username').val());
			var reg_password = $.trim($('#reg_password').val());
			var reg_mobile = $.trim($('#reg_mobile').val());
			var reg_email = $.trim($('#reg_email').val());
			var reg_location = $.trim($('#reg_location').val());
			
			if(validateRegForm(reg_username, reg_password, reg_mobile, reg_email, reg_location)){
				if(reg_email == DEFAULT_INPUT_REG_EMAIL){
					reg_email = '';
				}
				if(reg_location == DEFAULT_INPUT_REG_LOCATION){
					reg_location = '';
				}	
				
				$('#body_register table').hide();		
				$('#body_register > div').text('保存中...').show();	
				$.ajax({
					'async': false,
					'url': '/signin',
					'data': {	'reg_username': reg_username, 
								'reg_password': reg_password, 
								'reg_mobile': reg_mobile, 
								'reg_email': reg_email, 
								'reg_location': reg_location},
					'dataType': 'json',
					'type': 'POST',
					'success': function(data){ 
						var code = data['code'];
						if(code == 0){
							$('#body_register > div').text('註冊成功！用戶名為：'+reg_username);
						}else{
							$('#body_register > div').hide();
							$('#body_register table').show();
							var $msg = $('<div class="reg_field_msg"></div>').text(data['msg']);
							$msg.hide().appendTo($('#reg_username').parent()).slideDown(200);
						}
					}
				});	
			}

        });
		
		function validateRegForm(reg_username, reg_password, reg_mobile, reg_email, reg_location){
			var result = true;
			var msg = '<div class="reg_field_msg">不是有效的$1</div>';
			
			if(reg_username == DEFAULT_INPUT_REG_USERNAME || reg_username == ''){
				$(msg.replace('$1', DEFAULT_INPUT_REG_USERNAME)).hide().appendTo($('#reg_username').parent()).slideDown(200);
				result = false;
			}
			if(reg_password == DEFAULT_INPUT_REG_PASSWORD || reg_password == ''){
				$(msg.replace('$1', DEFAULT_INPUT_REG_PASSWORD)).hide().appendTo($('#reg_password').parent()).slideDown(200);
				result = false;
			}
			if(reg_mobile.match('^[0-9]*$') == null){
				$(msg.replace('$1', DEFAULT_INPUT_REG_MOBILE)).hide().appendTo($('#reg_mobile').parent()).slideDown(200);
				result = false;
			}
			if(!(reg_email == DEFAULT_INPUT_REG_EMAIL || reg_email == '')){
				if(reg_email.match('[\w-]+@([\w-]+\.)+[\w-]+') == null){
					$(msg.replace('$1', DEFAULT_INPUT_REG_EMAIL)).hide().appendTo($('#reg_email').parent()).slideDown(200);
					result = false;
				}
			}
			return result;
		}
	}
});