$(function () {
	/*前端校验功能  bootstrap validator*/
	/*1.完整的表单结构  form   input  submit 这些元素*/
	/*2.表单元素需要对应的名字 name="username" */
	/*3.初始化表单验证组件 插件*/
	/*4.配置组件功能*/
	/*5.配置具体的属性需要的校验规则*/
	$("#login").bootstrapValidator({
//		提示的图标
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',			// 有效的
            invalid: 'glyphicon glyphicon-remove',		// 无效的
            validating: 'glyphicon glyphicon-refresh'	// 刷新的
		},
//		属性对应的是表单元素的名字
		fields: {
//			匹配校验规则
			username: {
				// 规则
				validators: {
					message: '用户名无效',	// 默认提示信息
// 					匹配规则关键字
//					between：检测输入的值是否在两个指定的值之间。
//				    callback：通过回调函数返回验证信息。
//				    creditCard：验证信用卡格式。
//				    different：如果输入值和给定的值不同返回true。
//				    digits：如果输入的值只包含数字返回true。
//				    emailAddress：验证电子邮件格式是否有效。
//				    greaterThan：如果输入的值大于或等于指定的值返回true。
//				    hexColor：验证一个hex格式的颜色值是否有效。
//				    identical：验证输入的值是否和指定字段的值相同。
//				    lessThan：如果输入的值小于或等于指定的值返回true。
//				    notEmpty：检测字段是否为空。
//				    regexp：检测输入值是否和指定的javascript正则表达式匹配。
//				    remote：通过AJAX请求来执行远程代码。
//				    stringLength：验证字符串的长度。
//				    uri：验证URL地址是否有效。
//				    usZipCode：验证美国的邮政编码格式。  
					notEmpty: {
                        message: '用户名不能为空'
                    },
                    regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '只能是数字字母_.'
                    },
                    /*设置错误信息 和规则无关 和后台校验有关系*/
                    callback: {
                        message: '用户名错误'
                    },
                    fun: {
                    	message: 'fun函数无效的示例'
                    }
				}
			},
			password: {
                validators: {
                	message: '密码无效',
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 18,
                        message: '密码在6-18个字符内'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '含有非法字符'
                	},
                    callback: {
                        message: '密码不正确' 
                    }
                }
            }
		}
	}).on('success.form.bv', function (e) { // 表单校验成功
		/*禁用默认提交的事件 因为要使用ajax提交而不是默认的提交方式*/
		e.preventDefault();
		/*获取当前的表单*/
		var form = $(e.target);	// 可以通过选择器直接选择
		console.log(form.serialize());	// username=root&password=123456
		$.ajax({
			type: "post",
			url: "/employee/employeeLogin",
			data: form.serialize(),
			dataType: 'json',
			success: function (response) {
				if (response.success) {
                    /*登录成功*/
                    location.href = 'index.html';
                } else {
                	// 登录失败
//              	登录按钮点击后,默认不允许再次点击;登录失败要恢复登录按钮的点击
//					form.data('bootstrapValidator').disableSubmitButtons(false);
					form.bootstrapValidator('disableSubmitButtons', false);
//					指定触发某一个表单元素的的错误提示函数
					if (response.error == 1000) {
//						form.data('bootstrapValidator').updateStatus('username', 'INVALID', 'fun'); // 不能触发
// 						可以触发
						form.data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback'); 
//						form.data('bootstrapValidator').updateStatus('username', 'INVALID').validateField('username'); // 触发除callback之外的所有验证规则
//						form.data('bootstrapValidator').updateStatus('username', 'INVALID', 'notEmpty');
					} else if (response.error == 1001) {
						form.data('bootstrapValidator').updateStatus('password', 'INVALID', 'callback');
					}
                }
			}
		});
	});
//	重置功能
	$(".pull-left[type='reset']").on('click', function () {
		$('#login').data('bootstrapValidator').resetForm();
	});
});