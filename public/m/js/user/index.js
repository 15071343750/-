$(function () {
    getUserInfo(function (data) {
        console.log(data);
        $('.mui-media-body').html(data.username + '<p class="mui-ellipsis">' + data.mobile + '</p>');
    });

    $('.btn_outLogin').on('tap', function () {
        $.ajax({
            type: "get",
            url: "/user/logout",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    location.href = "/m/user/login.html";
                }
            }
        });
    });

});

var getUserInfo = function (fun) {
    lt.ajaxFilter({
        type: "get",
        url: "/user/queryUserMessage",
        dataType: "json",
        success: function (response) {
            fun && fun(response);
        }
    });
}