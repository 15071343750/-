NProgress.configure({
	showSpinner: false
});
$(window).ajaxStart(function() {
	NProgress.start();
});
$(window).ajaxStop(function() {
	NProgress.done();
});

// 点击显示影藏aside
$("[data-menu]").on('click', function() {
	$("aside").toggle(300);
	$("section").toggleClass('menu');
});

// 二级菜单的显示影藏
$('.menu [href="javascript:;"]').off('click').on('click', function() {
	$(this).siblings('.child').slideToggle();
});

// 退出模态框
var logoutFlag = true;
$("[data-logout]").click(function() {
	if(logoutFlag) {
		var ts = "温馨提示";
		var logoutModal =
			`<div id="logoutModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
			<div class="modal-dialog modal-sm">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title" id="myModalLabel">${ts}</h4>
					</div>
					<div class="modal-body">
						<p class="text-danger"><span class="glyphicon glyphicon-info-sign"></span> 您确定要退出后台管理系统吗？</p>
					</div>
					<div class="modal-footer">
					    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					    <button type="button" class="btn btn-primary">确认</button>
					</div>
				</div>
			</div>
		</div>`;
		//	追加到页面中
		$('body').append(logoutModal);
		logoutFlag = false;
	}
	//	bootstrap手动激活模态框
	$('#logoutModal').modal('show');
	/*为什么要先解绑click事件？？
	 * click事件都是绑定在同一个元素身上
	 * 给同一个对象绑定click事件，如果这个对象上绑定了多个click事件，那么点击一次click事件都会被触发
	 * 所以需要将之前绑定的click事件全部解绑，再次绑定click事件时，就只有最后绑定的这一个click事件
	 * */
	$("#logoutModal").off('click', '.btn-primary').on('click', '.btn-primary', function() {
		$.ajax({
			url: '/employee/employeeLogout',
			type: 'get',
			data: {},
			dataType: 'json',
			success: function(response) {
				setTimeout(function() {
					if(response.success) {
						/*退出成功*/
						location.href = 'login.html';
					}
				}, 500);
			}
		});
	});
});