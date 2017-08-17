/*
* @Author: yun
* @Date:   2017-07-18 11:43:31
* @Last Modified by:   yun
* @Last Modified time: 2017-07-18 20:56:17
*/

'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _mm=require('util/mm.js');
var _product=require('service/product-service.js');
var templateIndex=require('./index.string');
var Pagination=require('util/pagination/index.js');
var page={
    data: {
        listParam: {
            keyword: _mm.getUrlParam('keyword')||'',
            categoryId: _mm.getUrlParam('categoryId')||'',
            orderBy: _mm.getUrlParam('orderBy')||'default',
            pageNum: _mm.getUrlParam('pageNum')||1,
            pageSize: _mm.getUrlParam('pageSize')||20
        }
    },
    init: function(){
        this.onLoad()
        this.bindEvent();
    },
    onLoad: function(){
        this.loadList();
    },
    bindEvent: function(){
        var _this=this
        // 排序点击事件
        document.querySelector('#default').addEventListener('click',function(){
            // 如果已经有active样式 则不变
            _this.data.listParam.pageNum = 1;
            if(this.classList.contains('active')){
                return;
            }
            else{
                this.classList.add('active');
                document.querySelector('#price').classList.remove('active','asc','desc');
                _this.data.listParam.orderBy='default';
            }
            _this.loadList();
        },false);
        document.querySelector('#price').addEventListener('click',function(){
            _this.data.listParam.pageNum = 1;
            this.classList.add('active');
            document.querySelector('#default').classList.remove('active');
            if(!this.classList.contains('asc')){
                this.classList.add('asc');
                this.classList.remove('desc');
                _this.data.listParam.orderBy='price_asc';
            }
            else{
                this.classList.add('desc');
                this.classList.remove('asc');
                _this.data.listParam.orderBy='price_desc';
            }
            _this.loadList();
        },false);
    },
    // 加载list数据
    loadList: function(){
        var _this=this;
        var listParam=_this.data.listParam;
        var listHtml='';
        var pListCon= document.querySelector('.p-list-con');
        pListCon.innerHTML='<div class="loading"></div>';
        // 删除参数中不必要的字段
        listParam.categoryId ? (delete listParam.keyword) : (delete listParam.categoryId);
        // 加载商品列表
        _product.getProductList(listParam,function(res){
            listHtml=_mm.renderHtml(templateIndex,{list: res.list});
            document.querySelector('.p-list-con').innerHTML=listHtml;
            _this.loadPagination({
                hasPreviousPage : res.hasPreviousPage,
                prePage         : res.prePage,
                hasNextPage     : res.hasNextPage,
                nextPage        : res.nextPage,
                pageNum         : res.pageNum,
                pages           : res.pages
            });
        },function(errMsg){
            _mm.errorTips(errMsg);
        });
    },
    // 加载分页信息
    loadPagination : function(pageInfo){
        var _this = this;
        this.pagination ? '' : (this.pagination = new Pagination());
        this.pagination.render($.extend({}, pageInfo, {
            container : $('.pagination'),
            onSelectPage : function(pageNum){
                _this.data.listParam.pageNum = pageNum;
                _this.loadList();
            }
        }));
    }
};
document.addEventListener('DOMContentLoaded',function(){
    page.init();
},false)