$(function() {
	// 初步渲染
	var render = function(callback) {
		getProductData({
			page: currPage,
			pageSize: 2
		}, function(data) {
			$("tbody").html(template('productList', data));
			setPaginator(data.page, Math.ceil(data.total / data.size), render);
		});
		callback && callback();
	};
	render();

	//	上下架
	$("tbody").on('click', '.btn-change', function() {
		var dataList = $(this).get(0).dataset;
		var statu = dataList.statu == 1 ? 2 : 1;
		$.ajax({
			type: "post",
			url: "/product/updateProduct",
			data: {
				id: dataList.id,
				statu: statu
			},
			dataType: 'json',
			success: function(response) {
				if(response.success) {
					render();
				}
			}
		});
	});

	// 自定义校验数字规则
	// validate		校验对象	validators对象
	// $field		当前对应的字段	proName
	// options		notEmpty: { message: '请输入商品的名称' }
	$.fn.bootstrapValidator.validators.checkNum = {
		validate: function(validate, $field, options) {
			// 获取字段对应的值
			var text = $.trim($field.val());
			// 不能为空
			//		if (!text) return false; // 如果直接return一个false，那就没有提示信息
			if(!text) return {
				valid: false,
				message: '请输入商品信息'
			};
			// 必须是大于0的整数
			if(!/^[1-9]\d*$/.test(text)) return {
				valid: false,
				message: '请输入合法数字'
			};
			return true;
			// 返回true，表示验证成功
			// 返回false，表示验证失败
			// 如果返回false，自定义提示信息
		}
	};
	// 自定义尺码校验规则
	$.fn.bootstrapValidator.validators.checkSize = {
		validate: function(validate, $field, options) {
			var text = $.trim($field.val());
			if(!text) return {
				valid: false,
				message: '请输入商品尺码'
			};
			if(!/^[3-9]{2}-[3-9]{2}$/.test(text)) return {
				valid: false,
				message: '请输入合法尺码范围'
			};
			return true;
		}
	};
	// 自定义图片校验规则
	$.fn.bootstrapValidator.validators.checkPic = {
		validate: function(validate, $field, options) {
			if(picList.length < 3) return {
				valid: false,
				message: '请上传三张图片'
			};
			return true;
		}
	};
	//	添加商品
	$("#addForm").bootstrapValidator({
		excluded: [],	// 默认hidden(不止这一个)表单不验证
		//		提示的图标
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok', // 有效的
			invalid: 'glyphicon glyphicon-remove', // 无效的
			validating: 'glyphicon glyphicon-refresh' // 刷新的
		},
		fields: {
			proName: {
				validators: { // 规则
					notEmpty: {
						message: '请输入商品的名称'
					}
				}
			},
			proDesc: {
				validators: {
					notEmpty: {
						message: '请输入商品的描述'
					}
				}
			},
			num: {
				validators: {
					// 自定义校验规则
					checkNum: {}
				}
			},
			price: {
				validators: {
					checkNum: {}
				}
			},
			oldPrice: {
				validators: {
					checkNum: {}
				}
			},
			size: {
				validators: {
					checkSize: {}
				}
			},
			pic: {
				validators: {
					checkPic: {}
				}
			}
		}
	}).on('success.form.bv', function(e) { // 表单校验成功
		e.preventDefault();
		var addForm = $("#addForm");
//		另一种传输数据的方式
//		var data = addForm.serialize();
//		$.each(picList,function (i, item) {
//          data += '&picName' + (i + 1) + '=' + item.picName + '&picAddr' + (i + 1) + '=' + item.picAddr;
//      });
		//		获取数据
		var proName = $("#proName").val();
		var proDesc = $("#proDesc").val();
		var num = $("#num").val();
		var price = $("#price").val();
		var oldPrice = $("#oldPrice").val();
		var size = $("#size").val();

		$.ajax({
			type: "post",
			url: "/product/addProduct",
			data: {
				proName: proName,
				proDesc: proDesc,
				num: num,
				price: price,
				oldPrice: oldPrice,
				size: size,
				pic: picList
			},
			dataType: 'json',
			success: function(response) {
				if(response.success) {
					$("#addProduct").modal('hide');
					addForm.get(0).reset();
					addForm.data('bootstrapValidator').resetForm();
					currPage = 1;
					render();
				}
			}
		});

	});

	initUpload();

	//	编辑商品信息
	$("tbody").on('click', '.btn-edit', function() {
		var dataList = $(this).get(0).dataset;
		var productId = dataList.id; // id一般都是要穿到后台的，根据id来进行相应的修改
//		bootstrap模态框点击空白位置禁止关闭的方法：aria-hidden="false" data-backdrop="static"
		var editModal =
			`<div class="modal fade" tabindex="-1" role="dialog" id="editProduct" aria-hidden="false" data-backdrop="static">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<h3 class="modal-title text-center">修改商品信息</h3>
						</div>
						<div class="modal-body">
							<form action="#" id="editForm" autocomplete="off" class="form-horizontal">
								<div class="form-group">
									<label class="col-sm-2 control-label">商品名称</label>
									<div class="col-sm-10">
										<input type="text" class="form-control" name="proName" value="${dataList.proname}">
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-2 control-label">商品描述</label>
									<div class="col-sm-10">
										<textarea name="proDesc" class="form-control" >${dataList.prodesc}</textarea>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-2 control-label">商品库存</label>
									<div class="col-sm-10">
										<input type="text" class="form-control" name="num" value="${dataList.num}">
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-2 control-label">商品价格</label>
									<div class="col-sm-10">
										<input type="text" class="form-control" name="price" value="${dataList.price}">
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-2 control-label">商品原价</label>
									<div class="col-sm-10">
										<input type="text" class="form-control" name="oldPrice" value="${dataList.oldprice}">
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-2 control-label">商品尺码</label>
									<div class="col-sm-10">
										<input type="text" class="form-control" name="size" value="${dataList.size}">
									</div>
								</div>
							</form>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
							<button type="submit" form="editForm" class="btn btn-success">修改</button>
						</div>
					</div>
				</div>
			</div>`;
		// 也可以将editModal当成字符串，直接用html()方法追加到盒子中  	$("#dv").html(editModal)
		$("body").append(editModal);
		$("#editProduct").modal('show');

		$("#editForm").bootstrapValidator({
			//		提示的图标
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok', // 有效的
				invalid: 'glyphicon glyphicon-remove', // 无效的
				validating: 'glyphicon glyphicon-refresh' // 刷新的
			},
			fields: {
				proName: {
					validators: { // 规则
						notEmpty: {
							message: '请输入商品的名称'
						}
					}
				},
				proDesc: {
					validators: {
						notEmpty: {
							message: '请输入商品的描述'
						}
					}
				},
				num: {
					validators: {
						// 自定义校验规则
						checkNum: {}
					}
				},
				price: {
					validators: {
						checkNum: {}
					}
				},
				oldPrice: {
					validators: {
						checkNum: {}
					}
				},
				size: {
					validators: {
						checkSize: {}
					}
				}
			}
		}).on('success.form.bv', function(e) { // 表单验证成功
			// 增加的时候可以不要id，修改的时候肯定要id
			e.preventDefault();
			var editForm = $(e.target);
			var data = editForm.serialize();
			data += "&id=" + productId;
			$.ajax({
				type: "post",
				url: "/product/updateProduct",
				data: data,
				dataType: 'json',
				success: function(response) {
					$("#editProduct").next().remove();
					$("#editProduct").remove();
					render();
				}
			});
		});
		// 需求：当点击关闭模态框关闭时，页面还存在模态框，并且模态框还有id；下次再次点击编辑的时候，就会有两个模态框，会单个商品的编辑
		// 所以，当在点击关闭按钮时，页需要将添加的模态框全部清除
		$('[data-dismiss="modal"]').click(function() {
			$("#editProduct").next().remove();
			$("#editProduct").remove();
		});
		// 第二种思路：每次点击编辑都先将之前产生的模态框删除
		/*添加之前先删除
		 * 先定个开关 flag = false
		 * 生成一个模态框之后 flag = true
		 * 每次点击编辑之前都先进行一个判断
		 * if (flag) { 
		 * 		$("#editProduct").next().remove();
		 * 		$("#editProduct").remove(); 
		 * }
		 * 在重新添加一个模态框
		 * */
		// 第三种：复用之前添加的模态框，每次点击获取数据然后渲染到之前的模态框
		/*
		 *这个和admin.js中不一样的是，这个地方的模态框还需要渲染不同的数据
		 * 那一个数据是固定的
		 * */
	});

}); // 入口函数结束

//查询商品信息
var getProductData = function(params, callback) {
	$.ajax({
		type: "get",
		url: "/product/queryProductDetailList",
		data: params,
		dataType: 'json',
		success: function(response) {
			callback && callback(response);
		}

	});
}

var currPage = 1;
//分页
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

var picList = [];
// 初始化上传图片图片
var initUpload = function() {
	$('[name="pic1"]').fileupload({
		dataType: 'json',
		done: function(e, data) {
			var imgSrc = `<img src="${data.result.picAddr}" />`;
			//			将上传的图片信息保存在数组中
			picList.push(data.result);
			$(this).parent().parent().next().append(imgSrc);
			if(picList.length >= 3) {
				$("#addForm").data('bootstrapValidator').updateStatus('pic', 'VALID');
			} else {
				$("#addForm").data('bootstrapValidator').updateStatus('pic', 'INVALID');
			}
		}
	});
	//	console.log(picList);
	//	[
	//		{
	//			picName: "459cbfe0-0732-11e8-9cc3-559b08071334.jpg", 
	//			picAddr: "/upload/product/459cbfe0-0732-11e8-9cc3-559b08071334.jpg"},
	//		{
	//			picName: "45a5e7a0-0732-11e8-9cc3-559b08071334.jpg", 
	//			picAddr: "/upload/product/45a5e7a0-0732-11e8-9cc3-559b08071334.jpg"},
	//		{
	//			picName: "45ae2500-0732-11e8-9cc3-559b08071334.jpg", 
	//			picAddr: "/upload/product/45ae2500-0732-11e8-9cc3-559b08071334.jpg"}
	//		}
	//	]
}