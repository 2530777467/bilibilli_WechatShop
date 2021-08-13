// pages/category/category.js
// 引入  用来发送请求的方法 路径要全
import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList:[],
    // 右侧内容数据
    rightContent:[],
    // 被点击的左侧菜单
    currentIndex:0,
    // 点击右侧回到顶部
    scrollTop:0
  },
  // 结构的返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取本地存储的数据
    const Cates =wx.getStorageSync('cates');
    // 判断
    if(!Cates){
      // 不存在
      this.getCates();
    }else{
      // 有旧数据 定义过期时间 10s
      if(Date.now()-Cates.time>1000*10){
        // 重新发请求
        this.getCates();
      }else{
        // 可以用旧数据
        this.Cates=Cates.data;
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        let rightContent=this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  getCates(){
    request({url:"/categories"})
    .then(res=>{
      this.Cates=res;
      // 把接口的数据存入本地存储中
      wx.setStorageSync('cates', {time:Date.now(),data:this.Cates});

      // 构造左侧菜单数据
      let leftMenuList=this.Cates.map(v=>v.cat_name);
      // 构造右侧内容数据
      let rightContent=this.Cates[0].children
      this.setData({
        leftMenuList,
        rightContent
      })
    })
  },

  // async getCates(){
  //   // 使用es7的async await来发送请求
  //   const res=await request({url:"/categories"});
  //   this.Cates=res;
  //   // 把接口的数据存入本地存储中
  //   wx.setStorageSync('cates', {time:Date.now(),data:this.Cates});
  //   构造左侧菜单数据
  //   let leftMenuList=this.Cates.map(v=>v.cat_name);
  //   // 构造右侧内容数据
  //   let rightContent=this.Cates[0].children;
  //   this.setData({
  //     leftMenuList,
  //     rightContent
  //   })
  // },

//  左侧菜单点击事件
  handleItemTap(e){
    const { index } = e.currentTarget.dataset;
    let rightContent=this.Cates[index].children
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
    })
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