$(function() {
	var currPage = 1;
	var render = function() {
		getCategoryFirstData({
			page: currPage,
			pageSize: 3
		}, function(data) {
			$("tbody").html(template('firstList', data));
			setPaginator(data.page, Math.ceil(data.total / data.size), render);
		});
	};
	render();

	//	分页渲染
	var setPaginator = function(pageCurr, pageSum, callback) {
		// $('#data-pagination').bootstrapPaginator(options)就是将id为'data-pagination'的dom元素设置为分页组件，同时传入一些定制参数，currentPage设置当前页码，totalPages设置总页数。
		/*获取需要初始的元素 使用bootstrapPaginator方法*/
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
			/*设置显示的样式，默认是箭头		算是固定写法*/
			itemTexts: function(type, page, current) {
				switch(type) {
					case "first": // type值固定
						return `<span class="glyphicon glyphicon-fast-backward"></span>`; // 文字随意
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
			/*点击页面事件		参数都固定*/
			/*点击分页为什么会切换分页效果？
			 * 主要还是这下面的点击事件，下面的点击事件改变了当前页号，并且调用了渲染页面函数render
			 * 在render里面，有分页渲染函数
			 * 所以点击之后页面重新渲染，分页重新渲染
			 * */
			onPageClicked: function(event, originalEvent, type, page) {
				/*改变当前页再渲染 page当前点击的按钮的页面*/
				currPage = page; // 注意currPage的作用域
				callback && callback();
			}
		});
	}

	//	添加分类
	$("#form").bootstrapValidator({
		//		提示的图标
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok', // 有效的
			invalid: 'glyphicon glyphicon-remove', // 无效的
			validating: 'glyphicon glyphicon-refresh' // 刷新的
		},
		fields: {
			categoryName: {
				validators: {
					message: '分类名无效',
					notEmpty: {
						message: '分类名不能为空'
					}
				}
			}
		}
	}).on('success.form.bv', function(e) { // 表单校验成功
		/*禁用默认提交的事件 因为要使用ajax提交而不是默认的提交方式*/
		e.preventDefault();
		/*获取当前的表单*/
		var form = $(e.target); // 可以通过选择器直接选择
		$.ajax({
			url: '/category/addTopCategory',
			data: form.serialize(),
			type: 'post',
			dataType: 'json',
			success: function(response) {
				if (response.success) {
					$("#addBtnModal").modal('hide');
					currPage = 1;
					render();
					form.data('bootstrapValidator').resetForm();
					form.find('input').val('');
				}
			}
		});
	});

});

var getCategoryFirstData = function(params, callback) {
	$.ajax({
		type: "get",
		url: "/category/queryTopCategoryPaging",
		data: params,
		dataType: 'json',
		success: function(response) {
			callback && callback(response);
		}
	});
}