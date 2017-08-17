/*
* @Author: yun
* @Date:   2017-07-16 18:30:22
* @Last Modified by:   yun
* @Last Modified time: 2017-07-21 17:39:50
*/

'use strict';
require('./index.css');
require('page/common/nav-simple/index.js');
var _mm=require('util/mm.js');
document.addEventListener('DOMContentLoaded',function(){
    var type=_mm.getUrlParam('type')||'default';
    var orderNumber=_mm.getUrlParam('orderNumber')||'';
    var ele=document.querySelector('.'+type+'-success');
    // 显示对应的提示元素
    ele.style.display='block';
    if(type==='payment'){
        var detailEle=document.querySelector('.orderNumber')
        var baseLink=detailEle.getAttribute('href');
        detailEle.setAttribute('href',baseLink+orderNumber);
    }
},false);