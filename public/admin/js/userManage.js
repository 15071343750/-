$(function() {
	//	var pageNow = 1;
	var render = function() {
		getUserData({
			page: pageNow,
			pageSize: 5
		}, function(data) {
			$('tbody').html(template('formList', data));
			setPaginator(data.page, Math.ceil(data.total / data.size), render);
		});
	};
	render(); // 渲染

	$("tbody").on('click', '.btn-operation', function() {
		var id = $(this).data('id');
		var name = $(this).data('name');
		var isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
		$('#optionModal').find('strong').html((isDelete == 1 ? '启用 ' : '禁用 ') + name);
		$("#optionModal").modal('show'); // 手动触发显示模态框
		$("#optionModal").off('click', '.btn-danger').on('click', '.btn-danger', function() {
			$.ajax({
				type: 'post',
				url: '/user/updateUser',
				data: {
					id: id,
					isDelete: isDelete
				},
				dataType: 'json',
				success: function(data) {
					if(data.success) {
						render();
						$('#optionModal').modal('hide'); // 手动触发隐藏模态框
					}
				}
			})
		});
	});

});

var pageNow = 1;
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
		onPageClicked: function(event, originalEvent, type, page) {
			/*改变当前页再渲染 page当前点击的按钮的页面*/
			pageNow = page;
			callback && callback();
		}
	});
}

var getUserData = function(params, callback) {
	$.ajax({
		type: 'get',
		url: '/user/queryUser',
		data: params,
		datType: 'json',
		success: function(response) {
			callback && callback(response);
		}
	});
};