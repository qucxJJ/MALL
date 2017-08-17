/*
* @Author: yun
* @Date:   2017-07-16 14:52:50
* @Last Modified by:   yun
* @Last Modified time: 2017-07-18 11:53:15
*/

'use strict';
require('./index.css');
var _mm= require('util/mm.js');
// 导航
var header = {
    init : function(){
        this.onLoad();
        this.bindEvent();
        return this;
    },
    onLoad: function(){
        var keyword=_mm.getUrlParam('keyword');
        // 有关键字则回填搜索框
        if(keyword){
            document.querySelector('#search-input').value=keyword;
        }
    },
    bindEvent : function(){
        var _this=this;
        // 点击搜索按钮提交搜索
        document.querySelector('#search-btn').addEventListener('click',function(){
            _this.searchSubmit();
        },false);
        // 按下回车键也要提交
        document.querySelector('#search-input').addEventListener('keyup',function(e){
            // 13为回车键
            if(e.keyCode===13){
                _this.searchSubmit();
            }
        },false);
    },
    // 搜索的提交
    searchSubmit: function(){
        var keyword=document.querySelector('#search-input').value.trim();
        // 有关键字则跳转到list页面
        if(keyword){
            window.location.href='./list.html?keyword='+keyword;
        }
        // 关键字为空则跳转到主页
        else{
            _mm.goHome();
        }
    }
};

header.init();