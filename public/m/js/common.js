/*
 * @Author: xiaoxin 
 * @Date: 2018-01-27 20:58:12 
 * @Last Modified by: xiaoxin
 * @Last Modified time: 2018-01-28 11:50:51
 */
//初始化区域滚动组件
mui('.mui-scroll-wrapper').scroll();

//封装工具函数
window.lt = {};	//防止变量污染
//获取地址栏参数函数
lt.getUrlParams = function () {
	var searchStr = location.search;	//地址栏的数据格式："?key=1&value=2"
	//把获取的数据以对象的形式返回方便后面使用，所以这个地方需要把字符串转换成对象
	var params = {};	//地址栏后面不一定传过来值，如果没有传过来值就返回一个空对象
	if (searchStr.indexOf('?') == 0) {	//判断是否传过来值
		searchStr = searchStr.substr(1); //获取问号之后的字符串
		var strArr = searchStr.split('&');
		for (var i = 0; i < strArr.length; i++) {
			var smallArr = strArr[i].split('=');
			params[smallArr[0]] = smallArr[1];
		}
	}
	return params;
};

// 登录拦截
lt.ajaxFilter = function (options) {
	$.ajax({
		type: options.type || "get",
		url: options.url || location.pathname,
		data: options.data || {},
		dataType: options.dataType || "json",
		beforeSend: function () {
			options.beforeSend && options.beforeSend();
		},
		success: function (response) {
			// 如果后台返回的数据中有error属性且值为400，那就表示未登录
			if (response.error == 400) {
				mui.alert("请先登录", "未登录", "去登录", function () {
					// 登录之后的业务逻辑是返回上一页，跳转登录页面的时候要把本页面的地址记录
					location.href = "/m/user/login.html?returnUrl=" + location.pathname + location.search;
					// http://localhost:3000/m/product.html?productId=1
					// pathname: "/m/product.html"
					// search: "?productId=1"
				});
			} else {
				options.success && options.success(response);
			}
		},
		error: function () {
			options.error && options.error();
		}
	});
}