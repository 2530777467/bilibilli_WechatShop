// pages/cart/cart.js
import regeneratorRuntime from "../../lib/runtime/runtime";
import { getSetting, chooseAddress, openSetting, showModal ,showToast } from "../../utils/asyncWx.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  // 代码优化前
  // 点击 收货地址
  // handleChooseAddress(){
  //   // 获取权限状态
  //   wx.getSetting({
  //     success:(result)=>{
  //       // 获取权限状态 主要是发现一些 属性名很怪异的时候 都要用 []形式来获取属性值
  //       const scopeAddress=result.authSetting["scope.address"];
  //       if(scopeAddress===true||scopeAddress===undefined){
  //         wx.chooseAddress({
  //           success: (result) => {
  //             console.log(result);
  //           }
  //         });
  //       }else{
  //         // 用户 以前拒绝过授权权限 先诱导用户打开授权页面
  //         wx.openSetting({
  //           success:(result2)=>{
  //             // 可以调用 收获地址代码
  //             wx.chooseAddress({
  //               success: (result3) => {
  //                 console.log(result3);
  //               }
  //             });
  //           }
  //         })
  //       }
  //     }
  //   })
  // },

  // 代码优化后
  // 点击 收货地址
  async handleChooseAddress() {
    try {
      // 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      if (scopeAddress === false) {
        await openSetting();
      }
      let res2 = await chooseAddress();
      res2.all = res2.provinceName + res2.cityName + res2.countyName + res2.detailInfo;
      // console.log(res2);
      // 存入缓存中
      wx.setStorageSync('address', res2)
    } catch (error) {
      console.log(error);
    }
  },

  //设置购物车状态同时重新计算底部工具栏的数据全选总价格购买的数量
  setCart(cart) {
    let allChecked = true;
    // 总价 总数
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    // 给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync('cart', cart)
  },

  // 商品的选中
  handleItemChange(e) {
    // 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id)
    // 选中状态取反
    cart[index].checked = !cart[index].checked;

    this.setCart(cart);
  },

  // 商品的全选
  handleItemAllCheck() {
    // 获取data中的数据
    let { cart, allChecked } = this.data;
    // 修改值
    allChecked = !allChecked;
    // 循环修改cart数组中的 选中状态
    cart.forEach(v => v.checked = allChecked);
    // 把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },

  // 商品数量的加减功能
  async handleItemNumEdit(e) {
    // 获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到需要修改的商品索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      const res = await showModal({ content: '您是否删除？' });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
      // wx.showModal({
      //   title: '提示',
      //   content: '您是否删除？',
      //   success: (res) => {
      //     if (res.confirm) {
      //       cart.splice(index, 1);
      //       this.setCart(cart);
      //     } else {
      //       console.log("用户点击取消");
      //     }
      //   }
      // })
    } else {
      // 修改数量
      cart[index].num += operation;
      // 设置返回缓存中和data中
      this.setCart(cart);
    }
  },

  // 点击结算
  async handlePay(){
    // 判断收货地址
    const {address,totalNum}=this.data;
    // 判断用户是否有选购商品
    if (!address.userName) {
      await showToast({title:'您没有选择收货地址'});
      return;
    }
    if (totalNum===0) {
      await showToast({title:'您没有选购商品'});
      return;
    }
    // 跳转到 支付
    wx.navigateTo({
      url: '/pages/pay/pay',
    })
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
    const cart = wx.getStorageSync('cart') || [];

    this.setData({
      address
    });
    this.setCart(cart);

    // 计算全选
    // every 数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数都返回true 那么every的返回值为true
    // 只要 有一个回调函数返回false 那么不再循环执行，直接返回false
    // const allChecked=cart.length?cart.every(v=>v.checked):false;
    // let allChecked=true;

    // // 总价 总数
    // let totalPrice=0;
    // let totalNum=0;
    // cart.forEach(v=>{
    //   if (v.checked) {
    //     totalPrice+=v.num*v.goods_price;
    //     totalNum+=v.num
    //   } else {
    //     allChecked=false
    //   }
    // })
    // // 判断数组是否为空
    // allChecked=cart.length!=0?allChecked:false;

    // // 给data赋值
    // this.setData({
    //   address,
    //   cart,
    //   allChecked,
    //   totalPrice,
    //   totalNum
    // })
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