/*
* @Author: yun
* @Date:   2017-07-21 16:37:53
* @Last Modified by:   yun
* @Last Modified time: 2017-07-21 17:21:41
*/

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var templateIndex=require('./index.string');
var _payment=require('service/payment-service.js');
var _mm=require('util/mm.js');
// page逻辑部分
var page={
    data: {
        orderNo: _mm.getUrlParam('orderNumber')
    },
    init: function(){
        this.onLoad();
    },
    onLoad: function(){
        this.loadPayment();
    },
    loadPayment: function(){
        var _this=this;
        var paymentHtml='';
        var pageWrap=document.querySelector('.page-wrap');
        pageWrap.innerHTML='<div class="loading"></div>';
        _payment.getPaymentInfo(_this.data.orderNo,function(res){
            paymentHtml=_mm.renderHtml(templateIndex,res);
            pageWrap.innerHTML=paymentHtml;
            _this.listenOrderStatus();
        },function(errMsg){
            pageWrap.innerHTML='<p class="err-tip">'+errMsg+'</p>';
        });
    },
    listenOrderStatus: function(){
        var _this=this;
        this.paymentTimer=window.setInterval(function(){
            _payment.getPaymentStatus(_this.data.orderNo,function(res){
                if(res===true){
                    window.location.href='./result.html?type=payment&orderNumber='+_this.data.orderNo;
                }
            });
        },5000);
    }
};
document.addEventListener('DOMContentLoaded',function(){
    page.init();
},false);
