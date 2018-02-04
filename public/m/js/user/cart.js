$(function () {
    mui.init({ // 完成下拉刷新效果
        pullRefresh: {
            container: ".mui-scroll-wrapper",
            down: {
                auto: true,
                callback: function () {
                    getCartData(function (data) {
                        $('.mui-table-view').html(template('cartInfo', data));
                        this.endPulldownToRefresh();
                    }.bind(this));
                }
            }
        }
    })

    // 删除操作
    $('.mui-table-view').on('tap', '.mui-btn-red', function () {
        var id = $(this).attr('data-id');
        mui.confirm('确认删除？', '温馨提示', ['确定', '取消'], function (e) {
            if (e.index == 0) {
                lt.ajaxFilter({
                    url: "/cart/deleteCart",
                    data: {
                        id: id
                    },
                    beforeSend: function () {
                        window.inputIdArr = getId();
                    },
                    success: function (response) {
                        if (response.success) {
                            // 渲染html
                            getCartData(function (data) {
                                $('.mui-table-view').html(template('cartInfo', data));
                                var list = $('.mui-table-view input');
                                for (var i = 0; i < list.length; i++) {
                                    for (var j = 0; j < inputIdArr.length; j++) {
                                        if (list[i].dataset.id == inputIdArr[j]) {
                                            list[i].checked = 'checked';
                                        }
                                    }
                                }
                                setAllPrice();
                                mui.toast("删除成功");
                            });
                        }
                    }
                });
            } else {
                // 其他操作
            }
        });
    });

    // 编辑操作
    $('.mui-table-view').on('tap', '.mui-btn-blue', function () {
        var objData = this.dataset;
        // console.log(objData);
        // HTML5自定义属性对象Dataset  获取所有data属性的一个集合
        // {id: "4", size: "38", num: "1", productsize: "35-45", productnum: "66"}
        mui.confirm(template('edit', objData).replace(/\n/g, ''), '编辑商品', ['取消', '确认'], function (e) {
            if (e.index == 1) {
                lt.ajaxFilter({
                    type: "post",
                    url: "/cart/updateCart",
                    data: {
                        id: objData.id,
                        size: $('.lt_edit span.now').html(),
                        num: $('.lt_edit input').val()
                    },
                    beforeSend: function () {
                        window.inputIdArr = getId();
                    },
                    success: function (response) {
                        if (response.success) {
                            // 渲染html
                            getCartData(function (data) {
                                $('.mui-table-view').html(template('cartInfo', data));
                                // 重新计算总金额:根据之前选中的来计算
                                var list = $('.mui-table-view input');
                                for (var i = 0; i < list.length; i++) {
                                    for (var j = 0; j < inputIdArr.length; j++) {
                                        if (list[i].dataset.id == inputIdArr[j]) {
                                            list[i].checked = 'checked';
                                        }
                                    }
                                }
                                setAllPrice();
                                mui.toast("修改成功");
                            });
                        }
                    }
                });
            } else { // 点击取消后的操作
                // ...
            }
        });
        mui('.mui-numbox').numbox();
        $('.lt_edit span').on('tap', function () {
            $(this).addClass('now').siblings('span').removeClass('now');
        });
    });

    // 计算总额
    $('.mui-table-view').on('change', 'input', function () {
        setAllPrice();
    });

});

var getCartData = function (fun) {
    lt.ajaxFilter({
        type: "get",
        url: "/cart/queryCartPaging",
        data: {
            page: 1,
            pageSize: 100
        },
        dataType: "json",
        success: function (response) {
            fun && fun(response);
        }
    });
}

var setAllPrice = function () {
    var amount = 0;
    $('.mui-table-view input:checked').each(function (index, item) {
        var num = $(this).attr('data-num');
        var price = $(this).attr('data-price');
        amount += num * price;
    });
    amount = parseInt(amount * 100) / 100;
    $('#cartAmount').html(amount);
}

// 获取所有被选中的input的data-id
var getId = function () {
    var inputArr = [];
    $('.mui-table-view input:checked').each(function (index, item) {
        inputArr.push($(this).attr('data-id'));
    })
    return inputArr;
}