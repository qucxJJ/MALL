/*
* @Author: yun
* @Date:   2017-07-17 12:17:45
* @Last Modified by:   yun
* @Last Modified time: 2017-07-17 16:02:36
*/

'use strict';
require('./index.css');
require('page/common/nav-simple/index.js');
var _user=require('service/user-service.js');
var _mm=require('util/mm.js');
// 表单里的错误提示
var formError={
    show: function(errMsg){
        document.querySelector('.error-item').style.display='block';
        document.querySelector('.error-msg').innerText=errMsg;
    },
    hide: function(errMsg){
        document.querySelector('.error-item').style.display='none';
        document.querySelector('.error-msg').innerText='';
    }
};
// page逻辑部分
var page={
    init: function(){
        this.bindEvent();
    },
    bindEvent: function(){
        var _this=this;
        // 异步验证username是否已存在
        document.querySelector('#username').addEventListener('blur',function(){
            var username=document.querySelector('#username').value.trim();
            // 优化：若用户名为空不做验证
            if(!username){
                return;
            }
            _user.checkUsername(username,function(res){
                formError.hide();
            },function(errMsg){
                formError.show(errMsg);
            })
        },false);
        // 注册按钮点击提交
        document.querySelector('#submit').addEventListener('click',function(e){
            e.preventDefault();
            _this.submit();
        },false);
        // 注册按钮按下回车键提交
        document.querySelector('.user-box').addEventListener('keyup',function(e){
            if(e.keyCode===13){
                _this.submit();
            }
        },false);
    },
    // 提交表单  伪表单
    submit: function(){
        var _this=this;
        var formData={
            username: document.querySelector('#username').value.trim(),
            password: document.querySelector('#password').value.trim(),
            passwordConfirm: document.querySelector('#password-confirm').value.trim(),
            phone: document.querySelector('#phone').value.trim(),
            email: document.querySelector('#email').value.trim(),
            question: document.querySelector('#question').value.trim(),
            answer: document.querySelector('#answer').value.trim(),
        };
        // 表单验证结果
        var validateResult=_this.formValidate(formData);
        // 验证成功
        if(validateResult.status){
            _user.register(formData,function(res){
                window.location.href='./result.html?type=register';
            },function(errMsg){
                formError.show(errMsg);
            });
        }
        // 验证失败
        else{
            formError.show(validateResult.msg);
        }
    },
    // 表单验证
    formValidate: function(formData){
        var result={
            status: false,
            msg: ''
        };
        // 验证用户名是否为空
        if(!_mm.validate(formData.username,'require')){
            result.msg='用户名不能为空';
            return result;
        }
        // 验证密码是否为空
        if(!_mm.validate(formData.password,'require')){
            result.msg='密码不能为空';
            return result;
        }
        // 验证密码长度是否小于六位
        if(formData.password.length<6){
            result.msg='密码长度不能小于六位';
            return result;
        }
        // 验证两次输入的密码是否一致
        if(formData.password!==formData.passwordConfirm){
            result.msg='两次输入的密码不一致';
            return result;
        }
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