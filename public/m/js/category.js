//区域滚动条件:
//父容器有固定高度且有overflow:hidden;属性
//子容器高度超过父容器高度
//	<div class='father'>
//		<div class='son'>
//			...
//		</div>
//	</div>

//左侧栏
mui('.lt_cateLeft').scroll();
//右侧栏
mui('.lt_cateRight').scroll();

$(function () {
	//	左侧栏渲染：一级渲染
	getFirstCategoryData(function (data) {
		//		console.log(data);
		$(".lt_cateLeft").find('ul').html(template('firstCategory', data));
		//		右侧栏：二级渲染	初始化
		getSecondCategoryData(data.rows[0].id, function (data2) {
			//			console.log(data2);
			$(".lt_cateRight").find('ul').html(template('secondCategory', data2));
		});
	});
	//点击渲染
	/* 事件委托：为什么需要事件委托？？？
	 * 	原因：异步渲染和事件绑定机制
	 * 		ul中li是通过ajax异步获取数据然后渲染到页面上的
	 * 		如果要给li绑定事件，那么首先要求页面上有li元素，绑定事件如果发生在li全部渲染到页面之前，那么绑定事件就会失败
	 * 		如果在页面加载完就直接获取lt_cateLeft里面的li绑定事件，此时异步的ajax还没有完全将数据返回，页面上还没有li
	 * 		所以用事件委托的方法，先将事件绑定在页面已有的元素上面(li的父元素或者再上级)
	 */
	$(".lt_cateLeft ul").on('tap', 'li', function () {
		$(this).addClass('now').siblings('li').removeClass('now');
		var id = $(this).attr('data-id');
		getSecondCategoryData(id, function (data2) {
			$(".lt_cateRight").find('ul').html(template('secondCategory', data2));
			//每次渲染，都需要将盒子重新定位到顶部位置
			mui('.lt_cateRight').scroll().scrollTo(0, 0, 100);
		});
	});
});
//获取一级分类的数据
var getFirstCategoryData = function (fun) {
	$.ajax({
		url: '/category/queryTopCategory',
		data: {},
		type: 'GET',
		dataType: 'json',
		success: function (res) {
			fun && fun(res);
		}
	});
}
//获取二级分类的数据
var getSecondCategoryData = function (id, fun) {
	$.ajax({
		url: '/category/querySecondCategory',
		data: {
			id: id
		},
		type: 'GET',
		dataType: 'json',
		success: function (res) {
			fun && fun(res);
		}
	});
}