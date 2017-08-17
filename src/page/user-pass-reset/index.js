/*
* @Author: yun
* @Date:   2017-07-17 15:46:37
* @Last Modified by:   yun
* @Last Modified time: 2017-07-17 17:34:08
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
    data: {
        username: '',
        question: '',
        answer: '',
        token: ''
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function(){
        this.loadStepUsername();
    },
    bindEvent: function(){
        var _this=this;
        // 输入用户名后的按钮点击事件
        document.querySelector('#submit-username').addEventListener('click',function(e){
            e.preventDefault();
            var username=document.querySelector('#username').value.trim();
            if(username){
                _user.getQuestion(username,function(res){
                    _this.data.username=username;
                    _this.data.question=res;
                    _this.loadStepQuestion();
                },function(errMsg){
                    formErrorr.show(errMsg);
                });
            }
            else{
                formError.show('请输入用户名');
            }
        },false);
        // 输入密码提示问题答案后的按钮点击事件
        document.querySelector('#submit-question').addEventListener('click',function(e){
            e.preventDefault();
            var answer=document.querySelector('#answer').value.trim();
            if(answer){
                // 检查密码提示问题答案
                _user.checkAnswer({
                    username: _this.data.username,
                    question: _this.data.question,
                    answer: answer
                },function(res){
                    _this.data.answer=answer;
                    _this.data.token=res;
                    _this.loadStepPassword();
                },function(errMsg){
                    formErrorr.show(errMsg);
                });
            }
            else{
                formError.show('请输入密码提示问题答案');
            }
        },false);
        // 输入新密码后的按钮点击事件
        document.querySelector('#submit-password').addEventListener('click',function(e){
            e.preventDefault();
            var password=document.querySelector('#password').value.trim();
            if(password&&password.length>=6){
                // 检查密码提示问题答案
                _user.resetPassword({
                    username: _this.data.username,
                    passwordNew: password,
                    forgetToken: _this.data.token
                },function(res){
                    window.location.href='./result.html?type=pass-reset';
                },function(errMsg){
                    formErrorr.show(errMsg);
                });
            }
            else{
                formError.show('请输入不少于6位的新密码');
            }
        },false);
    },
    // 加载输入用户名部分
    loadStepUsername: function(){
        document.querySelector('.step-username').style.display="block";
    },
    // 加载输入密码提示问题答案部分
    loadStepQuestion: function(){
        // 隐藏错误提示
        formError.hide();
        // 切换容器
        document.querySelector('.step-username').style.display="none";
        document.querySelector('.step-question').style.display="block";
        document.querySelector('#question').innerText=this.data.question;
    },
    // 加载输入新密码部分
    loadStepPassword: function(){
        formError.hide();
        document.querySelector('.step-question').style.display="none";
        document.querySelector('.step-password').style.display="block";
    }
    
};
document.addEventListener('DOMContentLoaded',function(){
    page.init();
},false);
