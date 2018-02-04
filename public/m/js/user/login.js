/*
 * @Author: xiaoxin 
 * @Date: 2018-01-28 10:34:25 
 * @Last Modified by: xiaoxin
 * @Last Modified time: 2018-01-28 11:45:35
 */
$('.mui-btn-primary').on('tap', function () {
    if (window.loginKey) {
        return false;
    }
    var data = {
        username: $('.mui-input-row input[name = "username"]').val(),
        password: $('.mui-input-row input[name = "password"]').val()
    };
    if (!data.username) {
        mui.toast("用户名不能为空");
        return false;
    }
    if (!data.password) {
        mui.toast("密码不能为空");
        return false;
    }
    $.ajax({
        type: "post",
        url: "/user/login",
        data: data,
        dataType: "json",
        beforeSend: function () {
            window.loginKey = true;
        },
        success: function (response) {
            if (response.success) {
                var nowUrl = location.search;// ?returnUrl=/m/product.html
                if (nowUrl.indexOf("?returnUrl=") !== -1) {
                    // 如果当前地址栏中有地址，就回跳
                    location.href = nowUrl.replace("?returnUrl=", '');
                } else {
                    // 否则跳转到首页
                    location.href = "/m/user/index.html";
                }
            } else if (response.error == 403) {
                mui.toast(response.message);
                window.loginKey = false;
            }
        },
        error: function () {
            mui.toast("网络异常...");
            window.loginKey = false;
        }
    });
});