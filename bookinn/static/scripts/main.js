
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
					
					// 关闭按钮
					$('#config_close').click(function(e) {
                        $('#dialog_inn_config').fadeOut(500).parent().remove('#dialog_inn_config');
						$('#masklayer').fadeOut(500);
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
					$('#config_inn_body div.ainn_rooms > div.ainn_room').each(function(index, element) {
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
						this.disabled = 'disabled';
						$(this).text('正在保存...');
						
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
						if((insertData+updateData+deleteData).length != 0){
							$.ajax({
								'async': false,
								'url': '/inn/save_inn_config',
								'data': {'innid': innid, 
									'insertData': insertData.substr(0, insertData.length - 1), 
									'updateData': updateData.substr(0, updateData.length - 1), 
									'deleteData': deleteData.substr(0, deleteData.length - 1)},
								'dataType': 'json',
								'type': 'POST',
								'success': function(data){ 
									var code = data['code'];
									
								}
							});
						}
                    });
				}
			});				
			
			return false;
        });
	}
});