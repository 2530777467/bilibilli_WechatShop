// pages/pay/pay.js
import regeneratorRuntime from "../../lib/runtime/runtime";
import { request } from "../../request/index.js";
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  // 点击支付
  async handleOrderPay() {
    try {
      // 判断缓存中是否存在token
      const token = wx.getStorageSync('token');
      // 判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/auth',
        });
        return;
      }
      console.log("已存在token");
      // 创建订单
      // 准备 请求头参数
      const header = { Authorization: token };
      // 准备 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.goods_number,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods };
      // 准备发送请求 创建订单 获取订单编号
      const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams, header });
      // 发起预支付接口
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number }, header });
      // 发起微信支付
      await requestPayment(pay);
      // 查询后台 订单状态
      const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number }, header });
      await showToast({ title: "支付成功" });
      // 手动删除缓存中 已经支付的商品
      let newCart = wx.getStorageSync('cart');
      // 留下购物车中未被选中的商品
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync('cart', newCart)

      // 支付成功后 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/order',
      })
    } catch (error) {
      await showToast({ title: "支付失败" })
      console.log(error);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    // 获取缓存中的购物车信息
    let cart = wx.getStorageSync('cart') || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    this.setData({ address })

    // 总价 总数
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})