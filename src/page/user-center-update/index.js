/*
* @Author: yun
* @Date:   2017-07-17 17:56:51
* @Last Modified by:   yun
* @Last Modified time: 2017-07-17 20:43:39
*/

'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide=require('page/common/nav-side/index.js');
var templateIndex=require('./index.string');

var _user=require('service/user-service.js');
var _mm=require('util/mm.js');
function binde(ele,type,selector,fn){
    if(fn==null){
        fn=selector;
        selector=null;
    }
    ele.addEventListener(type,function(e){
        //有委托
        if(selector){
            if(e.target.nodeName===selector.toUpperCase()){
                fn.call(e.target,e);   //改变this
            }
        }else{    //无委托
            fn(e);
        }
    },false);
}
// page逻辑部分
var page={
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function(){
        // 初始化左侧菜单
        navSide.init({name: 'user-center'});
        this.loadUserInfo();
    },
    bindEvent: function(){
        var _this=this;
        binde(document,'click','button',function(){
            var userInfo={
                phone: document.querySelector('#phone').value.trim(),
                email: document.querySelector('#email').value.trim(),
                question: document.querySelector('#question').value.trim(),
                answer: document.querySelector('#answer').value.trim()
            };
            var validateResult=_this.formValidate(userInfo);
            // 更改用户信息
            if(validateResult.status){
                _user.updateUserInfo(userInfo,function(res,msg){
                    _mm.successTips(msg);
                    window.location.href='./user-center.html';
                },function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }
            // 验证失败
            else{
                _mm.errorTips(validateResult.msg);
            }
        });
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
    },
    // 表单验证
    formValidate: function(formData){
        var result={
            status: false,
            msg: ''
        };
        // 验证手机号码是否为空
        if(!_mm.validate(formData.phone,'require')){
            result.msg='手机号码不能为空';
            return result;
        }
        // 验证手机号格式是否正确
        if(!_mm.validate(formData.phone,'phone')){
            result.msg='手机号码格式不正确';
            return result;
        }
        // 验证邮箱是否为空
        if(!_mm.validate(formData.email,'require')){
            result.msg='邮箱不能为空';
            return result;
        }
        // 验证邮箱格式是否正确
        if(!_mm.validate(formData.email,'email')){
            result.msg='邮箱格式不正确';
            return result;
        }
        // 验证密码提示问题是否为空
        if(!_mm.validate(formData.question,'require')){
            result.msg='密码提示问题不能为空';
            return result;
        }
        // 验证密码提示问题答案是否为空
        if(!_mm.validate(formData.answer,'require')){
            result.msg='密码提示问题答案不能为空';
            return result;
        }
        // 通过验证，返回正确提示
        result.status=true;
        result.msg='验证通过';
        return result;
    }
};
document.addEventListener('DOMContentLoaded',function(){
    page.init();
},false);
