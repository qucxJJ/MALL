/*
* @Author: yun
* @Date:   2017-07-16 16:16:38
* @Last Modified by:   yun
* @Last Modified time: 2017-07-17 20:53:40
*/

'use strict';
require('./index.css');
var _mm     = require('util/mm.js');
var templateIndex=require('./index.string');
// 侧边导航
var navSide = {
    option: {
        name:'',
        navList:[
            {
                name: 'user-center',desc: '个人中心',href: './user-center.html'
            },
            {
                name: 'order-list',desc: '我的订单',href: './order-list.html'
            },
            {
                name: 'user-pass-update',desc: '修改密码',href: './user-pass-update.html'
            },
            {
                name: 'about',desc: '关于MALL',href: './about.html'
            }
        ]
    },
    init : function(opt){
        if(opt.name){
            this.option.name=opt.name;
        }
        this.renderNav();
    },
    renderNav: function(){
        // 计算active数据
        for(var i=0,iLength=this.option.navList.length;i<iLength;i++){
            if(this.option.navList[i].name===this.option.name){
                this.option.navList[i].isActive=true;
            }
        }
        // 渲染list数据
        var navHtml=_mm.renderHtml(templateIndex,{
            navList:this.option.navList
        });
        // 把html放入容器
        document.querySelector('.nav-side').innerHTML=navHtml;

    }
    
};

module.exports = navSide;