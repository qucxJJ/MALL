/*
* @Author: yun
* @Date:   2017-07-21 16:46:27
* @Last Modified by:   yun
* @Last Modified time: 2017-07-21 17:22:46
*/

'use strict';

var _mm = require('util/mm.js');

var _payment = {
    // 获取商品列表
    getPaymentInfo : function(orderNo,resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/order/pay.do'),
            data    : {orderNo: orderNo},
            success : resolve,
            error   : reject
        });
    },
    // 获取订单状态
    getPaymentStatus : function(orderNo,resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/order/query_order_pay_status.do'),
            data    : {orderNo: orderNo},
            success : resolve,
            error   : reject
        });
    }
}
module.exports = _payment;