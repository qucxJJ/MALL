/*
* @Author: yun
* @Date:   2017-07-20 13:12:31
* @Last Modified by:   yun
* @Last Modified time: 2017-07-21 14:27:57
*/
'use strict';
require('./index.css');
require('page/common/header/index.js');
require('page/common/nav/index.js');
var _mm=require('util/mm.js');
var addressModal=require('./address-modal.js');
var _order=require('service/order-service.js');
var _address=require('service/address-service.js');
var templateAddress=require('./address-list.string');
var templateProduct=require('./product-list.string');

var page={
    data: {
        selectedAddressId: null
    },
    init: function(){
        this.onLoad()
        this.bindEvent();
    },
    onLoad: function(){
        this.loadAddressList();
        this.loadProductList();
    },
    bindEvent: function(){
        var _this=this;
        // 地址的选择
        document.addEventListener('click',function(e){
            if(e.target.parentElement.classList.contains('address-item')){
                var arr=document.querySelectorAll('.address-item');
                for(var i=0;i<arr.length;i++){
                    arr[i].classList.remove('active');
                }
                e.target.parentElement.classList.add('active');
                _this.data.selectedAddressId=e.target.parentElement.dataset.id;
            }
        },false);
        // 订单的提交
        document.addEventListener('click',function(e){
            if(e.target.classList.contains('order-submit')){
                var shippingId=_this.data.selectedAddressId;
                if(shippingId){
                    _order.createOrder(shippingId,function(res){
                        window.location.href='./payment.html?orderNumber='+res.orderNo;
                    },function(errMsg){
                        _mm.errorTips(errMsg);
                    })
                }else{
                    _mm.errorTips('请选择地址后再提交');
                }
            }
        },false);
        // 新增地址
        document.addEventListener('click',function(e){
            if(e.target.parentElement.parentElement.classList.contains('address-add')||e.target.parentElement.classList.contains('address-add')){
                addressModal.show({
                    isUpdate: false,
                    onSuccess: function(){
                        _this.loadAddressList();
                    }
                });
            }
        },false);
        // 编辑已有地址
        document.addEventListener('click',function(e){
            if(e.target.classList.contains('address-update')){
                e.stopPropagation();
                var shippingId=e.target.dataset.id;
                _address.getAddress(shippingId,function(res){
                    addressModal.show({
                        isUpdate: true,
                        data: res,
                        onSuccess: function(){
                            _this.loadAddressList();
                        }
                    });
                },function(errMsg){
                    _mm.errorTips(errMsg);
                })  
            }
        },false);
        // 删除已有地址
        document.addEventListener('click',function(e){
            e.stopPropagation();
            if(e.target.classList.contains('address-delete')){
                var shippingId=e.target.dataset.id;
                if(window.confirm('确认要删除改地址吗？')){
                    _address.deleteAddress(shippingId,function(res){
                        _this.loadAddressList();
                    },function(errMsg){
                        _mm.errorTips(errMsg);
                    })  
                }  
            }
        },false);
    },
    loadAddressList: function(){
        var _this=this;
        document.querySelector('.address-con').innerHTML='<div class="loading"></div>';
        _address.getAddressList(function(res){
            _this.addressFilter(res);
            var addressListHtml=_mm.renderHtml(templateAddress,res);
            document.querySelector('.address-con').innerHTML=addressListHtml;
        },function(){
            document.querySelector('.address-con').innerHTML='<p class="err-tip">地址加载失败，请刷新后重试</p>';
        })
    },
    addressFilter: function(res){
        if(this.data.selectedAddressId){
            var selectedAddressIdFlag=false;
            for(var i=0,length=res.list.length;i<length;i++){
                // 数字和字符串比较，==可以避免转换类型
                if(res.list[i].id==this.data.selectedAddressId){
                    res.list[i].isActive=true;
                    selectedAddressIdFlag=true;
                }
            }
            // 如果选中的地址不在列表里面则删除
            if(!selectedAddressIdFlag){
                this.data.selectedAddressId=null;
            }
        }
    },
    loadProductList: function(){
        document.querySelector('.product-con').innerHTML='<div class="loading"></div>';
        _order.getProductList(function(res){
            var productListHtml=_mm.renderHtml(templateProduct,res);
            document.querySelector('.product-con').innerHTML=productListHtml;
        },function(){
            document.querySelector('.product-con').innerHTML='<p class="err-tip">商品信息加载失败，请刷新后重试</p>';
        })
    },
    filter: function(data){
        data.notEmpty=!!data.cartProductVoList.length;
    }
    
};
document.addEventListener('DOMContentLoaded',function(){
    page.init();
},false)