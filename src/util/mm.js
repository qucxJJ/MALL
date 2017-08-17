/*
* @Author: yun
* @Date:   2017-07-15 17:57:11
* @Last Modified by:   yun
* @Last Modified time: 2017-07-18 17:36:00
*/

'use strict';
var Hogan=require('hogan.js');
var conf={
    serverHost: ''
};
var _mm={
    request: function(param){
        var _this=this;
        $.ajax({
            type: param.method,
            url: param.url,
            async: true,
            data: param.data,
            dataType: param.type||'json',
            success: function(res){
                // 请求成功
                if(0===res.status){
                    typeof param.success==='function' && param.success(res.data,res.msg);    //res.data,res.msg
                }
                // 没有登录状态，需要强制登陆
                else if(10===res.status){
                    _this.doLogin();
                }
                // 请求数据错误
                else if(1===res.status){
                    typeof param.error==='function' && param.error(res.msg);
                }
            },
            error: function(err){
                typeof param.error==='function' && param.error(err.statusText);
            }
        });
    },
    
    // 获取服务器地址
    getServerUrl: function(path){
        return conf.serverHost+path;
    },
    // 获取URL参数
    getUrlParam: function(name){
        var reg=new RegExp('(^|&)'+name+'=([^&]*)(&|$)');
        var result=window.location.search.substr(1).match(reg);
        return result?decodeURIComponent(result[2]):null;  //result[2]第二个捕获组
    },
    // 渲染HTML模板
    renderHtml: function(htmlTemplate,data){
        var template=Hogan.compile(htmlTemplate);
        var result=template.render(data);
        return result;
    },
    //成功提示
    successTips: function(msg){
        alert(msg||'操作成功');
    },
    // 错误提示
    errorTips: function(msg){
        alert(msg||'哪里不对了');
    },
    //字段的验证，支持非空判断、手机、邮箱
    validate: function(value,type){
        value=value.trim();
        //验证非空
        if(type==='require'){
            return !!value
        }
        // 验证手机
        if(type==='phone'){
            return /^1\d{10}$/.test(value);
        }
        // 验证邮箱
        if(type==='email'){
            return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
        }
    },
    // 同意登录处理
    doLogin:function(){
        window.location.href='./user-login.html?redirect='+encodeURIComponent(window.location.href);
    },
    goHome: function(){
        window.location.href='./index.html';
    }


};


module.exports=_mm;