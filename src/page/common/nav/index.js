/*
* @Author: yun
* @Date:   2017-07-16 12:17:28
* @Last Modified by:   yun
* @Last Modified time: 2017-07-17 20:37:36
*/

'use strict';
require('./index.css');
var _mm     = require('util/mm.js');
var _user   = require('service/user-service.js');
var _cart   = require('service/cart-service.js');
// 导航
var nav = {
    init : function(){
        this.bindEvent();
        this.loadUserInfo();
        this.loadCartCount();
        return this;
    },
    bindEvent : function(){
        // 登录点击事件
        document.querySelector('.js-login').addEventListener('click',function(){
            _mm.doLogin();
        },false);
        // 注册点击事件
        document.querySelector('.js-register').addEventListener('click',function(){
            window.location.href = './user-register.html';
        },false);
        // 退出点击事件
        document.querySelector('.js-logout').addEventListener('click',function(){
            _user.logout(function(res){
                window.location.reload();
            }, function(errMsg){
                _mm.errorTips(errMsg);
            });
        },false);
    },
    // 加载用户信息
    loadUserInfo : function(){
        _user.checkLogin(function(res){
            document.querySelector('.not-login').style.display='none';
            var login=document.querySelector('.login');
            login.style.display='block'
            login.querySelector('.username').innerText=res.username;
            // $('.user.not-login').hide().siblings('.user.login').show()
            //     .find('.username').text(res.username);
        }, function(errMsg){
            // do nothing
        });
    },
    // 加载购物车数量
    loadCartCount : function(){
        _cart.getCartCount(function(res){
            document.querySelector('.cart-count').innerText=res||0;
            // $('.nav .cart-count').text(res || 0);
        }, function(errMsg){
            document.querySelector('.cart-count').innerText=0;
            // $('.nav .cart-count').text(0);
        });
    }
};

module.exports = nav.init();