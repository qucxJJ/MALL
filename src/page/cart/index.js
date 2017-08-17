/*
* @Author: yun
* @Date:   2017-07-19 16:15:41
* @Last Modified by:   yun
* @Last Modified time: 2017-07-20 13:25:13
*/

'use strict';
require('./index.css');
require('page/common/header/index.js');
var nav=require('page/common/nav/index.js');
var _mm=require('util/mm.js');
var _cart=require('service/cart-service.js');
var templateIndex=require('./index.string');

var page={
    data: {
    },
    init: function(){
        this.onLoad()
        this.bindEvent();
    },
    onLoad: function(){
        this.loadCart();
    },
    bindEvent: function(){
        var _this=this;
        // 切换选中状态
        document.addEventListener('click',function(e){
            if(e.target.classList.contains('cart-select')){
                var productId=e.target.dataset.productId;
                if(e.target.checked){
                    _cart.selectProduct(productId,function(res){
                        _this.renderCart(res);
                    },function(){
                        _this.showCartError();
                    });
                }
                else{
                    _cart.unselectProduct(productId,function(res){
                        _this.renderCart(res);
                    },function(){
                        _this.showCartError();
                    });
                }
            }
        },false);
        document.addEventListener('click',function(e){
            // 全选或取消全选
            if(e.target.classList.contains('cart-select-all')){
                if(e.target.checked){
                    _cart.selectAllProduct(function(res){
                        _this.renderCart(res);
                    },function(){
                        _this.showCartError();
                    });
                }
                else{
                    _cart.unselectAllProduct(function(res){
                        _this.renderCart(res);
                    },function(){
                        _this.showCartError();
                    });
                }
            }
        },false);
        // 更新商品数量
        document.addEventListener('click',function(e){
            if(e.target.classList.contains('count-btn')){
                var productId=e.target.parentElement.dataset.productId;
                var input=e.target.parentElement.children[1];
                var currentCount=input.value;
                var newCount=0;
                var maxCount=input.dataset.max;
                var minCount=1;
                if(e.target.classList.contains('plus')){
                    if(parseInt(currentCount)>=parseInt(maxCount)){
                        _mm.errTips('该商品数量已达到上限');
                        return;
                    }
                    newCount=parseInt(currentCount)+1;
                }
                else if(e.target.classList.contains('minus')){
                    if(parseInt(currentCount)<=minCount){
                        return;
                    }
                    newCount=parseInt(currentCount)-1;
                }
                _cart.updateProduct({
                    productId: productId,
                    count: newCount
                },function(res){
                    _this.renderCart(res);
                },function(){
                    _this.showCartError();
                });
            }
        },false);
        // 删除某个商品
        document.addEventListener('click',function(e){
            if(e.target.classList.contains('cart-delete')){
                if(window.confirm('确认要删除该商品？')){
                    var productId=e.target.dataset.productId;
                    _this.deleteCartProduct(productId);                
                }
            }
        },false);
        // 删除选中的商品
        document.addEventListener('click',function(e){
            if(e.target.classList.contains('delete-selected')){
                if(window.confirm('确认要删除选中的商品？')){
                    var arrProductIds=[];
                    var selecteBtn=document.querySelectorAll('.cart-select');
                    for(var i=0;i<selecteBtn.length;i++){
                        if(selecteBtn[i].checked){
                            arrProductIds.push(selecteBtn[i].dataset.productId);
                        }
                    }
                    if(arrProductIds.length){
                        _this.deleteCartProduct(arrProductIds.join(','));  
                    }else{
                        _mm.errorTips('您还没有选中商品');
                    }         
                }
            }
        },false);
        // 去结算
        document.addEventListener('click',function(e){
            if(e.target.classList.contains('btn-submit')){
                if(_this.data.cartInfo&&_this.data.cartInfo.cartTotalPrice>0){
                    window.location.href='./order-confirm.html';
                }
                else{
                    _mm.errorTips('请选择商品后再去结算');
                }
            }
        },false);
    },
    // 加载购物车数据
    loadCart: function(){
        var _this=this;
        _cart.getCartList(function(res){
            _this.renderCart(res);
        },function(errMsg){
            _this.showCartError();
        })
    },
    filter: function(data){
        data.notEmpty=!!data.cartProductVoList.length;
    },
    renderCart: function(data){
        this.filter(data);
        this.data.cartInfo=data;
        var cartHtml=_mm.renderHtml(templateIndex,data);
        document.querySelector('.page-wrap').innerHTML=cartHtml;
        // 通知导航的购物车更新数量
        nav.loadCartCount();
    },
    showCartError: function(){
        document.querySelector('.page-wrap').innerHTML='<p class="err-tip">哪里不对了</p>';
    },
    deleteCartProduct: function(productIds){
        var _this=this;
        _cart.deleteProduct(productIds,function(res){
            _this.renderCart(res)
        },function(){
            _this.showCartError();
        });
    }
};
document.addEventListener('DOMContentLoaded',function(){
    page.init();
},false)