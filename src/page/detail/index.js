/*
* @Author: yun
* @Date:   2017-07-18 21:00:47
* @Last Modified by:   yun
* @Last Modified time: 2017-07-19 16:23:37
*/

'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _mm=require('util/mm.js');
var _product=require('service/product-service.js');
var _cart=require('service/cart-service.js');
var templateIndex=require('./index.string');

var page={
    data: {
        productId: _mm.getUrlParam('productId')||'',
        detailInfo: ''
    },
    init: function(){
        this.onLoad()
        this.bindEvent();
    },
    onLoad: function(){
        // 没有传商品ID则自动跳回首页
        if(!this.data.productId){
            _mm.goHome();
        }
        this.loadDetail();
    },
    bindEvent: function(){
        var _this = this;
        // 图片预览

        document.addEventListener('mouseover',function(e){
            if(e.target.classList.contains('p-img')){
                var imgUrl=e.target.getAttribute('src');
                document.querySelector('.main-img').setAttribute('src',imgUrl);
            }
        },false);
        // count的操作
        document.addEventListener('click',function(e){
            var minCount= 1;
            var maxCount= _this.data.detailInfo.stock || 1;
            var pCount=document.querySelector('.p-count');
            if(e.target.classList.contains('plus')){
                pCount.value=pCount.value<maxCount?parseInt(pCount.value)+1:maxCount;
            }
            if(e.target.classList.contains('minus')){
                pCount.value=pCount.value>minCount?pCount.value-1:minCount;
            }
        },false);
        // 加入购物车
        document.addEventListener('click',function(e){
            if(e.target.classList.contains('cart-add')){
                _cart.addToCart({
                    productId   : _this.data.productId,
                    count       : document.querySelector('.p-count').value
                }, function(res){
                    window.location.href = './result.html?type=cart-add';
                }, function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }
        });
    },
    // 加载detail数据
    loadDetail: function(){
        var _this=this;
        var html='';
        document.querySelector('.page-wrap').innerHTML='<div class="loading"></div>';
        _product.getProductDetail(this.data.productId,function(res){
            _this.filter(res);
            // 缓存数据
            _this.data.detailInfo = res;
            html=_mm.renderHtml(templateIndex,res);
            document.querySelector('.page-wrap').innerHTML=html;
        },function(errMsg){
            document.querySelector('.page-wrap').innerHTML='<p class="err-tip">此商品太淘气，找不到了！</p>'
        })
    },
    filter: function(data){
        data.subImages=data.subImages.split(',');
    }
};
document.addEventListener('DOMContentLoaded',function(){
    page.init();
},false)