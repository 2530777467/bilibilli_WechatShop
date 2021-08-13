// pages/auth/auth.js
import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
import { login } from "../../utils/asyncWx.js";


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // async handleGetUserInfo() {
  //   wx.getUserProfile({
  //     // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  //     desc: "授权登录",
  //     success: (res) => {
  //       console.log("授权成功!", res);
  //       const { encrypteData, rawData, iv, signature } = res;
  //       // 获取小程序登录成功后的code
  //       const { code } = await login();
  //       const loginPramas = { encrypteData, rawData, iv, signature, code };
  //       // 发送请求 获取用户的token
  //       const { token } = await request({ url: '/users/wxlogin', data: loginPramas, method: 'POST' });
  //       // 把token存入缓存中 同时跳转到上一个页面
  //       wx.setStorageSync('token', token);
  //       wx.navigateBack({
  //         delta: 1,
  //       });
  //     },
  //     fail: res => {
  //       console.log("授权失败!", res);
  //     }
  //   })
  // },

  async handleGetUserInfo(e){
    try {
      // 获取用户信息
      const {encrypteData,rawData,iv,signature}=e.detail;
      // 获取小程序登录成功后的code
      const {code}=await login();
      const loginPramas={encrypteData,rawData,iv,signature,code}
      // 发送请求 获取用户的token
      // const {token}=await request({url:'/users/wxlogin',data:loginPramas,method:'POST'});
      // 把token存入缓存中 同时跳转到上一个页面
      // wx.setStorageSync('token', token);
      wx.setStorageSync('token', "021xRW7i11b5Ev0uiSC7i1SL48i1xRW7Q");
      wx.navigateBack({
        delta: 1,
      })

    } catch (error) {
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