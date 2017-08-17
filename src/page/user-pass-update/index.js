/*
* @Author: yun
* @Date:   2017-07-17 20:46:48
* @Last Modified by:   yun
* @Last Modified time: 2017-07-17 21:22:01
*/

'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide=require('page/common/nav-side/index.js');

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
        navSide.init({name: 'user-pass-update'});
    },
    bindEvent: function(){
        var _this=this;
        binde(document,'click','button',function(){
            var userInfo={
                password: document.querySelector('#password').value.trim(),
                passwordNew: document.querySelector('#password-new').value.trim(),
                passwordConfirm: document.querySelector('#password-confirm').value.trim(),
            };
            var validateResult=_this.formValidate(userInfo);
            // 更改用户信息
            if(validateResult.status){
                _user.updatePassword({
                    passwordOld: userInfo.password,
                    passwordNew: userInfo.passwordNew
                },function(res,msg){
                    _mm.successTips(msg);
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

    // 表单验证
    formValidate: function(formData){
        var result={
            status: false,
            msg: ''
        };
        // 验证原密码是否为空
        if(!_mm.validate(formData.password,'require')){
            result.msg='原密码不能为空';
            return result;
        }
        // 验证新密码是否为空
        if(!_mm.validate(formData.passwordNew,'require')){
            result.msg='原密码不能为空';
            return result;
        }
        // 验证新密码是否小于6位
        if(!formData.passwordNew||formData.passwordNew.length<6){
            result.msg='密码长度小于6位';
            return result;
        }
        if(formData.passwordNew===formData.password){
            result.msg='新密码不能和原密码相同';
            return result;
        }
        // 判断两次输入密码是否一致
        if(formData.passwordNew!==formData.passwordConfirm){
            result.msg='两次输入的密码不一致';
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
