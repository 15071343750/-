/*
 * @Author: xiaoxin 
 * @Date: 2018-01-27 21:01:56 
 * @Last Modified by: xiaoxin
 * @Last Modified time: 2018-01-29 10:32:23
 */
$(function () {
	var id = lt.getUrlParams().productId;
	var render = function () {
		getProductDetailData({id: id}, function (data) {
			// console.log(data);
			setTimeout(function () {
				$("#productBox").html(template('templateProduct', data));
				// 轮播图初始化
				mui('.mui-slider').slider({	//为什么要写在这个地方？？？异步渲染
					interval: 2000
				});
				// 数量选择按钮初始化
				mui('.mui-numbox').numbox();
			}, 500);
		});
	}
	render();

	// 重新加载
	$('.reload').on('tap', function () {
		$('#productBox').html('<div class="loading"><span class="mui-spinner"></span></div>');
		render();
	});

	// 尺码选择
	$('#productBox').on('tap', '.lt_item > span', function () {
		$(this).addClass('now').siblings('span').removeClass('now');
	});

	// 加入购物车
	/*
	需要获取数据	商品id 尺码 数量
	发送ajax
	成功：提示成功 弹出一个对话框去购物车查看
	失败：提示失败
	防止多次提交
	*/
	$('.mui-btn-danger').on('tap', function () {
		if (window.during) {	// 为true不能提交
			return;
		}
		var size = $('.lt_item > span.now').html();
		var quantity = $('.mui-numbox-input').val();
		var params = {
			productId: id,
			size: size,
			num: quantity
		};
		if (!params.productId) {
			mui.toast('商品id异常');
			return false;
		}
		if (!params.size) {
			mui.toast('请选择尺码');
			return false;
		}
		if (!params.num) {
			mui.toast('请选择数量');
			return false;
		}
		lt.ajaxFilter({
			type: "post",
			url: " /cart/addCart",
			data: params,
			dataType: "json",
			beforeSend: function () {
				window.during = true;
			},
			success: function (response) {
				// { "success": true }
				if (response.success) {
					mui.confirm('前去购物车查看', '温馨提示', ["前往", "继续浏览"], function (e) {
						if (e.index == 0) {
							location.href = "/m/user/cart.html";
						} else {
							window.during = false;
							// ...
						}
					});
				} else {
					mui.toast('添加失败，请重试！');
				}
			},
			error: function () {
				mui.toast("提交失败，网络繁忙！");
				window.during = false;
			}
		});
	});

});

var getProductDetailData = function (json, callback) {
	$.ajax({
		url: '/product/queryProductDetail',
		data: json,
		type: 'get',
		dataType: 'json',
		success: function (res) {
			callback && callback(res);
		}
	});
}