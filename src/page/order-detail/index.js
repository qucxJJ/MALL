/*
* @Author: yun
* @Date:   2017-07-21 15:17:06
* @Last Modified by:   yun
* @Last Modified time: 2017-07-21 16:22:26
*/

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide=require('page/common/nav-side/index.js');
var templateIndex=require('./index.string');
var _order=require('service/order-service.js');
var _mm=require('util/mm.js');
// page逻辑部分
var page={
    data: {
        orderNo: _mm.getUrlParam('orderNumber')
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function(){
        // 初始化左侧菜单
        navSide.init({name: 'order-list'});
        this.loadDetail();
    },
    bindEvent: function(){
        var _this=this;
        document.addEventListener('click',function(e){
            if(e.target.classList.contains('order-cancel')){
                if(window.confirm('确实要取消该订单吗？')){
                    _order.cancelOrder(_this.data.orderNo,function(res){
                        _mm.successTips('订单取消成功');
                        _this.loadDetail();
                    },function(errmsg){
                        _mm.errorTips(errMsg);
                    })
                }
            }
        },false);
    },
    loadDetail: function(){
        var _this=this;
        var orderDetailHtml='';
        var content=document.querySelector('.content');
        content.innerHTML='<div class="loading"></div>';
        _order.getOrderDetail(this.data.orderNo,function(res){
            _this.dataFilter(res);
            orderDetailHtml=_mm.renderHtml(templateIndex,res);
            content.innerHTML=orderDetailHtml;
        },function(errMsg){
            content.innerHTML='<p class="err-tip">'+errMsg+'</p>';
        });

    },
    dataFilter: function(data){
        data.needPay=data.status===10;
        data.isCancelable=data.status===10;
    }
};
document.addEventListener('DOMContentLoaded',function(){
    page.init();
},false);
