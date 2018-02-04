$(function () {
//	获取localStorage数据
	var localList = getLocalStorage('leTaoHistory');
//	渲染页面
	$(".lt_history").html(template('historyTmp', {list: localList}));
	
//	点击搜索按钮
	$(".search_btn").on('tap', function () {
		//获取输入框中的文字
		var key = $.trim($(".search_input").val());
		//如果没有输入就点击按钮
		if (key == '') {
			mui.toast('请输入内容');
			return false;
		}
		//清空输入框中的文字
		$(".search_input").val('');
		//获取本地存储的数据(已经转换成数组形式)
		var dataArr = getLocalStorage('leTaoHistory');
		//将获取的key存入数组中
		//三种情况		1、重复；2、原数组长度超过10；3、正常插入
		var flag = false;
		var sameIndex;
		dataArr.forEach(function (item, index) {	//判断是否有重复的
			if (key == item) {
				flag = true;
				sameIndex = index;
			}
		});
		if (flag) {	//有重复的就删除再添加数据至数组尾部
			dataArr.splice(sameIndex, 1);
			dataArr.push(key);
		} else {
			if (dataArr.length < 10) {	//正常插入，原数组长度 < 10
				dataArr.push(key);
			} else {	//数组长度 > 10，就删除头部数据
				dataArr.shift();
				dataArr.push(key);
			}
		}
		//写入本地存储中(只能写入string格式)		JSON.stringify()将数组转换成字符串(js方法)
		localStorage.setItem('leTaoHistory', JSON.stringify(dataArr));	//每次改变dataArr，都要将dataArr重新写入本地存储
		//点击跳转
		location.href = "searchList.html?key=" + key;
	});
	
//	点击历史数据后面的小叉叉(清除一条数据)
	$(".lt_history").on('tap', '.mui-icon-closeempty', function () {
		var dataArr = getLocalStorage('leTaoHistory');
		var key = $(this).attr('data-key');
		var delIndex;
		dataArr.forEach(function (item, index) {
			if (key == item) {
				delIndex = index;	//找出重复项(点击的删除条)在数组中的位置
			}
		});
		dataArr.splice(delIndex, 1);
		localStorage.setItem('leTaoHistory', JSON.stringify(dataArr));
		$(".lt_history").html(template('historyTmp', {list: dataArr}));	// 可以再次获取本地数据再渲染
	});
	
//	清除全部历史数据
	$(".lt_history").on('tap', '.fa-trash', function () {
//		var dataArr = getLocalStorage('leTaoHistory');
		var dataArr = [];
		localStorage.setItem('leTaoHistory', JSON.stringify(dataArr));
		$(".lt_history").html(template('historyTmp', {list: []}));
	});
	
});

//搜索记录全部存在localstorage；以数组的形式返回本地数据
var getLocalStorage = function (key) {
	var str = localStorage.getItem(key) || "[]";
//	本地存储的数据都是数组字符串,转换成数组格式
	var arr = JSON.parse(str);
	return arr;
}