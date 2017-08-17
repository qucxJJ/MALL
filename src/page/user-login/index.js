/*
* @Author: yun
* @Date:   2017-07-13 17:26:58
* @Last Modified by:   yun
* @Last Modified time: 2017-07-17 15:40:45
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
        // 登录按钮点击提交
        document.querySelector('#submit').addEventListener('click',function(e){
            e.preventDefault();
            _this.submit();
        },false);
        // 登录按钮按下回车键提交
        document.querySelector('#username').addEventListener('keyup',function(e){
            if(e.keyCode===13){
                _this.submit();
            }
        },false);
        document.querySelector('#password').addEventListener('keyup',function(e){
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
            password: document.querySelector('#password').value.trim()
        };
        // 表单验证结果
        var validateResult=_this.formValidate(formData);
        // 验证成功
        if(validateResult.status){
            _user.login(formData,function(res){
                window.location.href=_mm.getUrlParam('redirect')||'./index.html';
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
        if(!_mm.validate(formData.username,'require')){
            result.msg='用户名不能为空';
            return result;
        }
        if(!_mm.validate(formData.password,'require')){
            result.msg='密码不能为空';
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
