//下拉刷新上拉加载
mui.init({
	pullRefresh: {
		container: ".mui-scroll-wrapper",
		//下拉刷新
		down: {
			callback: function() {
				setTimeout(function() {
					this.endPulldownToRefresh();
				}.bind(this), 1000);
			}
		},
		//上拉加载
		up: {
			callback: function () {
				setTimeout(function() {
					this.endPullupToRefresh();
				}.bind(this), 1000);
			}
		}
	}
});

$(function () {
	// 1、初始化渲染
	var render = function () {
		// decodeURIComponent() 转码，将地址栏中乱码的汉字转成正常编码
		var key = decodeURIComponent(lt.getUrlParams().key) || ''; //没有数据就默认为空
		$(".search_input").val(key);
		getProductListData({
			proName: key,
			page: 1,
			pageSize: 10
		}, function (data) {
			$(".lt_product").html(template('templateList', data));
		});
	}
	render();
	
	// 2、当前页搜索
	$(".search_btn").on('tap', function () {
		var key = $.trim($(".search_input").val());
		if (key == '') {
			mui.toast('请输入关键字');
			return false;
		}
		$(".lt_product").html('<div class="loading"><span class="mui-spinner"></span></div>');
		getProductListData({
			proName: key,
			page: 1,
			pageSize: 10
		}, function (data) {
			$(".lt_product").html(template('templateList', data));
		});
	});
	
	// 3、排序展示
	$(".lt_orderBar > a").on('tap', function () {
		var key = $.trim($(".search_input").val());
		if (key == '') {
			mui.toast('请输入关键字');
			return false;
		}
//		获取排序关键字
		var sortName = $(this).attr('data-type');
		if (!sortName) {
			return false;
		}
//		点击更换箭头	三种情况：第一次点击不用更换；第二次点击更换；再次点击再更换
		if ($(this).hasClass('now')) {
			$(this).find('span').toggleClass('fa-angle-down').toggleClass('fa-angle-up');
		}
		//如果写在更换箭头上面，那么第一次点击就会更换箭头
		//点击的时候除了要将其他a链接的now样式取消还要将其他按钮的样式重置箭头向下的初始样式
		$(this).addClass('now').siblings('a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
		//排序方式：根据span中的ClassName来判断用什么方式来排序
		var numValue;
		if ($(this).find('span').hasClass('fa-angle-down')) {
			numValue = 2;
		} else {
			numValue = 1;
		}
		var order = {};
		order[sortName] = numValue;
//		$.extend(obj, obj10) 拼接两个对象
		getProductListData($.extend({
			proName: key,
			page: 1,
			pageSize: 10
		}, order), function (data) {
			$(".lt_product").html(template('templateList', data));
		});
	});
	
	// 4、下拉刷新
	// 5、上拉加载
});

//从后台获取list的详细数据
var getProductListData = function (json, callback) {
	$.ajax({
		url: '/product/queryProduct',
		type: 'get',
		data: json,
		dataType: 'json',
		success: function (res) {
			if (!res.data.length) {
				mui.toast('没有相关数据');
			}
			callback && callback(res);
		}
	});
}