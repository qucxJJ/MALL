/*
* @Author: yun
* @Date:   2017-07-20 19:15:10
* @Last Modified by:   yun
* @Last Modified time: 2017-07-21 11:43:22
*/

'use strict';
var _mm=require('util/mm.js');
var _cities=require('util/cities/index.js');
var _address=require('service/address-service.js');
var templateAddressModal=require('./address-modal.string');
var addressModal={
    show: function(option){
        // 绑定option，方便其他方法使用
        this.option=option;
        this.option.data=option.data||{};
        this.modalWrap=document.querySelector('.modal-wrap');
        this.modalWrap.style.visibility='visible';
        // 渲染页面
        this.loadModal();
        // 绑定事件
        this.bindEvent();

    },
    bindEvent: function(){
        var _this=this;
        // 省份和城市的二级联动
        document.querySelector('#receiver-province').addEventListener('change',function(e){
            var selectProvince=this.value;
            _this.loadCities(selectProvince);
        },false);
        // 提交收货地址
        document.addEventListener('click',function(e){
            if(e.target.classList.contains('address-btn')){
                console.log('ssssss');
                var receiverInfo=_this.getReceiverInfo();
                var isUpdate=_this.option.isUpdate;
                // 使用新地址且验证通过
                if(!isUpdate&&receiverInfo.status){
                    _address.save(receiverInfo.data,function(res){
                        _mm.successTips('新地址添加成功');
                        _this.hide();
                        typeof _this.option.onSuccess==="function"&&_this.option.onSuccess(res);
                    },function(errMsg){
                        _mm.errorTips(errMsg);
                    })
                }
                // 更新地址并且验证通过
                else if(isUpdate&&receiverInfo.status){
                    _address.update(receiverInfo.data,function(res){
                        _mm.successTips('地址修改成功');
                        _this.hide();
                        typeof _this.option.onSuccess==="function"&&_this.option.onSuccess(res);
                    },function(errMsg){
                        _mm.errorTips(errMsg);
                    })
                }
                // 验证不通过
                else{
                    _mm.errorTips(receiverInfo.errMsg||'好像哪里不对了');
                    return;
                }
            }
        },false);
        // 关闭弹框
        document.addEventListener('click',function(e){
            if(e.target.classList.contains('close')){
                _this.hide();
            }
        },false);
        // $(document).on('click','.close',function(e){
        //     _this.hide();
        //     console.log('close');
        // });
    },
    // 添加新地址时option.data并没有被渲染到页面中，只是作为一个参数传递
    loadModal: function(){
        var addressModalHtml=_mm.renderHtml(templateAddressModal,{
            data: this.option.data,
            isUpdate: this.option.isUpdate
        });
        this.modalWrap.innerHTML=addressModalHtml;
        // 加载省份
        this.loadProvince();
        // 加载城市
        this.loadCities();
    },
    // 加载省份信息
    loadProvince: function(){
        var provinces=_cities.getProvinces()||[];
        var provinceSelect=document.querySelector('#receiver-province');
        provinceSelect.innerHTML=this.getSelectOption(provinces);
        // 如果是更新地址并且有省份信息，则回填省份
        if(this.option.isUpdate&&this.option.data.receiverProvince){
            provinceSelect.value=this.option.data.receiverProvince;
            this.loadCities(this.option.data.receiverProvince);
        }
    },
    loadCities: function(proName){
        var cities=_cities.getCities(proName)||[];
        var citySelect=document.querySelector('#receiver-city');
        citySelect.innerHTML=this.getSelectOption(cities);
        // 如果是更新地址并且有城市信息，则回填城市
        if(this.option.isUpdate&&this.option.data.receiverCity){
            citySelect.value=this.option.data.receiverCity;
        }
    },
    // 获取选择框的选项 输入数组 输出HTML
    getSelectOption: function(optionArr){
        var html='<option value="">请选择</option>';
        // 用length缓存可以优化，提高效率
        for(var i=0,length=optionArr.length;i<length;i++){
            html+='<option value="'+optionArr[i]+'">'+optionArr[i]+'</option>';
        }
        return html;
    },
    // 获取收件人信息，并进行表单验证
    getReceiverInfo: function(){
        var receiverInfo={};
        var result={
            status: false
        };
        receiverInfo.receiverName=this.modalWrap.querySelector('#receiver-name').value.trim();
        receiverInfo.receiverProvince=this.modalWrap.querySelector('#receiver-province').value;
        receiverInfo.receiverCity=this.modalWrap.querySelector('#receiver-city').value;
        receiverInfo.receiverAddress=this.modalWrap.querySelector('#receiver-address').value.trim();
        receiverInfo.receiverPhone=this.modalWrap.querySelector('#receiver-phone').value.trim();
        receiverInfo.receiverZip=this.modalWrap.querySelector('#receiver-email').value.trim();
        if(this.option.isUpdate){
            receiverInfo.id=document.querySelector('#receiver-id').value;
        }
        if(!receiverInfo.receiverName){
            result.errMsg='请输入收件人姓名';
        }
        else if(!receiverInfo.receiverProvince){
            result.errMsg='请选择收件人所在省份';
        }
        else if(!receiverInfo.receiverCity){
            result.errMsg='请选择收件人所在城市';
        }
        else if(!receiverInfo.receiverAddress){
            result.errMsg='请输入收件人详细地址';
        }
        else if(!receiverInfo.receiverPhone){
            result.errMsg='请输入收件人手机号';
        }
        // 所有验证都通过
        else{
            result.status=true;
            result.data=receiverInfo;
        }
        return result;
    },
    // 关闭弹窗
    hide: function(){
        this.modalWrap.style.visibility='hidden';
    }
    
};
module.exports=addressModal;
