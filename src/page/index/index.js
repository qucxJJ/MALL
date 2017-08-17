/*
* @Author: yun
* @Date:   2017-07-13 16:52:31
* @Last Modified by:   yun
* @Last Modified time: 2017-07-18 12:08:49
*/
'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
require('util/slider/index.js');
var _mm=require('util/mm.js');
var templateBanner=require('./index.string');

$(function() {
    // 渲染banner
    var bannerHtml=_mm.renderHtml(templateBanner);
    $('.banner-con').html(bannerHtml);
    // 初始化banner
    var $slider=$('.banner').unslider({
        dots: true
    });
    // 前一张后一张操作事件绑定
    $('.banner-con .banner-arrow').click(function(){
        var fn=$(this).hasClass('prev') ? 'prev' : 'next';
        $slider.data('unslider')[fn]();
    });
});
