$(function() {
	var currPage = 1;
	var render = function() {
		getCategorySecondData({
			page: currPage,
			pageSize: 3
		}, function(data) {
			$("tbody").html(template('secondList', data));
			setPaginator(data.page, Math.ceil(data.total / data.size), render);
		});
	};
	render();

	//	分页
	var setPaginator = function(pageCurr, pageSum, callback) {
		$('.pagination').bootstrapPaginator({
			/*当前使用的是3版本的bootstrap*/
			bootstrapMajorVersion: 3,
			/*配置的字体大小是小号*/
			size: 'small',
			/*当前页*/
			currentPage: pageCurr,
			/*一共多少页*/
			totalPages: pageSum,
			/*页面上最多显示几个含数字的分页按钮*/
			numberOfPages: pageSum,
			/*设置显示的样式，默认是箭头	*/
			itemTexts: function(type, page, current) {
				switch(type) {
					case "first": // type值固定
						return `<span class="glyphicon glyphicon-fast-backward"></span>`;
					case "prev":
						return `<span class="glyphicon glyphicon-step-backward"></span>`;
					case "next":
						return `<span class="glyphicon glyphicon-step-forward"></span>`;
					case "last":
						return `<span class="glyphicon glyphicon-fast-forward"></span>`;
					case "page":
						return page;
				}
			},
			onPageClicked: function(event, originalEvent, type, page) {
				currPage = page; // 注意currPage的作用域
				callback && callback();
			}
		});
	}

	initDropDown();
	initUpload();

	//	表单验证
	$("#form").bootstrapValidator({
		/*校验插件默认会忽略    隐藏的表单元素    不忽略任何情况的表单元素*/
		excluded: [],
		//		提示的图标
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok', // 有效的
			invalid: 'glyphicon glyphicon-remove', // 无效的
			validating: 'glyphicon glyphicon-refresh' // 刷新的
		},
		//		属性对应的是表单元素的名字
		fields: {
			//			匹配校验规则
			categoryId: {
				validators: {
					notEmpty: {
						message: '请选择一级分类'
					}
				}
			},
			brandName: {
				validators: {
					notEmpty: {
						message: '请输入二级分类名称'
					}
				}
			},
			brandLogo: {
				validators: {
					notEmpty: {
						message: '请上传二级分类Logo'
					}
				}
			}
		}
	}).on('success.form.bv', function(e) { // 表单校验成功
		e.preventDefault();
		var form = $(e.target);
		$.ajax({
			type: "post",
			url: "/category/addSecondCategory",
/*			serialize()	将form表单里面所有的name属性以及值，转化成
	categoryId=5&brandName=%E5%AE%89%E8%B8%8F&brandLogo=%2Fupload%2Fbrand%2F08377380-068c-11e8-9707-3d67045488c9.png
	就是和地址栏中数据的样式一样		这个数据可以直接作为json格式作为data的参数
	后台可以解析这样格式的数据
*/
			data: form.serialize(),
			dataType: 'json',
			success: function(response) {
				if(response.success) {
					$("#addBtnModal").modal('hide');
					var currPage = 1;
					render();
					// 把表单重置
					form.get(0).reset(); // reset() 是原生方法
					form.data('bootstrapValidator').resetForm();
					// 将一级分类以及图片重置为默认样式
					$(".dropdown-text").html('--请选择--');
					$(".form-group > img").attr('src', 'images/bg.png');
				}
			}
		});
	});

	// 只要把模态框关闭，就恢复默认表单状态
	$('[data-dismiss="modal"]').on('click', function() {
		$("#form").get(0).reset(); // reset() 是原生方法
		$("#form").data('bootstrapValidator').resetForm();
		$(".dropdown-text").html('--请选择--');
		$(".form-group > img").attr('src', 'images/bg.png');
	});

}); // 入口函数结束

//获取二级分类
var getCategorySecondData = function(params, callback) {
	$.ajax({
		url: '/category/querySecondCategoryPaging',
		type: 'get',
		data: params,
		dataType: 'json',
		success: function(response) {
			callback && callback(response);
		}
	});
}

//初始化下拉列表
var initDropDown = function() {
	var dropDown = $('.dropdown-menu');
	$.ajax({
		type: 'get',
		url: '/category/queryTopCategoryPaging',
		data: {
			page: 1,
			pageSize: 100
		},
		dataType: 'json',
		success: function(response) {
			var html = [];
			$.each(response.rows, function(index, item) {
				var str = '<li><a data-id="' + item.id + '" href="javascript:;">' + item.categoryName + '</a></li>';
				html.push(str);
			});
			dropDown.html(html);
		}
	});
	dropDown.on('click', 'a', function() {
		$(".dropdown-text").html($(this).html());
		// 将一级分类传入到input中
		$('[name="categoryId"]').val($(this).data('id'));
		// 写入之后，手动触发验证成功
		$("#form").data('bootstrapValidator').updateStatus('categoryId', 'VALID');
	});
}

//文件上传
var initUpload = function() {
	$('[name="pic1"]').fileupload({
		dataType: 'json',
		done: function(e, data) {
			$(this).parent().parent().next().find('img').attr('src', data.result.picAddr);
			// 将图片路径传入表单元素中
			$('[name="brandLogo"]').val(data.result.picAddr);
			// 图片成功上传之后，将图片表单（隐藏域表单）手动触发验证成功
			$("#form").bootstrapValidator('updateStatus', 'brandLogo', 'VALID');
		}
	});
}