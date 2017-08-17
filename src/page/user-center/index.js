/*
* @Author: yun
* @Date:   2017-07-17 17:45:16
* @Last Modified by:   yun
* @Last Modified time: 2017-07-17 19:51:50
*/

'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide=require('page/common/nav-side/index.js');
var templateIndex=require('./index.string');

var _user=require('service/user-service.js');
var _mm=require('util/mm.js');
// page逻辑部分
var page={
    init: function(){
        this.onLoad();
    },
    onLoad: function(){
        // 初始化左侧菜单
        navSide.init({name: 'user-center'});
        this.loadUserInfo();
    },
    // 加载用户信息  若没有用户登录状态，则强制登录
    loadUserInfo: function(){
        var userHtml='';
        _user.getUserInfo(function(res){
            userHtml=_mm.renderHtml(templateIndex, res);
            document.querySelector('.panel-body').innerHTML=userHtml;
        },function(errMsg){
            _mm.errorTips(errMsg);
        });
    }
};
document.addEventListener('DOMContentLoaded',function(){
    page.init();
},false);
